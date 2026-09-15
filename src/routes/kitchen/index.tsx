import { createFileRoute } from "@tanstack/react-router";
import { KitchenDashboard } from "@/components/kitchen/kitchen-dashboard";
import { listKitchenOrders } from "@/lib/kitchen-orders";

export const Route = createFileRoute("/kitchen/")({
  loader: () => listKitchenOrders(),
  component: KitchenDashboard,
});
