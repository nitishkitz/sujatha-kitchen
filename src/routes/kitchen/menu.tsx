import { createFileRoute } from "@tanstack/react-router";
import { KitchenMenuScreen } from "@/components/kitchen/kitchen-menu-screen";
import { listMenuFlags } from "@/lib/kitchen-orders";

export const Route = createFileRoute("/kitchen/menu")({
  loader: () => listMenuFlags(),
  component: KitchenMenuScreen,
});
