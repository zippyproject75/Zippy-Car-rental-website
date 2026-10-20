# Zippy Car Rental — Planning V2: Final Implementation Plan

**Status:** PLAN ONLY — final approval candidate. This document is the single implementation plan for Zippy Car Rental. No website, prototype screen, source code, configuration, integration, redirect, deployment, or production account change is created by this plan. Implementation begins only after explicit owner approval.

**Planning rule:** this plan is decision-complete where a reversible technical decision is possible. Where only the owner can establish a business fact, the plan records a safe fallback and whether that input blocks design, implementation, or launch; it does not invent a fact or begin another planning cycle.

## Legend and evidence rules

- **[C] Confirmed** — explicit owner/brief requirement.
- **[R] Recommended** — technically or product-wise recommended implementation decision.
- **[A] Assumption / reversible default** — used only until an owner confirms the real fact.
- **[O] Owner input required** — a fact, asset, access, or approval that cannot safely be inferred.
- **[B] Production-launch blocker** — must be resolved before a production claim, feature, or launch depends on it.

The owner brief, supplied agreement summary, Planning v1, and supplied black/champagne reference board are authoritative in that order. The legacy Zippy site and competitor/reference sites are inspiration and redirect-research inputs only; their prices, policies, reviews, vehicles, photos, ratings, claims, and copy are not Zippy facts. Research is not restarted in this plan.

---

## 1. Executive summary and final release goals

### 1.1 Release goal [C]

Build a premium, mobile-first, responsive self-drive car-rental website for Zippy Car Rental in Pune, Maharashtra. It enables customers to:

1. discover **exactly five** actual vehicle records;
2. view only confirmed vehicle facts, rates, and policies;
3. select a branch and requested pickup/return dates and times in a website-native calendar;
4. receive an **estimated rental cost only when all applicable approved pricing data exists**;
5. open a requested branch in Google Maps;
6. open WhatsApp with a prefilled enquiry, then manually press Send;
7. use the full public experience in English, Hindi, or Marathi; and
8. choose carefully designed light or dark themes.

### 1.2 Release-1 truth boundary [C]

Release 1 is frontend-first. It is **not** a booking-management system, live availability service, payment platform, enquiry database, authentication system, customer dashboard, WhatsApp Business API integration, Google Calendar integration, Google Sheets integration, CMS, or backend API.

The site must never say or imply “Booked”, “Reserved”, “Confirmed”, “Available now”, “Instant booking”, or an equivalent claim merely because a visitor selected dates or opened WhatsApp. “Estimated rental cost” is never a quote, reservation, or confirmation; final price and availability are confirmed by Zippy.

### 1.3 Success criteria [C][R]

- A visitor can find one of the five cars, make a valid Pune/IST date-time enquiry, and reach a correctly encoded WhatsApp handoff in under roughly 60 seconds on a mid-range phone.
- Exactly five central records render: Fronx, Brezza, Baleno, Ertiga Vehicle 1, and Ertiga Vehicle 2. No price, spec, policy, rating, image, branch availability, or business claim is fabricated.
- English, Hindi, and Marathi are complete for every published customer-facing interface and approved content; changing locale preserves the equivalent route.
- Light and dark themes are complete, readable, persistent, and avoid an incorrect-theme flash.
- Google Maps Embed API maps load only when requested and always have working directions-link fallbacks.
- Public pages are static-first, SEO-aware, accessible to WCAG 2.2 AA, and measured rather than assumed for performance.
- The production build has passing typecheck, lint, format, unit, end-to-end, accessibility, and deployed smoke checks before launch.

---

## 2. Requirements, scope discrepancies, assumptions, and blockers

### 2.1 Confirmed product and design requirements [C]

| Area | Final requirement |
|---|---|
| Business | Zippy Car Rental; self-drive rental in Pune, Maharashtra, India. |
| Fleet | Exactly five separate units: Maruti Suzuki Fronx; Maruti Suzuki Brezza; Maruti Suzuki Baleno; Maruti Suzuki Ertiga — Vehicle 1; Maruti Suzuki Ertiga — Vehicle 2. |
| Themes | Fully designed light and dark themes. |
| Languages | English default plus Hindi and Marathi, across the complete published site. |
| Design direction | Premium automotive / urban luxury: deep black, graphite, champagne gold, warm white, warm grey; cinematic automotive hierarchy; restrained, refined surfaces. |
| Enquiry | Website-native date/time calendar, duration calculator, conditional cost calculator, WhatsApp click-to-chat, phone/email fallbacks. |
| Maps | Google Maps Embed API plus directions links. |
| Production stack | Next.js App Router, React, strict TypeScript, Tailwind CSS v4, Lucide React, Motion, React DayPicker, date-fns/timezone utilities, Zod, Vitest, Playwright, axe, ESLint, one formatter, GitHub, Vercel. |
| Prototype boundary | This Figma Make workspace remains React 19 + Vite 8 + Tailwind v4 + Oxfmt. The production Next.js app is created separately in Antigravity/VS Code. |

### 2.2 Contract discrepancies requiring written acknowledgement [O][B]

The owner’s intended functionality is clear, but the supplied written Phase 1 agreement has three different descriptions. This plan follows the owner’s current product direction without falsely asserting that the contract has already been amended.

| Written agreement | Current owner direction / planned implementation | Required acknowledgement |
|---|---|---|
| Google Calendar API in Phase 1 | **Do not implement it.** Build a website-native rental calendar, duration calculator, and conditional estimate only. There are no Google Calendar events, vehicle calendars, or availability feeds. | Written scope clarification/amendment before treating the substitution as contractually settled. |
| Spreadsheet-based analytics/information in Phase 1 | **Do not implement or schedule Google Sheets** in Release 1 or assume it for Phase 2. | Written acknowledgement that the documented Phase-1 item is intentionally excluded. |
| WhatsApp API in Phase 2 | Release 1 has only a browser `wa.me` click-to-chat link with prefilled text. It is not the Business API, automation, storage, webhook, or message-sending integration. | Record that this simple frontend link is distinct from the contracted Phase-2 API work. |

### 2.3 Reversible defaults [A]

| Default | Rationale and safe behaviour |
|---|---|
| Timezone `Asia/Kolkata` | One Pune business; all date conversion, display, validation, and tests use it explicitly. |
| Time slots | 30-minute intervals, 00:00–23:30, until approved hours/lead time restrict them. |
| Booking window | Configurable `maxAdvanceDays: 180`, `minLeadMinutes: 0`, and no minimum duration until approved; no restriction is presented as business policy. |
| Default locale | English at unprefixed paths; Hindi `/hi/...`; Marathi `/mr/...`. |
| Theme initial state | Use system preference until the visitor explicitly chooses a theme; persist only the explicit choice. |
| Rate state | No approved rate or rule means **“Price on request”**, never zero, “from”, or an estimate. |
| Images | CSS-based premium placeholders, not stock or AI vehicle photos, until owner-supplied Zippy photos arrive. |
| Ertiga indexing | Vehicle 2 is `noindex,follow` and omitted from sitemap until it has owner-approved distinguishing detail and unique factual copy. |

