import { Check, MapPin, ShoppingBag, Ticket } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useKitchen } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { PrimaryButton } from "./bits";

const STEPS = ["Received", "Preparing", "Ready"] as const;
const TITLES = ["Order received", "Preparing meal", "Ready for pickup"] as const;

export function StatusScreen() {
  const order = useKitchen((s) => s.order);
  const reset = useKitchen((s) => s.reset);
  const navigate = useNavigate();
  useEffect(() => {
    if (!order) void navigate({ to: "/" });
  }, [order, navigate]);
  if (!order) return null;
  const ready = order.stage >= 2;

  return (
    <section className="flex min-h-dvh flex-col bg-bg px-5 pt-8 pb-24">
      <h1 className="font-display text-[2.35rem] leading-[1.1] tracking-tight text-ink">{TITLES[order.stage]}</h1>
      <p className="mt-1 text-sm text-muted">{ready ? "Show this at the kitchen counter" : order.slot}</p>

      <ol className="mt-6 grid grid-cols-3">
        {STEPS.map((label, i) => {
          const done = order.stage >= i;
          return (
            <li key={label} className="relative text-center">
              {i < STEPS.length - 1 && (
                <span
                  className={cn(
                    "absolute top-1.5 left-[calc(50%+10px)] h-px w-[calc(100%-20px)]",
                    order.stage > i ? "bg-forest" : "bg-line",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 mx-auto grid size-3 rounded-full",
                  done ? "bg-forest" : "bg-line",
                )}
              />
              <p className={cn("mt-2 text-xs", done ? "text-ink" : "text-muted")}>{label}</p>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 rounded-3xl bg-tile px-5 py-8 text-center">
        <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">Pickup number</p>
        <p className="font-display mt-1 text-7xl leading-none tracking-tight text-forest-deep">{order.code}</p>
        {ready ? (
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1 text-xs font-medium text-bg">
            <Check className="size-3.5" strokeWidth={2.5} /> Ready — collect now
          </span>
        ) : (
          <p className="mt-3 text-sm text-muted">Kitchen is on it</p>
        )}
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium">How to pick up</p>
        <ul className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: MapPin, label: "Go to the kitchen" },
            { icon: Ticket, label: "Show your number" },
            { icon: ShoppingBag, label: "Collect your order" },
          ].map((s) => (
            <li key={s.label} className="rounded-2xl bg-surface px-2 py-4 shadow-[0_0_0_1px_var(--color-line)]">
              <s.icon className="mx-auto size-5 text-forest" />
              <p className="mt-2 text-xs leading-snug text-muted">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-line pt-4">
        <p className="text-sm font-medium">Sujatha's Authentic Kitchen</p>
        <p className="mt-1 text-sm text-muted">
          {order.name} · {order.lines.reduce((s, l) => s + l.qty, 0)} items · {inr(order.total)}
        </p>
        <p className="text-xs text-muted">{order.pay === "upi" ? "Pay UPI at counter" : "Pay cash at counter"}</p>
        {order.lines.map((l) => (
          <p key={l.key} className="mt-1 text-sm text-muted">
            {l.qty}× {l.name}
            {l.sizeLabel ? ` (${l.sizeLabel})` : ""}
          </p>
        ))}
      </div>

      <PrimaryButton
        className="mt-auto"
        onClick={() => {
          reset();
          void navigate({ to: "/" });
        }}
      >
        Place another pickup
      </PrimaryButton>
    </section>
  );
}
