import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { HeroNew } from "@/components/sections/HeroNew";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Reviews } from "@/components/sections/Reviews";
import { RentalGuidelines } from "@/components/sections/RentalGuidelines";
import { CinematicCta } from "@/components/sections/CinematicCta";
import { PackageSelector } from "@/components/sections/PackageSelector";
import { PickupLocations } from "@/components/sections/PickupLocations";
import { DoorstepDelivery } from "@/components/sections/DoorstepDelivery";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/ui/JsonLd";
import { getApprovedFaqs } from "@/data/faqs";
import { BookingForm } from "@/features/booking/BookingForm";
import { getBookingFormProps } from "@/features/booking/props";
import { CarGrid } from "@/features/cars/CarGrid";
import { BranchCard } from "@/features/maps/BranchCard";
import { getCars, getPublishedBranches } from "@/lib/catalog";
import { env } from "@/lib/env";
import { autoRentalJsonLd } from "@/lib/jsonld";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    path: "/",
    title: t("homeTitle"),
    description: t("homeDescription"),
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("Home");
  const bookingProps = await getBookingFormProps(locale);
  const branches = getPublishedBranches(env.showPendingContent);
  const faqs = getApprovedFaqs("home").map((f) => ({
    id: f.id,
    question: f.content[locale].question,
    answer: f.content[locale].answer ?? "",
  }));
  const cars = getCars();

  return (
    <>
      {/* ── 1. CINEMATIC HERO ── */}
      <HeroNew />

      {/* ── 2. RENTAL ENQUIRY FORM (Immediately beneath hero) ── */}
      <section
        id="enquiry"
        aria-labelledby="enquiry-title"
        className="scroll-mt-20 border-b border-line bg-canvas relative z-20"
      >
        <div className="container-site py-14 sm:py-16 lg:py-20">
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
            <div>
              <p className="eyebrow mb-2 sm:mb-3">{t("enquiryEyebrow")}</p>
              <h2
                id="enquiry-title"
                className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl"
              >
                {t("enquiryTitle")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-3">
                This is an enquiry — not a booking. Zippy confirms the price and availability with you personally on WhatsApp before any reservation is made.
              </p>
            </div>
            <p className="text-sm sm:text-[0.9375rem] leading-relaxed text-ink-2 lg:self-end">
              {t("enquiryIntro")}
            </p>
          </div>
          <div className="rounded-card border border-line bg-raised p-5 shadow-raised sm:p-8 lg:p-10">
            <BookingForm {...bookingProps} headingId="enquiry-title" />
          </div>
        </div>
      </section>

      {/* ── 3. TRUST STRIP (4 concise verified benefits) ── */}
      <TrustStrip />

      {/* ── 4. FLEET WITH REAL-TIME FILTERS ── */}
      <section
        id="fleet"
        aria-labelledby="fleet-title"
        className="scroll-mt-20 border-b border-line bg-canvas"
      >
        <div className="container-site py-16 sm:py-20 lg:py-24">
          <SectionHeading
            id="fleet-title"
            eyebrow={t("fleetEyebrow")}
            title={t("fleetTitle")}
            intro={t("fleetIntro")}
            action={
              <ButtonLink href="/cars" variant="secondary">
                {t("fleetAll")}
                <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
            }
          />
          <div className="mt-10">
            <CarGrid cars={cars} showFilters />
          </div>
        </div>
      </section>

      {/* ── 4.5. PACKAGE PRICING ── */}
      <section
        aria-labelledby="package-title"
        className="scroll-mt-20 border-b border-line bg-muted/30"
      >
        <div className="container-site py-16 sm:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-2 sm:mb-3">{t("packageSectionEyebrow")}</p>
              <h2
                id="package-title"
                className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl"
              >
                {t("packageSectionTitle")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">
                {t("packageSectionIntro")}
              </p>
            </div>
            <div className="lg:self-center">
              <PackageSelector />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ── */}
      <section
        id="how-it-works"
        aria-label={t("howTitle")}
        className="scroll-mt-20 border-b border-line bg-muted/40"
      >
        <div className="container-site py-16 sm:py-20 lg:py-24">
          <HowItWorks />
        </div>
      </section>

      {/* ── 6. WHY ZIPPY / ABOUT (Split layout) ── */}
      <section
        id="about"
        aria-labelledby="about-title"
        className="scroll-mt-20 border-b border-line bg-canvas"
      >
        <div className="container-site grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
          {/* Left: Brand message & key facts */}
          <div>
            <p className="eyebrow mb-3">{t("aboutEyebrow")}</p>
            <h2
              id="about-title"
              className="font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl"
            >
              {t("aboutTitle")}
            </h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-ink-2 sm:text-lg">
              {t("aboutBody")}
            </p>

            {/* 4 Balanced benefit cards */}
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Transparent Pricing", sub: "Clear rates with no hidden surprises" },
                { label: "No Surprise Charges", sub: "Everything discussed upfront before you drive" },
                { label: "3 Pickup Locations", sub: "Kondhwa, Gangadham, and Undri branches" },
                { label: "Personal Support", sub: "Direct WhatsApp contact with the business" },
              ].map(({ label, sub }) => (
                <li
                  key={label}
                  className="rounded-xl border border-line bg-raised p-4 shadow-xs"
                >
                  <p className="text-sm font-bold text-ink">{label}</p>
                  <p className="mt-1 text-xs text-ink-3 leading-snug">{sub}</p>
                </li>
              ))}
            </ul>

            <ButtonLink href="/about" variant="quiet" className="mt-8">
              {t("aboutCta")}
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </div>

          {/* Right: Authentic vehicle photograph */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-line shadow-raised">
              <div className="relative aspect-[4/3] overflow-hidden bg-sunken">
                <Image
                  src="/images/cars/baleno.jpeg"
                  alt="Maruti Suzuki Baleno — Zippy Car Rental Pune fleet"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            {/* Overlay badge */}
            <div className="absolute -bottom-4 left-6 rounded-xl border border-line bg-raised px-4 py-3 shadow-raised">
              <p className="text-xs font-semibold text-accent-ink uppercase tracking-wider">
                Maruti Suzuki
              </p>
              <p className="text-sm font-bold text-ink">Baleno · City Hatchback</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. CUSTOMER FEEDBACK ── */}
      <Reviews />

      {/* ── 8. PICKUP LOCATIONS & MAPS ── */}
      {branches.length ? (
        <section
          id="branches"
          aria-labelledby="branches-title"
          className="scroll-mt-20 border-t border-line bg-muted/30"
        >
          <div className="container-site py-16 sm:py-20 lg:py-24">
            <SectionHeading
              id="branches-title"
              eyebrow={t("branchesEyebrow")}
              title={t("branchesTitle")}
              intro={t("branchesIntro")}
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {branches.map((b) => (
                <BranchCard key={b.id} branch={b} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── 8.5. PICKUP LOCATIONS WITH GOOGLE MAPS LINKS ── */}
      <PickupLocations />

      {/* ── 8.6. DOORSTEP DELIVERY POLICY ── */}
      <DoorstepDelivery />

      {/* ── 9. RENTAL GUIDELINES & POLICIES ── */}
      <RentalGuidelines />

      {/* ── 10. FREQUENTLY ASKED QUESTIONS ── */}
      {faqs.length ? (
        <section
          id="faq"
          aria-labelledby="faq-title"
          className="scroll-mt-20 border-t border-line bg-canvas"
        >
          <div className="container-site py-16 sm:py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
              <SectionHeading
                id="faq-title"
                eyebrow={t("faqEyebrow")}
                title={t("faqTitle")}
                action={
                  <ButtonLink href="/faq" variant="quiet">
                    {t("faqAll")}
                    <ArrowRight aria-hidden className="size-4" />
                  </ButtonLink>
                }
                className="lg:flex-col lg:items-start lg:justify-start"
              />
              <Accordion items={faqs} />
            </div>
          </div>
        </section>
      ) : null}

      {/* ── 11. FINAL CINEMATIC CTA ── */}
      <CinematicCta />

      {/* Structured data */}
      <JsonLd data={autoRentalJsonLd()} />
    </>
  );
}
