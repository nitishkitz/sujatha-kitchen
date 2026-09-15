import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/kitchen/orders/index";
import type { StaffStatus } from "@/lib/kitchen-orders";
import { cn } from "@/lib/utils";
import { KitchenTabBar } from "./kitchen-tab-bar";
import { StatusChip } from "./status-chip";

const FILTERS: Array<{ id: "all" | StaffStatus; label: string }> = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "preparing", label: "Preparing" },
  { id: "ready", label: "Ready" },
  { id: "completed", label: "Completed" },
];

export function KitchenOrdersScreen() {
  const { orders } = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | StaffStatus>("all");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!needle) return true;
      return (
        o.code.toLowerCase().includes(needle) ||
        o.customer.toLowerCase().includes(needle) ||
        o.phone.includes(needle.replace(/\s/g, "")) ||
        o.summary.toLowerCase().includes(needle)
      );
    });
  }, [orders, q, filter]);

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="px-5 pt-4 pad-safe-t">
        <h1 className="text-xl font-semibold tracking-tight">Orders</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search A47, name, mobile…"
          className="mt-3 h-field w-full rounded-xl bg-surface px-3 text-sm shadow-card outline-none focus:ring-2 focus:ring-forest/30"
        />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "h-chip shrink-0 rounded-full px-3.5 text-caption",
                filter === f.id ? "bg-forest text-on-forest" : "bg-surface text-ink shadow-card",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <ul className="flex-1 px-5 pt-2 pb-28">
        {shown.map((o) => (
          <li key={o.code}>
            <Link
              to="/kitchen/orders/$id"
              params={{ id: o.code }}
              className="flex items-center gap-3 border-b border-line py-3.5 text-ink no-underline"
            >
              <span className="w-10 text-sm font-semibold tabular-nums">{o.code}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{o.summary}</span>
                <span className="text-micro text-muted">
                  {o.customer} · {o.time}
                </span>
              </span>
              <StatusChip status={o.status} />
            </Link>
          </li>
        ))}
        {shown.length === 0 && <p className="py-10 text-center text-sm text-muted">No matching orders.</p>}
      </ul>

      <KitchenTabBar active="orders" />
    </div>
  );
}