### 2.4 Owner facts that must not be invented [O]

Production domain; legal entity and GST details if displayed; final logo/brand assets; WhatsApp, phone, email, grievance contact; branch confirmation, hours, and any branch phone; vehicle variants, colours, years, seats, fuel, transmission, mileage, rental restrictions, and photos; rates, taxes, deposits, kilometre rules, fuel, tolls, fines, insurance/damage, eligibility, documents, payment, cancellation/refund terms; verified About/FAQ copy; translation and legal-copy approvals; Vercel/GitHub/Google Cloud ownership; Maps key and allowed origins.

---

## 3. Final Phase 1 and Phase 2 boundaries

### 3.1 Phase 1 — included [C]

- Responsive public frontend; premium design; mobile/tablet/desktop support.
- English, Hindi, Marathi; light and dark themes.
- Exactly five central vehicle records; designed placeholders pending real photos.
- Public Home, Cars, five car details, shared `/book` enquiry, About, Contact, FAQ, legal routes, and custom 404.
- Website-native date/time selection in IST; elapsed-duration calculation; estimate only where approved pricing configuration permits it.
- Google Maps Embed API integration with click-to-load embeds and direct directions fallback.
- WhatsApp click-to-chat plus call/email/copy fallback.
- Basic on-page SEO plus the technical SEO, semantic, sitemap, metadata, and validation practices in this plan.
- Static content architecture, tests, frontend deployment, domain setup for the contract’s 12-month provision, handover, and approved revision process.

### 3.2 Phase 1 — explicitly excluded [C]

No Supabase/database, backend booking APIs, actual vehicle availability, hold/reservation/confirmation storage, payment, customer account/login/Google Auth, WhatsApp Business API, Google Sheets, Google Calendar API, Cloudinary, admin panel, analytics tracker by default, or unapproved offers/services.

### 3.3 Phase 2 — separate approval only [C][R]

The contractual Phase 2 scope may include backend development, booking business logic, Supabase PostgreSQL, agreed backend hosting, Cloudinary, frontend/backend integration, WhatsApp API, Google login, backend deployment, and the agreed booking functionality. Its 30-calendar-day timeline starts only at the mutually established official Phase-2 start.

Phase 1 prepares extension points only: typed enquiry service, isolated pricing/duration functions, central content data, server-only folder boundary, and no fake endpoint. A Phase-2 project must separately define data ownership, availability source, conflict/hold rules, rate locking, authentication, payments, retention, access control, audit records, rate limits, and failure behaviour.

---

## 4. Final sitemap, URL, locale, and redirect strategy

### 4.1 URL policy [R]

Use lowercase, hyphenated paths with **no trailing slash**. `www` or apex is selected after the owner confirms the production domain; the noncanonical hostname permanently redirects in one hop. Personal enquiry data is never included in URL parameters. `/book?car=<approved-slug>` may preselect a vehicle but contains no personal information.

### 4.2 Public route matrix [C][R]

`localePrefix: "as-needed"` keeps English at the listed route and maps every equivalent Hindi/Marathi route by prepending `/hi` or `/mr`. For example, `/cars/brezza`, `/hi/cars/brezza`, and `/mr/cars/brezza`.

| English route | Purpose | Index / sitemap |
|---|---|---|
| `/` | Home | Index when production domain/content gate passes |
| `/cars` | Five-car fleet catalogue | Index |
| `/cars/fronx` | Fronx detail | Index |
| `/cars/brezza` | Brezza detail | Index |
| `/cars/baleno` | Baleno detail | Index |
| `/cars/ertiga-1` | Ertiga Vehicle 1 detail | Index |
| `/cars/ertiga-2` | Ertiga Vehicle 2 detail | `noindex,follow`, excluded until differentiated |
| `/book` | Shared request/calculator page | `noindex,follow`, excluded |
| `/about` | Verified company information | Index only after approved substantive content |
| `/contact` | Contacts, branches, maps | Index after contact/address confirmation |
| `/faq` | Approved FAQs | Index |
| `/terms-and-conditions` | Approved terms | Index only after approval |
| `/privacy-policy` | Approved privacy policy | Index only after approval |
| `/cookie-policy` | Accurate cookie policy | Index only after approval |
| `/cancellation-and-refund-policy` | Approved policy | Published, footer-linked, indexed only after approval; otherwise unavailable/noindexed rather than fabricated |
| unmatched route | Custom not-found | True 404; excluded |

There is one canonical route per car and one shared `/book` route. All pages must be available in all locales when published, including legal pages after approved translations.

### 4.3 Legacy assessment [O][R]

Before launch, inspect actual legacy routes, Google Search Console, backlinks, and whether the old Lovable host or a former custom domain can control redirects. New-domain redirects cannot redirect `zippycarrental-selfdrivecars.lovable.app` without control of that host.

| Legacy path | Intended result after verification |
|---|---|
| `/booking/fronx`, `/booking/brezza` | 308 to equivalent current model if the legacy model is verified. |
| `/booking/city` | Verify whether it was Baleno. Redirect to Baleno only if verified; otherwise 404. |
| `/booking/i20`, `/booking/swift`, `/booking/xl6` | Helpful 404; never redirect to an unrelated active car. A `/cars` redirect needs evidence of valuable traffic/backlinks and owner approval. |
| other legacy `/booking/*` | 404 unless a verified equivalent exists. |

Use Next.js redirects for controllable new-domain paths, test status/destination, avoid chains, and point all internal links at final routes.

---

## 5. Design system and responsive experience

### 5.1 Visual language [C][R]

The supplied board establishes premium black-and-champagne-gold automotive design, not the Planning-v1 lime scheme. Use cinematic media treatment, compact premium navigation, deliberate hierarchy, large vehicle media areas, calm warm content surfaces, thin borders, and restrained depth. Do not copy its XL6/Ciaz, offers, reviews, fake statistics, login/booking-dashboard/payment states, chauffeur/airport/outstation claims, or unverified prices.

Avoid generic template effects: no decorative blobs, persistent glassmorphism, oversized pills, unnecessary gradients, noisy shadows, autoplay carousels, or motion without purpose.

### 5.2 Semantic design tokens [R]

