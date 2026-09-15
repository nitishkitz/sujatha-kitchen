import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { Check, X } from "lucide-react";
import { addonsFor, defaultSize, itemById, orderedSizes } from "@/lib/menu";
import { unitPrice, useKitchen } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { toast } from "sonner";
import { PrimaryButton, QtyStepper } from "./bits";

export function ItemSheet() {
  const sheetId = useKitchen((s) => s.sheetId);
  const closeSheet = useKitchen((s) => s.closeSheet);
  const addLine = useKitchen((s) => s.addLine);
  const item = sheetId ? itemById(sheetId) : undefined;

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string | null>(null);
  const [addons, setAddons] = useState<string[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!item) return;
    setQty(1);
    setSize(defaultSize(item));
    setAddons([]);
    setNote("");
  }, [item]);

  if (!item) return null;

  const extras = addonsFor(item);
  const img = (size && item.imgs?.[size]) || item.img;
  const unit = unitPrice(item, size, addons);
  const sizeLabel = item.sizes?.find((s) => s.id === size)?.name;
  const selected = item;
  const sizes = orderedSizes(item);

  function toggle(id: string) {
    setAddons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function add() {
    addLine({
      itemId: selected.id,
      name: selected.name,
      img,
      sizeLabel,
      addons,
      note: note.trim(),
      qty,
      unit,
    });
    closeSheet();
    toast.success(`${selected.name} added`);
  }

  return (
    <Drawer.Root open={!!sheetId} onOpenChange={(o) => !o && closeSheet()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-ink/50" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[96dvh] max-w-phone flex-col overflow-hidden bg-bg outline-none">
          <div className="relative h-52 shrink-0 overflow-hidden bg-forest-deep">
            <img src={img} alt={item.name} className="size-full object-contain object-center p-3" />
            <button
              type="button"
              aria-label="Close"
              onClick={closeSheet}
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-surface/90 text-ink"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="-mt-8 flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-sheet bg-surface">
            <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line" />
            <div className="flex-1 overflow-y-auto px-5 pt-3 pb-4">
              <Drawer.Title className="font-display text-3xl leading-tight font-medium tracking-tight text-ink">
                {item.name}
              </Drawer.Title>
              <Drawer.Description className="mt-1 text-sm text-muted">
                {item.blurb ?? item.desc}
              </Drawer.Description>

              {sizes.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {sizes.map((s) => {
                    const on = size === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSize(s.id)}
                        className={cn(
                          "flex h-20 flex-col items-start justify-center rounded-lg px-4 text-left transition-colors duration-150",
                          on ? "bg-forest text-on-forest" : "bg-bg text-ink shadow-card",
                        )}
                      >
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className="text-lg font-semibold tabular-nums">{inr(s.price)}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {extras.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-ink">Add something</p>
                  {extras.map((a) => {
                    const on = addons.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggle(a.id)}
                        className="flex w-full items-center justify-between border-b border-line py-3.5 text-left"
                      >
                        <span className="flex items-center gap-3 text-sm text-ink">
                          <span
                            className={cn(
                              "grid size-5 place-items-center rounded-sm border",
                              on ? "border-forest bg-forest" : "border-muted/40",
                            )}
                          >
                            {on ? <Check className="size-3 text-on-forest" strokeWidth={3} /> : null}
                          </span>
                          {a.name}
                        </span>
                        <span className="text-sm tabular-nums text-muted">+{inr(a.price)}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <label className="mt-6 block text-sm font-semibold text-ink">
                Anything for Sujatha aunty?
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 70))}
                placeholder="Less spicy, no onion please..."
                className="mt-2 min-h-16 w-full rounded-md border-0 bg-bg p-3 text-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-forest/30"
              />
            </div>

            <div className="flex items-center gap-3 bg-surface px-5 pt-2 pad-safe-b">
              <QtyStepper value={qty} onChange={setQty} variant="round" />
              <PrimaryButton tone="lime" onClick={add} className="flex-1">
                Add to bag · {inr(unit * qty)}
              </PrimaryButton>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
