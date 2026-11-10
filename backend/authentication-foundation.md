# Supabase backend and owner operations

The Next.js frontend and Fastify API run as separate applications. Supabase Auth owns
credentials and browser sessions; Supabase Postgres stores application roles, profiles, fleet,
pricing, pickup locations, enquiries, policies, and audit history. The backend validates the
Supabase session from HttpOnly cookies and reads the role from `user_roles`. User-editable auth
metadata is never an authorization source.

Customer email/password registration uses the server-only Supabase Auth Admin API to create an
already-confirmed account, so registration does not send a confirmation email. The browser then
signs the new customer in with their password. Email remains the account identifier and must be
syntactically valid; owner sign-in and password-recovery flows are unchanged. Registration accepts
no role field and is protected by the same-origin check and IP-based rate limiting.

## Configure a Supabase project

1. Create a Supabase project and keep its database password, secret/service-role key, and OAuth
   secrets in a trusted secret manager. Do not commit credentials or put the secret key in any
   `NEXT_PUBLIC_*` variable.
2. Set backend environment values:
   - `DATABASE_URL`: the project's PostgreSQL connection string with TLS enabled in production.
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SECRET_KEY`: project URL, publishable/anon
     key, and server-only secret/service-role key.
   - `SUPABASE_STORAGE_BUCKET=vehicle-images` and the exact `FRONTEND_ORIGIN`.
   - `AUTH_SECRET`: a randomly generated secret with at least 32 bytes, used to HMAC rate-limit keys.
3. Set frontend `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Set `BACKEND_API_URL` to the backend origin. These are
   the only Supabase values exposed to the browser.
4. In Supabase Auth, set the site URL to the canonical frontend origin and add redirect URLs for
   `http://localhost:3000/auth/callback` during local development and
   `https://<your-domain>/auth/callback` in production.
5. Enable email/password sign-in and configure the Auth email templates/provider for confirmation
   and password reset. Enable Google under Authentication → Providers. Create a Google OAuth client
   and add the callback URI shown by Supabase (normally
   `https://<project-ref>.supabase.co/auth/v1/callback`) to the Google client. Store the Google
   client secret in Supabase, not in frontend or backend source code. Add both development and
   production callback destinations to Supabase's allowed redirect URLs.
6. Create a public-read Storage bucket named `vehicle-images` (or set
   `SUPABASE_STORAGE_BUCKET` to the chosen bucket). Uploads go through the owner-only backend using
   the server secret key; restrict accepted MIME types and file size to the configured API limits.
   Public read is needed for website vehicle images; never grant public writes.
7. Back up the project, then run `pnpm --dir backend db:migrate` from the repository root. The
   migration runner applies numbered migrations transactionally and records them in
   `schema_migrations`. Migration `0002` references Supabase's `auth.users` and renames the legacy
   application profile/audit tables rather than deleting them. Verify the migration logs and
   resulting schema before enabling production traffic. Roll back by restoring a tested database
   snapshot; do not manually drop tables.

## Provision the one owner

There is no public admin signup or role selector. New email or Google Auth identities receive the
`CUSTOMER` role from the database trigger. The owner must first create and verify/sign in to the
intended Supabase Auth identity, then an operator grants that identity owner status:

1. Verify the business owner's identity and exact email out of band.
2. Supply `OWNER_EMAIL`, `DATABASE_URL`, `SUPABASE_URL`, and `SUPABASE_SECRET_KEY` only to a trusted
   operator shell or deployment job. Do not put secret values in command arguments, logs, source,
   or Git.
   In PowerShell, set the temporary owner email with `$env:OWNER_EMAIL = "owner@example.com"`; the
   other backend values are loaded from `backend/.env` for local development. In Command Prompt,
   use `set "OWNER_EMAIL=owner@example.com"` instead.
3. From the repository root, run `pnpm --dir backend auth:provision-owner`. The command only grants the role to an existing,
   verified Supabase Auth account. It is safe to rerun for the same owner, refuses a different
   already-provisioned owner, and records the provisioning action.
4. In PowerShell, clear the temporary value with `Remove-Item Env:OWNER_EMAIL` (or in Command
   Prompt, `set OWNER_EMAIL=`). Then verify `/admin/login` and `/admin` using the owner's configured
   sign-in method.

PowerShell example:

```powershell
$env:OWNER_EMAIL = "owner@example.com"
pnpm --dir backend auth:provision-owner
Remove-Item Env:OWNER_EMAIL
```

A partial unique index on `user_roles.role` enforces at most one `SUPER_ADMIN`, including concurrent
provisioning. Only the operator command may grant the role; customer signup fields and OAuth
metadata cannot do so.

## Account recovery and security boundaries

Use Supabase's password-reset email flow when the owner mailbox is available. If it is unavailable,
perform identity verification and use the protected operator command:

1. Supply the existing owner's exact `OWNER_EMAIL`, a new unique `OWNER_PASSWORD` (12–128
   characters), `DATABASE_URL`, `SUPABASE_URL`, and `SUPABASE_SECRET_KEY` from the secret manager.
2. Run `pnpm --dir backend auth:recover-owner`. It refuses to create or rename an owner, resets the
   password through Supabase Auth, revokes all active sessions, and writes an audit event.
3. Remove the temporary password value and verify sign-in.

The owner-only APIs enforce permissions server-side. Customer profile updates are scoped to the
authenticated user. Enquiry submission remains available without an account and is rate-limited.
Mutation requests verify the frontend origin. Audit events exclude passwords, session tokens, and
reset tokens; ordinary customers cannot edit or read owner audit history.

Use HTTPS for both apps in production. Configure a trusted reverse proxy to provide correct
forwarded protocol and client-address headers, and set `TRUST_PROXY=true` only when that proxy
overwrites them. Do not claim production readiness until migrations, OAuth callbacks, storage
permissions, owner provisioning, backups, and the customer/owner flows have been verified against
the actual Supabase project.
