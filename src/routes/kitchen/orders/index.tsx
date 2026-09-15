import { createFileRoute } from "@tanstack/react-router";
import { KitchenOrdersScreen } from "@/components/kitchen/kitchen-orders-screen";
import { listKitchenOrders } from "@/lib/kitchen-orders";

export const Route = createFileRoute("/kitchen/orders/")({
  loader: () => listKitchenOrders(),
  component: KitchenOrdersScreen,
});