| Token role | Dark theme | Light theme | Use / contrast rule |
|---|---|---|---|
| `surface-canvas` | deep black | warm white | page background |
| `surface-raised` | graphite | warm off-white | cards, dialogs |
| `surface-muted` | charcoal | soft warm grey | quiet sections/placeholders |
| `text-primary` | warm white | charcoal | body/headings |
| `text-secondary` | warm grey | slate-charcoal | supporting copy |
| `border-subtle` | graphite-grey | warm-grey | structural boundaries |
| `accent-gold` | champagne gold | deeper gold/charcoal pairing | fills, large emphasis, outline/focus accents |
| `on-accent` | near-black | warm white/near-black as tested | button text |
| `danger`, `success`, `warning` | paired semantic variants | paired semantic variants | never colour alone |

Exact values are selected with WCAG contrast testing. Champagne gold is not used as small text on warm white when it fails contrast; a dark text/outline alternative is used. Tokens, not literal colours, drive all components.

### 5.3 Typography [R]

Use `Manrope` for English display/UI headings, `Inter` for Latin body/UI, and `Noto Sans Devanagari` for Hindi/Marathi UI and content through the supported Next.js font system in production. Use tabular numerals for prices, dates, times, and specifications. The localized type token must avoid a Latin-only fallback for Devanagari. Suggested scale: H1 36→64px, H2 28→42px, H3 20→26px, body 16→18px, labels 14–16px; all final values are contrast, overflow, and device tested.

### 5.4 Components and states [R]

Header/navigation; language and theme controls; buttons; form fields/selects; calendar dialog; vehicle cards/media/placeholders; spec list; price/estimate block; branch/map cards; accordion; breadcrumbs; mobile sticky action bar; legal template; dialog; inline validation/status; footer; 404. Each component specifies default, hover, focus-visible, active, disabled, error, loading, empty, and both-theme states where applicable.

### 5.5 Layout and media [R]

Mobile-first breakpoints: base/`sm` 640/`md` 768/`lg` 1024/`xl` 1280; max content width about 1200px; 20/24/32px responsive gutters. Verify at 320, 360, 390, 768, 1024, 1280, 1440px and 200% zoom.

- Car cards and vehicle placeholder media use one fixed **3:2** ratio.
- Detail hero media uses a deliberate responsive 4:5 mobile / 16:9 desktop container.
- Placeholder panels are CSS-only graphite/warm-grey panels with subtle technical linework, model name, and “Photo coming soon”; no stock, AI, or pretend-Zippy car imagery.
- When real photos arrive, data supplies source, dimensions, meaningful alt text, and crop guidance; a missing source always renders the placeholder instead of a broken image.

### 5.6 Theme and menu behaviour [C][R]

Use one proven Next-compatible theme solution (recommended: `next-themes` configured with an attribute on `<html>`). Respect system preference when no stored choice exists, persist an explicit choice, apply it before paint, and suppress only the documented hydration mismatch boundary rather than hiding the app. The current theme is maintained across routes/locales.

Desktop exposes compact navigation, locale selector, theme selector, and enquiry CTA. Mobile uses an accessible dialog/sheet: 44px+ targets, labelled trigger, focus moves into it, Escape closes, focus returns to trigger, body scroll is managed, and language/theme/contact/enquiry actions are available.

---

## 6. Page, interaction, and customer-journey specification

### 6.1 Home [C][R]

Order: premium header; cinematic hero with approved copy/placeholder; visible native booking-calculator entry; verified service proposition; exactly five-car discovery grid; “How enquiry works”; verified Zippy facts; branch cards/maps; approved FAQ preview; enquiry CTA; complete footer. A sticky mobile action bar appears after hero exit and is hidden while a modal calendar is open.

The hero must not assert an unconfirmed benefit. Until approved, use a restrained factual proposition such as “Self-drive car rental in Pune” rather than legacy claims.

### 6.2 Cars catalogue [C]

Render precisely five cards in a 1/2/3 column responsive grid. No filters or price sort for five units; they add no useful decision support and prices may be pending. Each card contains name, Ertiga unit label where applicable, 3:2 placeholder/photo, confirmed specs only, confirmed rate or “Price on request”, “View details”, and “Enquire”.

### 6.3 Individual car pages [C]

Breadcrumb; H1; model-specific factual introduction; large placeholder/gallery; confirmed specs; approved price/estimate entry; enquiry panel preselecting that unit; approved policy links; four related vehicles. A car page never implies car-to-branch allocation. The two Ertiga pages retain separate IDs/slugs and show only confirmed distinguishing details; otherwise Vehicle 2 remains noindex and copy avoids fake differentiation.

### 6.4 Shared booking/enquiry page [C]

`/book` is the universal CTA target. It supports optional valid `?car=<slug>` preselection, ignores invalid slug values safely, uses no personal URL parameters, and states what happens next: Zippy receives the WhatsApp message only after the visitor presses Send and manually confirms availability/final price.

### 6.5 About, Contact, FAQ, legal, and 404 [C][R]

- **About:** verified factual company story only; noindex while only a minimal placeholder is available.
- **Contact:** visible confirmed call/email/WhatsApp details, three confirmed branch cards, branch map affordance and directions link, no invented business hours.
- **FAQ:** approved answers only, grouped by topic. Safe initial answers explain enquiry versus confirmation, contact methods, and confirmed pickup branches.
- **Legal:** common structured `LegalPage` layout with title, effective date, version, owner/legal approval state, table of contents, sections, and policy contact.
- **404:** true 404 status with Home, current fleet, and Contact paths; removed models are described neutrally as no longer in the current fleet.

### 6.6 Required journeys [C][R]

1. Home → choose car → select dates/times → conditional estimate or “Price on request” → WhatsApp enquiry.
2. Search landing page → car facts → preselected request → WhatsApp.
3. Home/Contact → selected branch map → directions.
4. Locale switch → equivalent localized route, equivalent car/form context where valid.
5. Theme switch → same route/content, persistent selection.
6. Direct entry → every public route works at correct locale and status.
7. Removed legacy listing → useful true 404, not misleading vehicle substitution.
8. WhatsApp not opened/blocked → copyable message, telephone and email alternatives.

---

## 7. Five-car data model and content governance

### 7.1 Authoritative records [C]

`data/cars.ts` is the only source for the five records:

1. `fronx` — Maruti Suzuki Fronx
2. `brezza` — Maruti Suzuki Brezza
3. `baleno` — Maruti Suzuki Baleno
4. `ertiga-1` — Maruti Suzuki Ertiga, Vehicle 1
5. `ertiga-2` — Maruti Suzuki Ertiga, Vehicle 2

