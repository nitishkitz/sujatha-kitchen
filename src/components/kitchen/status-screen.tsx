import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getPickupStatus } from "@/lib/kitchen-orders";
import { useKitchen } from "@/lib/store";
import { PreparingState } from "./preparing-state";
import { ReadyState } from "./ready-state";

export function StatusScreen() {
  const order = useKitchen((s) => s.order);
  const applyKitchenStatus = useKitchen((s) => s.applyKitchenStatus);
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(() => useKitchen.persist.hasHydrated());

  useEffect(() => {
    return useKitchen.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!order) void navigate({ to: "/" });
  }, [hydrated, order, navigate]);

  useEffect(() => {
    if (!order) return;
    const code = order.code;
    let cancelled = false;
    async function tick() {
      try {
        const live = await getPickupStatus({ data: { code } });
        if (!cancelled && live) applyKitchenStatus(live.status);
      } catch {
        /* keep last known stage */
      }
    }
    void tick();
    const id = window.setInterval(() => void tick(), 2500);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [order?.code, applyKitchenStatus]);

  if (!order) return null;
  if (order.stage >= 2) return <ReadyState code={order.code} />;
  return <PreparingState code={order.code} stage={order.stage} />;
}
