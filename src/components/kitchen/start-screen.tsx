import { ArrowRight, Banknote, Hash, Utensils } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Wordmark } from "./bits";

export function StartScreen() {
  return (
    <section className="flex min-h-dvh flex-col bg-bg">
      <div className="relative h-hero overflow-hidden bg-forest-deep pad-safe-t">
        <div className="relative z-20 px-6 pt-4">
          <Wordmark light />
          <p className="font-te mt-3 text-center text-caption text-lime/90">
            అన్నం పరబ్రహ్మ స్వరూపం
          </p>
          <p className="mt-1 text-center text-micro tracking-[0.14em] text-on-forest/70 uppercase">
            Good food, good mood
          </p>
        </div>

        <img
          src="/food/veg-meals.png"
          alt=""
          className="hero-enter pointer-events-none absolute -bottom-8 -left-16 h-[78%] w-[92%] max-w-none object-contain drop-shadow-lg"
        />
        <img
          src="/food/chicken-curry.png"
          alt=""
          className="hero-enter pointer-events-none absolute -right-8 -bottom-4 h-[58%] w-auto max-w-[70%] object-contain drop-shadow-lg"
          style={{ animationDelay: "90ms" }}
        />

        <span className="absolute top-[7.5rem] right-3 z-20 max-w-24 rounded-full bg-lime px-2.5 py-1.5 text-center text-micro leading-tight font-semibold text-on-lime">
          Same Great Food Everyday
        </span>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-forest-deep/80" />
      </div>

      <div className="flex flex-1 flex-col px-5 pt-7 pb-6 pad-safe-b">
        <h1 className="font-display text-5xl leading-none font-medium tracking-tight text-ink">
          Hungry?
        </h1>
        <p className="mt-3 text-lg leading-snug text-ink/80">
          Your food can be ready
          <br />
          in 15–20 min.
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-lg bg-surface px-4 py-3 shadow-card">
          <span className="size-2.5 rounded-full bg-lime ring-4 ring-lime/30" />
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.14em] text-forest uppercase">
              Kitchen open
            </p>
            <p className="text-caption text-muted">Pickup only · 15–20 min</p>
          </div>
        </div>

        <Link
          to="/menu"
          className="press mt-6 flex h-cta w-full items-center justify-center gap-2 rounded-lg bg-forest text-body font-semibold text-on-forest no-underline"
        >
          Start my order
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </Link>

        <ul className="mt-auto grid grid-cols-3 gap-2 pt-8 text-center">
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