Unique ID and slug tests prevent a sixth record, duplicate slug, missing unit, or accidental model replacement. **[O]** Confirm whether “Brezza” is the exact owner-approved naming or whether the physical car is an older “Vitara Brezza”; route slug remains `/cars/brezza` for clarity.

### 7.2 Content-state model [R]

Every business-facing field has `confirmed`, `pending`, or `not-applicable` state with source/approval metadata. A public renderer emits a field only when confirmed and nonempty. A pending price renders the specific fallback “Price on request”; pending specs do not render blank rows; pending images render the intentional placeholder. Contact/branch data may be reviewed in preview but is launch-gated before production.

Central data modules own car content, site identity/contact/branches, booking/pricing configuration, FAQs, legal documents, navigation, metadata, and translations. UI components never hard-code a rate, phone, address, spec, policy, or location.

### 7.3 Car/pricing image model [R]

Each record includes immutable ID/slug, make/model/display name, optional Ertiga unit label, distinguishing-detail status, confirmation-gated specs, image assets, approved price configuration reference, FAQ tags, sort order, localized SEO copy/status, and indexing state. Image assets contain source, width, height, alt text, and usage/crop intent. All rates live in one central pricing configuration, not in card/page strings.

### 7.4 Content validation and release gate [R]

Zod validates content schemas. A build/CI content report lists pending owner fields, unapproved translation/legal records, missing alt/dimensions, duplicate/invalid slugs, and public content missing required localized copies. In launch mode, CI fails for launch-required contacts, branches, production domain, privacy/terms, required translated published content, and maps configuration if maps are enabled. It does **not** require pricing or photos because honest fallbacks exist.

---

## 8. Native rental calendar, duration, and conditional price calculator

### 8.1 Interface and data minimisation [C]

The native calendar is independent of Google Calendar. Fields:

| Field | Requirement |
|---|---|
| Car | Optional at Home/`/book`: “Any available car”; locked/preselected from a vehicle page but changeable through an explicit link. |
| Pickup branch | Required, from confirmed branch configuration. |
| Pickup date/time | Required. |
| Return date/time | Required. |
| Name | Optional; included only in handoff message. |
| Enquiry note | Optional, maximum 300 characters. |

Do not collect licence, ID, payment, phone, or unnecessary personal data. “Any available car” is a request preference, never a real availability result.

### 8.2 Date/time contract [R]

Use React DayPicker plus date-fns and a supported timezone-aware utility. All user input is interpreted as an `Asia/Kolkata` local date/time, converted to an instant with explicit timezone information, and formatted back in IST for display/message. Do not subtract calendar dates or rely on a visitor device’s timezone.

`validateRequest(input, nowInIST, rules)` rejects invalid/parsing-failed values, pickup before minimum lead time, pickup beyond configured advance window, blocked owner-approved hours/days, and `returnAt <= pickupAt`. The rules object is configurable, so later business policy does not require component rewrites.

`calculateElapsedMinutes(pickupAt, returnAt)` returns the positive elapsed instant difference in whole minutes. Tests cover same-day, overnight, month/year boundaries, DST in a non-IST device locale, and local-device timezone differences. DayPicker disabled dates mean “not selectable by current request rules,” never vehicle availability.

### 8.3 Pricing contract [R]

Use one pure, unit-tested function:

`calculateEstimate({ carId, pickupAt, returnAt }, pricingConfig) → { kind: 'estimate', amountInr, billableUnits, breakdown, disclaimer } | { kind: 'price-on-request', reason } | { kind: 'invalid', errors }`.

The function returns an estimate only when the selected car (not “Any available car”), approved rate model, active rate, approved rounding/minimum rules, and every applicable approved surcharge/tax rule exist. Otherwise it returns `price-on-request`; it never guesses taxes, deposits, kilometres, fuel, late fee, or a rate from legacy content.

Supported configurable models, enabled only after owner approval:

| Approved model | Required configuration | Deterministic calculation |
|---|---|---|
| Hourly | amount, billable interval, rounding (`ceil`/approved alternative), minimum | calculate elapsed minutes; apply approved billable interval/rounding; multiply by hourly units. |
| 24-hour daily | amount, daily-unit rule, rounding, minimum | calculate elapsed minutes; determine daily units by the explicitly approved rule (for example `ceil(duration / 1440)`); multiply. |
| Mixed/extended | ordered approved rate tiers and transition rule | apply only the supplied deterministic rule, such as approved full-day units plus approved rounded residual hours. Do not silently choose the cheaper of two models. |

Every visible result says **“Estimated rental cost”** and “Final price and vehicle availability must be confirmed by Zippy.” If owner pricing remains absent, the calculator validates dates/duration then shows “Price on request — Zippy will confirm the applicable price.”

### 8.4 Calendar interaction and accessibility [R]

Mobile opens a full-screen date dialog; desktop uses a bounded dialog/popup with two-month view where space permits. Native/selectable time controls are reliable on mobile. The flow supports keyboard calendar navigation, labelled current selections, focus management, Escape close, text errors, and reduced motion. Calendar/Motion code is dynamically loaded only when needed.

### 8.5 Enquiry handoff [C]

The client validates locally, builds the message through a typed enquiry service adapter, and opens `https://wa.me/<confirmed-E164-digits>?text=<encoded-message>`. Message boundary:

```text
Hi Zippy Car Rental, I’d like to check availability (enquiry only; not a confirmed booking).
Car: <selected car or Any available car>
Pickup branch: <branch>
Pickup: <IST formatted date/time>
Return: <IST formatted date/time>
Estimated rental cost: <only if calculated>
Name: <optional>
Note: <optional>
```

The UI explicitly says WhatsApp opens with a prefilled message and the customer must press Send. After a handoff attempt it shows a copyable message, call/email links, edit option, and “Zippy will confirm availability and final price.” A blocked/new-window failure never loses entered data and is not reported as successful sending.

---

## 9. Google Maps and external integration boundary

### 9.1 Branch configuration [O]

The design supports the following three previously identified branches, pending owner reconfirmation before launch:

| Branch | Proposed address for verification |
|---|---|
| Kondhwa | Khadi Machine Chowk, Kondhwa Saswad Road, Pune 411048 |
| Gangadham | Gangadham Chowk, Beside Solitaire Premier, Ganga Dham Road, Phase 1, Pune 411037 |
| Undri | Opposite Euro School, Undri Marg, Near My Toy Trolly, Undri 411060 |

No coordinates, opening hours, phone allocations, or vehicle allocation are inferred.

### 9.2 Google Maps Embed API [C][R]

Each branch card has “View map” and “Get directions.” “Get directions” always uses a Google Maps search/directions URL built from the full confirmed address. “View map” is a click-to-load facade; only after visitor action does it create an Embed API iframe for that branch. It has loading, unavailable, and retry/directions states.

