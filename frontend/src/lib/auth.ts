import { cookies } from "next/headers";
import { backendApiUrl } from "@/lib/auth-api";
import type { AdminActivityEntry, AuthenticatedUser } from "@/lib/auth-types";

export type { AdminActivityEntry, AuthenticatedUser, UserRole } from "@/lib/auth-types";

async function getCookieHeader(): Promise<string> {
  return (await cookies())
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const cookieHeader = await getCookieHeader();
  if (!cookieHeader) return null;

  try {
    const response = await fetch(backendApiUrl("/api/auth/session"), {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    const result = (await response.json()) as { user: AuthenticatedUser | null };
    return result.user;
  } catch {
    return null;
  }
}

export async function getRecentAdminActivity(limit = 50): Promise<AdminActivityEntry[]> {
  const cookieHeader = await getCookieHeader();
  if (!cookieHeader)
    throw new Error("Cannot load owner activity without an authenticated session.");

  const response = await fetch(backendApiUrl(`/api/admin/activity?limit=${limit}`), {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Backend activity lookup failed with status ${response.status}.`);
  }
  const result = (await response.json()) as { entries: AdminActivityEntry[] };
  return result.entries;
}
