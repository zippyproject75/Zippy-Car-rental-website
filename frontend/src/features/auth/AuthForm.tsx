"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type MouseEvent } from "react";
import { localizedPath } from "@/lib/routes";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthFormMode = "login" | "signup" | "admin-login" | "forgot" | "reset";

const fieldClass =
  "mt-1.5 w-full rounded-control border border-line bg-canvas px-3.5 py-3 text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus";

function getSafeNextPath(): string | null {
  const candidate = new URLSearchParams(window.location.search).get("next");
  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\")
  ) {
    return null;
  }

  const destination = new URL(candidate, window.location.origin);
  if (destination.origin !== window.location.origin) return null;
  return `${destination.pathname}${destination.search}${destination.hash}`;
}

export function AuthForm({ mode }: { mode: AuthFormMode }) {
  const locale = useLocale();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";
  const isAdmin = mode === "admin-login";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";
  const isLogin = mode === "login" || isAdmin;

  function navigatePreservingNext(event: MouseEvent<HTMLAnchorElement>, path: string) {
    const nextPath = getSafeNextPath();
    if (!nextPath) return;
    event.preventDefault();
    router.push(`${localizedPath(locale, path)}?next=${encodeURIComponent(nextPath)}`);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      const supabase = getSupabaseBrowserClient();
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");
      const defaultNextPath = localizedPath(locale, isAdmin ? "/admin" : "/account");
      const nextPath = isAdmin ? defaultNextPath : (getSafeNextPath() ?? defaultNextPath);
      const callbackUrl = (nextPath: string) =>
        `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

      if (isSignup) {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            email,
            password,
            displayName: String(formData.get("displayName") ?? "").trim(),
            phone: String(formData.get("phone") ?? "").trim(),
          }),
        });
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        if (!response.ok) {
          throw new Error(result?.error ?? "The account could not be created. Please try again.");
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          throw new Error(
            "Your account was created, but automatic sign-in failed. Please sign in with your new credentials.",
          );
        }
        router.replace(nextPath);
        router.refresh();
      } else if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw new Error("Email or password is incorrect.");
        router.replace(nextPath);
        router.refresh();
      } else if (isForgot) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: callbackUrl(localizedPath(locale, "/reset-password")),
        });
        if (resetError) throw resetError;
        setMessage(
          "If an account exists for that email, password reset instructions have been sent.",
        );
      } else if (isReset) {
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) throw passwordError;
        setMessage("Password updated. Sign in with your new password.");
        setTimeout(() => router.replace(localizedPath(locale, "/login")), 1200);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "The request could not be completed.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setError("");
    setLoading(true);
    try {
      const defaultNextPath = localizedPath(locale, isAdmin ? "/admin" : "/account");
      const nextPath = isAdmin ? defaultNextPath : (getSafeNextPath() ?? defaultNextPath);
      const { error: googleError } = await getSupabaseBrowserClient().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });
      if (googleError) throw googleError;
    } catch (googleError) {
      setError(
        googleError instanceof Error ? googleError.message : "Google sign-in could not start.",
      );
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-lg px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-card border border-line bg-raised p-5 shadow-raised sm:p-8">
        <p className="eyebrow">{isAdmin ? "Zippy owner access" : "Zippy Car Rental"}</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">
          {isSignup
            ? "Create your account"
            : isAdmin
              ? "Administrator sign in"
              : isForgot
                ? "Reset your password"
                : isReset
                  ? "Choose a new password"
                  : "Welcome back"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-2">
          {isAdmin
            ? "Sign in with the owner account provisioned for this website."
            : isSignup
              ? "Create your account and continue immediately. No confirmation email is sent."
              : isForgot
                ? "Enter your account email. If it is registered, we will send a one-time reset link."
                : isReset
                  ? "Your one-time link expires after 30 minutes."
                  : "Sign in to view and update your customer account."}
        </p>

        <form className="mt-7 space-y-5" onSubmit={submit}>
          {isSignup ? (
            <>
              <label className="block text-sm font-medium text-ink" htmlFor="displayName">
                Name
                <input
                  className={fieldClass}
                  id="displayName"
                  name="displayName"
                  autoComplete="name"
                  required
                  maxLength={100}
                />
              </label>
              <label className="block text-sm font-medium text-ink" htmlFor="phone">
                Phone <span className="font-normal text-ink-3">(optional)</span>
                <input
                  className={fieldClass}
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={30}
                />
              </label>
            </>
          ) : null}

          {!isReset ? (
            <label className="block text-sm font-medium text-ink" htmlFor="email">
              Email
              <input
                className={fieldClass}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
          ) : null}

          {isLogin || isSignup || isReset ? (
            <label className="block text-sm font-medium text-ink" htmlFor="password">
              Password
              <input
                className={fieldClass}
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={isLogin ? 1 : 12}
                maxLength={128}
                required
              />
              {!isLogin ? (
                <span className="mt-1 block text-xs font-normal text-ink-3">
                  Use at least 12 characters.
                </span>
              ) : null}
            </label>
          ) : null}

          {error ? (
            <p className="rounded-control bg-danger-surface p-3 text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p
              className="rounded-control bg-success-surface p-3 text-sm text-success"
              role="status"
            >
              {message}
            </p>
          ) : null}

          <button
            className="w-full rounded-control bg-accent px-4 py-3 font-semibold text-on-accent hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-wait disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : isSignup
                ? "Create customer account"
                : isAdmin || mode === "login"
                  ? "Sign in"
                  : isForgot
                    ? "Send reset link"
                    : "Update password"}
          </button>
        </form>

        {isLogin || isSignup ? (
          <div className="mt-5">
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-line" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-raised px-3 text-xs text-ink-3">or continue with</span>
              </div>
            </div>
            <button
              className="flex min-h-11 w-full items-center justify-center gap-3 rounded-control border border-line bg-canvas px-4 py-3 font-semibold text-ink hover:bg-muted disabled:cursor-wait disabled:opacity-60"
              type="button"
              onClick={signInWithGoogle}
              disabled={loading}
            >
              <span aria-hidden="true" className="font-bold text-accent-ink">
                G
              </span>
              Continue with Google
            </button>
          </div>
        ) : null}

        <nav
          className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-2"
          aria-label="Account links"
        >
          {isLogin ? (
            <>
              {mode === "login" ? (
                <Link
                  className="underline underline-offset-4"
                  href={localizedPath(locale, "/signup")}
                  onClick={(event) => navigatePreservingNext(event, "/signup")}
                >
                  Create an account
                </Link>
              ) : null}
              <Link
                className="underline underline-offset-4"
                href={localizedPath(locale, "/forgot-password")}
              >
                Forgot password?
              </Link>
            </>
          ) : null}
          {isSignup || isForgot || isReset ? (
            <Link
              className="underline underline-offset-4"
              href={localizedPath(locale, "/login")}
              onClick={(event) => navigatePreservingNext(event, "/login")}
            >
              Back to customer sign in
            </Link>
          ) : null}
        </nav>
      </div>
    </section>
  );
}