Implementation prerequisites: Google Cloud project under agreed ownership; billing enabled; Maps Embed API enabled; browser-visible key held in environment configuration but treated as sensitive configuration; HTTP referrer restrictions for production domain and approved preview origins only; API restriction to Maps Embed API; documented cost owner/quota alert; and real-domain test. The key must never be called a secret merely because it is an environment variable.

The Content Security Policy is trialled report-only, then permits only the exact Google maps frame/image/connect origins proven necessary. Maps are tested on production and protected preview after domain/credential configuration. The Privacy and Cookie policies describe the actual Google iframe behavior and third-party data/cookie implications; direct directions links and embeds are not described as Zippy-collected data.

### 9.3 Other integrations [C]

| Integration | Release-1 decision |
|---|---|
| WhatsApp | Browser click-to-chat only, after customer action; no API, automation, webhook, or send receipt. |
| Phone/email | `tel:`/`mailto:` fallbacks, from approved central data. |
| Google Calendar | Excluded; calendar UI has no Google event/availability connection. |
| Google Sheets | Excluded; no logging, analytics spreadsheet, or future scheduled task in this plan. |
| Payment/auth/analytics | Excluded by default. Any future tracker undergoes privacy/cookie/CSP review first. |

---

## 10. Multilingual architecture

### 10.1 Locale implementation [C][R]

Use `next-intl` or an equally mature App Router solution selected at scaffold time; recommended choice is `next-intl` because it supports locale-aware routing, messages, formatting, and metadata. Locale configuration is one source of truth: `en`, `hi`, `mr`; default `en`; prefix mode `as-needed`.

Middleware/routing normalizes known locale paths, prevents invalid locale paths, maintains locale in links, and allows direct entry to localized routes. Switcher maps to the same semantic route and valid car slug; it does not reset the visitor to Home. User-entered booking values remain only in client form state for the active page and are not put into locale URLs.

### 10.2 Translation content and formatting [C]

Central message/catalogue files cover navigation, CTAs, headings, labels, validation, status/error/loading text, calculator copy, map labels, FAQs, footer, and every published legal document. Business IDs, vehicle IDs/names, prices, dates, contacts, and addresses remain structured facts; locale messages provide surrounding grammar/copy. Hindi and Marathi legal translations require owner/legal review to preserve meaning.

Use locale-aware date, number, and INR formatting while preserving IST. Test Devanagari font load, long strings, layout wrapping, mobile menu, calendar labels, form error text, tabs/accordion state, and no missing critical messages. A locale is not “complete” if only its header changes.

### 10.3 Localized SEO [R]

Each indexable equivalent page has locale-specific title/description and canonical self-reference, plus `hreflang` alternates for `en-IN`, `hi-IN`, `mr-IN`, and `x-default` where appropriate. The sitemap includes only currently indexable localized routes. Vehicle IDs/slug paths remain stable across locales unless an approved localization strategy requires otherwise.

---

## 11. Legal, privacy, cookies, and policy approval

### 11.1 Legal content model [R]

`LegalDocument` has slug, locale, title, version, effective/last-updated date, `draft | owner-reviewed | approved` status, sections/order, source/approval record, and index/footer visibility. The shared legal template is designed now; it is not legal advice and does not convert draft outline text into a final policy.

### 11.2 Policy requirements [C][O]

- **Privacy:** accurately describe the absence of independent Release-1 enquiry storage; user-initiated WhatsApp message content; Google Maps/direct-link behavior; actual host/server logs; actual cookie/analytics technologies; retention and privacy request/grievance contact when confirmed.
- **Terms:** reflect verified self-drive practice only: enquiry versus confirmation, eligibility, payment/deposit, rates, pickup/return, fuel/mileage/tolls/fines, damage/insurance, prohibited use, cancellation, and jurisdiction only after owner/legal confirmation.
- **Cookie:** state only deployed technologies. Do not add a cosmetic banner. Assess consent when optional analytics or third-party map iframe behavior requires it.
- **Cancellation/refund:** designed as a dedicated template, but do not publish invented windows, charges, promises, or refund timelines. If it must be visible at launch, approved complete wording is a blocker; otherwise do not show a misleading footer link/page.

No backend acceptance records exist in Release 1. The site does not state that terms acceptance, consent, enquiry, or policy-version acceptance is stored. Future checkout may add versioned acceptance records only with server-side implementation and a separately approved data/privacy design.

---

## 12. SEO strategy and validation workflow

### 12.1 Metadata and semantic implementation [R]

Use Next.js Metadata API through one `buildMetadata` helper. It consumes approved site URL/configuration and page/locale content to generate unique title, description, canonical, Open Graph, Twitter/social data, robots directive, and alternates. Never invent the production domain; production build/launch checks fail without it.

Use semantic landmarks, one H1, meaningful internal links, language attributes, accurate alt text, server-rendered primary content, `sitemap.ts`, `robots.ts`, correct 404s, and only data-supported structured data. Possible JSON-LD: Organization/AutoRental only after verified contact/address facts; BreadcrumbList on detail/legal pages. Do not add reviews, ratings, prices, opening hours, coordinates, `Offer`, `Product`, or business claims without verified visible support.

### 12.2 Indexing and previews [R]

Production robots/sitemap permit only approved indexable pages. Non-production should be protected by Vercel deployment protection where possible and also emit `noindex`; verify actual HTTP response/meta behavior. Do not depend on `robots.txt Disallow` alone, because crawlers may not see an in-page `noindex` directive when blocked from crawling. Check preview deployment headers/body rather than assume Vercel defaults.

### 12.3 SEO workflow [R]

At each public page change: verify title/description uniqueness, canonical/indexing, localized alternates, rendered main content, heading/landmark hierarchy, final internal links, image attributes, and JSON-LD. At page, hardening, and launch milestones: crawl preview/production for response/status/link/canonical/redirect issues; run Lighthouse SEO; validate schema; log accumulated findings in one SEO issue register; submit verified production sitemap to Search Console. No ranking or traffic outcome is promised.

---

## 13. Production architecture and technical stack

### 13.1 Stack [C][R]

| Concern | Final production choice / justification |
|---|---|
| Framework | Supported current stable Next.js App Router at implementation time; static public routes, Metadata API, image optimization, route handlers only when later approved. |
| UI/runtime | React version paired to Next.js; Server Components by default; client islands only for interactions. |
| Language | TypeScript `strict: true`. |
| CSS | Tailwind CSS v4 with semantic tokens; no component library unless a concrete new need is approved. |
| Icons/motion | `lucide-react`; `motion/react` only for selected interactions, code-split and reduced-motion aware. |
| Dates | React DayPicker, date-fns, supported timezone utility; `Asia/Kolkata` contract. |
| Validation | Zod for content, environment, and enquiry inputs. |
| Tests | Vitest; Playwright; `@axe-core/playwright`; manual assistive-technology checks. |
| Quality tooling | ESLint and **Oxfmt** as the single formatter, matching the Figma workspace's established lightweight formatter; no Prettier duplication. |
| Source/deploy | GitHub and Vercel. |

