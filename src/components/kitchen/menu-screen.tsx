import { useEffect, useMemo, useState } from "react";
import { Check, Plus, Search, X } from "lucide-react";
import { CATS, CAT_HERO, CAT_LABEL, MENU, type Category } from "@/lib/menu";
import { useKitchen } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { FoodThumb } from "./bits";

function slug(cat: string) {
  return cat.toLowerCase().replace(/[^a-z]+/g, "-");
}

export function MenuScreen() {
  const openSheet = useKitchen((s) => s.openSheet);
  const bag = useKitchen((s) => s.bag);
  const custName = useKitchen((s) => s.custName);
  const [active, setActive] = useState<Category>("Lunch");
  const [q, setQ] = useState("");
  const [searchOn, setSearchOn] = useState(false);
  const hi = custName.trim() || "Alex";

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return MENU;
    return MENU.filter(
      (i) =>
        i.name.toLowerCase().includes(needle) ||
        i.desc.toLowerCase().includes(needle) ||
        i.cat.toLowerCase().includes(needle),
    );
  }, [q]);

  useEffect(() => {
    if (q) return;
    const els = CATS.map((c) => document.getElementById("cat-" + slug(c))).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!vis?.target.id) return;
        const name = CATS.find((c) => "cat-" + slug(c) === vis.target.id);
        if (name) setActive(name);
      },
      { rootMargin: "-18% 0px -70% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [q]);

  function jump(cat: Category) {
    setActive(cat);
    setQ("");
    setSearchOn(false);
    document.getElementById("cat-" + slug(cat))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function qtyOf(id: string) {
    return bag.filter((b) => b.itemId === id).reduce((s, b) => s + b.qty, 0);
  }

  const groups = q
    ? ([["Search", filtered]] as const)
    : CATS.map((cat) => [cat, MENU.filter((i) => i.cat === cat)] as const);

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="sticky top-0 z-20 bg-bg/95 backdrop-blur-md pad-safe-t">
        <div className="flex items-start justify-between px-5 pt-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Hi, {hi}</h1>
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
              className="h-field w-full rounded-md border-0 bg-surface px-4 text-sm shadow-card outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>
        ) : (
          <nav
            className="mt-3 flex gap-2 overflow-x-auto px-5 pb-3"
            style={{ scrollbarWidth: "none" }}
          >
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => jump(c)}
                className={cn(
                  "h-chip shrink-0 rounded-full px-4 text-sm transition-colors duration-150",
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
        {groups.map(([cat, items]) => (
          <section key={cat} id={cat === "Search" ? "search" : "cat-" + slug(cat)} className="scroll-mt-32">
            {cat !== "Search" && <CategoryBanner cat={cat as Category} />}
            {items.map((item) => {
              const n = qtyOf(item.id);
              return (
                <article key={item.id} className="flex h-row items-center gap-3 border-b border-line">
                  <FoodThumb src={item.img} alt={item.name} />
                  <div className="min-w-0 flex-1">
                    <h3 className="flex items-center gap-1 text-body leading-snug font-semibold text-ink">
                      <span className="truncate">{item.name}</span>
                      {item.veg ? <Check className="size-3.5 shrink-0 text-forest" strokeWidth={3} /> : null}
                    </h3>
                    <p className="mt-0.5 truncate text-caption leading-snug text-muted">{item.desc}</p>
                    <p className="mt-1 text-sm font-semibold tabular-nums text-ink">
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
                    className="press relative grid size-9 place-items-center rounded-full bg-forest text-on-forest after:absolute after:inset-[-6px]"
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
          </section>
        ))}
      </div>
    </div>
  );
}

function CategoryBanner({ cat }: { cat: Category }) {
  const hero = CAT_HERO[cat];
  return (
    <div className="relative mt-2 mb-1 h-banner overflow-hidden rounded-lg bg-forest-deep">
      <div className="relative z-10 flex h-full flex-col justify-center px-5">
        <p className="text-micro font-medium tracking-[0.2em] text-lime uppercase">{hero.kicker}</p>
        <p className="font-display text-3xl leading-none font-medium text-on-forest">{hero.title}</p>
        <p className="mt-1 whitespace-pre-line text-caption leading-snug text-on-forest/75">{hero.line}</p>
      </div>
      <img
        src={hero.imgs[0]}
        alt=""
        className="absolute -right-6 -bottom-10 h-[155%] w-auto object-contain drop-shadow-md"
      />
    </div>
  );
}
