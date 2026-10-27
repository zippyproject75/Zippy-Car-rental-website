<p align="center">
  <img src="public/zippy_main_logo.png" alt="Zippy Car Rental Logo" width="120" />
</p>

<h1 align="center">Zippy Car Rental — Pune</h1>

<p align="center">
  <strong>Self-drive car rental platform for Pune, Maharashtra</strong>
</p>

<p align="center">
  <a href="https://zippycarrental.in">🌐 Live Site</a> ·
  <a href="#-getting-started">🚀 Getting Started</a> ·
  <a href="#-tech-stack">🛠 Tech Stack</a> ·
  <a href="#-project-structure">📂 Project Structure</a>
</p>

---

## 📖 About

**Zippy Car Rental** is a modern, responsive web application that lets users browse and enquire about self-drive rental cars in Pune. The platform showcases a curated fleet of **five Maruti Suzuki vehicles** — Fronx, Brezza, Baleno, and two Ertigas — with an interactive enquiry flow and WhatsApp-based booking confirmation.

### ✨ Key Features

- 🚗 **Fleet Catalogue** — Browse all available vehicles with high-quality images, specs, and categories
- 📅 **Interactive Enquiry Form** — Select a vehicle, pick dates, and send a booking enquiry
- 💬 **WhatsApp Integration** — Direct confirmation via WhatsApp; no automatic charges
- 📱 **Fully Responsive** — Optimised for mobile, tablet, and desktop viewports
- 🌙 **Premium Dark Theme** — Sleek dark UI with gold (#D4B373) accent tones
- ⚡ **Blazing Fast** — Vite-powered dev experience with React 19 and Tailwind CSS v4
- 🔍 **SEO Ready** — Meta tags, Open Graph, favicon, and semantic HTML out of the box

---

## 🛠 Tech Stack

### Preview / Landing App (Root)

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19 | UI library |
| [Vite](https://vite.dev) | 8 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling |
| [TypeScript](https://www.typescriptlang.org) | 5.7 | Type safety |

### Production App (`/production`)

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | Full-stack React framework (App Router) |
| [React](https://react.dev) | 19 | UI library |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling |
| [TypeScript](https://www.typescriptlang.org) | 5.9 | Type safety |
| [Zod](https://zod.dev) | 4 | Runtime schema validation |
| [Lucide React](https://lucide.dev) | 1.60 | Icon library |
| [Motion](https://motion.dev) | 14 | Animations |
| [next-intl](https://next-intl.dev) | 4 | Internationalisation |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4 | Theme management |
| [date-fns](https://date-fns.org) | 4 | Date utilities |
| [react-day-picker](https://daypicker.dev) | 10 | Date picker component |

---

## 📂 Project Structure

```
Zippy-Car-rental-website/
├── public/                        # Static assets (served at root)
│   ├── zippy_main_logo.png        # Favicon & brand logo
│   └── images/
│       └── cars/                  # Fleet vehicle images
│           ├── fronx.jpeg
│           ├── brezza.jpeg
│           ├── baleno.jpeg
│           └── ertiga.jpeg
├── src/                           # Vite preview app source
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global styles + Tailwind v4 import
├── production/                    # Next.js production application
│   ├── src/
│   │   ├── app/                   # Next.js App Router pages
│   │   ├── components/            # Shared React components
│   │   ├── data/                  # Static data & constants
│   │   ├── features/              # Feature modules
│   │   ├── i18n/                  # Internationalisation config
│   │   ├── lib/                   # Utility libraries
│   │   ├── messages/              # i18n translation files
│   │   ├── services/              # API & service layers
│   │   └── types/                 # TypeScript type definitions
│   ├── public/                    # Next.js static assets
│   ├── tests/                     # E2E & unit tests
│   ├── scripts/                   # Build & content scripts
│   ├── next.config.ts             # Next.js configuration
│   ├── package.json               # Production dependencies
│   └── pnpm-lock.yaml             # Lockfile (pnpm)
├── index.html                     # Vite HTML shell
├── vite.config.ts                 # Vite configuration
├── package.json                   # Root dependencies
├── tsconfig.json                  # TypeScript configuration
├── LICENSE                        # MIT License
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 22
- **npm** (root app) or **pnpm** ≥ 10 (production app)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/zippyproject75/Zippy-Car-rental-website.git
cd Zippy-Car-rental-website
```

### 2. Install Dependencies

**Root (Vite preview app):**

```bash
npm install
```

**Production (Next.js app):**

```bash
cd production
pnpm install
```

### 3. Start Development Servers

**Vite preview app** (port 8443):

```bash
npm run dev
# → http://localhost:8443
```

**Next.js production app** (port 3000):

```bash
cd production
pnpm dev
# → http://localhost:3000
```

### 4. Build for Production

**Vite preview:**

```bash
npm run build        # Output: /dist
npm run preview      # Preview production build
```

**Next.js production:**

```bash
cd production
pnpm build           # Output: /production/.next
pnpm start           # Start production server
```

---

## 🧪 Testing & Quality

The production app includes a full testing and quality pipeline:

```bash
cd production

# Run unit tests
pnpm test

# Run end-to-end tests
pnpm test:e2e

# Lint
pnpm lint

# Type-check
pnpm typecheck

# Format check
pnpm format:check

# Run all checks (format → lint → typecheck → test → build)
pnpm check

# Generate content report
pnpm content:report

# Pre-launch verification
pnpm launch:check
```

---

## 🌐 Deployment

The production site is deployed at **[zippycarrental.in](https://zippycarrental.in)**.

### Environment Variables

Copy the example env file and fill in values:

```bash
cd production
cp .env.example .env.local
```

See [`.env.example`](production/.env.example) for all available environment variables.

---

## 🚗 Fleet

| Vehicle | Category | Seats | Transmission |
|---|---|---|---|
| Maruti Suzuki Fronx | Compact SUV | 5 | Manual / Automatic |
| Maruti Suzuki Brezza | Compact SUV | 5 | Manual / Automatic |
| Maruti Suzuki Baleno | Hatchback | 5 | Manual / Automatic |
| Maruti Suzuki Ertiga (Vehicle 1) | MPV | 7 | Manual / Automatic |
| Maruti Suzuki Ertiga (Vehicle 2) | MPV | 7 | Manual / Automatic |

> **Note:** Rental rates are available on request. All bookings are confirmed manually via WhatsApp — no automatic charges are applied.

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** your changes: `git commit -m "feat: add my feature"`
4. **Push** to the branch: `git push origin feature/my-feature`
5. **Open** a Pull Request

Please follow the existing code style and run `pnpm check` in the production directory before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Copyright © 2026 [zippyproject75](https://github.com/zippyproject75)

---

<p align="center">
  Made with ❤️ in Pune, India
</p>
