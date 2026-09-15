import { createFileRoute } from "@tanstack/react-router";
import { KitchenOrderScreen } from "@/components/kitchen/kitchen-order-screen";
import { getKitchenOrder } from "@/lib/kitchen-orders";

export const Route = createFileRoute("/kitchen/orders/$id")({
  loader: ({ params }) => getKitchenOrder({ data: { code: params.id } }),
  component: KitchenOrderScreen,
});
