import { Clock, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { greeting } from "@/lib/utils";
import { useEffect, useState } from "react";

export function StartScreen() {
  const [hi, setHi] = useState("Hello");
  useEffect(() => setHi(greeting()), []);

  return (
    <section className="flex min-h-dvh flex-col bg-bg">
      <header className="px-5 pt-6">
        <p className="font-te text-center text-xs text-forest">అన్నం పరబ్రహ్మ స్వరూపం</p>
        <div className="mx-auto mt-5 size-20 overflow-hidden rounded-2xl bg-tile">
          <img src="/food/clay-pot.png" alt="" className="size-full object-contain p-1.5" />
        </div>
        <p className="mt-4 text-center text-xs font-medium tracking-[0.16em] text-muted uppercase">
          Self pickup only
        </p>
        <h1 className="font-display mt-1 text-center text-[2rem] leading-[1.1] text-forest-deep">
          Sujatha's Authentic Kitchen
        </h1>
        <p className="mt-1 text-center text-sm text-muted">Good food, good mood · Hyderabad</p>
      </header>

      <div className="flex-1 px-5 pt-8">
        <p className="text-sm text-muted">{hi}</p>
        <h2 className="mt-1 text-xl font-medium tracking-tight text-ink">
          How would you like to receive your order?
        </h2>

        <div className="mt-4 rounded-2xl border border-forest bg-surface p-4 shadow-[0_0_0_1px_rgb(27_77_62_/_0.12)]">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-tile text-forest">
              <ShoppingBag className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-medium text-ink">Self pickup</p>
              <p className="mt-0.5 text-sm text-muted">
                Collect at the kitchen counter. No delivery.
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-sm text-forest">
            <Clock className="size-4" />
            Ready in 15–20 min
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium">
              <span className="size-1.5 rounded-full bg-forest" />
              Kitchen open
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 pb-24">
        <Link
          to="/menu"
          className="flex h-14 w-full items-center justify-center rounded-full bg-forest text-[15px] font-semibold text-bg no-underline transition-transform duration-150 ease-out active:scale-[0.96]"
        >
          Start pickup order
        </Link>
      </div>
    </section>
  );
}