No Redux, form/state library, CMS, database, backend framework, or UI kit is needed for five static records and a local calculator. Production dependencies use compatible supported versions at installation time rather than projected version numbers.

### 13.2 Production folder boundary [R]

```text
src/
  app/
    [locale]/
      layout.tsx  page.tsx  not-found.tsx
      cars/page.tsx  cars/[slug]/page.tsx
      book/page.tsx  about/page.tsx  contact/page.tsx  faq/page.tsx
      terms-and-conditions/page.tsx  privacy-policy/page.tsx
      cookie-policy/page.tsx  cancellation-and-refund-policy/page.tsx
    sitemap.ts  robots.ts  globals.css
  components/
    layout/  ui/  sections/
  features/
    cars/  booking/  maps/  localization/
  data/
    cars.ts  pricing.ts  site.ts  faqs.ts  legal/  navigation.ts
  messages/
    en/  hi/  mr/
  services/
    enquiry/                 # interface + Release-1 WhatsApp adapter
  lib/
    dates.ts  pricing.ts  formatting.ts  seo.ts  jsonld.ts  env.ts
  types/
    car.ts  site.ts  content.ts  booking.ts
  server/                     # reserved, server-only future integrations
tests/
  unit/  e2e/  fixtures/
scripts/
  content-report.ts
```

Exact placement follows chosen locale-library conventions, but data/UI/domain/services/utilities stay separate. `data/` is the authoritative source for business facts. `services/enquiry` prevents UI components from constructing external URLs. Future server files import `server-only`; private credentials never enter client components.

---

## 14. Caching, performance, image, and animation plan

### 14.1 Caching [R]

| Content type | Strategy |
|---|---|
| Public marketing, car, FAQ, approved legal pages | Static rendering/CDN output; updated by deploy while content is Git-managed. |
| `/book` | Static shell; client-only valid car preselection; no personal data in URL/cache. |
| Versioned static assets | Long-lived immutable cache. |
| Public images | Next image optimization/responsive modern formats; version filename when replacing photo. |
| Client calculator | Local computation against static approved configuration; no private response. |
| Future enquiry/booking/identity | `private, no-store` unless separately reviewed; never shared/CDN-cache personal data. |

### 14.2 Performance and image budgets [R]

Use CSS placeholders until actual photos exist. After photography: `next/image`, explicit dimensions/aspect ratios, correct `sizes`, responsive formats, lazy below fold, and only the actual above-fold hero image prioritized. Dynamically import DayPicker, map iframe, and Motion features when interaction requires them.

Targets are measured on preview/prod rather than promised: Core Web Vitals aim for LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at p75 once field data exists; Home initial JS budget about ≤120KB gzip excluding framework/runtime measured from actual build; no map iframe or third party on initial load until click. Lighthouse mobile runs cover Home, Cars, one car page, Contact, every theme/locale-risk template; results go in performance log.

### 14.3 Motion [R]

Motion may support brief hero entrance, menu/dialog transitions, card hover/focus feedback, form feedback, and sticky-action transitions. Use opacity/transform only, short durations, no parallax/autoplay/repeated scroll reveals, and `prefers-reduced-motion` alternatives with no meaningful information lost.

---

## 15. Accessibility standards

Target WCAG 2.2 AA in each theme and all three languages. Requirements: skip link; semantic header/nav/main/footer; visible focus; 44×44px practical minimum targets; labels/hints/errors; error summary/live feedback; non-colour status; keyboard-complete forms/menu/dialog/calendar; focus trap only for modal dialog and return on close; Escape close; 320px/200% zoom support; no horizontal overflow; correct locale/language attributes; meaningful media alt text; and text alternatives for icons.

Automated axe is necessary but insufficient. Manually test the enquiry/calculator/map fallback with keyboard and screen readers (VoiceOver/iOS plus TalkBack or NVDA), mobile browsers, both themes, all locales, and reduced motion. Date controls must communicate requested selection rather than availability.

---

## 16. Security, deployment, and handover

### 16.1 Security [R]

Validate environment at build/deploy; keep `.env*` out of Git; enable repository secret scanning; never expose service-account/private keys. A browser Maps key uses `NEXT_PUBLIC_` only because the embed requires it, with strict referrer/API restrictions. External new-window links use safe `rel` values.

Configure and verify HTTPS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, anti-framing, and a CSP built from actual dependencies. Trial CSP report-only on preview, inspect violations, then enforce. Maps origins are allowed only when the confirmed embed needs them. Verify deployed headers, not assumptions.

### 16.2 Deployment [C][R]

GitHub PR → protected Vercel preview → `main` production flow. Preview protection/noindex is verified. Before launch: configure chosen production hostname, DNS/HTTPS, canonical redirects, environment values, Google Maps restrictions, deployment account access, and domain ownership/12-month provision responsibility. Required quality gates: typecheck, ESLint, Oxfmt check, Vitest, Playwright/axe smoke, production build, and deployed smoke tests.

### 16.3 Handover and contract operations [C]

Document owner/admin access for GitHub, Vercel, domain registrar, Google Cloud/Maps, Search Console, and approved business-content source. Deliver environment-variable ownership (never secret values in documentation), deployment rollback process, content-update process, policy/version register, known limitations, and support contact. Honor four initial frontend revision rounds and 12 months of applicable maintenance according to the written agreement; changes beyond its stated minor-change allowance are separately scoped.

---

## 17. Implementation phases and dependencies

