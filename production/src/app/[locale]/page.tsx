import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { HeroNew } from "@/components/sections/HeroNew";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Reviews } from "@/components/sections/Reviews";
import { RentalGuidelines } from "@/components/sections/RentalGuidelines";
import { CinematicCta } from "@/components/sections/CinematicCta";
import { PackageSelector } from "@/components/sections/PackageSelector";
import { PickupLocations } from "@/components/sections/PickupLocations";
import { HowItWorks } from "@/components/sections/HowItWorks";
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
import { autoRentalJsonLd, faqPageJsonLd, webSiteJsonLd } from "@/lib/jsonld";
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
      {/* ── SECTION 1: HERO — WHAT YOU OFFER AND WHERE ── */}
      <HeroNew />

      {/* ── RENTAL ENQUIRY FORM (Primary action after hero) ── */}
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

      {/* ── TRUST STRIP (Concise verified benefits) ── */}
      <TrustStrip />

      {/* ── SECTION 2: FLEET — AVAILABLE VEHICLES ── */}
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

      {/* ── SECTION 3: RENTAL PACKAGES — UNDERSTAND THE OPTIONS ── */}
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

      {/* ── SECTION 4: HOW IT WORKS — THREE SIMPLE STEPS ── */}
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-title"
        className="scroll-mt-20 border-b border-line bg-canvas"
      >
        <div className="container-site py-16 sm:py-20 lg:py-24">
          <HowItWorks withHeading={true} />
        </div>
      </section>

      {/* ── SECTION 5: PICKUP LOCATIONS — WHERE CUSTOMERS CAN COLLECT VEHICLES ── */}
      <PickupLocations />

      {/* ── SECTION 6: RENTAL REQUIREMENTS — WHAT CUSTOMERS NEED ── */}
      <RentalGuidelines />

      {/* ── SECTION 7: RENTAL PROCESS — HOW IT WORKS ── */}
      <Reviews />

      {/* ── SECTION 8: FAQ — ANSWER COMMON RENTAL QUESTIONS ── */}
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

      {/* ── SECTION 9: FINAL CTA — PLAN YOUR RENTAL ── */}
      <CinematicCta />

      {/* Structured data */}
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd data={autoRentalJsonLd()} />
      {faqs.length ? <JsonLd data={faqPageJsonLd(faqs)} /> : null}
    </>
  );
}
