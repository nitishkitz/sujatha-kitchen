import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";

export type StaffStatus = "pending" | "preparing" | "ready" | "completed";

export type KitchenLine = {
  name: string;
  note?: string;
  qty: number;
  price: number;
};

export type KitchenOrder = {
  code: string;
  status: StaffStatus;
  customer: string;
  phone: string;
  slot: string;
  pay: string;
  lines: KitchenLine[];
  total: number;
  summary: string;
  items: number;
  time: string;
  placedAt: string;
  preparingAt: string | null;
  readyAt: string | null;
  collectedAt: string | null;
};

export type KitchenMetrics = {
  total: number;
  completed: number;
  preparing: number;
  pending: number;
  ready: number;
};

const lineSchema = z.object({
  name: z.string().min(1).max(80),
  note: z.string().max(80).optional(),
  qty: z.number().int().min(1).max(20),
  price: z.number().int().min(0).max(5000),
});

const placeSchema = z.object({
  name: z.string().min(1).max(40),
  phone: z.string().regex(/^\d{10}$/),
  slot: z.string().min(1).max(40),
  pay: z.enum(["upi", "cash"]),
  lines: z.array(lineSchema).min(1).max(20),
  total: z.number().int().min(1).max(20000),
});

type OrderRow = {
  id: string;
  status: StaffStatus;
  customer_name: string;
  phone: string;
  slot: string;
  pay: string;
  lines: unknown;
  total: number;
  summary: string;
  items: number;
  placed_at: string;
  preparing_at: string | null;
  ready_at: string | null;
  collected_at: string | null;
};

function parseLines(raw: unknown): KitchenLine[] {
  if (typeof raw === "string") {
    try {
      return z.array(lineSchema).parse(JSON.parse(raw));
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) return z.array(lineSchema).parse(raw);
  return [];
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function mapOrder(row: OrderRow): KitchenOrder {
  return {
    code: row.id,
    status: row.status,
    customer: row.customer_name,
    phone: row.phone,
    slot: row.slot,
    pay: row.pay,
    lines: parseLines(row.lines),
    total: Number(row.total),
    summary: row.summary,
    items: Number(row.items),
    time: fmtTime(row.placed_at),
    placedAt: row.placed_at,
    preparingAt: row.preparing_at,
    readyAt: row.ready_at,
    collectedAt: row.collected_at,
  };
}

function metricsFrom(orders: KitchenOrder[]): KitchenMetrics {
  return {
    total: orders.length,
    completed: orders.filter((o) => o.status === "completed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    pending: orders.filter((o) => o.status === "pending").length,
    ready: orders.filter((o) => o.status === "ready").length,
  };
}

export function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return `${d.slice(0, 5)} ${d.slice(5)}`;
  return phone;
}

export const placePickupOrder = createServerFn({ method: "POST" })
  .validator(placeSchema)
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const next = await sql<{ n: number }>`
      select coalesce(max(substring(id from 2)::int), 40) + 1 as n from kitchen_orders
    `;
    const code = "A" + String(next[0]?.n ?? 41);
    const items = data.lines.reduce((s, l) => s + l.qty, 0);
    const summary = data.lines
      .slice(0, 2)
      .map((l) => l.name.replace(/ \(.+\)$/, ""))
      .join(" + ");
    await sql`
      insert into kitchen_orders (
        id, status, customer_name, phone, slot, pay, lines, total, summary, items, placed_at
      ) values (
        ${code},
        'pending',
        ${data.name},
        ${data.phone},
        ${data.slot},
        ${data.pay},
        ${JSON.stringify(data.lines)}::jsonb,
        ${data.total},
        ${summary},
        ${items},
        now()
      )
    `;
    const rows = await sql<OrderRow>`select * from kitchen_orders where id = ${code}`;
    return mapOrder(rows[0]);
  });

export const getPickupStatus = createServerFn({ method: "GET" })
  .validator(z.object({ code: z.string().min(2).max(8) }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<OrderRow>`select * from kitchen_orders where id = ${data.code}`;
    return rows[0] ? mapOrder(rows[0]) : null;
  });

export const listKitchenOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<OrderRow>`
      select * from kitchen_orders
      where placed_at >= date_trunc('day', now())
      order by placed_at desc
    `;
    const orders = rows.map(mapOrder);
    return { orders, metrics: metricsFrom(orders) };
  });

export const getKitchenOrder = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ code: z.string().min(2).max(8) }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<OrderRow>`select * from kitchen_orders where id = ${data.code}`;
    return rows[0] ? mapOrder(rows[0]) : null;
  });

export const updateKitchenStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      code: z.string().min(2).max(8),
      status: z.enum(["pending", "preparing", "ready", "completed"]),
    }),
  )
  .handler(async ({ data, context }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    if (data.status === "preparing") {
      await sql`
        update kitchen_orders
        set status = ${data.status}, preparing_at = coalesce(preparing_at, now()), updated_by = ${context.userId}
        where id = ${data.code}
      `;
    } else if (data.status === "ready") {
      await sql`
        update kitchen_orders
        set status = ${data.status},
            preparing_at = coalesce(preparing_at, now()),
            ready_at = coalesce(ready_at, now()),
            updated_by = ${context.userId}
        where id = ${data.code}
      `;
    } else if (data.status === "completed") {
      await sql`
        update kitchen_orders
        set status = ${data.status},
            ready_at = coalesce(ready_at, now()),
            collected_at = coalesce(collected_at, now()),
            updated_by = ${context.userId}
        where id = ${data.code}
      `;
    } else {
      await sql`
        update kitchen_orders
        set status = ${data.status}, updated_by = ${context.userId}
        where id = ${data.code}
      `;
    }
    const rows = await sql<OrderRow>`select * from kitchen_orders where id = ${data.code}`;
    return rows[0] ? mapOrder(rows[0]) : null;
  });

export const listMenuFlags = createServerFn({ method: "GET" }).handler(async () => {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{ item_id: string; available: boolean }>`
    select item_id, available from kitchen_menu_flags
  `;
  return Object.fromEntries(rows.map((r) => [r.item_id, r.available])) as Record<string, boolean>;
});

export const setMenuFlag = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ itemId: z.string().min(1).max(40), available: z.boolean() }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      insert into kitchen_menu_flags (item_id, available, updated_at)
      values (${data.itemId}, ${data.available}, now())
      on conflict (item_id) do update set available = ${data.available}, updated_at = now()
    `;
    return { itemId: data.itemId, available: data.available };
  });
