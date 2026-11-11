<p align="center">
  <img src="public/zippy_main_logo.png" alt="Zippy Car Rental Logo" width="120" />
</p>

<h1 align="center">Zippy Car Rental — Pune</h1>

<p align="center">
  <strong>Self-drive car rental platform for Pune, Maharashtra, India</strong>
</p>

<p align="center">
  <a href="https://www.zippycarrental.in">🌐 Live Site</a> ·
  <a href="#-getting-started">🚀 Getting Started</a> ·
  <a href="#-tech-stack">🛠 Tech Stack</a>
</p>

---

## 📖 Overview

Zippy Car Rental is a multilingual web application for browsing and enquiring about self-drive car rentals in Pune. It showcases a fleet of five Maruti Suzuki vehicles with WhatsApp-based booking enquiries.

**Architecture:** Monorepo with independently runnable Next.js frontend in `frontend/` and Fastify API in `backend/`. Supabase Auth handles customer/owner sign-in; Supabase Postgres stores the business catalog and enquiries. The frontend proxies `/api/*` to the backend so auth cookies remain first-party.

**Languages:** English (default), Hindi (`/hi`), Marathi (`/mr`)

**Features:** Responsive design, fleet catalogue, vehicle detail pages, interactive enquiry form with date picker, WhatsApp integration, FAQ, legal pages (Privacy Policy, Terms & Conditions, Cancellation & Refund Policy, Cookie Policy, Copyright), SEO metadata, XML sitemap, robots.txt, security headers, dark mode support, structured data (JSON-LD), social media preview images (Open Graph).

---

## 🛠 Tech Stack

**Frontend (`frontend/`):**
- **Framework:** Next.js 16.4.2 (App Router)
- **UI:** React 19.3.1, Tailwind CSS 4.3.3, Motion 14.4.0
- **i18n:** next-intl 4.14.9
- **Validation:** Zod 4.6.7
- **Date Handling:** date-fns 4.4.0, react-day-picker 10.0.2
- **Icons:** lucide-react 1.60.0
- **Analytics:** Vercel Analytics 2.0.1
- **Testing:** Vitest 5.0.5, Playwright 1.64.1
- **Node.js:** ≥22

**Backend (`backend/`):** Fastify 5, Supabase Auth, Supabase Postgres, Zod, TypeScript, and Vitest.

---

## 🚀 Getting Started

Install and run each application in a separate terminal:
```bash
git clone https://github.com/zippyproject75/Zippy-Car-rental-website.git
cd Zippy-Car-rental-website

corepack pnpm@10.34.3 --dir frontend install
corepack pnpm@10.34.3 --dir backend install
```
The root, frontend, and backend packages pin pnpm 10.34.3. Use Corepack as shown if your
globally installed `pnpm` does not match that version.

**Terminal 1 — backend API (`http://127.0.0.1:4000`):**
```bash
Copy-Item backend/.env.example backend/.env
corepack pnpm@10.34.3 --dir backend dev
```

**Terminal 2 — frontend (`http://localhost:3000`):**
```bash
Copy-Item frontend/.env.example frontend/.env.local
corepack pnpm@10.34.3 --dir frontend dev
```

PowerShell users can use these commands as shown. On macOS/Linux, copy the example env files with `cp`.

**Additional Scripts (`frontend/`):**
- `pnpm content:report` - Generate content report showing approved/pending status
- `pnpm launch:check` - Launch readiness content check

The root package also exposes `pnpm dev:frontend`, `pnpm dev:backend`, `pnpm build`,
`pnpm test:frontend`, and `pnpm test:backend` shortcuts.

---

## 🔧 Environment Variables

Copy `frontend/.env.example` to `frontend/.env.local` and `backend/.env.example` to `backend/.env`.
The backend's secrets must only be configured in its server environment.

