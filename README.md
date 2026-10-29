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

**Languages:** English (default), Hindi (`/hi`), Marathi (`/mr`)

**Features:** Responsive design, fleet catalogue, vehicle detail pages, interactive enquiry form, WhatsApp integration, FAQ, legal pages, SEO metadata, XML sitemap, robots.txt, security headers.

---

## 🛠 Tech Stack

- **Framework:** Next.js 16.4.2 (App Router)
- **UI:** React 19.3.1, Tailwind CSS 4.3.3
- **i18n:** next-intl 4.14.9
- **Validation:** Zod 4.6.7
- **Package Manager:** pnpm 10.34.3
- **Node.js:** ≥22

---

## 🚀 Getting Started

```bash
git clone https://github.com/zippyproject75/Zippy-Car-rental-website.git
cd Zippy-Car-rental-website
npm install && cd production && pnpm install
pnpm dev              # http://localhost:3000
pnpm build && pnpm start
```

---

## 🔧 Environment Variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_ENV` | Yes | `development`, `preview`, or `production` |
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Canonical origin, e.g., `https://www.zippycarrental.in` |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` | No | Google Maps Embed API key |
| `CSP_MODE` | No | `report-only` (default) or `enforce` |

**Locales:** English (unprefixed), Hindi (`/hi`), Marathi (`/mr`) | **Translation Files:** `production/src/messages/en.json`, `hi.json`, `mr.json`

---

## 🛣️ Key Routes

| Route | Description | Indexable |
|-------|-------------|-----------|
| `/` | Homepage | Yes |
| `/cars` | Fleet listing | Yes |
| `/cars/[slug]` | Vehicle detail | Yes (except ertiga-2) |
| `/book` | Enquiry form | No |
| `/contact` | Contact page | Yes |
| `/faq` | FAQ page | Yes |
| `/privacy-policy` | Privacy Policy | Yes (approved) |
| `/terms-and-conditions` | Terms & Conditions | Yes (approved) |

**Sitemap:** `/sitemap.xml` (30 URLs, 10 pages × 3 locales) | **Robots.txt:** `/robots.txt`

---

## 🧪 Testing & Quality

```bash
cd production
pnpm test            # All unit tests (50 tests)
pnpm typecheck       # TypeScript
pnpm lint            # ESLint
pnpm check           # All checks (format → lint → typecheck → test → build)
```

---

## 🚀 Deployment

### Vercel Configuration

Set environment variables:
- `NEXT_PUBLIC_SITE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://www.zippycarrental.in`
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY=your_key`
- `CSP_MODE=report-only`

### Post-Deployment Verification

1. Verify HTTPS at `https://www.zippycarrental.in`
2. Check sitemap at `https://www.zippycarrental.in/sitemap.xml`
3. Check robots.txt at `https://www.zippycarrental.in/robots.txt`
4. Test locale routes: `/`, `/hi`, `/mr`
5. Verify security headers in browser dev tools
6. Submit sitemap to Google Search Console

---

## 📂 Project Structure

```
production/src/
├── app/[locale]/          # Localized routes
├── components/           # React components
├── data/                 # Fleet, FAQs, legal, site config
├── i18n/                 # Internationalisation
├── lib/                  # Utilities (routes, SEO, security)
├── messages/             # Translations (en, hi, mr)
└── types/                # TypeScript types
```

---

## 🔒 Security

**Score:** 8.5/10 (Strong)

**Features:** CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, no secrets in Git, dependency audit (no vulnerabilities).

**Limitations:** CSP `unsafe-inline` (required for SSG), no HSTS (requires CDN config).

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file.

Copyright © 2026 [zippyproject75](https://github.com/zippyproject75)

---

<p align="center">
  Made with ❤️ in Pune, India
</p>
