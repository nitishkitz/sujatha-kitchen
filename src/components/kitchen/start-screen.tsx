import { ArrowRight, Banknote, Hash, Utensils } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BrandLockup } from "./brand-lockup";

export function StartScreen() {
  return (
    <section className="flex min-h-dvh flex-col bg-bg">
      <div className="relative h-hero overflow-hidden bg-forest-deep pad-safe-t">
        <div className="relative z-20 px-6 pt-2">
          <BrandLockup light />
          <p className="font-te mt-2.5 text-center text-caption text-lime/85">
            అన్నం పరబ్రహ్మ స్వరూపం
          </p>
          <p className="mt-1 text-center text-micro tracking-[0.16em] text-on-forest/65 uppercase">
            Good food, good mood
          </p>
        </div>

        <img
          src="/ui/start-food-composed.png"
          alt=""
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[68%] w-full object-cover object-top"
        />

        <p className="font-script pointer-events-none absolute top-28 right-3 z-20 w-[6.5rem] rotate-[-12deg] text-center text-[1.35rem] leading-[1.05] text-on-forest">
          Same Great
          <br />
          Food Everyday
        </p>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-6 pb-5 pad-safe-b">
        <h1 className="font-display text-[3.15rem] leading-[0.95] font-medium tracking-tight text-ink">
          Hungry?
        </h1>
        <p className="mt-3 text-[1.05rem] leading-snug text-ink/80">
          Your food can be ready
          <br />
          in 15–20 min.
        </p>

        <div className="mt-5 flex items-center gap-3 rounded-[1rem] bg-surface px-4 py-3 shadow-card">
          <span className="size-2.5 rounded-full bg-lime ring-4 ring-lime/25" />
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-forest uppercase">
              Kitchen open
            </p>
            <p className="text-caption text-muted">Pickup only · 15–20 min</p>
          </div>
        </div>

        <Link
          to="/menu"
          className="press mt-5 flex h-cta w-full items-center justify-center gap-2 rounded-[1.15rem] bg-forest text-body font-semibold text-on-forest no-underline"
        >
          Start my order
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </Link>

        <ul className="mt-auto grid grid-cols-3 gap-2 pt-6 text-center">
          {[
            { icon: Utensils, label: "Order here" },
            { icon: Banknote, label: "Pay at counter" },
            { icon: Hash, label: "Collect with your number" },
          ].map((s) => (
            <li key={s.label} className="flex flex-col items-center gap-1.5">
              <s.icon className="size-4 text-forest" strokeWidth={1.75} />
              <p className="text-micro leading-tight text-muted">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
