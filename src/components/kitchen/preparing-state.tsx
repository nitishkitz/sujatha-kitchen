import { Bell, Check, CookingPot } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Received", "Preparing", "Ready"] as const;

export function PreparingState({ code, stage }: { code: string; stage: 0 | 1 | 2 }) {
  return (
    <section className="flex min-h-dvh flex-col bg-forest-deep px-6 pt-14 text-on-forest pad-safe-t pad-safe-b">
      <p className="text-center text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
        Preparing your order
      </p>
      <p className="ticket-pop mt-5 text-center text-ticket leading-none font-bold tracking-tight">{code}</p>
      <p className="mt-3 text-center text-sm text-on-forest/70">That’s your pickup number.</p>

      <ol className="relative mx-auto mt-12 grid w-full max-w-xs grid-cols-3">
        <span className="absolute top-2.5 right-[16%] left-[16%] h-0.5 bg-on-forest/20" />
        <span
          className="track-fill absolute top-2.5 left-[16%] h-0.5 bg-lime"
          style={{ width: stage === 0 ? "0%" : stage === 1 ? "34%" : "68%" }}
        />
        {STEPS.map((label, i) => {
          const done = stage > i;
          const current = stage === i;
          return (
            <li key={label} className="relative z-10 flex flex-col items-center">
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full",
                  done || current ? "bg-lime text-on-lime" : "bg-transparent ring-2 ring-on-forest/30",
                )}
              >
                {done ? (
                  <Check className="size-3" strokeWidth={3} />
                ) : current ? (
                  <span className="size-2 rounded-full bg-on-lime" />
                ) : null}
              </span>
              <p className={cn("mt-2 text-micro", done || current ? "text-on-forest" : "text-on-forest/40")}>
                {label}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 space-y-2.5">
        <div className="flex items-start gap-3 rounded-[1rem] bg-bg px-4 py-3.5 text-ink">
          <CookingPot className="mt-0.5 size-5 shrink-0 text-forest" />
          <div>
            <p className="text-sm font-medium">Your food is being made now.</p>
            <p className="text-caption text-muted">About 8 min to go.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-[1rem] bg-bg px-4 py-3.5 text-ink">
          <Bell className="mt-0.5 size-5 shrink-0 text-forest" />
          <div>
            <p className="text-sm font-medium">We’ll notify you here</p>
            <p className="text-caption text-muted">when it’s ready.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
