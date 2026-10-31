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

**Features:** Responsive design, fleet catalogue, vehicle detail pages, interactive enquiry form with date picker, WhatsApp integration, FAQ, legal pages (Privacy Policy, Terms & Conditions, Cancellation & Refund Policy, Cookie Policy, Copyright), SEO metadata, XML sitemap, robots.txt, security headers, dark mode support, structured data (JSON-LD), social media preview images (Open Graph).

---

## 🛠 Tech Stack

- **Framework:** Next.js 16.4.2 (App Router)
- **UI:** React 19.3.1, Tailwind CSS 4.3.3, Motion 14.4.0
- **i18n:** next-intl 4.14.9
- **Validation:** Zod 4.6.7
- **Date Handling:** date-fns 4.4.0, react-day-picker 10.0.2
- **Icons:** lucide-react 1.60.0
- **Analytics:** Vercel Analytics 2.0.1
- **Testing:** Vitest 5.0.5, Playwright 1.64.1
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

**Additional Scripts:**
- `pnpm content:report` - Generate content report showing approved/pending status
- `pnpm launch:check` - Launch readiness content check

---

## 🔧 Environment Variables

Copy `production/.env.example` to `production/.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_ENV` | Yes | `development`, `preview`, or `production` |
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Canonical origin, e.g., `https://www.zippycarrental.in` |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` | No | Google Maps Embed API key (browser-restricted) |
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
cd production
pnpm test            # Unit tests (Vitest)
pnpm test:e2e        # End-to-end tests (Playwright)
pnpm typecheck       # TypeScript
pnpm lint            # ESLint
pnpm format:check    # Code formatting check
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
