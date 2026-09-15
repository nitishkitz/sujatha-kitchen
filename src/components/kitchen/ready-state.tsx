import { Check } from "lucide-react";
import { PickupTicketArt } from "./pickup-ticket-art";

export function ReadyState({ code }: { code: string }) {
  return (
    <section className="flex min-h-dvh flex-col bg-lime px-6 pt-14 text-on-lime pad-safe-t pad-safe-b">
      <p className="text-center text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
        Ready for pickup
      </p>
      <p className="ticket-pop mt-4 text-center text-ticket leading-none font-bold tracking-tight text-forest-deep">
        {code}
      </p>
      <p className="mt-3 text-center text-sm text-forest-deep/80">Show this number at the counter.</p>

      <div className="relative mx-auto mt-4 flex w-full flex-1 items-center justify-center">
        <PickupTicketArt code={code} />
      </div>

      <div className="mt-2 mb-2 flex items-start gap-3 rounded-[1.15rem] bg-bg px-4 py-4 text-ink">
        <span className="grid size-8 place-items-center rounded-full bg-forest text-on-forest">
          <Check className="size-4" strokeWidth={3} />
        </span>
        <div>
          <p className="text-sm font-semibold">Your order is ready!</p>
          <p className="text-caption text-muted">Enjoy your meal.</p>
        </div>
      </div>
    </section>
  );
}
