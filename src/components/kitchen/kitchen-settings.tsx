import { useState } from "react";
import { signOut } from "@/lib/auth/client";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { KitchenTabBar } from "./kitchen-tab-bar";
import { PrimaryButton } from "./bits";

export function KitchenSettingsScreen() {
  const user = useCurrentUser();
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="px-5 pt-4 pad-safe-t">
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
      </header>
      <div className="flex-1 px-5 pt-4 pb-28">
        <div className="rounded-[1.15rem] bg-surface p-4 shadow-card">
          <p className="text-caption text-muted">Signed in</p>
          <p className="mt-1 text-sm font-medium">{user?.displayName ?? "Kitchen staff"}</p>
          <p className="text-caption text-muted">{user?.primaryEmail}</p>
        </div>
        <div className="mt-5 rounded-[1.15rem] bg-surface p-4 shadow-card">
          <p className="text-sm font-medium">Kitchen</p>
          <p className="mt-1 text-caption text-muted">Sujatha’s Authentic Kitchen · pickup only</p>
          <p className="mt-2 text-caption text-muted">Ready in 15–20 min · pay at counter</p>
        </div>
        <PrimaryButton
          className="mt-8"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            void signOut("/kitchen/login").catch(() => setBusy(false));
          }}
        >
          {busy ? "Signing out…" : "Sign out"}
        </PrimaryButton>
      </div>
      <KitchenTabBar active="settings" />
    </div>
  );
}
