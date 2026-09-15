import { Toaster } from "sonner";
import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { pathToScreen } from "@/lib/nav";
import { useKitchen } from "@/lib/store";
import { PhoneShell } from "./bits";
import { StartScreen } from "./start-screen";
import { MenuScreen } from "./menu-screen";
import { ItemSheet } from "./item-sheet";
import { BagBar } from "./bag-sheet";
import { CheckoutScreen } from "./checkout-screen";
import { StatusScreen } from "./status-screen";

export function KitchenApp() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const screen = pathToScreen(path);

  useEffect(() => {
    void useKitchen.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-dvh bg-forest-deep">
      <PhoneShell>
        {screen === "start" && <StartScreen />}
        {screen === "menu" && <MenuScreen />}
        {screen === "checkout" && <CheckoutScreen />}
        {screen === "status" && <StatusScreen />}
        {screen === "menu" && <BagBar />}
        <ItemSheet />
      </PhoneShell>
      <Toaster position="top-center" richColors />
    </div>
  );
}
