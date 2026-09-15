# Sujatha's Authentic Kitchen

Pickup-only ordering for a Hyderabad canteen. Scan, order in about a minute, pay at the counter, show your number.

No delivery. Kitchen collects at the counter.

## Flow

1. **Start** — self pickup, kitchen open, ready in 15–20 min
2. **Menu** — Lunch · Maggi & More · Snacks · Beverages
3. **Item** — size, add-ons, kitchen note
4. **Bag** — quantities, ASAP or a scheduled window
5. **Checkout** — name, mobile, UPI or cash at counter
6. **Status** — Received → Preparing → Ready, with a pickup number

Menu and prices come from the printed Sujatha's card. Every dish uses a transparent PNG.

## Run

```bash
npm install
npm run dev
```

Then open the app in the browser. Orders stay in the browser (no accounts, no live payments).

## Stack

React, TanStack Start, Tailwind v4, Zustand, Vaul.
