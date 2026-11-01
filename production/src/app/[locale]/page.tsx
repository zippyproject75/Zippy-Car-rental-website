import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroNew } from "@/components/sections/HeroNew";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Reviews } from "@/components/sections/Reviews";
import { CinematicCta } from "@/components/sections/CinematicCta";
import { SimpleFlowChart } from "@/components/sections/SimpleFlowChart";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/ui/JsonLd";
import { getApprovedFaqs } from "@/data/faqs";
import { CarGrid } from "@/features/cars/CarGrid";
import { getCars } from "@/lib/catalog";
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
            title="Our Fleet"
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

      {/* ── SECTION 3: SIMPLE FLOW CHART — HOW IT WORKS ── */}
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-title"
        className="scroll-mt-20 border-b border-line bg-muted/30"
      >
        <SimpleFlowChart />
      </section>

      {/* ── SECTION 4: RENTAL PROCESS — HOW IT WORKS ── */}
      <Reviews />

      {/* ── SECTION 5: FAQ — ANSWER COMMON RENTAL QUESTIONS ── */}
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

      {/* ── SECTION 6: FINAL CTA — BOOK NOW ── */}
      <CinematicCta />

      {/* Structured data */}
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd data={autoRentalJsonLd()} />
      {faqs.length ? <JsonLd data={faqPageJsonLd(faqs)} /> : null}
    </>
  );
}
