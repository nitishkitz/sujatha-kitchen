import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, MoreHorizontal, Phone, UserRound } from "lucide-react";
import { formatPhone, updateKitchenStatus } from "@/lib/kitchen-orders";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/kitchen/orders/$id";
import { StatusChip } from "./status-chip";

export function KitchenOrderScreen() {
  const order = Route.useLoaderData();
  const { id } = Route.useParams();
  const router = useRouter();

  if (!order) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg px-6">
        <p className="text-sm text-muted">Order {id} isn’t on this board.</p>
        <Link to="/kitchen" className="text-sm font-medium text-forest">
          Back to today
        </Link>
      </div>
    );
  }

  const steps = [
    { label: "Order received", done: true, at: order.time },
    {
      label: "Preparing",
      done: order.status !== "pending",
      at: order.preparingAt ? formatClock(order.preparingAt) : undefined,
    },
    {
      label: "Ready",
      done: order.status === "ready" || order.status === "completed",
      at: order.readyAt ? formatClock(order.readyAt) : undefined,
    },
    {
      label: "Collected",
      done: order.status === "completed",
      at: order.collectedAt ? formatClock(order.collectedAt) : undefined,
    },
  ];

  async function setStatus(status: "preparing" | "ready" | "completed") {
    await updateKitchenStatus({ data: { code: id, status } });
    await router.invalidate();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="relative flex h-12 items-center justify-center px-2 pad-safe-t">
        <Link
          to="/kitchen"
          aria-label="Back"
          className="absolute left-2 grid size-11 place-items-center text-ink no-underline"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-[1.05rem] font-semibold">Order {order.code}</h1>
        <span className="absolute right-2 grid size-11 place-items-center text-ink">
          <MoreHorizontal className="size-5" />
        </span>
      </header>

      <div className="flex-1 px-5 pt-2 pb-8">
        <div className="rounded-[1.15rem] bg-surface p-4 shadow-card">
          <div className="flex items-start justify-between">
            <p className="text-[2rem] font-bold tabular-nums">{order.code}</p>
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
          <div className="mt-2 flex items-center gap-2 text-sm">
            <UserRound className="size-4 text-muted" />
            {order.customer}
          </div>
          <div className="mt-1 flex items-center gap-2 text-caption text-muted">
            <Phone className="size-4" />
            {formatPhone(order.phone)}
          </div>
        </div>

        <div className="mt-5">
          <h2 className="text-sm font-semibold">Timeline</h2>
          <ol className="relative mt-3 space-y-3 pl-1">
            <span className="absolute top-2 bottom-2 left-[9px] w-px bg-line" />
            {steps.map((s) => (
              <li key={s.label} className="relative flex items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "relative z-10 grid size-[18px] place-items-center rounded-full",
                      s.done ? "bg-forest text-on-forest" : "bg-bg ring-2 ring-line",
                    )}
                  >
                    {s.done ? <span className="text-[9px] leading-none">✓</span> : null}
                  </span>
                  <span className={cn("text-sm", s.done ? "text-ink" : "text-muted")}>{s.label}</span>
                </span>
                {s.at ? <span className="text-micro tabular-nums text-muted">{s.at}</span> : null}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 space-y-2">
          {order.status === "pending" && (
            <button
              type="button"
              onClick={() => void setStatus("preparing")}
              className="press flex h-cta w-full items-center justify-center rounded-[1.15rem] bg-forest text-body font-semibold text-on-forest"
            >
              Start preparing
            </button>
          )}
          {order.status !== "ready" && order.status !== "completed" && (
            <button
              type="button"
              onClick={() => void setStatus("ready")}
              className="press flex h-cta w-full items-center justify-center rounded-[1.15rem] bg-lime text-body font-semibold text-on-lime"
            >
              Mark as Ready
            </button>
          )}
          {order.status !== "completed" && (
            <button
              type="button"
              onClick={() => void setStatus("completed")}
              className="press flex h-cta w-full items-center justify-center rounded-[1.15rem] bg-forest text-body font-semibold text-on-forest"
            >
              Mark as Collected
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatClock(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}
