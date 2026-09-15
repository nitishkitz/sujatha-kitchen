import { ArrowLeft, MapPin } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useKitchen } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { toast } from "sonner";
import { PrimaryButton } from "./bits";

export function CheckoutScreen() {
  const bag = useKitchen((s) => s.bag);
  const slot = useKitchen((s) => s.slot);
  const pay = useKitchen((s) => s.pay);
  const setPay = useKitchen((s) => s.setPay);
  const custName = useKitchen((s) => s.custName);
  const phone = useKitchen((s) => s.phone);
  const setCustomer = useKitchen((s) => s.setCustomer);
  const place = useKitchen((s) => s.place);
  const navigate = useNavigate();
  const count = bag.reduce((s, b) => s + b.qty, 0);
  const sub = bag.reduce((s, b) => s + b.unit * b.qty, 0);

  function submit() {
    if (!place()) {
      toast.error("Name and a 10-digit mobile are needed");
      return;
    }
    void navigate({ to: "/status" });
  }

  return (
    <section className="flex min-h-dvh flex-col bg-bg">
      <header className="px-5 pt-4">
        <Link to="/menu" className="inline-flex size-10 items-center justify-center text-ink no-underline">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="mt-1 text-2xl font-medium tracking-tight">Checkout</h1>
        <p className="text-sm text-muted">Sujatha's Authentic Kitchen</p>
      </header>

      <div className="flex-1 space-y-3 px-5 pt-4 pb-4">
        <div className="rounded-2xl bg-surface p-4 shadow-[0_0_0_1px_var(--color-line)]">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Pickup address</p>
          <div className="mt-2 flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-tile text-forest">
              <MapPin className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium">Sujatha's Authentic Kitchen</p>
              <p className="text-sm text-muted">Kitchen counter · Hyderabad</p>
              <p className="mt-1 text-sm text-forest">{slot}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-4 shadow-[0_0_0_1px_var(--color-line)]">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Your details</p>
          <label className="mt-3 block text-sm text-muted">Pickup name</label>
          <input
            value={custName}
            onChange={(e) => setCustomer(e.target.value, phone)}
            className="mt-1 h-12 w-full rounded-xl border border-line bg-bg px-3 text-sm outline-none focus:border-forest"
            placeholder="Name called at the counter"
          />
          <label className="mt-3 block text-sm text-muted">Mobile</label>
          <input
            value={phone}
            onChange={(e) => setCustomer(custName, e.target.value)}
            inputMode="tel"
            className="mt-1 h-12 w-full rounded-xl border border-line bg-bg px-3 text-sm outline-none focus:border-forest"
            placeholder="10-digit number"
          />
        </div>

        <div className="rounded-2xl bg-surface p-4 shadow-[0_0_0_1px_var(--color-line)]">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Payment method</p>
          <div className="mt-2">
            {(["upi", "cash"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPay(p)}
                className="flex w-full items-center justify-between border-b border-line py-3.5 last:border-0"
              >
                <span className="text-sm">{p === "upi" ? "UPI at counter" : "Cash at counter"}</span>
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full border",
                    pay === p ? "border-forest bg-forest" : "border-muted/40",
                  )}
                >
                  {pay === p ? <span className="size-2 rounded-full bg-bg" /> : null}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-4 shadow-[0_0_0_1px_var(--color-line)]">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Order summary</p>
          {bag.map((b) => (
            <div key={b.key} className="mt-2 flex justify-between text-sm">
              <span className="text-muted">
                {b.qty}× {b.name}
                {b.sizeLabel ? ` (${b.sizeLabel})` : ""}
              </span>
              <span className="tabular-nums">{inr(b.unit * b.qty)}</span>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t border-line pt-3 text-[15px] font-medium">
            <span>Total · {count} items</span>
            <span className="tabular-nums">{inr(sub)}</span>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-bg px-5 pt-2 pb-24">
        <PrimaryButton onClick={submit}>Place pick-up order · {inr(sub)}</PrimaryButton>
      </div>
    </section>
  );
}
