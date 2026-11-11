import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
const connectionString = process.env.DATABASE_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

const missingVariables = [
  ["OWNER_EMAIL", email],
  ["DATABASE_URL", connectionString],
  ["SUPABASE_URL", supabaseUrl],
  ["SUPABASE_SECRET_KEY", secretKey],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}.`);
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
  throw new Error("OWNER_EMAIL must be a valid email address.");
}

const supabase = createClient(supabaseUrl, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const database = postgres(connectionString, {
  max: 1,
  connect_timeout: 10,
  prepare: false,
  ssl: process.env.NODE_ENV === "production" ? "require" : undefined,
});

async function findVerifiedUserByEmail() {
  for (let page = 1; page <= 100; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`Could not look up the owner identity: ${error.message}`);
    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email);
    if (user) {
      if (!user.email_confirmed_at) {
        throw new Error("The owner email must be confirmed before granting the Super Admin role.");
      }
      return user;
    }
    if (data.users.length < 1000) break;
  }
  throw new Error(
    "No Supabase Auth account exists for OWNER_EMAIL. Sign in once with that verified email, then provision it.",
  );
}

try {
  const ownerUser = await findVerifiedUserByEmail();
  const result = await database.begin(async (transaction) => {
    await transaction`SELECT pg_advisory_xact_lock(hashtext('zippy-single-supabase-owner'))`;
    const [existingOwner] = await transaction`
      SELECT user_id FROM user_roles WHERE role = 'SUPER_ADMIN' FOR UPDATE
    `;
    if (existingOwner) {
      if (existingOwner.user_id !== ownerUser.id) {
        throw new Error("A different Super Admin is already provisioned; refusing to replace it.");
      }
      return "unchanged";
    }
    await transaction`
      INSERT INTO user_roles (user_id, role)
      VALUES (${ownerUser.id}, 'SUPER_ADMIN')
      ON CONFLICT (user_id) DO UPDATE SET role = 'SUPER_ADMIN', updated_at = now()
    `;
    await transaction`
      INSERT INTO admin_activity_logs (actor_user_id, action, subject_type, subject_id, summary)
      VALUES (
        ${ownerUser.id}, 'admin.owner_provisioned', 'user', ${ownerUser.id},
        '{"method":"protected_operator_cli"}'::jsonb
      )
    `;
    return "created";
  });

  console.info(
    result === "unchanged"
      ? "This verified Supabase account is already the single Super Admin; no changes were made."
      : "The verified Supabase account was granted the single Super Admin role.",
  );
} finally {
  await database.end();
}
