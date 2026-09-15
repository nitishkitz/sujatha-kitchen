import { createFileRoute } from "@tanstack/react-router";
import { KitchenLoginScreen } from "@/components/kitchen/kitchen-login";

export const Route = createFileRoute("/kitchen/login")({
  component: KitchenLoginScreen,
});
