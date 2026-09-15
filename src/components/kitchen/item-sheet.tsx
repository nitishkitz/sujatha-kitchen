import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { Check } from "lucide-react";
import { addonsFor, itemById } from "@/lib/menu";
import { unitPrice, useKitchen } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { toast } from "sonner";
import { FoodThumb, PrimaryButton, QtyStepper } from "./bits";

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
    setSize(item.sizes?.[0]?.id ?? null);
    setAddons([]);
    setNote("");
  }, [item]);

  if (!item) return null;

  const extras = addonsFor(item);
  const img = (size && item.imgs?.[size]) || item.img;
  const unit = unitPrice(item, size, addons);
  const sizeLabel = item.sizes?.find((s) => s.id === size)?.name;
  const selected = item;

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
        <Drawer.Overlay className="fixed inset-0 z-40 bg-ink/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] max-w-lg flex-col overflow-hidden rounded-t-3xl bg-surface outline-none">
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-line" />
          <div className="flex-1 overflow-y-auto px-5 pt-3 pb-4">
            <FoodThumb src={img} size="lg" className="h-40 rounded-2xl" />
            <Drawer.Title className="mt-4 text-xl font-medium tracking-tight text-ink">{item.name}</Drawer.Title>
            <p className="mt-0.5 text-[15px] font-medium tabular-nums text-ink">{inr(unit)}</p>
            <Drawer.Description className="mt-1 text-sm text-muted">{item.desc}</Drawer.Description>

            {item.sizes && (
              <div className="mt-5">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium text-ink">Size</p>
                  <p className="text-xs text-terra">Required</p>
                </div>
                <div className="mt-1">
                  {item.sizes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSize(s.id)}
                      className="flex w-full items-center justify-between border-b border-line py-3.5 text-left"
                    >
                      <span className="text-sm text-ink">{s.name}</span>
                      <span className="flex items-center gap-3 text-sm tabular-nums text-muted">
                        {inr(s.price)}
                        <span
                          className={cn(
                            "grid size-5 place-items-center rounded-full border",
                            size === s.id ? "border-forest bg-forest" : "border-muted/40",
                          )}
                        >
                          {size === s.id ? <span className="size-2 rounded-full bg-bg" /> : null}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {extras.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium text-ink">Add-ons</p>
                {extras.map((a) => {
                  const on = addons.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggle(a.id)}
                      className="flex w-full items-center justify-between border-b border-line py-3.5 text-left"
                    >
                      <span className="flex items-center gap-2 text-sm text-ink">
                        <img src={a.img} alt="" className="size-7 object-contain" />
                        {a.name}
                      </span>
                      <span className="flex items-center gap-3 text-sm tabular-nums text-muted">
                        +{inr(a.price)}
                        <span
                          className={cn(
                            "grid size-5 place-items-center rounded-md border",
                            on ? "border-forest bg-forest" : "border-muted/40",
                          )}
                        >
                          {on ? <Check className="size-3 text-bg" strokeWidth={3} /> : null}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <label className="mt-5 block text-sm font-medium text-ink">Special request</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 70))}
              placeholder="Less spicy, extra pickle…"
              className="mt-1.5 min-h-20 w-full rounded-xl border border-line bg-bg p-3 text-sm outline-none focus:border-forest"
            />
            <p className="mt-1 text-right text-xs tabular-nums text-muted">{note.length}/70</p>
          </div>
          <div className="flex items-center gap-3 border-t border-line bg-surface px-5 pt-3 pb-8">
            <QtyStepper value={qty} onChange={setQty} />
            <PrimaryButton onClick={add} className="flex-1">
              Add to bag · {inr(unit * qty)}
            </PrimaryButton>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
