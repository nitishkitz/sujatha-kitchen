import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PhoneShell } from "@/components/kitchen/bits";

export const Route = createFileRoute("/kitchen")({
  component: KitchenLayout,
});

function KitchenLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path === "/kitchen/login") return <Outlet />;
  return (
    <StaffGate>
      <div className="min-h-dvh bg-bg">
        <PhoneShell>
          <Outlet />
        </PhoneShell>
      </div>
    </StaffGate>
  );
}

function StaffGate({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg">
        <div className="h-10 w-40 animate-pulse rounded-full bg-soft" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn to="/kitchen/login" />;
  return <>{children}</>;
}
