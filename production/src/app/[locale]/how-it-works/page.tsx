import {
  ArrowRight,
  CalendarClock,
  CarFront,
  Check,
  CheckCircle2,
  Clock,
  FileCheck,
  KeyRound,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/sections/PageIntro";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ENQUIRY_PATH } from "@/data/navigation";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    path: "/how-it-works",
    title: t("howItWorksTitle"),
    description: t("howItWorksDescription"),
  });
}

export default async function HowItWorksPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const tNav = await getTranslations({ locale, namespace: "Nav" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const STEPS = [
    {
      num: "01",
      title: "Explore Our Fleet",
      badge: "Step 1 · Vehicle Selection",
      icon: CarFront,
      desc: "Browse our hand-picked Maruti Suzuki lineup tailored for Pune city commutes and Maharashtra road trips.",
      points: [
        "Select from stylish compact SUVs (Fronx, Brezza), premium hatchbacks (Baleno), or spacious 7-seater MPVs (Ertiga, XL6).",
        "View detailed seating capacity, manual or automatic transmissions, and fuel options.",
        "Transparent vehicle specifications with authentic photos of our actual fleet.",
      ],
      ctaText: "View Our Fleet",
      ctaHref: "/cars",
    },
    {
      num: "02",
      title: "Choose Your Pickup Details",
      badge: "Step 2 · Location & Time",
      icon: MapPin,
      desc: "Select convenient branch pickup or flexible doorstep delivery across major Pune neighborhoods.",
      points: [
        "Pick from our established Pune branches: Kondhwa, Gangadham, or Undri.",
        "Doorstep delivery available across Pune Station, Viman Nagar, Hinjawadi, and Kothrud.",
        "Choose your preferred pickup calendar date and exact morning or afternoon time slot.",
      ],
      ctaText: null,
      ctaHref: null,
    },
    {
      num: "03",
      title: "Select Your Return Details",
      badge: "Step 3 · Rental Duration",
      icon: CalendarClock,
      desc: "Plan your travel window with flexible return timing and automatic duration calculation.",
      points: [
        "Choose your scheduled return date and convenient drop-off time slot.",
        "Review your calculated rental duration formatted clearly in India Standard Time (IST).",
        "Transparent daily and hourly rate structures without hidden weekend surges.",
      ],
      ctaText: null,
      ctaHref: null,
    },
    {
      num: "04",
      title: "Submit Your Enquiry",
      badge: "Step 4 · WhatsApp Preparation",
      icon: MessageCircle,
      desc: "Prepare a clean, structured booking enquiry directly through our instant WhatsApp workflow.",
      points: [
        "Review your selected car, branch, and pickup/return dates on our fast booking form.",
        "Click 'Prepare My Enquiry' to format your request without registering an account.",
        "No upfront credit card required to check availability and obtain an accurate quote.",
      ],
      ctaText: "Open Booking Form",
      ctaHref: ENQUIRY_PATH,
    },
    {
      num: "05",
      title: "Confirmation From Zippy",
      badge: "Step 5 · Owner Review",
      icon: ShieldCheck,
      desc: "Receive personal, direct owner confirmation with transparent terms and vehicle handover instructions.",
      points: [
        "Our team personally reviews your enquiry and confirms immediate car availability.",
        "Clear pricing confirmation, refundable deposit details, and fuel guidelines sent directly to your chat.",
        "Receive exact branch directions, contact coordinator details, and vehicle readiness status.",
      ],
      ctaText: null,
      ctaHref: null,
    },
    {
      num: "06",
      title: "Enjoy Your Journey",
      badge: "Step 6 · Drive & Handover",
      icon: Sparkles,
      desc: "Complete swift physical handover, receive your sanitized car, and drive Pune on your terms.",
      points: [
        "Present your original Indian Driving Licence and Aadhaar Card/Passport for quick physical verification.",
        "Inspect your clean, well-maintained Maruti Suzuki car, record the odometer, and collect the keys.",
        "Seamless Maharashtra highway transit supported by active FASTags on all vehicles.",
        "Effortless vehicle return at your agreed schedule and prompt refundable deposit return.",
      ],
      ctaText: null,
      ctaHref: null,
    },
  ];

  const HIGHLIGHTS = [
    {
      icon: CheckCircle2,
      title: "No Middlemen",
      desc: "Direct WhatsApp owner communication means zero broker commissions and guaranteed car allocation.",
    },
    {
      icon: FileCheck,
      title: "Simple Documentation",
      desc: "Only valid Driving Licence (min 1 year) and Aadhaar/Passport required at pickup. No tedious paperwork.",
    },
    {
      icon: Clock,
      title: "Transparent Billing",
      desc: "Fair daily and hourly rates with clear like-to-like fuel policy and swift security deposit refunds.",
    },
    {
      icon: KeyRound,
      title: "FASTag Highway Ready",
      desc: "All vehicles are equipped with active FASTags for hassle-free Mumbai-Pune Expressway and outstation trips.",
    },
  ];

  return (
    <>
      {/* ── Page Hero ── */}
      <PageIntro
        crumbs={[{ label: tCommon("home"), href: "/" }, { label: tNav("howItWorks") }]}
        title="Simple, transparent self-drive process."
        intro="From selecting your preferred Maruti Suzuki vehicle to personal WhatsApp owner confirmation, here is our complete 6-step customer journey designed for effortless car rental in Pune."
      />

      {/* ── 6-Step Visual Timeline Section ── */}
      <section
        aria-label="How Zippy Car Rental Works"
        className="container-site py-16 sm:py-20 lg:py-24"
      >
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">STEP-BY-STEP CUSTOMER JOURNEY</p>
          <h2 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-ink sm:text-4xl">
            From enquiry to the open road in six easy steps.
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink-2">
            No complicated apps or opaque booking engines. Just straightforward owner-operated self-drive service.
          </p>
        </div>

        {/* 6 Step Cards Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="group relative flex flex-col justify-between rounded-2xl border border-line bg-raised p-6 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-raised"
              >
                <div>
                  {/* Card Header: Step number + Icon */}
                  <div className="flex items-center justify-between border-b border-line/60 pb-5">
                    <span className="flex size-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-ink transition-colors group-hover:bg-accent group-hover:text-on-accent">
                      <Icon aria-hidden className="size-6" />
                    </span>
                    <span className="font-display text-2xl font-black tracking-tight text-accent-ink tabular-nums">
                      {step.num}
                    </span>
                  </div>

                  {/* Badge & Title */}
                  <div className="mt-5">
                    <span className="inline-block text-[0.6875rem] font-bold uppercase tracking-wider text-accent-ink">
                      {step.badge}
                    </span>
                    <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2">
                      {step.desc}
                    </p>
                  </div>

                  {/* Bullet Points */}
                  <ul className="mt-5 space-y-2.5 border-t border-line/60 pt-5">
                    {step.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-2">
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-ink" />
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Optional Action CTA */}
                {step.ctaText && step.ctaHref ? (
                  <div className="mt-6 pt-4 border-t border-line/60">
                    <ButtonLink
                      href={step.ctaHref}
                      variant="quiet"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-ink hover:text-ink transition-colors"
                    >
                      {step.ctaText}
                      <ArrowRight aria-hidden className="size-3.5" />
                    </ButtonLink>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Key Highlights / Policies ── */}
      <section
        aria-label="Why rent with Zippy"
        className="border-t border-line bg-muted/30 py-16 sm:py-20"
      >
        <div className="container-site">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">OUR CORE COMMITMENTS</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
              Reliable cars. Fair terms. Zero surprises.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-line bg-canvas p-6 shadow-xs"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent-ink">
                    <Icon aria-hidden className="size-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-2">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Final Action CTA ── */}
      <section
        aria-labelledby="how-cta-title"
        className="border-t border-line bg-canvas text-ink"
      >
        <div className="container-site relative overflow-hidden py-20 lg:py-28">
          {/* Decorative accent line */}
          <div
            aria-hidden
            className="absolute left-4 top-0 h-px w-20 bg-accent sm:left-6 lg:left-8"
          />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">READY TO HIT THE ROAD?</p>
              <h2
                id="how-cta-title"
                className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl lg:text-5xl"
              >
                Your next drive starts here.
              </h2>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink-2">
                Choose your preferred Maruti Suzuki vehicle, select your dates, and send us an enquiry directly on WhatsApp.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
              <ButtonLink href={ENQUIRY_PATH} size="lg">
                Plan My Rental
                <ArrowRight aria-hidden className="size-5" />
              </ButtonLink>
              <ButtonLink href="/cars" variant="secondary" size="lg">
                Explore Fleet
              </ButtonLink>
              <ButtonLink href="/contact" variant="quiet" size="lg">
                Contact Us
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

