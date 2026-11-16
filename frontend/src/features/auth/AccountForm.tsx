"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { localizedPath } from "@/lib/routes";
import { authApiUrl } from "@/lib/auth-api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuthenticatedUser } from "@/lib/auth-types";

const fieldClass =
  "mt-1.5 w-full rounded-control border border-line bg-canvas px-3.5 py-3 text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus";

export function AccountForm({ user }: { user: AuthenticatedUser }) {
  const router = useRouter();
  const locale = useLocale();
  const [displayName, setDisplayName] = useState(user.displayName ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const response = await fetch(authApiUrl("/api/account"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, phone }),
        credentials: "include",
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Profile could not be updated.");
      setMessage("Your account details have been updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Profile could not be updated.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setError("");
    try {
      const { error: signOutError } = await getSupabaseBrowserClient().auth.signOut();
      if (signOutError) throw signOutError;
      router.replace(localizedPath(locale, "/login"));
      router.refresh();
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "You could not be signed out.");
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-card border border-line bg-raised p-5 shadow-raised sm:p-8">
        <p className="eyebrow">Customer account</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Your account</h1>
        <p className="mt-3 text-sm text-ink-2">{user.email}</p>
        <form className="mt-7 space-y-5" onSubmit={save}>
          <label className="block text-sm font-medium text-ink" htmlFor="displayName">
            Name
            <input
              className={fieldClass}
              id="displayName"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              autoComplete="name"
              maxLength={100}
              required
            />
          </label>
          <label className="block text-sm font-medium text-ink" htmlFor="phone">
            Phone <span className="font-normal text-ink-3">(optional)</span>
            <input
              className={fieldClass}
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
              maxLength={30}
            />
          </label>
          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="text-sm text-success" role="status">
              {message}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-control bg-accent px-5 py-3 font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving…" : "Save changes"}
            </button>
            <button
              className="rounded-control border border-line px-5 py-3 font-semibold text-ink hover:bg-muted"
              type="button"
              onClick={logout}
            >
              Sign out
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
