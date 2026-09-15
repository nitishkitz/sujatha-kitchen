import { create } from "zustand";
import type { PlacedOrder } from "./store";

export type StaffStatus = "pending" | "preparing" | "ready" | "completed";

export type StaffLine = {
  name: string;
  note?: string;
  qty: number;
  price: number;
};

export type StaffOrder = {
  code: string;
  summary: string;
  items: number;
  status: StaffStatus;
  time: string;
  lines: StaffLine[];
  total: number;
  customer: string;
  phone: string;
  live?: boolean;
};

const SEED: StaffOrder[] = [
  {
    code: "A47",
    summary: "Chicken Curry + Tea",
    items: 2,
    status: "preparing",
    time: "12:32 PM",
    lines: [
      { name: "Chicken Curry (Full)", note: "Less spicy", qty: 1, price: 80 },
      { name: "Tea", qty: 1, price: 20 },
    ],
    total: 100,
    customer: "Alex",
    phone: "9876543210",
  },
  {
    code: "A46",
    summary: "Veg Meals",
    items: 1,
    status: "ready",
    time: "12:28 PM",
    lines: [{ name: "Veg meals", qty: 1, price: 100 }],
    total: 100,
    customer: "Priya",
    phone: "9848012345",
  },
  {
    code: "A45",
    summary: "Chapati + Egg Curry",
    items: 2,
    status: "ready",
    time: "12:21 PM",
    lines: [
      { name: "Chapati (2 pcs)", qty: 1, price: 30 },
      { name: "Egg Curry", qty: 1, price: 40 },
    ],
    total: 70,
    customer: "Ravi",
    phone: "9900112233",
  },
  {
    code: "A44",
    summary: "Veg Maggi",
    items: 1,
    status: "preparing",
    time: "12:18 PM",
    lines: [{ name: "Veg Maggi", qty: 1, price: 40 }],
    total: 40,
    customer: "Meena",
    phone: "9123456780",
  },
  {
    code: "A43",
    summary: "Samosa + Tea",
    items: 2,
    status: "completed",
    time: "12:05 PM",
    lines: [
      { name: "Samosa", qty: 1, price: 20 },
      { name: "Tea", qty: 1, price: 20 },
    ],
    total: 40,
    customer: "Arun",
    phone: "9012345678",
  },
];

type StaffState = {
  orders: StaffOrder[];
  setStatus: (code: string, status: StaffStatus) => void;
  upsert: (order: StaffOrder) => void;
};

export const useStaff = create<StaffState>((set, get) => ({
  orders: SEED,
  setStatus: (code, status) =>
    set({
      orders: get().orders.map((o) => (o.code === code ? { ...o, status } : o)),
    }),
  upsert: (order) => {
    const rest = get().orders.filter((o) => o.code !== order.code);
    set({ orders: [order, ...rest] });
  },
}));

function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function upsertLiveOrder(order: PlacedOrder) {
  const status: StaffStatus = order.stage >= 2 ? "ready" : order.stage >= 1 ? "preparing" : "pending";
  const summary = order.lines
    .slice(0, 2)
    .map((l) => l.name.replace(/ \(.*\)$/, ""))
    .join(" + ");
  useStaff.getState().upsert({
    code: order.code,
    summary,
    items: order.lines.reduce((s, l) => s + l.qty, 0),
    status,
    time: fmtTime(order.placedAt),
    lines: order.lines.map((l) => ({
      name: l.sizeLabel ? `${l.name} (${l.sizeLabel})` : l.name,
      note: l.note || undefined,
      qty: l.qty,
      price: l.unit * l.qty,
    })),
    total: order.total,
    customer: order.name,
    phone: order.phone,
    live: true,
  });
}

export function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return `${d.slice(0, 5)} ${d.slice(5)}`;
  return phone;
}
