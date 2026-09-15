import type { ButtonHTMLAttributes } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FoodThumb({
  src,
  size = "md",
  className,
}: {
  src: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box =
    size === "sm" ? "size-14" : size === "lg" ? "h-52 w-full" : "size-[72px]";
  return (
    <div className={cn("shrink-0 overflow-hidden rounded-xl bg-tile", box, className)}>
      <img src={src} alt="" className="size-full object-contain p-1.5" />
    </div>
  );
}

export function QtyStepper({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
}) {
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
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-14 w-full items-center justify-center rounded-full bg-forest px-5 text-[15px] font-semibold text-bg transition-transform duration-150 ease-out active:scale-[0.96] disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
