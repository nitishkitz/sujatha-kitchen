import { useEffect } from "react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SLOTS } from "@/lib/menu";
import { useKitchen } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { toast } from "sonner";
import { FoodThumb, PrimaryButton } from "./bits";

const STEPS = ["Details", "Review", "Done"] as const;

export function CheckoutScreen() {
  const bag = useKitchen((s) => s.bag);
  const pickup = useKitchen((s) => s.pickup);
  const slot = useKitchen((s) => s.slot);
  const setPickup = useKitchen((s) => s.setPickup);
  const pay = useKitchen((s) => s.pay);
  const setPay = useKitchen((s) => s.setPay);
  const custName = useKitchen((s) => s.custName);
  const phone = useKitchen((s) => s.phone);
  const setCustomer = useKitchen((s) => s.setCustomer);
  const place = useKitchen((s) => s.place);
  const navigate = useNavigate();
  const sub = bag.reduce((s, b) => s + b.unit * b.qty, 0);

  useEffect(() => {
    if (bag.length === 0) void navigate({ to: "/menu" });
  }, [bag.length, navigate]);

  function submit() {
    if (!place()) {
      toast.error("Name and a 10-digit mobile are needed");
      return;
    }
    void navigate({ to: "/status" });
  }

  return (
    <section className="flex min-h-dvh flex-col bg-bg">
      <header className="px-5 pad-safe-t">
        <div className="relative flex h-12 items-center justify-center">
          <Link
            to="/menu"
            aria-label="Back to menu"
            className="absolute left-0 grid size-11 place-items-center text-ink no-underline"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-lg font-semibold tracking-tight">Your Bag</h1>
        </div>
        <ol className="mt-1 mb-4 flex items-center justify-center gap-5">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full text-micro font-semibold",
                  i === 0 ? "bg-forest text-on-forest" : "bg-soft text-muted",
                )}
              >
                {i + 1}
              </span>
              <span className={cn("text-caption", i === 0 ? "font-medium text-ink" : "text-muted")}>
                {label}
              </span>
            </li>
          ))}
        </ol>
      </header>

      <div className="flex-1 space-y-6 px-5 pb-28">
        <section>
          <h2 className="text-sm font-semibold text-ink">Pickup time</h2>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setPickup("asap")}
              className={cn(
                "flex h-20 flex-col items-start justify-center gap-0.5 rounded-lg px-4 text-left",
                pickup === "asap"
                  ? "bg-lime-soft shadow-[0_0_0_1.5px_var(--color-lime)]"
                  : "bg-surface shadow-card",
              )}
            >
              <Clock className="size-4 text-forest" />
              <span className="text-sm font-semibold">ASAP</span>
              <span className="text-caption text-muted">15–20 min</span>
            </button>
            <button
              type="button"
              onClick={() => setPickup("schedule", SLOTS[0])}
              className={cn(
                "flex h-20 flex-col items-start justify-center gap-0.5 rounded-lg px-4 text-left",
                pickup === "schedule"
                  ? "bg-lime-soft shadow-[0_0_0_1.5px_var(--color-lime)]"
                  : "bg-surface shadow-card",
              )}
            >
              <Calendar className="size-4 text-forest" />
              <span className="text-sm font-semibold">Schedule</span>
              <span className="text-caption text-muted">a time</span>
            </button>
          </div>
          {pickup === "schedule" && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {SLOTS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPickup("schedule", t)}
                  className={cn(
                    "rounded-md px-2 py-2 text-caption",
                    slot === t ? "bg-forest text-on-forest" : "bg-surface text-ink shadow-card",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-semibold text-ink">Your details</h2>
          <label className="mt-2.5 block text-caption text-muted">Name</label>
          <input
            value={custName}
            onChange={(e) => setCustomer(e.target.value, phone)}
            className="mt-1 h-field w-full rounded-md bg-surface px-3 text-sm shadow-card outline-none focus:ring-2 focus:ring-forest/30"
            placeholder="Name called at the counter"
          />
          <label className="mt-3 block text-caption text-muted">Mobile number</label>
          <input
            value={phone}
            onChange={(e) => setCustomer(custName, e.target.value)}
            inputMode="tel"
            className="mt-1 h-field w-full rounded-md bg-surface px-3 text-sm shadow-card outline-none focus:ring-2 focus:ring-forest/30"
            placeholder="10-digit number"
          />
        </section>

        <section>
          <h2 className="text-sm font-semibold text-ink">Payment at counter</h2>
          <div className="mt-2 space-y-1">
            {(["upi", "cash"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPay(p)}
                className="flex w-full items-center gap-3 py-2.5 text-left"
              >
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full border",
                    pay === p ? "border-forest bg-forest" : "border-muted/40",
                  )}
                >
                  {pay === p ? <span className="size-1.5 rounded-full bg-on-forest" /> : null}
                </span>
                <span className="text-sm">{p === "upi" ? "UPI at counter" : "Cash at counter"}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="pb-4">
          <h2 className="text-sm font-semibold text-ink">Order summary</h2>
          {bag.map((b) => (
            <div key={b.key} className="flex items-center gap-3 border-b border-line py-3">
              <FoodThumb src={b.img} size="sm" alt={b.name} />
              <p className="min-w-0 flex-1 truncate text-sm text-ink">
                {b.name}
                {b.sizeLabel ? ` (${b.sizeLabel})` : ""}
              </p>
              <span className="text-caption tabular-nums text-muted">×{b.qty}</span>
              <span className="w-12 text-right text-sm tabular-nums">{inr(b.unit * b.qty)}</span>
            </div>
          ))}
          <div className="mt-3 flex justify-between text-body font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{inr(sub)}</span>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 bg-bg px-5 pt-2 pad-safe-b">
        <PrimaryButton onClick={submit}>Place order · {inr(sub)}</PrimaryButton>
      </div>
    </section>
  );
}
