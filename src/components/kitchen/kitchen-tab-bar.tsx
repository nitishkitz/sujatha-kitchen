import { Link } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Settings, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

export function KitchenTabBar({
  active,
}: {
  active: "orders" | "menu" | "today" | "settings";
}) {
  const tabs = [
    { id: "orders" as const, label: "Orders", icon: ClipboardList, to: "/kitchen/orders" as const },
    { id: "menu" as const, label: "Menu", icon: UtensilsCrossed, to: "/kitchen/menu" as const },
    { id: "today" as const, label: "Today", icon: CalendarDays, to: "/kitchen" as const },
    { id: "settings" as const, label: "Settings", icon: Settings, to: "/kitchen/settings" as const },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto flex max-w-phone justify-around border-t border-line bg-surface pt-2 pad-safe-b">
      {tabs.map((t) => (
        <Link
          key={t.id}
          to={t.to}
          className={cn(
            "flex flex-col items-center gap-1 px-3 text-micro no-underline",
            active === t.id ? "text-forest" : "text-muted",
          )}
        >
          <t.icon className="size-5" />
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
