import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useKitchen } from "@/lib/store";
import { inr } from "@/lib/utils";

export function BagBar() {
  const bag = useKitchen((s) => s.bag);
  const navigate = useNavigate();
  const count = bag.reduce((s, b) => s + b.qty, 0);
  const sub = bag.reduce((s, b) => s + b.unit * b.qty, 0);
  if (!count) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-phone justify-center px-3 pad-safe-b">
      <button
        type="button"
        onClick={() => void navigate({ to: "/checkout" })}
        className="bar-enter pointer-events-auto flex h-[4.15rem] w-full items-center gap-3 rounded-[1.15rem] bg-forest px-3 text-on-forest shadow-bar"
      >
        <span className="relative grid size-10 place-items-center rounded-full bg-forest-deep">
          <ShoppingBag className="size-4" />
          <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-lime text-[0.62rem] font-bold text-on-lime">
            {count}
          </span>
        </span>
        <span className="min-w-0 flex-1 text-left text-sm font-medium tabular-nums">
          {count} item{count > 1 ? "s" : ""} · {inr(sub)}
        </span>
        <span className="inline-flex h-10 items-center gap-1 rounded-xl bg-lime px-3.5 text-sm font-semibold text-on-lime">
          View bag
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </span>
      </button>
    </div>
  );
}
