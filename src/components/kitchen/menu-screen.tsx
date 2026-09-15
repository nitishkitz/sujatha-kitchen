import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { CATS, MENU, type Category } from "@/lib/menu";
import { useKitchen } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { FoodThumb } from "./bits";

function slug(cat: string) {
  return cat.toLowerCase().replace(/[^a-z]+/g, "-");
}

export function MenuScreen() {
  const openSheet = useKitchen((s) => s.openSheet);
  const bag = useKitchen((s) => s.bag);
  const [active, setActive] = useState<Category>("Lunch");

  useEffect(() => {
    const els = CATS.map((c) => document.getElementById("cat-" + slug(c))).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!vis?.target.id) return;
        const name = CATS.find((c) => "cat-" + slug(c) === vis.target.id);
        if (name) setActive(name);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function jump(cat: Category) {
    setActive(cat);
    document.getElementById("cat-" + slug(cat))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function qtyOf(id: string) {
    return bag.filter((b) => b.itemId === id).reduce((s, b) => s + b.qty, 0);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="sticky top-0 z-20 bg-bg/95 backdrop-blur-md">
        <div className="px-5 pt-4">
          <p className="text-xs font-medium tracking-[0.14em] text-muted uppercase">Pickup</p>
          <h1 className="mt-0.5 text-lg font-medium tracking-tight text-ink">Sujatha's Authentic Kitchen</h1>
          <p className="mt-0.5 text-sm text-muted">Ready in 15–20 min · Collect at counter</p>
        </div>
        <nav className="mt-3 flex gap-5 overflow-x-auto border-b border-line px-5" style={{ scrollbarWidth: "none" }}>
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => jump(c)}
              className={cn(
                "shrink-0 border-b-2 py-2.5 text-sm transition-colors duration-150",
                active === c
                  ? "border-forest font-medium text-ink"
                  : "border-transparent text-muted",
              )}
            >
              {c}
            </button>
          ))}
        </nav>
      </header>

      <div className="flex-1 px-5 pt-2 pb-32">
        {CATS.map((cat) => (
          <section key={cat} id={"cat-" + slug(cat)} className="scroll-mt-28">
            <h2 className="pt-5 pb-1 text-xl font-medium tracking-tight text-ink">{cat}</h2>
            {MENU.filter((i) => i.cat === cat).map((item) => {
              const n = qtyOf(item.id);
              return (
                <article key={item.id} className="flex items-start gap-3 border-b border-line py-3.5">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] leading-snug font-medium text-ink">{item.name}</h3>
                    <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-muted">{item.desc}</p>
                    <p className="mt-1.5 text-[15px] font-medium tabular-nums text-ink">
                      {item.sizes ? item.sizes.map((s) => inr(s.price)).join(" / ") : inr(item.price)}
                    </p>
                  </div>
                  <div className="relative shrink-0">
                    <FoodThumb src={item.img} />
                    <button
                      type="button"
                      aria-label={`Add ${item.name}`}
                      onClick={() => openSheet(item.id)}
                      className="absolute -right-1 -bottom-1 grid size-8 place-items-center rounded-full bg-forest text-bg shadow-[var(--shadow-bar)] transition-transform duration-150 ease-out active:scale-[0.96]"
                    >
                      {n > 0 ? (
                        <span className="text-xs font-semibold tabular-nums">{n}</span>
                      ) : (
                        <Plus className="size-4" strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
