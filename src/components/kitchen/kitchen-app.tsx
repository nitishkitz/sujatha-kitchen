import { Toaster } from "sonner";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { pathToScreen, screenPath } from "@/lib/nav";
import type { Screen } from "@/lib/store";
import { StartScreen } from "./start-screen";
import { MenuScreen } from "./menu-screen";
import { ItemSheet } from "./item-sheet";
import { BagBar, BagBody, BagSheet } from "./bag-sheet";
import { CheckoutScreen } from "./checkout-screen";
import { StatusScreen } from "./status-screen";

export function KitchenApp() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const screen = pathToScreen(path);
  const navigate = useNavigate();
  const split = screen === "menu" || screen === "checkout";

  function go(next: Screen) {
    void navigate({ to: screenPath(next) });
  }

  return (
    <div className="min-h-dvh bg-bg">
      <div
        className={cn(
          "relative mx-auto min-h-dvh max-w-lg bg-bg",
          split && "lg:grid lg:max-w-5xl lg:grid-cols-[1fr_360px] lg:border-x lg:border-line",
        )}
      >
        <div className="relative min-h-dvh lg:overflow-y-auto">
          {screen === "start" && <StartScreen />}
          {screen === "menu" && <MenuScreen />}
          {screen === "checkout" && <CheckoutScreen />}
          {screen === "status" && <StatusScreen />}
          {screen === "menu" && (
            <div className="lg:hidden">
              <BagBar />
            </div>
          )}
        </div>
        {split ? (
          <aside className="hidden border-l border-line bg-surface p-5 lg:flex lg:flex-col">
            <h2 className="text-lg font-medium tracking-tight">Your pickup</h2>
            <p className="mb-2 text-sm text-muted">Collect at the kitchen counter</p>
            <div className="flex-1 overflow-y-auto">
              <BagBody onCheckout={() => go("checkout")} hideCta={screen === "checkout"} />
            </div>
          </aside>
        ) : null}
        <ItemSheet />
        <BagSheet />
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}
