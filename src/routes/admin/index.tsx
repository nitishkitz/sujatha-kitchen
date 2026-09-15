import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/kitchen/admin-dashboard";
import { PhoneShell } from "@/components/kitchen/bits";

export const Route = createFileRoute("/admin/")({
  component: () => (
    <div className="min-h-dvh bg-forest-deep/5">
      <PhoneShell>
        <AdminDashboard />
      </PhoneShell>
    </div>
  ),
});
