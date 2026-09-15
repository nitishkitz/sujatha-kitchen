import { Drawer } from "vaul";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { ADDONS, SLOTS } from "@/lib/menu";
import { useKitchen } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { FoodThumb, PrimaryButton, QtyStepper } from "./bits";

export function BagBar() {
  const bag = useKitchen((s) => s.bag);
  const setBagOpen = useKitchen((s) => s.setBagOpen);
  const count = bag.reduce((s, b) => s + b.qty, 0);
  const sub = bag.reduce((s, b) => s + b.unit * b.qty, 0);
  if (!count) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-30 flex justify-center px-4 lg:hidden">
      <button
        type="button"
        onClick={() => setBagOpen(true)}
        className="pointer-events-auto flex h-14 w-full max-w-lg items-center justify-between rounded-full bg-forest px-6 text-[15px] font-semibold text-bg shadow-[var(--shadow-bar)] transition-transform duration-150 ease-out active:scale-[0.96]"
      >
        <span className="tabular-nums">
          Basket · {count} item{count > 1 ? "s" : ""}
        </span>
        <span className="tabular-nums">{inr(sub)}</span>
      </button>
    </div>
  );
}

export function BagSheet() {
  const open = useKitchen((s) => s.bagOpen);
  const setBagOpen = useKitchen((s) => s.setBagOpen);
  const navigate = useNavigate();
  return (
    <Drawer.Root open={open} onOpenChange={setBagOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-ink/40 data-[state=closed]:pointer-events-none" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] max-w-lg flex-col overflow-hidden rounded-t-3xl bg-surface outline-none data-[state=closed]:pointer-events-none">
          <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-line" />
          <div className="flex-1 overflow-y-auto px-5 pt-2 pb-4">
            <Drawer.Title className="text-xl font-medium tracking-tight text-ink">Your order</Drawer.Title>
            <Drawer.Description className="text-sm text-muted">This is a pickup order — collect at the counter.</Drawer.Description>
            <BagBody
              onCheckout={() => {
                setBagOpen(false);
                void navigate({ to: "/checkout" });
              }}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function BagBody({
  onCheckout,
  hideCta,
}: {
  onCheckout: () => void;
  hideCta?: boolean;
}) {
  const bag = useKitchen((s) => s.bag);
  const changeQty = useKitchen((s) => s.changeQty);
  const pickup = useKitchen((s) => s.pickup);
  const slot = useKitchen((s) => s.slot);
  const setPickup = useKitchen((s) => s.setPickup);
  const count = bag.reduce((s, b) => s + b.qty, 0);
  const sub = bag.reduce((s, b) => s + b.unit * b.qty, 0);

  if (!count) {
    return <p className="py-10 text-center text-sm text-muted">Your bag is empty.</p>;
  }

  return (
    <div>
      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-tile p-3.5">
        <span className="grid size-10 place-items-center rounded-full bg-surface text-forest">
          <ShoppingBag className="size-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-ink">Pick up at the kitchen</p>
          <p className="text-sm text-muted">{pickup === "asap" ? "Standard (15–20 min)" : slot}</p>
        </div>
      </div>

      {bag.map((b) => (
        <div key={b.key} className="flex items-start gap-3 border-b border-line py-4">
          <FoodThumb src={b.img} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">
              {b.name}
              {b.sizeLabel ? ` · ${b.sizeLabel}` : ""}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {b.addons.map((a) => ADDONS[a]?.name).filter(Boolean).join(", ") || b.note || " "}
            </p>
            <div className="mt-2">
              <QtyStepper value={b.qty} min={0} onChange={(n) => changeQty(b.key, n - b.qty)} />
            </div>
          </div>
          <p className="text-sm font-medium tabular-nums">{inr(b.unit * b.qty)}</p>
        </div>
      ))}

      <div className="mt-4 flex justify-between text-sm">
        <span className="text-muted">Subtotal</span>
        <span className="tabular-nums">{inr(sub)}</span>
      </div>
      <div className="mt-1 flex justify-between text-[15px] font-medium">
        <span>Total</span>
        <span className="tabular-nums">{inr(sub)}</span>
      </div>

      <p className="mt-5 text-sm font-medium text-ink">Pickup time</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setPickup("asap")}
          className={cn(
            "rounded-xl border px-3 py-3 text-left",
            pickup === "asap" ? "border-forest bg-tile" : "border-line bg-surface",
          )}
        >
          <span className="block text-sm font-medium">ASAP</span>
          <span className="text-xs text-muted">15–20 min</span>
        </button>
        <button
          type="button"
          onClick={() => setPickup("schedule", SLOTS[0])}
          className={cn(
            "rounded-xl border px-3 py-3 text-left",
            pickup === "schedule" ? "border-forest bg-tile" : "border-line bg-surface",
          )}
        >
          <span className="block text-sm font-medium">Schedule</span>
          <span className="text-xs text-muted">Pick a window</span>
        </button>
      </div>
      {pickup === "schedule" && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {SLOTS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPickup("schedule", t)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-sm",
                slot === t ? "border-forest bg-forest text-bg" : "border-line bg-surface",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {!hideCta && (
        <PrimaryButton onClick={onCheckout} className="mt-5 mb-2">
          Review payment
        </PrimaryButton>
      )}
    </div>
  );
}
