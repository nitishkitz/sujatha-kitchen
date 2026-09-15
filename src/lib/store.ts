import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ADDONS, type MenuItem } from "./menu";
import { upsertLiveOrder } from "./staff";

export type Screen = "start" | "menu" | "checkout" | "status";
export type Pay = "upi" | "cash";

export type BagLine = {
  key: string;
  itemId: string;
  name: string;
  img: string;
  sizeLabel?: string;
  addons: string[];
  note: string;
  qty: number;
  unit: number;
};

export type PlacedOrder = {
  code: string;
  name: string;
  phone: string;
  slot: string;
  pay: Pay;
  lines: BagLine[];
  total: number;
  stage: 0 | 1 | 2;
  placedAt: number;
};

type KitchenState = {
  screen: Screen;
  bag: BagLine[];
  pickup: "asap" | "schedule";
  slot: string;
  pay: Pay;
  custName: string;
  phone: string;
  order: PlacedOrder | null;
  sheetId: string | null;
  bagOpen: boolean;
  setScreen: (s: Screen) => void;
  openSheet: (id: string) => void;
  closeSheet: () => void;
  setBagOpen: (v: boolean) => void;
  addLine: (line: Omit<BagLine, "key">) => void;
  changeQty: (key: string, d: number) => void;
  setPickup: (p: "asap" | "schedule", slot?: string) => void;
  setPay: (p: Pay) => void;
  setCustomer: (name: string, phone: string) => void;
  setStage: (stage: 0 | 1 | 2) => void;
  place: () => boolean;
  reset: () => void;
  totals: () => { count: number; sub: number };
};

function lineKey(p: Omit<BagLine, "key" | "qty" | "unit" | "img" | "name">) {
  return [p.itemId, p.sizeLabel ?? "", [...p.addons].sort().join(","), p.note].join("|");
}

export function unitPrice(item: MenuItem, sizeId: string | null, addonIds: string[]) {
  const base = item.sizes
    ? (item.sizes.find((s) => s.id === sizeId)?.price ?? item.price)
    : item.price;
  const extra = addonIds.reduce((s, id) => s + (ADDONS[id]?.price ?? 0), 0);
  return base + extra;
}

export const useKitchen = create<KitchenState>()(
  persist(
    (set, get) => ({
      screen: "start",
      bag: [],
      pickup: "asap",
      slot: "ASAP · 15–20 min",
      pay: "upi",
      custName: "Alex",
      phone: "",
      order: null,
      sheetId: null,
      bagOpen: false,
      setScreen: (screen) => set({ screen }),
      openSheet: (sheetId) => set({ sheetId }),
      closeSheet: () => set({ sheetId: null }),
      setBagOpen: (bagOpen) => set({ bagOpen }),
      addLine: (line) => {
        const key = lineKey(line);
        const bag = [...get().bag];
        const i = bag.findIndex((b) => b.key === key);
        if (i >= 0) bag[i] = { ...bag[i], qty: bag[i].qty + line.qty };
        else bag.push({ ...line, key });
        set({ bag, bagOpen: false });
      },
      changeQty: (key, d) => {
        set({
          bag: get()
            .bag.map((b) => (b.key === key ? { ...b, qty: b.qty + d } : b))
            .filter((b) => b.qty > 0),
        });
      },
      setPickup: (pickup, slot) =>
        set({
          pickup,
          slot: pickup === "asap" ? "ASAP · 15–20 min" : (slot ?? get().slot),
        }),
      setPay: (pay) => set({ pay }),
      setCustomer: (custName, phone) => set({ custName, phone }),
      setStage: (stage) => {
        const o = get().order;
        if (!o) return;
        const next = { ...o, stage };
        set({ order: next });
        upsertLiveOrder(next);
      },
      place: () => {
        const { bag, custName, phone, slot, pay } = get();
        const name = custName.trim();
        const ph = phone.replace(/\D/g, "");
        if (!name || ph.length < 10 || bag.length === 0) return false;
        const total = bag.reduce((s, b) => s + b.unit * b.qty, 0);
        const code = "A" + String(10 + Math.floor(Math.random() * 80));
        const order: PlacedOrder = {
          code,
          name,
          phone: ph,
          slot,
          pay,
          lines: bag,
          total,
          stage: 0,
          placedAt: Date.now(),
        };
        set({
          order,
          bagOpen: false,
          sheetId: null,
        });
        upsertLiveOrder(order);
        return true;
      },
      reset: () =>
        set({
          bag: [],
          order: null,
          pickup: "asap",
          slot: "ASAP · 15–20 min",
        }),
      totals: () => {
        const bag = get().bag;
        return {
          count: bag.reduce((s, b) => s + b.qty, 0),
          sub: bag.reduce((s, b) => s + b.unit * b.qty, 0),
        };
      },
    }),
    {
      name: "sujatha-kitchen",
      skipHydration: true,
      partialize: (s) => ({
        bag: s.bag,
        order: s.order,
        custName: s.custName,
        phone: s.phone,
        pay: s.pay,
        pickup: s.pickup,
        slot: s.slot,
      }),
    },
  ),
);
