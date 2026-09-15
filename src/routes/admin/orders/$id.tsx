import { createFileRoute } from "@tanstack/react-router";
import { AdminOrder } from "@/components/kitchen/admin-dashboard";
import { PhoneShell } from "@/components/kitchen/bits";

export const Route = createFileRoute("/admin/orders/$id")({
  component: AdminOrderPage,
});

function AdminOrderPage() {
  const { id } = Route.useParams();
  return (
    <div className="min-h-dvh bg-forest-deep/5">
      <PhoneShell>
        <AdminOrder id={id} />
      </PhoneShell>
    </div>
  );
}
