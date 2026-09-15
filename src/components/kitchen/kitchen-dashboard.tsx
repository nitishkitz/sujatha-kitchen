import { Link, useRouter } from "@tanstack/react-router";
import { CalendarDays, ChefHat, ClipboardList, UserRound, UtensilsCrossed } from "lucide-react";
import { useEffect } from "react";
import { Route } from "@/routes/kitchen/index";
import type { KitchenOrder, StaffStatus } from "@/lib/kitchen-orders";
import { cn } from "@/lib/utils";
import { BrandLockup } from "./brand-lockup";
import { KitchenTabBar } from "./kitchen-tab-bar";
import { StatusChip } from "./status-chip";

const METRIC_META = [
  { key: "total" as const, label: "Total orders", icon: ClipboardList, tone: "text-forest" },
  { key: "completed" as const, label: "Completed", icon: ChefHat, tone: "text-forest" },
  { key: "preparing" as const, label: "Preparing", icon: UtensilsCrossed, tone: "text-forest" },
  { key: "pending" as const, label: "Pending", icon: CalendarDays, tone: "text-chip-warn" },
];

export function KitchenDashboard() {
  const { orders, metrics } = Route.useLoaderData();
  const router = useRouter();
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  useEffect(() => {
    const t = window.setInterval(() => {
      void router.invalidate();
    }, 4000);
    return () => window.clearInterval(t);
  }, [router]);

  const pending = orders.filter((o) => o.status === "pending");
  const preparing = orders.filter((o) => o.status === "preparing");
  const ready = orders.filter((o) => o.status === "ready");
  const recent = orders.filter((o) => o.status === "completed").slice(0, 6);

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="flex items-center justify-between px-5 pad-safe-t">
        <BrandLockup compact align="left" />
        <Link
          to="/kitchen/settings"
          aria-label="Settings"
          className="grid size-11 place-items-center rounded-full bg-surface text-forest shadow-card no-underline"
        >
          <UserRound className="size-5" />
        </Link>
      </header>

      <div className="flex-1 px-5 pt-4 pb-28">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Today at a glance</h1>
            <p className="mt-0.5 text-caption text-muted">{today}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-chip-ready px-2.5 py-1 text-micro font-semibold text-forest">
            <span className="size-1.5 rounded-full bg-forest" />
            Live
          </span>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {METRIC_META.map((m) => (
            <div key={m.key} className="rounded-[1rem] bg-surface px-1.5 py-3 text-center shadow-card">
              <m.icon className={cn("mx-auto size-4", m.tone)} />
              <p className="mt-1 text-lg font-semibold tabular-nums">{metrics[m.key]}</p>
              <p className="text-micro leading-tight text-muted">{m.label}</p>
            </div>
          ))}
        </div>

        <QueueGroup title="Pending" count={pending.length} orders={pending} />
        <QueueGroup title="Preparing" count={preparing.length} orders={preparing} />
        {ready.length > 0 && <QueueGroup title="Ready" count={ready.length} orders={ready} />}

        <div className="mt-6 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">Recent orders</h2>
          <Link to="/kitchen/orders" className="text-caption text-muted no-underline">
            View all
          </Link>
        </div>
        <ul className="mt-1">
          {recent.map((o) => (
            <OrderRow key={o.code} order={o} />
          ))}
          {recent.length === 0 && <p className="py-6 text-center text-caption text-muted">None collected yet.</p>}
        </ul>
      </div>

      <KitchenTabBar active="today" />
    </div>
  );
}

function QueueGroup({
  title,
  count,
  orders,
}: {
  title: string;
  count: number;
  orders: KitchenOrder[];
}) {
  return (
    <section className="mt-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[0.72rem] font-semibold tracking-[0.16em] text-muted uppercase">{title}</h2>
        <span className="text-caption tabular-nums text-ink">{count}</span>
      </div>
      {orders.length === 0 ? (
        <p className="mt-2 text-caption text-muted">Clear.</p>
      ) : (
        <ul className="mt-1">
          {orders.map((o) => (
            <OrderRow key={o.code} order={o} extra={queueExtra(o)} />
          ))}
        </ul>
      )}
    </section>
  );
}

function queueExtra(o: KitchenOrder) {
  if (o.status === "preparing" && o.preparingAt) {
    const min = Math.max(1, Math.round((Date.now() - new Date(o.preparingAt).getTime()) / 60000));
    return `${min} min`;
  }
  return o.time;
}

function OrderRow({ order, extra }: { order: KitchenOrder; extra?: string }) {
  return (
    <li>
      <Link
        to="/kitchen/orders/$id"
        params={{ id: order.code }}
        className="flex items-center gap-3 border-b border-line py-3.5 text-ink no-underline"
      >
        <span className="w-10 text-sm font-semibold tabular-nums">{order.code}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm">{order.summary}</span>
          <span className="text-micro text-muted">
            {order.items} item{order.items > 1 ? "s" : ""}
            {extra ? ` · ${extra}` : ""}
          </span>
        </span>
        <StatusChip status={order.status as StaffStatus} />
      </Link>
    </li>
  );
}
