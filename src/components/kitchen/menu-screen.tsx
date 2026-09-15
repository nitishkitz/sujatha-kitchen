import { useEffect, useState } from "react";
import { Check, Plus, Search, X } from "lucide-react";
import { CATS, CAT_HERO, CAT_LABEL, MENU, type Category } from "@/lib/menu";
import { listMenuFlags } from "@/lib/kitchen-orders";
import { useKitchen } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { FoodThumb } from "./bits";

export function MenuScreen() {
  const openSheet = useKitchen((s) => s.openSheet);
  const bag = useKitchen((s) => s.bag);
  const custName = useKitchen((s) => s.custName);
  const [active, setActive] = useState<Category>("Lunch");
  const [q, setQ] = useState("");
  const [searchOn, setSearchOn] = useState(false);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const hi = custName.trim() || "Alex";

  useEffect(() => {
    void listMenuFlags().then(setFlags).catch(() => undefined);
  }, []);

  const items = (
    q.trim()
      ? MENU.filter(
          (i) =>
            i.name.toLowerCase().includes(q.toLowerCase()) ||
            i.desc.toLowerCase().includes(q.toLowerCase()),
        )
      : MENU.filter((i) => i.cat === active)
  ).filter((i) => flags[i.id] !== false);

  function qtyOf(id: string) {
    return bag.filter((b) => b.itemId === id).reduce((s, b) => s + b.qty, 0);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="sticky top-0 z-20 bg-bg/95 backdrop-blur-md pad-safe-t">
        <div className="flex items-start justify-between px-5 pt-1">
          <div>
            <h1 className="text-[1.65rem] leading-tight font-semibold tracking-tight text-ink">
              Hi, {hi}
            </h1>
            <p className="mt-0.5 text-sm text-muted">What are you having today?</p>
          </div>
          <button
            type="button"
            aria-label={searchOn ? "Close search" : "Search menu"}
            onClick={() => {
              setSearchOn((v) => !v);
              if (searchOn) setQ("");
            }}
            className="grid size-11 place-items-center rounded-full text-ink"
          >
            {searchOn ? <X className="size-5" /> : <Search className="size-5" />}
          </button>
        </div>

        {searchOn ? (
          <div className="px-5 pt-2 pb-3">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search meals, maggi, tea…"
              className="h-field w-full rounded-xl bg-surface px-4 text-sm shadow-card outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>
        ) : (
          <nav className="mt-3 flex gap-2 overflow-x-auto px-5 pb-3" style={{ scrollbarWidth: "none" }}>
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setActive(c);
                  setQ("");
                }}
                className={cn(
                  "h-chip shrink-0 rounded-full px-4 text-[0.82rem] transition-colors duration-150",
                  active === c
                    ? "bg-forest font-medium text-on-forest"
                    : "bg-surface text-ink shadow-card",
                )}
              >
                {CAT_LABEL[c]}
              </button>
            ))}
          </nav>
        )}
      </header>

      <div className="flex-1 px-5 pt-1 pb-32">
        {!q && <CategoryBanner cat={active} />}
        {items.map((item) => {
          const n = qtyOf(item.id);
          return (
            <article key={item.id} className="flex min-h-[5.1rem] items-center gap-3 border-b border-line py-3">
              <FoodThumb src={item.img} alt={item.name} variant="menu" />
              <div className="min-w-0 flex-1">
                <h3 className="flex items-center gap-1 text-[0.95rem] leading-snug font-semibold text-ink">
                  <span className="truncate">{item.name}</span>
                  {item.veg ? <Check className="size-3.5 shrink-0 text-forest" strokeWidth={3} /> : null}
                </h3>
                <p className="mt-0.5 truncate text-[0.78rem] leading-snug text-muted">{item.desc}</p>
                <p className="mt-1 text-[0.88rem] font-semibold tabular-nums text-ink">
                  {item.sizes
                    ? item.sizes
                        .slice()
                        .sort((a, b) => b.price - a.price)
                        .map((s) => `${s.name} ${inr(s.price)}`)
                        .join("  |  ")
                    : inr(item.price)}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Add ${item.name}`}
                onClick={() => openSheet(item.id)}
                className="press relative grid size-9 place-items-center rounded-full bg-forest text-on-forest after:absolute after:inset-[-7px]"
              >
                {n > 0 ? (
                  <span className="text-xs font-semibold tabular-nums">{n}</span>
                ) : (
                  <Plus className="size-4" strokeWidth={2.5} />
                )}
              </button>
            </article>
          );
        })}
        {items.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">Nothing matches that search.</p>
        )}
      </div>
    </div>
  );
}

function CategoryBanner({ cat }: { cat: Category }) {
  const hero = CAT_HERO[cat];
  return (
    <div className="relative mt-1 mb-2 h-banner overflow-hidden rounded-[1rem] bg-forest-deep">
      <div className="relative z-10 flex h-full flex-col justify-center px-5">
        <p className="text-[0.62rem] font-medium tracking-[0.22em] text-lime uppercase">{hero.kicker}</p>
        <p className="font-display text-[2rem] leading-none font-medium text-on-forest">{hero.title}</p>
        <p className="mt-1 whitespace-pre-line text-[0.78rem] leading-snug text-on-forest/75">{hero.line}</p>
      </div>
      <img
        src={hero.imgs[0]}
        alt=""
        className="absolute -right-2 -bottom-8 h-[145%] w-auto object-contain drop-shadow-md"
      />
      {hero.imgs[1] ? (
        <img
          src={hero.imgs[1]}
          alt=""
          className="absolute right-16 -bottom-10 h-[110%] w-auto object-contain drop-shadow-md"
        />
      ) : null}
    </div>
  );
}
