import type { StaffStatus } from "@/lib/kitchen-orders";
import { cn } from "@/lib/utils";

export function StatusChip({ status }: { status: StaffStatus }) {
  const map: Record<StaffStatus, string> = {
    pending: "bg-soft text-muted",
    preparing: "bg-chip-prep text-ink",
    ready: "bg-chip-ready text-forest",
    completed: "bg-soft text-muted",
  };
  const label: Record<StaffStatus, string> = {
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-micro font-semibold", map[status])}>
      {label[status]}
    </span>
  );
}
