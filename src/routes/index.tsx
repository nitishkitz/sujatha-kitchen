import { createFileRoute } from "@tanstack/react-router";
import { KitchenApp } from "@/components/kitchen/kitchen-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <KitchenApp />;
}