| Phase | Work after approval | Main dependencies / exit |
|---|---|---|
| 0. Confirm/collect | Record owner inputs, contract acknowledgements, content/asset approvals, account/domain access. | Safe defaults documented; blockers tracked without delaying placeholder-capable design. |
| 1. Figma design validation | Design tokens/components and key desktop/mobile screens/states: Home, fleet, details, calculator, Contact/maps, FAQ/legal, 404, menu, light/dark, EN/HI/MR samples. | Owner visual sign-off; contrast/overflow review. Prototype remains Vite. |
| 2. Production scaffold | Separate Next.js app, locale/theme foundation, Tailwind tokens, quality tooling, CI, protected preview. | Production/prototype separation preserved; preview noindex verified. |
| 3. Content/data layer | Five records, site/branch/pricing/legal/messages, schemas, content report. | Exactly-five/locale/status tests pass. |
| 4. Shell and pages | Layout primitives, public templates, placeholders, metadata, maps facade, routes/404. | Direct route, responsive, semantic, placeholder, basic SEO checks pass. |
| 5. Calendar/enquiry | IST calendar, validation, duration/pricing pure functions, WhatsApp adapter/fallback. | Unit/E2E/a11y handoff suite passes; no false booking language. |
| 6. Hardening | Maps credentials/real environment, approved assets/content, legal gates, redirects, SEO, headers/CSP, cross-browser/performance. | All launch-gate checks, deployed verification, and blocker resolution. |
| 7. Launch/handover | Domain, production deployment, Search Console, owner acceptance, access handover. | Production smoke test and final acceptance recorded. |
| 8. Future only | Separate approved Phase 2/backend capabilities. | Never silently folded into Phase 1. |

---

## 18. Owner-input tracker and launch blockers

### 18.1 Needed to complete Figma design [O]

Approved logo/brand source or approval to use text wordmark; approved visual direction; representative approved copy/translation review contact; confirmation that premium placeholders are acceptable; desired image shot list. Prices/specs are not design blockers because fallback states are designed.

### 18.2 Needed before production launch [O][B]

| Item | Safe fallback during build | Launch consequence |
|---|---|---|
| Production domain and canonical host | Preview URL only | **[B]** cannot finalize canonical, sitemap, OAuth-free Maps restrictions, or domain launch. |
| Final contacts/WhatsApp and three addresses | Preview-marked pending data | **[B]** cannot safely publish contact/maps. |
| Google Cloud project, Maps Embed key/billing/restrictions | Designed facade/directions UI | **[B]** for required interactive Embed API maps. |
| Privacy, Terms, legal identity/grievance contact | Legal layouts remain draft/noindex | **[B]** for production legal publication. |
| Cancellation/refund wording if required in nav/footer | Hide page/link rather than invent | **[B]** if client requires it at launch. |
| Locale and legal translation approval | Internal draft only | **[B]** for complete three-language published release. |
| Brand asset decision | Approved wordmark fallback | **[B]** only if neither asset nor fallback is approved. |
| Pricing/rules | “Price on request” | Not a site-launch blocker; blocks numeric calculator estimates. |
| Vehicle specs/photos | Hidden specs/placeholders | Not a site-launch blocker; blocks factual details/real imagery. |

### 18.3 Contract clarification inputs [O][B]

Written acknowledgement for Calendar API substitution, Google Sheets exclusion, and Release-1 WhatsApp click-to-chat distinction; Phase-1/Phase-2 scope remains otherwise as documented in the agreement. These are commercial/contract controls, not reasons to fabricate integrations.

### 18.4 Risks and mitigations [R]

| Risk | Mitigation |
|---|---|
| Visitor mistakes enquiry for booking | Explicit copy, estimate disclaimer, “What happens next”, no reservation language. |
| Missing pricing reduces conversion | Confirm rules early; use honest “Price on request” rather than invented rates. |
| Duplicate Ertiga pages dilute quality | Separate unit IDs; noindex Vehicle 2 until factual differentiation. |
| Map key/cookies/performance issue | Restricted key, click-to-load iframe, directions fallback, privacy/CSP tests. |
| Translation/legal meaning differs | Central source; native-language/legal review and publication gate. |
| Legacy redirects unavailable | Verify control/Search Console; use direct migration notice only if owner controls old host. |
| Phase-1 scope creeps into backend | Enforce exclusions and separate Phase-2 approval. |

---

## 19. Test plan and acceptance criteria

### 19.1 Automated and manual test suite [C][R]

| ID | Acceptance criterion |
|---|---|
| AC-01 | Data test asserts exactly five records, unique slugs, Fronx/Brezza/Baleno, and two distinct Ertiga IDs. |
| AC-02 | Pending price/spec/image state never renders a fabricated fact; no broken image; placeholder dimensions remain stable. |
| AC-03 | EN/HI/MR routes, message completeness, locale switch equivalence, `hreflang`, and long-string layout tests pass. |
| AC-04 | Light/dark system default, explicit persistence, route/locale retention, no avoidable flash, contrast, and component states pass. |
| AC-05 | IST validation rejects past/invalid/out-of-window/return-not-after-pickup input; timezone/device-locale cases pass. |
| AC-06 | Pure duration/pricing tests cover hourly, daily, approved mixed rules, rounding, missing rates, and “Price on request.” |
| AC-07 | Every calculated amount is labelled “Estimated rental cost” with confirmation disclaimer; no false availability/booking wording appears. |
| AC-08 | WhatsApp message encoding, optional fields, blocked-popup/copy/call/email fallback, and user-must-send disclosure work in real browsers. |
| AC-09 | Maps click-load works with restricted configured key; directions links, loading/error fallback, privacy/CSP behavior work on approved domain. |
| AC-10 | No Google Sheets, Google Calendar API, WhatsApp Business API, payment, auth, or availability request is included in bundle/configuration. |
| AC-11 | Every route/internal link/status/404/verified redirect works; no personal data appears in URLs. |
| AC-12 | Unique titles/descriptions, canonical/robots/sitemap/hreflang, rendered server HTML, schema validity, and preview noindex behavior pass. |
| AC-13 | Keyboard, screen reader, dialog/date control, focus, contrast, reduced-motion, 320px, 200% zoom, and axe checks pass across themes/locales. |
| AC-14 | Static/cache behavior, responsive image behavior, lazy client modules/maps, Lighthouse milestone checks, and measured budgets are recorded. |
| AC-15 | Build/type/lint/format/unit/e2e/deployed headers/CSP/no-secret checks pass; handover/domain/owner acceptance are recorded. |

### 19.2 Final delivery checklist [C]

All pages and links work; content approval gate is clear; client-provided assets/policies are recorded; deployment/domain behavior is verified; SEO/performance/accessibility/security checks have actual results; and final owner acceptance is captured. A performance score, ranking, map connection, or policy approval is never claimed without evidence.

---

## 20. Complete 100-point improvement audit traceability

Every audit item is integrated above and mapped to the acceptance test(s) that prove it.

