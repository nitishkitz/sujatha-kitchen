import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/kitchen/today")({
  component: () => <Navigate to="/kitchen" />,
});
