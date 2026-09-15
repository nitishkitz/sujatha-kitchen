import { createFileRoute } from "@tanstack/react-router";
import { KitchenSettingsScreen } from "@/components/kitchen/kitchen-settings";

export const Route = createFileRoute("/kitchen/settings")({
  component: KitchenSettingsScreen,
});
