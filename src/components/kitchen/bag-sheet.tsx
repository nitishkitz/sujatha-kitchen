import { Drawer } from "vaul";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { ADDONS } from "@/lib/menu";
import { useKitchen } from "@/lib/store";
import { inr } from "@/lib/utils";
import { FoodThumb, PrimaryButton, QtyStepper } from "./bits";

export function BagBar() {
  const bag = useKitchen((s) => s.bag);
  const navigate = useNavigate();
  const count = bag.reduce((s, b) => s + b.qty, 0);
  const sub = bag.reduce((s, b) => s + b.unit * b.qty, 0);
  if (!count) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-phone justify-center px-4 pad-safe-b">
      <button
        type="button"
        onClick={() => void navigate({ to: "/checkout" })}
        className="bar-enter pointer-events-auto flex h-16 w-full items-center gap-3 rounded-lg bg-forest px-3 text-on-forest shadow-bar"
      >
        <span className="relative grid size-10 place-items-center rounded-full bg-forest-deep">
          <ShoppingBag className="size-4" />
          <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-lime text-micro font-bold text-on-lime">
            {count}
          </span>
        </span>
        <span className="min-w-0 flex-1 text-left text-sm font-medium tabular-nums">
          {count} item{count > 1 ? "s" : ""} · {inr(sub)}
        </span>
        <span className="press inline-flex h-10 items-center gap-1 rounded-md bg-lime px-3.5 text-sm font-semibold text-on-lime">
          View bag
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </span>
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
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] max-w-phone flex-col overflow-hidden rounded-t-sheet bg-surface outline-none data-[state=closed]:pointer-events-none">
          <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-line" />
          <div className="flex-1 overflow-y-auto px-5 pt-2 pb-4">
            <Drawer.Title className="text-xl font-semibold tracking-tight text-ink">Your bag</Drawer.Title>
            <Drawer.Description className="text-sm text-muted">
              Pickup only — collect at the counter.
            </Drawer.Description>
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
  const count = bag.reduce((s, b) => s + b.qty, 0);
  const sub = bag.reduce((s, b) => s + b.unit * b.qty, 0);

  if (!count) {
    return <p className="py-10 text-center text-sm text-muted">Your bag is empty.</p>;
  }

  return (
    <div>
      {bag.map((b) => (
        <div key={b.key} className="flex items-start gap-3 border-b border-line py-4">
          <FoodThumb src={b.img} size="sm" alt={b.name} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">
              {b.name}
              {b.sizeLabel ? ` (${b.sizeLabel})` : ""}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {b.addons.map((a) => ADDONS[a]?.name).filter(Boolean).join(", ") || b.note || " "}
            </p>
            <div className="mt-2">
              <QtyStepper value={b.qty} min={0} onChange={(n) => changeQty(b.key, n - b.qty)} />
            </div>
          </div>
          <p className="text-sm font-semibold tabular-nums">{inr(b.unit * b.qty)}</p>
        </div>
      ))}

      <div className="mt-4 flex justify-between text-body font-semibold">
        <span>Total</span>
        <span className="tabular-nums">{inr(sub)}</span>
      </div>

      {!hideCta && (
        <PrimaryButton onClick={onCheckout} className="mt-5 mb-2">
          Continue · {inr(sub)}
        </PrimaryButton>
      )}
    </div>
  );
}