**Frontend variables:**
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_ENV` | Yes | `development`, `preview`, or `production` |
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Canonical origin, e.g., `https://www.zippycarrental.in` |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` | No | Google Maps Embed API key (browser-restricted) |
| `CSP_MODE` | No | `report-only` (default) or `enforce` |
| `BACKEND_API_URL` | Yes | Backend origin used by Next.js API rewrites (default `http://localhost:4000`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes for Supabase mode | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes for Supabase mode | Browser-safe Supabase publishable key |

**Backend variables:**
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Random secret of at least 32 bytes for rate-limit key HMAC |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase publishable/anon key used to validate browser sessions |
| `SUPABASE_SECRET_KEY` | Yes | Server-only Supabase secret/service-role key; never expose to frontend |
| `SUPABASE_STORAGE_BUCKET` | Yes for photo operations | Public-read storage bucket name (default `vehicle-images`) |
| `FRONTEND_ORIGIN` | Yes | Exact frontend origin allowed by CORS and mutation-origin checks |
| `OWNER_EMAIL` | Provisioning only | Existing verified Supabase identity to grant owner status |
| `OWNER_PASSWORD` | Recovery only | Temporary password for the protected owner recovery command |

When Supabase values are not configured in the frontend, public fleet pages use the existing
read-only local content. Once Supabase is configured, catalog and pickup data are fetched from the
backend at request time; backend failures are surfaced rather than hidden behind stale data.

**Locales:** English (unprefixed), Hindi (`/hi`), Marathi (`/mr`) | **Translation Files:** `frontend/src/messages/en.json`, `hi.json`, `mr.json`

---

## 🛣️ Key Routes

| Route | Description | Indexable |
|-------|-------------|-----------|
| `/` | Homepage | Yes |
| `/cars` | Fleet listing | Yes |
| `/cars/[slug]` | Vehicle detail | Yes (except ertiga-2) |
| `/book` | Enquiry form | No |
| `/about` | About page | Yes (approved) |
| `/contact` | Contact page | Yes |
| `/faq` | FAQ page | Yes |
| `/privacy-policy` | Privacy Policy | Yes (approved) |
| `/terms-and-conditions` | Terms & Conditions | Yes (approved) |
| `/cancellation-and-refund-policy` | Cancellation & Refund Policy | Yes (approved) |
| `/cookie-policy` | Cookie Policy | Yes (approved) |
| `/copyright` | Copyright | Yes (approved) |

**Sitemap:** `/sitemap.xml` (42 URLs, 14 pages × 3 locales) | **Robots.txt:** `/robots.txt`

---

## 🧪 Testing & Quality

```bash
pnpm --dir frontend test
pnpm --dir backend test
pnpm --dir frontend test:e2e  # Starts both apps for browser tests
pnpm --dir frontend typecheck
pnpm --dir backend typecheck
pnpm --dir frontend lint
pnpm --dir backend lint
pnpm build
```

---

## 🚀 Deployment

### Vercel Configuration

Deploy the Next.js frontend and Fastify backend as separate services, and configure the Supabase
project using [backend/authentication-foundation.md](backend/authentication-foundation.md). Set:
- `NEXT_PUBLIC_SITE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://www.zippycarrental.in`
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY=your_key`
- `CSP_MODE=report-only`
- Frontend: `BACKEND_API_URL` to the private or public backend HTTPS origin
- Frontend: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `BACKEND_API_URL`
- Backend: `DATABASE_URL`, `AUTH_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SECRET_KEY`,
  `SUPABASE_STORAGE_BUCKET` and `FRONTEND_ORIGIN`

### Post-Deployment Verification

1. Verify HTTPS at `https://www.zippycarrental.in`
2. Check sitemap at `https://www.zippycarrental.in/sitemap.xml`
3. Check robots.txt at `https://www.zippycarrental.in/robots.txt`
4. Test locale routes: `/`, `/hi`, `/mr`
5. Verify security headers in browser dev tools
6. Submit sitemap to Google Search Console

### Authentication foundation

The Next.js application includes customer accounts and a separate `/admin/login` route. There is no
public administrator signup. The owner dashboard manages vehicles, prices, photos, pickup locations,
enquiries, policies, and activity through protected backend APIs. See
[backend/authentication-foundation.md](backend/authentication-foundation.md) for database migration,
Google OAuth setup, storage configuration, one-owner provisioning, recovery, and deployment steps.
For local owner provisioning in PowerShell, set `$env:OWNER_EMAIL = "owner@example.com"` before
running `pnpm --dir backend auth:provision-owner` from the repository root; `backend/.env` supplies
the other backend configuration values. Clear it afterward with `Remove-Item Env:OWNER_EMAIL`.

---

## 📂 Project Structure

**Frontend (`frontend/`):**
```
frontend/src/
├── app/[locale]/          # Localized routes
├── components/           # React components
├── data/                 # Fleet, FAQs, legal, site config
├── i18n/                 # Internationalisation
├── lib/                  # Utilities (routes, SEO, security)
├── messages/             # Translations (en, hi, mr)
└── types/                # TypeScript types
```

**Backend (`backend/`):** `src/` contains the Fastify API and auth services; `migrations/` contains
PostgreSQL migrations; `scripts/` contains the migration and protected owner provisioning/recovery
commands; `tests/` contains backend unit tests.

---

## 🔒 Security

**Score:** 8.5/10 (Strong)

**Features:** CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, no secrets in Git, dependency audit (no vulnerabilities).

**Limitations:** CSP `unsafe-inline` (required for SSG), no HSTS (requires CDN config).

---

## 📱 Social Media Previews

- **Open Graph Image:** Auto-generated branded image with Zippy logo and tagline (1200×630px)
- **Twitter Cards:** Optimized for rich link previews on Twitter/X
- **WhatsApp Preview:** Enhanced with Zippy logo for better link sharing
- All preview images use the canonical production URL (`https://www.zippycarrental.in/zippy_main_logo.png`)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file.

Copyright © 2026 [zippyproject75](https://github.com/zippyproject75)

---

<p align="center">
  Made with ❤️ in Pune, India
</p>
