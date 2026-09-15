import { Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, ChefHat, ClipboardList, Settings, UserRound, UtensilsCrossed } from "lucide-react";
import { formatPhone, useStaff, type StaffStatus } from "@/lib/staff";
import { cn } from "@/lib/utils";
import { Wordmark } from "./bits";

const METRICS = [
  { key: "total", label: "Total orders", value: "36", icon: ClipboardList, tone: "text-forest" },
  { key: "done", label: "Completed", value: "7", icon: ChefHat, tone: "text-forest" },
  { key: "prep", label: "Preparing", value: "5", icon: UtensilsCrossed, tone: "text-forest" },
  { key: "pend", label: "Pending", value: "5", icon: CalendarDays, tone: "text-chip-warn" },
] as const;

export function AdminDashboard() {
  const orders = useStaff((s) => s.orders);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="flex items-center justify-between px-5 pad-safe-t">
        <Wordmark compact align="left" />
        <span className="grid size-11 place-items-center rounded-full bg-surface text-forest shadow-card">
          <UserRound className="size-5" />
        </span>
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
          {METRICS.map((m) => (
            <div key={m.key} className="rounded-lg bg-surface px-2 py-3 text-center shadow-card">
              <m.icon className={cn("mx-auto size-4", m.tone)} />
              <p className="mt-1 text-lg font-semibold tabular-nums">{m.value}</p>
              <p className="text-micro leading-tight text-muted">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">Recent orders</h2>
          <span className="text-caption text-muted">View all</span>
        </div>

        <ul className="mt-2">
          {orders.map((o) => (
            <li key={o.code}>
              <Link
                to="/admin/orders/$id"
                params={{ id: o.code }}
                className="flex items-center gap-3 border-b border-line py-3.5 text-ink no-underline"
              >
                <span className="w-10 text-sm font-semibold tabular-nums">{o.code}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{o.summary}</span>
                  <span className="text-micro text-muted">
                    {o.items} item{o.items > 1 ? "s" : ""}
                    {o.live ? " · live" : ""}
                  </span>
                </span>
                <StatusChip status={o.status} />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <StaffTabBar active="today" />
    </div>
  );
}

export function AdminOrder({ id }: { id: string }) {
  const order = useStaff((s) => s.orders.find((o) => o.code === id));
  const setStatus = useStaff((s) => s.setStatus);

  if (!order) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg px-6">
        <p className="text-sm text-muted">Order {id} isn’t on this board.</p>
        <Link to="/admin" className="text-sm font-medium text-forest">
          Back to today
        </Link>
      </div>
    );
  }

  const steps: { label: string; done: boolean }[] = [
    { label: "Order received", done: true },
    { label: "Preparing", done: order.status !== "pending" },
    { label: "Ready", done: order.status === "ready" || order.status === "completed" },
    { label: "Collected", done: order.status === "completed" },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="relative flex h-12 items-center justify-center px-5 pad-safe-t">
        <Link
          to="/admin"
          aria-label="Back"
          className="absolute left-3 grid size-11 place-items-center text-ink no-underline"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-lg font-semibold">Order {order.code}</h1>
      </header>

      <div className="flex-1 px-5 pt-2 pb-8">
        <div className="rounded-lg bg-surface p-4 shadow-card">
          <div className="flex items-start justify-between">
            <p className="text-3xl font-bold tabular-nums">{order.code}</p>
            <StatusChip status={order.status} />
          </div>
          <p className="mt-1 text-caption text-muted">
            {order.items} items · {order.time}
          </p>

          <div className="mt-4 border-t border-line pt-3">
            {order.lines.map((l, i) => (
              <div key={i} className="flex items-start justify-between py-1.5 text-sm">
                <div>
                  <p>
                    {l.qty} × {l.name}
                  </p>
                  {l.note ? <p className="text-caption text-muted">{l.note}</p> : null}
                </div>
                <span className="tabular-nums">₹{l.price}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-line pt-2 text-body font-semibold">
              <span>Total</span>
              <span className="tabular-nums">₹{order.total}</span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="text-sm font-semibold">Customer</h2>
          <p className="mt-1 text-sm">{order.customer}</p>
          <p className="text-caption text-muted">{formatPhone(order.phone)}</p>
        </div>

        <div className="mt-5">
          <h2 className="text-sm font-semibold">Timeline</h2>
          <ol className="mt-3 space-y-3">
            {steps.map((s) => (
              <li key={s.label} className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full",
                    s.done ? "bg-forest text-on-forest" : "ring-2 ring-line",
                  )}
                >
                  {s.done ? <span className="text-micro">✓</span> : null}
                </span>
                <span className={cn("text-sm", s.done ? "text-ink" : "text-muted")}>{s.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 space-y-2">
          {order.status !== "ready" && order.status !== "completed" && (
            <button
              type="button"
              onClick={() => setStatus(order.code, "ready")}
              className="press flex h-cta w-full items-center justify-center rounded-lg bg-lime text-body font-semibold text-on-lime"
            >
              Mark as Ready
            </button>
          )}
          {order.status !== "completed" && (
            <button
              type="button"
              onClick={() => setStatus(order.code, "completed")}
              className="press flex h-cta w-full items-center justify-center rounded-lg bg-forest text-body font-semibold text-on-forest"
            >
              Mark as Collected
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: StaffStatus }) {
  const map: Record<StaffStatus, string> = {
    pending: "bg-soft text-muted",
    preparing: "bg-chip-prep text-ink",
    ready: "bg-chip-ready text-forest",
    completed: "bg-soft text-muted",
  };
  const label: Record<StaffStatus, string> = {
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-micro font-semibold", map[status])}>
      {label[status]}
    </span>
  );
}

function StaffTabBar({ active }: { active: "orders" | "menu" | "today" | "settings" }) {
  const tabs = [
    { id: "orders" as const, label: "Orders", icon: ClipboardList, to: "/admin" },
    { id: "menu" as const, label: "Menu", icon: UtensilsCrossed, to: "/admin" },
    { id: "today" as const, label: "Today", icon: CalendarDays, to: "/admin" },
    { id: "settings" as const, label: "Settings", icon: Settings, to: "/admin" },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto flex max-w-phone justify-around border-t border-line bg-surface pt-2 pad-safe-b">
      {tabs.map((t) => (
        <Link
          key={t.id}
          to={t.to}
          className={cn(
            "flex flex-col items-center gap-1 px-3 text-micro no-underline",
            active === t.id ? "text-forest" : "text-muted",
          )}
        >
          <t.icon className="size-5" />
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
