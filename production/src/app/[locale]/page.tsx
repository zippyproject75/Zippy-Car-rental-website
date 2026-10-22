import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { Hero } from "@/components/sections/Hero";
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

  return (
    <>
      <Hero />

      <section
        aria-labelledby="enquiry-title"
        className="container-site relative z-10 -mt-20 lg:-mt-24"
      >
        <div className="rounded-card border border-line bg-raised p-5 shadow-raised sm:p-8 lg:p-10">
          <div className="mb-8 grid gap-3 lg:grid-cols-[1fr_1.4fr] lg:gap-10">
            <div>
              <p className="eyebrow mb-3">{t("enquiryEyebrow")}</p>
              <h2
                id="enquiry-title"
                className="font-display text-3xl font-bold tracking-[-0.02em] text-ink"
              >
                {t("enquiryTitle")}
              </h2>
            </div>
            <p className="text-[0.9375rem] leading-relaxed text-ink-2 lg:self-end">
              {t("enquiryIntro")}
            </p>
          </div>
          <BookingForm {...bookingProps} headingId="enquiry-title" />
        </div>
      </section>

      <section aria-labelledby="fleet-title" className="container-site py-20 lg:py-28">
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
          <CarGrid cars={getCars()} />
        </div>
      </section>

      <section
        id="how-it-works"
        aria-label={t("howTitle")}
        className="scroll-mt-20 border-y border-line bg-muted/60 py-20 lg:py-24"
      >
        <div className="container-site">
          <HowItWorks />
        </div>
      </section>

      <section
        aria-labelledby="about-title"
        className="container-site grid gap-8 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28"
      >
        <div>
          <p className="eyebrow mb-3">{t("aboutEyebrow")}</p>
          <h2
            id="about-title"
            className="font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl"
          >
            {t("aboutTitle")}
          </h2>
        </div>
        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-ink-2">{t("aboutBody")}</p>
          <ButtonLink href="/about" variant="quiet">
            {t("aboutCta")}
            <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
      </section>

      {branches.length ? (
        <section aria-labelledby="branches-title" className="border-t border-line py-20 lg:py-28">
          <div className="container-site">
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

      {faqs.length ? (
        <section aria-labelledby="faq-title" className="border-t border-line py-20 lg:py-28">
          <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
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
        </section>
      ) : null}

      <CtaBand />
      <JsonLd data={autoRentalJsonLd()} />
    </>
  );
}
