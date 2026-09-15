import { Bell, Check, CookingPot } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useKitchen } from "@/lib/store";
import { cn } from "@/lib/utils";

const STEPS = ["Received", "Preparing", "Ready"] as const;

export function StatusScreen() {
  const order = useKitchen((s) => s.order);
  const setStage = useKitchen((s) => s.setStage);
  const reset = useKitchen((s) => s.reset);
  const navigate = useNavigate();

  useEffect(() => {
    if (!order) void navigate({ to: "/" });
  }, [order, navigate]);

  useEffect(() => {
    if (!order || order.stage >= 2) return;
    const t1 =
      order.stage < 1
        ? window.setTimeout(() => setStage(1), 2400)
        : undefined;
    const t2 = window.setTimeout(() => setStage(2), order.stage < 1 ? 5600 : 3200);
    return () => {
      if (t1) window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [order, setStage]);

  if (!order) return null;
  const ready = order.stage >= 2;

  if (ready) return <ReadyState code={order.code} onAgain={() => { reset(); void navigate({ to: "/" }); }} />;

  return (
    <section className="flex min-h-dvh flex-col bg-forest-deep px-6 pt-10 text-on-forest pad-safe-t pad-safe-b">
      <p className="text-center text-micro font-semibold tracking-[0.22em] uppercase">
        Preparing your order
      </p>
      <p className="ticket-pop font-sans mt-4 text-center text-ticket leading-none font-bold tracking-tight">
        {order.code}
      </p>
      <p className="mt-3 text-center text-sm text-on-forest/70">That’s your pickup number.</p>

      <ol className="relative mx-auto mt-10 grid w-full max-w-xs grid-cols-3">
        <span className="absolute top-2.5 right-[16%] left-[16%] h-0.5 bg-on-forest/20" />
        <span
          className="track-fill absolute top-2.5 left-[16%] h-0.5 bg-lime"
          style={{ width: order.stage === 0 ? "0%" : order.stage === 1 ? "34%" : "68%" }}
        />
        {STEPS.map((label, i) => {
          const done = order.stage > i;
          const current = order.stage === i;
          return (
            <li key={label} className="relative z-10 flex flex-col items-center">
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full",
                  done || current ? "bg-lime text-on-lime" : "bg-transparent ring-2 ring-on-forest/30",
                )}
              >
                {done ? <Check className="size-3" strokeWidth={3} /> : current ? <span className="size-2 rounded-full bg-on-lime" /> : null}
              </span>
              <p className={cn("mt-2 text-micro", done || current ? "text-on-forest" : "text-on-forest/40")}>
                {label}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 space-y-2.5">
        <div className="flex items-start gap-3 rounded-lg bg-bg px-4 py-3.5 text-ink">
          <CookingPot className="mt-0.5 size-5 shrink-0 text-forest" />
          <div>
            <p className="text-sm font-medium">Your food is being made now.</p>
            <p className="text-caption text-muted">About 8 min to go.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg bg-bg px-4 py-3.5 text-ink">
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

function ReadyState({ code, onAgain }: { code: string; onAgain: () => void }) {
  return (
    <section className="flex min-h-dvh flex-col bg-lime px-6 pt-10 text-on-lime pad-safe-t pad-safe-b">
      <p className="text-center text-micro font-semibold tracking-[0.22em] uppercase">
        Ready for pickup
      </p>
      <p className="ticket-pop mt-3 text-center text-ticket leading-none font-bold tracking-tight text-forest-deep">
        {code}
      </p>
      <p className="mt-3 text-center text-sm text-forest-deep/80">Show this number at the counter.</p>

      <div className="relative mx-auto mt-6 flex w-full max-w-xs flex-1 items-center justify-center">
        <Spark />
        <TicketHand code={code} />
      </div>

      <div className="mt-auto rounded-lg bg-bg px-4 py-4 text-ink">
        <div className="flex items-start gap-3">
          <span className="grid size-8 place-items-center rounded-full bg-forest text-on-forest">
            <Check className="size-4" strokeWidth={3} />
          </span>
          <div>
            <p className="text-sm font-semibold">Your order is ready!</p>
            <p className="text-caption text-muted">Enjoy your meal.</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onAgain}
        className="mt-3 mb-1 w-full text-center text-caption font-medium text-forest-deep/70"
      >
        Place another pickup
      </button>
    </section>
  );
}

function TicketHand({ code }: { code: string }) {
  return (
    <svg viewBox="0 0 320 300" className="w-full max-w-72" aria-hidden="true">
      <ellipse cx="160" cy="278" rx="70" ry="10" fill="#003227" opacity="0.18" />
      <path
        d="M92 292c-8-2-38-22-36-58 2-28 24-40 48-34 10 2 18 8 28 6 14-2 18-16 40-12 22 4 40 24 38 46-2 24-16 42-44 52-18 6-58 18-74 0z"
        fill="#003227"
      />
      <path
        d="M128 210c12 22 8 42-6 62"
        fill="none"
        stroke="#00241c"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path d="M148 198c22-4 36 8 34 28" fill="none" stroke="#00241c" strokeWidth="12" strokeLinecap="round" />
      <g transform="translate(108 22) rotate(-11)">
        <rect x="0" y="0" width="124" height="148" rx="12" fill="#fffdf8" />
        <rect x="10" y="10" width="104" height="128" rx="8" fill="none" stroke="#004b3a" strokeWidth="1.4" />
        <text x="62" y="36" textAnchor="middle" fill="#004b3a" fontFamily="Great Vibes, cursive" fontSize="26">
          Sujatha's
        </text>
        <text
          x="62"
          y="92"
          textAnchor="middle"
          fill="#003227"
          fontFamily="DM Sans, sans-serif"
          fontSize="40"
          fontWeight="700"
        >
          {code}
        </text>
        <text
          x="62"
          y="118"
          textAnchor="middle"
          fill="#626762"
          fontFamily="DM Sans, sans-serif"
          fontSize="8"
          letterSpacing="1.6"
        >
          AUTHENTIC KITCHEN
        </text>
      </g>
    </svg>
  );
}

function Spark() {
  return (
    <>
      <span className="absolute top-6 left-8 size-1.5 rotate-45 bg-forest-deep/40" />
      <span className="absolute top-16 right-4 size-2 rotate-45 bg-forest-deep/30" />
      <span className="absolute bottom-16 left-6 size-1 rotate-45 bg-forest-deep/40" />
      <span className="absolute right-10 bottom-24 h-3 w-0.5 bg-forest-deep/30" />
      <span className="absolute top-10 right-16 h-0.5 w-3 bg-forest-deep/30" />
    </>
  );
}
