import { useRouter } from "@tanstack/react-router";
import { MENU } from "@/lib/menu";
import { setMenuFlag } from "@/lib/kitchen-orders";
import { inr } from "@/lib/utils";
import { Route } from "@/routes/kitchen/menu";
import { KitchenTabBar } from "./kitchen-tab-bar";

export function KitchenMenuScreen() {
  const flags = Route.useLoaderData();
  const router = useRouter();

  async function toggle(id: string, available: boolean) {
    await setMenuFlag({ data: { itemId: id, available } });
    await router.invalidate();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="px-5 pt-4 pad-safe-t">
        <h1 className="text-xl font-semibold tracking-tight">Menu</h1>
        <p className="mt-1 text-caption text-muted">Turn items off when they run out.</p>
      </header>
      <ul className="flex-1 px-5 pt-3 pb-28">
        {MENU.map((item) => {
          const on = flags[item.id] !== false;
          return (
            <li key={item.id} className="flex items-center justify-between border-b border-line py-3">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-caption text-muted">
                  {item.cat} · {inr(item.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void toggle(item.id, !on)}
                className={
                  on
                    ? "h-8 rounded-full bg-chip-ready px-3 text-micro font-semibold text-forest"
                    : "h-8 rounded-full bg-soft px-3 text-micro font-semibold text-muted"
                }
              >
                {on ? "Available" : "Sold out"}
              </button>
            </li>
          );
        })}
      </ul>
      <KitchenTabBar active="menu" />
    </div>
  );
}
