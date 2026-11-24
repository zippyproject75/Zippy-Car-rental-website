"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
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

function readAuthNotice(): { error: string; message: string } {
  const params = new URLSearchParams(window.location.search);
  const messageParam = params.get("message");
  const errorParam = params.get("authError");
  const errorCode = params.get("authErrorCode");
  const description =
    params.get("error_description") ?? params.get("error") ?? params.get("resetError");

  let message = "";
  if (messageParam === "password-updated") {
    message = "Your password was updated. Sign in with your new password.";
  }

  let error = "";
  if (errorParam === "reset_link" || errorCode === "otp_expired") {
    error = "This password reset link is invalid or has expired. Request a new reset link.";
  } else if (errorParam === "callback") {
    error = "We could not complete that sign-in link. Please try again.";
  } else if (errorParam === "oauth") {
    error = "Sign-in could not be completed. Please try again.";
  } else if (description) {
    error = description.replace(/\+/g, " ");
  }

  return { error, message };
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function getAuthCallbackUrl(nextPath: string): string {
  const browserOrigin = window.location.origin;
  const hostname = window.location.hostname;
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";

  let origin = browserOrigin;
  if (!isLocalHost) {
    const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
    if (configured) {
      try {
        origin = new URL(configured).origin;
      } catch {
        // Fall back to the current browser origin if the configured site URL is invalid.
      }
    }
  }

  return `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}

function setRecoveryNextCookie(nextPath: string) {
  document.cookie = `zippy_recovery_next=${encodeURIComponent(nextPath)}; Path=/; Max-Age=3600; SameSite=Lax`;
}

function clearRecoveryNextCookie() {
  document.cookie = "zippy_recovery_next=; Path=/; Max-Age=0; SameSite=Lax";
}

export function AuthForm({ mode }: { mode: AuthFormMode }) {
  const locale = useLocale();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [checkingRecovery, setCheckingRecovery] = useState(mode === "reset");
  const recoveryReadyRef = useRef(false);

  const isSignup = mode === "signup";
  const isAdmin = mode === "admin-login";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";
  const isLogin = mode === "login" || isAdmin;

  useEffect(() => {
    recoveryReadyRef.current = recoveryReady;
  }, [recoveryReady]);

  useEffect(() => {
    const notice = readAuthNotice();
    if (notice.error) setError(notice.error);
    if (notice.message) setMessage(notice.message);
  }, []);

  useEffect(() => {
    if (!isReset) {
      clearRecoveryNextCookie();
      return;
    }

    setRecoveryNextCookie(localizedPath(locale, "/reset-password"));

    let active = true;
    let subscription: { unsubscribe: () => void } | undefined;
    const timeoutId = window.setTimeout(() => {
      if (!active) return;
      setCheckingRecovery(false);
      if (!recoveryReadyRef.current) {
        setError((current) =>
          current || "This password reset link is invalid or has expired. Request a new reset link.",
        );
      }
    }, 4000);

    async function prepareRecoverySession() {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!active) return;
        if (session) {
          recoveryReadyRef.current = true;
          setRecoveryReady(true);
          setCheckingRecovery(false);
          window.clearTimeout(timeoutId);
        }

        const { data: listener } = supabase.auth.onAuthStateChange(
          (event: AuthChangeEvent, nextSession: Session | null) => {
            if (!active) return;
            if (
              event === "PASSWORD_RECOVERY" ||
              (nextSession &&
                (event === "SIGNED_IN" ||
                  event === "INITIAL_SESSION" ||
                  event === "TOKEN_REFRESHED"))
            ) {
              recoveryReadyRef.current = true;
              setRecoveryReady(true);
              setCheckingRecovery(false);
              window.clearTimeout(timeoutId);
              setError((current) => (current.includes("invalid or has expired") ? "" : current));
            }
          },
        );
        subscription = listener.subscription;
      } catch {
        if (active) {
          window.clearTimeout(timeoutId);
          setCheckingRecovery(false);
          setError("Password reset is not available right now. Please try again later.");
        }
      }
    }

    void prepareRecoverySession();
    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, [isReset, locale]);

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

    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const supabase = getSupabaseBrowserClient();
      const email = normalizeEmail(String(formData.get("email") ?? ""));
      const password = String(formData.get("password") ?? "");
      const defaultNextPath = localizedPath(locale, isAdmin ? "/admin" : "/account");
      const nextPath = isAdmin ? defaultNextPath : (getSafeNextPath() ?? defaultNextPath);

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
        if (!email) {
          throw new Error("Enter the email address for your account.");
        }
        const resetNextPath = localizedPath(locale, "/reset-password");
        setRecoveryNextCookie(resetNextPath);
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: getAuthCallbackUrl(resetNextPath),
        });
        if (resetError) throw resetError;
        setMessage(
          "If an account exists for that email, password reset instructions have been sent.",
        );
        form.reset();
      } else if (isReset) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          recoveryReadyRef.current = false;
          setRecoveryReady(false);
          throw new Error(
            "This password reset link is invalid or has expired. Request a new reset link.",
          );
        }
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) throw passwordError;
        const { error: signOutError } = await supabase.auth.signOut({ scope: "global" });
        if (signOutError) {
          await supabase.auth.signOut({ scope: "local" });
        }
        clearRecoveryNextCookie();
        setMessage("Your password has been updated. Redirecting you to sign in…");
        router.replace(`${localizedPath(locale, "/login")}?message=password-updated`);
        router.refresh();
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
          redirectTo: getAuthCallbackUrl(nextPath),
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
                  ? checkingRecovery
                    ? "We are verifying your one-time reset link."
                    : recoveryReady
                      ? "Choose a new password for your account."
                      : "This reset link could not be verified. You can request a new one below."
                  : "Sign in to view and update your customer account."}
        </p>

        {isReset && checkingRecovery ? (
          <p className="mt-7 rounded-control border border-line bg-canvas p-4 text-sm text-ink-2" role="status">
            Verifying your reset link…
          </p>
        ) : isReset && !recoveryReady ? (
          <div className="mt-7 space-y-4">
            {error ? (
              <p className="rounded-control bg-danger-surface p-3 text-sm text-danger" role="alert">
                {error}
              </p>
            ) : null}
            <Link
              className="inline-flex min-h-11 w-full items-center justify-center rounded-control bg-accent px-4 py-3 font-semibold text-on-accent hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              href={localizedPath(locale, "/forgot-password")}
            >
              Request a new reset link
            </Link>
          </div>
        ) : (
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
                {isReset ? "New password" : "Password"}
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
              disabled={loading || (isReset && (!recoveryReady || checkingRecovery))}
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
        )}

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
