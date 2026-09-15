import { cn } from "@/lib/utils";

export function BrandLockup({
  light,
  compact,
  align = "center",
}: {
  light?: boolean;
  compact?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={cn(align === "left" ? "text-left" : "text-center")}>
      <p
        className={cn(
          "font-script leading-[0.85]",
          compact ? "text-[1.85rem]" : "text-[3.15rem]",
          light ? "text-on-forest" : "text-forest",
        )}
      >
        Sujatha's
      </p>
      <p
        className={cn(
          "mt-1 font-display font-medium tracking-[0.28em] uppercase",
          compact ? "text-[0.55rem]" : "text-[0.62rem]",
          light ? "text-on-forest/75" : "text-muted",
        )}
      >
        Authentic Kitchen
      </p>
    </div>
  );
}
