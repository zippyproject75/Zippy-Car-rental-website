import { createServerClient } from "@supabase/ssr";
import type { FastifyReply, FastifyRequest } from "fastify";
import { getDatabase } from "./database.js";
import type { UserRole } from "./permissions.js";

export type AuthenticatedUser = {
  id: string;
  email: string;
  displayName: string | null;
  phone: string | null;
  role: UserRole;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be configured before using authenticated APIs.`);
  return value;
}

export function createRequestSupabaseClient(request: FastifyRequest, reply: FastifyReply) {
  return createServerClient(
    requiredEnv("SUPABASE_URL"),
    requiredEnv("SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return Object.entries(request.cookies).flatMap(([name, value]) =>
            typeof value === "string" ? [{ name, value }] : [],
          );
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            reply.setCookie(name, value, options);
          }
        },
      },
    },
  );
}

export async function getCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<AuthenticatedUser | null> {
  const hasAuthCookie = Object.keys(request.cookies).some(
    (name) => name.startsWith("sb-") && name.includes("-auth-token"),
  );
  if (!hasAuthCookie) return null;

  const supabase = createRequestSupabaseClient(request, reply);
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    if (error.name === "AuthSessionMissingError" || error.status === 401) return null;
    throw new Error(`Supabase could not validate the current session: ${error.message}`);
  }
  if (!data.user) return null;

  const [profile] = await getDatabase()`
    SELECT
      COALESCE(roles.role, 'CUSTOMER') AS role,
      profiles.display_name AS "displayName",
      profiles.phone
    FROM (SELECT ${data.user.id}::uuid AS user_id) auth_user
    LEFT JOIN user_roles roles ON roles.user_id = auth_user.user_id
    LEFT JOIN customer_profiles profiles ON profiles.user_id = auth_user.user_id
  `;

  const role = profile?.role;
  if (role !== "SUPER_ADMIN" && role !== "CUSTOMER") {
    throw new Error("The authenticated account has an unsupported application role.");
  }
  return {
    id: data.user.id,
    email: data.user.email ?? "",
    displayName: profile?.displayName ?? null,
    phone: profile?.phone ?? null,
    role,
  };
}
