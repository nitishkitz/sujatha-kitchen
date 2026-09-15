import type { ButtonHTMLAttributes } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function PhoneShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto min-h-dvh w-full max-w-phone bg-bg", className)}>{children}</div>
  );
}

export function FoodThumb({
  src,
  size = "md",
  className,
  alt = "",
}: {
  src: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  alt?: string;
}) {
  const box = size === "sm" ? "size-11" : size === "lg" ? "h-52 w-full" : "size-16";
  return (
    <div className={cn("shrink-0 overflow-hidden rounded-md bg-soft", box, className)}>
      <img src={src} alt={alt} className="size-full object-cover" />
    </div>
  );
}

export function QtyStepper({
  value,
  onChange,
  min = 1,
  variant = "pill",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  variant?: "pill" | "round";
}) {
  if (variant === "round") {
    return (
      <div className="inline-flex items-center gap-3">
        <button
          type="button"
          aria-label="Decrease"
          className="press grid size-11 place-items-center rounded-full border border-line bg-surface text-ink"
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus className="size-4" />
        </button>
        <span className="w-5 text-center text-lg font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          aria-label="Increase"
          className="press grid size-11 place-items-center rounded-full bg-forest text-on-forest"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="size-4" strokeWidth={2.5} />
        </button>
      </div>
    );
  }
  return (
    <div className="inline-flex h-9 items-center rounded-full border border-line bg-surface">
      <button
        type="button"
        aria-label="Decrease"
        className="grid size-9 place-items-center text-forest"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-5 text-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase"
        className="grid size-9 place-items-center text-forest"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export function PrimaryButton({
  children,
  className,
  tone = "forest",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "forest" | "lime" }) {
  return (
    <button
      type="button"
      className={cn(
        "press flex h-cta w-full items-center justify-center rounded-lg px-5 text-body font-semibold",
        tone === "forest" ? "bg-forest text-on-forest" : "bg-lime text-on-lime",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Wordmark({
  light,
  compact,
  align = "center",
}: {
  light?: boolean;
  compact?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "left" ? "text-left" : "text-center"}>
      <p
        className={cn(
          "font-script leading-none",
          compact ? "text-2xl" : "text-6xl",
          light ? "text-on-forest" : "text-forest",
        )}
      >
        Sujatha's
      </p>
      <p
        className={cn(
          "mt-1 font-display tracking-[0.22em] uppercase",
          compact ? "text-micro" : "text-xs",
          light ? "text-on-forest/75" : "text-muted",
        )}
      >
        Authentic Kitchen
      </p>
    </div>
  );
}
