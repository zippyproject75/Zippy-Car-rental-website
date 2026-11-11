import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
const password = process.env.OWNER_PASSWORD;
const connectionString = process.env.DATABASE_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!email || !password || !connectionString || !supabaseUrl || !secretKey) {
  throw new Error(
    "Set OWNER_EMAIL, OWNER_PASSWORD, DATABASE_URL, SUPABASE_URL, and SUPABASE_SECRET_KEY in the backend environment.",
  );
}
if (password.length < 12 || password.length > 128) {
  throw new Error("OWNER_PASSWORD must be between 12 and 128 characters.");
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

try {
  const [owner] = await database`
    SELECT user_id FROM user_roles WHERE role = 'SUPER_ADMIN'
  `;
  if (!owner) throw new Error("No Super Admin has been provisioned.");

  const { data, error: lookupError } = await supabase.auth.admin.getUserById(owner.user_id);
  if (lookupError) throw new Error(`Could not verify the provisioned owner: ${lookupError.message}`);
  if (data.user.email?.toLowerCase() !== email || !data.user.email_confirmed_at) {
    throw new Error("OWNER_EMAIL does not match the verified, provisioned Super Admin identity.");
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(owner.user_id, {
    password,
  });
  if (updateError) throw new Error(`Supabase could not reset the owner password: ${updateError.message}`);

  const { error: signOutError } = await supabase.auth.admin.signOut(owner.user_id, "global");
  if (signOutError) throw new Error(`Owner password changed but sessions could not be revoked: ${signOutError.message}`);

  await database`
    INSERT INTO admin_activity_logs (actor_user_id, action, subject_type, subject_id, summary)
    VALUES (
      ${owner.user_id}, 'admin.password_recovered', 'user', ${owner.user_id},
      '{"method":"protected_operator_cli"}'::jsonb
    )
  `;
  console.info("Owner password reset. All active Supabase sessions were revoked.");
} finally {
  await database.end();
}
