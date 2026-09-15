import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { BrandLockup } from "./brand-lockup";
import { PhoneShell, PrimaryButton } from "./bits";

export function KitchenLoginScreen() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg">
        <div className="h-10 w-48 animate-pulse rounded-full bg-soft" />
      </div>
    );
  }
  if (user) return <Navigate to="/kitchen" />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || "Kitchen",
        });
        if (err) throw new Error(err.message ?? "Could not create account");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (err) throw new Error(err.message ?? "Could not sign in");
      }
      await authClient.getSession();
      await navigate({ to: "/kitchen" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh bg-bg">
      <PhoneShell>
        <section className="flex min-h-dvh flex-col px-6 pt-16 pb-8 pad-safe-t pad-safe-b">
          <BrandLockup />
          <p className="mt-8 text-center text-[0.68rem] font-semibold tracking-[0.22em] text-forest uppercase">
            Kitchen console
          </p>
          <p className="mt-2 text-center text-sm text-muted">
            Manage today’s orders and pickup queue.
          </p>

          <form className="mt-8 space-y-3" onSubmit={(e) => void submit(e)}>
            {mode === "up" && (
              <label className="block">
                <span className="text-caption text-muted">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 h-field w-full rounded-xl bg-surface px-3 text-sm shadow-card outline-none focus:ring-2 focus:ring-forest/30"
                  autoComplete="name"
                />
              </label>
            )}
            <label className="block">
              <span className="text-caption text-muted">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-field w-full rounded-xl bg-surface px-3 text-sm shadow-card outline-none focus:ring-2 focus:ring-forest/30"
                autoComplete="username"
              />
            </label>
            <label className="block">
              <span className="text-caption text-muted">Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 h-field w-full rounded-xl bg-surface px-3 text-sm shadow-card outline-none focus:ring-2 focus:ring-forest/30"
                autoComplete={mode === "up" ? "new-password" : "current-password"}
              />
            </label>
            {error ? <p className="text-caption text-chip-warn">{error}</p> : null}
            <PrimaryButton type="submit" disabled={busy} className="mt-2">
              {busy ? "Please wait…" : mode === "up" ? "Create account" : "Sign in"}
            </PrimaryButton>
          </form>

          <button
            type="button"
            className="mt-4 text-center text-caption text-forest"
            onClick={() => {
              setMode(mode === "in" ? "up" : "in");
              setError(null);
            }}
          >
            {mode === "in" ? "Need an account? Create one" : "Already on staff? Sign in"}
          </button>

          <p className="mt-auto pt-8 text-center text-micro tracking-[0.14em] text-muted uppercase">
            Staff access only
          </p>
        </section>
      </PhoneShell>
    </div>
  );
}