| # | Plan section(s) | Acceptance |
|---:|---|---|
| 1 | §§2.2, 3.2, 9.3 | AC-10 |
| 2 | §§2.2, 3.2, 8, 9.3 | AC-10 |
| 3 | §8 | AC-05, AC-06 |
| 4 | §8.3 | AC-06, AC-07 |
| 5 | §9.2 | AC-09 |
| 6 | §§2.2, 8.5, 9.3 | AC-08, AC-10 |
| 7 | §§1.2, 3 | AC-10, AC-15 |
| 8 | §§1.1, 7.1 | AC-01 |
| 9 | §§5.5, 7.2 | AC-02 |
| 10 | §3 | AC-10, AC-15 |
| 11 | §§2.2, 8.1 | AC-05 |
| 12 | §§2.3, 8.2 | AC-05 |
| 13 | §8.2 | AC-05 |
| 14 | §8.2 | AC-05, AC-06 |
| 15 | §8.3 | AC-06 |
| 16 | §8.3 | AC-06 |
| 17 | §8.3 | AC-06 |
| 18 | §§2.3, 8.2–8.3 | AC-05, AC-06 |
| 19 | §§7.2, 8.3 | AC-02, AC-06 |
| 20 | §§1.2, 8.3 | AC-07 |
| 21 | §7.1 | AC-01 |
| 22 | §§4.2, 7.1 | AC-01 |
| 23 | §7.2 | AC-02 |
| 24 | §§4.2, 7.1 | AC-01 |
| 25 | §5.5 | AC-02 |
| 26 | §5.5 | AC-02, AC-14 |
| 27 | §§7.1–7.3 | AC-01, AC-06 |
| 28 | §§2.4, 7.2 | AC-02, AC-06 |
| 29 | §§6.3, 7.2 | AC-02 |
| 30 | §§2.3, 6.3, 7.1 | AC-01, AC-12 |
| 31 | §4.2 | AC-11 |
| 32 | §§4.1–4.2 | AC-01, AC-11 |
| 33 | §§4.2, 6.4 | AC-11 |
| 34 | §§4.1, 6.4 | AC-11 |
| 35 | §4.3 | AC-11 |
| 36 | §4.3 | AC-11 |
| 37 | §4.3 | AC-11 |
| 38 | §4.1 | AC-11 |
| 39 | §§4, 19 | AC-11 |
| 40 | §§1.2, 6.6, 8.5 | AC-07, AC-08 |
| 41 | §12.3 | AC-12 |
| 42 | §12.1 | AC-12 |
| 43 | §12.1 | AC-12 |
| 44 | §§12.1, 18.2 | AC-12, AC-15 |
| 45 | §12.2 | AC-12 |
| 46 | §12.2 | AC-12 |
| 47 | §§4.2, 12.2 | AC-12 |
| 48 | §12.1–12.3 | AC-12 |
| 49 | §12.1 | AC-12 |
| 50 | §12.3 | AC-12 |
| 51 | §9.2 | AC-09 |
| 52 | §9.2 | AC-09 |
| 53 | §9.2, §16.1 | AC-09, AC-15 |
| 54 | §9.2 | AC-09 |
| 55 | §§9.2, 14.2 | AC-09, AC-14 |
| 56 | §§9.2, 16.1 | AC-09, AC-15 |
| 57 | §§9.2, 11.2 | AC-09 |
| 58 | §8.5 | AC-08 |
| 59 | §8.5 | AC-08 |
| 60 | §§3.2, 9.3 | AC-10 |
| 61 | §11.2 | AC-15 |
| 62 | §11.2 | AC-15 |
| 63 | §§11.2, 18.2 | AC-15 |
| 64 | §11.2 | AC-02, AC-15 |
| 65 | §11.2 | AC-15 |
| 66 | §11.2 | AC-15 |
| 67 | §§2.4, 18.2 | AC-15 |
| 68 | §§8.1, 11.2 | AC-08, AC-15 |
| 69 | §11.1 | AC-15 |
| 70 | §11.2 | AC-15 |
| 71 | §13.1 | AC-15 |
| 72 | §13.1 | AC-15 |
| 73 | §13.1 | AC-15 |
| 74 | §13.1 | AC-15 |
| 75 | §§13.1, 14.3 | AC-13, AC-14 |
| 76 | §8.2 | AC-05 |
| 77 | §§7.4, 13.1 | AC-01, AC-05 |
| 78 | §13.1 | AC-15 |
| 79 | §13.1 | AC-15 |
| 80 | §§2.1, 13.1 | AC-15 |
| 81 | §14.1 | AC-14 |
| 82 | §14.1 | AC-14 |
| 83 | §14.2 | AC-02, AC-14 |
| 84 | §§8.4, 14.2 | AC-14 |
| 85 | §14.2 | AC-14 |
| 86 | §14.1 | AC-14 |
| 87 | §§9.2, 14.2 | AC-09, AC-14 |
| 88 | §§9.2, 16.1 | AC-15 |
| 89 | §16.1 | AC-15 |
| 90 | §§9.2, 13.2, 16.1 | AC-09, AC-15 |
| 91 | §19 | AC-01–AC-15 |
| 92 | §8.3 | AC-06 |
| 93 | §§7.2, 8.3 | AC-02, AC-06 |
| 94 | §8.2 | AC-05 |
| 95 | §§8.4, 15 | AC-13 |
| 96 | §§8.5, 9.2 | AC-08, AC-09 |
| 97 | §§4, 6, 19 | AC-11 |
| 98 | §§12.2–12.3, 14.2 | AC-12, AC-14 |
| 99 | §18.1–18.2 | AC-15 |
| 100 | This document; §§17, 21 | AC-15 |

---

## 21. Final consistency and readiness determination

### 21.1 Consistency review [R]

This plan is internally consistent:

- Fleet is exactly five units, including two distinct Ertigas.
- Light/dark themes and English/Hindi/Marathi are mandatory and fully scoped.
- A website-native IST calendar calculates elapsed duration and conditional price estimates; Google Calendar API is excluded.
- Google Sheets is excluded.
- Google Maps **Embed API**, loaded on request, and directions fallback are planned.
- WhatsApp is click-to-chat only; not its Business API.
- No price/rule, availability, image, policy, or car fact is invented.
- Next.js/React/TypeScript/Tailwind v4 is the production plan; Figma Make remains Vite/React.
- SEO, caching, security, accessibility, limited animation, performance, testing, deployment, and handover are implemented as planned work rather than promises.
- Legal approval and Phase 2 remain separate gates.
- All 100 audit points map to an implementation section and acceptance criterion.

### 21.2 Readiness determination [R]

**Ready for final owner approval as Planning V2.** No unresolved technical contradiction prevents implementation with the documented reversible defaults. Owner-only items remain correctly tracked: pricing/spec/photo/brand facts affect content quality or particular calculator output; domain, contacts/branches, Maps credentials, approved legal/translation content, and written scope-discrepancy acknowledgement are production-launch/commercial blockers as identified in §18.

After approval, follow §17 in order. Do not create a further planning cycle; do not begin Phase 2 work without its separate approval.
