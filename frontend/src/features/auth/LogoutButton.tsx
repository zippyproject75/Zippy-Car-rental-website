"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { localizedPath } from "@/lib/routes";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const locale = useLocale();
  const [error, setError] = useState("");

  async function logout() {
    setError("");
    try {
      const { error: signOutError } = await getSupabaseBrowserClient().auth.signOut();
      if (signOutError) throw signOutError;
      router.replace(localizedPath(locale, "/admin/login"));
      router.refresh();
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "You could not be signed out.");
    }
  }

  return (
    <div>
      <button
        className="rounded-control bg-accent px-4 py-3 text-sm font-semibold text-on-accent hover:bg-accent-hover"
        type="button"
        onClick={logout}
      >
        Sign out
      </button>
      {error ? (
        <p className="mt-2 text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
