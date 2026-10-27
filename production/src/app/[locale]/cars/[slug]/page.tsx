import { ArrowRight, FileText } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { Notice } from "@/components/ui/Notice";
import { visibleLegalLinks } from "@/data/legal";
import { BookingForm } from "@/features/booking/BookingForm";
import { getBookingFormProps } from "@/features/booking/props";
import { CarCard } from "@/features/cars/CarCard";
import { CarMedia } from "@/features/cars/CarMedia";
import { PriceBlock, PriceLine } from "@/features/cars/PriceBlock";
import { SpecList } from "@/features/cars/SpecList";
import { getPublicSpecs } from "@/features/cars/specs";
import { Link } from "@/i18n/navigation";
import { isLocale, locales, type Locale } from "@/i18n/routing";
import { getCarBySlug, getCars, getRelatedCars } from "@/lib/catalog";
import { visibleFact } from "@/lib/content";
import { env } from "@/lib/env";
import { breadcrumbJsonLd, carProductJsonLd } from "@/lib/jsonld";
import { localizedPath } from "@/lib/routes";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getCars().map((car) => ({ locale, slug: car.slug })));
}

async function resolve(params: Params["params"]) {
  const { locale, slug } = await params;
  const car = getCarBySlug(slug);
  if (!isLocale(locale) || !car) notFound();
  setRequestLocale(locale);
  return { locale: locale as Locale, car };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, car } = await resolve(params);
  const t = await getTranslations({ locale, namespace: "Meta" });
  const values = { car: car.displayName, unit: car.unitNumber ?? 0 };
  return buildMetadata({
    locale,
    path: `/cars/${car.slug}`,
    title: t(car.unitNumber ? "carTitleUnit" : "carTitle", values),
    description: t(car.unitNumber ? "carDescriptionUnit" : "carDescription", values),
    image: car.images.primary
      ? {
          url: car.images.primary.src,
          width: car.images.primary.width,
          height: car.images.primary.height,
          alt: car.images.primary.alt[locale],
        }
      : undefined,
  });
}

export default async function CarPage({ params }: Params) {
  const { locale, car } = await resolve(params);
  const t = await getTranslations();
  const bookingProps = await getBookingFormProps(locale);
  const unit = car.unitNumber ? t("Common.vehicleUnit", { unit: car.unitNumber }) : null;
  const specs = getPublicSpecs(car, env.showPendingContent);
  const description = visibleFact(car.description, env.showPendingContent);
  const distinguishing = visibleFact(car.distinguishingDetails, env.showPendingContent);
  const policies = visibleLegalLinks(locale, env.showPendingContent).filter(
    (d) => d.slug === "terms-and-conditions" || d.slug === "cancellation-and-refund-policy",
  );
  const crumbs = [
    { label: t("Common.home"), href: "/" },
    { label: t("Car.breadcrumbCars"), href: "/cars" },
    { label: unit ? `${car.model} ${unit}` : car.model },
  ];
  const intro = car.unitNumber
    ? t("Car.introUnit", { car: car.displayName, unit: car.unitNumber })
    : t("Car.intro", { car: car.displayName });

  return (
    <>
      <div className="container-site pt-8 pb-28 lg:pb-20">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
          <div className="overflow-hidden rounded-card border border-line">
            <CarMedia car={car} variant="detail" priority sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <p className="eyebrow">{car.make}</p>
              <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
                {car.model}
                {unit ? (
                  <span className="mt-2 block text-2xl font-bold text-accent-ink sm:text-3xl">
                    {unit}
                  </span>
                ) : null}
              </h1>
            </div>
            <p className="text-[1.0625rem] leading-relaxed text-ink-2">{intro}</p>
            {description ? (
              <p className="text-[1.0625rem] leading-relaxed text-ink-2">
                {description.value[locale]}
              </p>
            ) : null}
            {car.unitNumber ? (
              <Notice>{distinguishing ? distinguishing.value[locale] : t("Car.ertigaNote")}</Notice>
            ) : null}
            <PriceBlock carId={car.id} />
            <ButtonLink
              href={{ pathname: "/book", query: { car: car.slug } }}
              size="lg"
              className="w-full sm:w-auto"
            >
              {t("Car.enquiryTitle")}
              <ArrowRight aria-hidden className="size-5" />
            </ButtonLink>
          </div>
        </div>

        <section aria-labelledby="specs-title" className="mt-16">
          <h2 id="specs-title" className="font-display text-2xl font-bold text-ink">
            {t("Car.specsTitle")}
          </h2>
          <div className="mt-5">
            {specs.length ? (
              <SpecList specs={specs} />
            ) : (
              <p className="text-ink-2">{t("Car.specsPending")}</p>
            )}
          </div>
        </section>

        <section
          aria-labelledby="car-enquiry-title"
          id="enquiry"
          className="mt-16 rounded-card border border-line bg-raised p-5 shadow-raised sm:p-8"
        >
          <h2 id="car-enquiry-title" className="mb-6 font-display text-2xl font-bold text-ink">
            {t("Car.enquiryTitle")}
          </h2>
          <BookingForm {...bookingProps} initialCarId={car.id} headingId="car-enquiry-title" />
        </section>

        <section aria-labelledby="policies-title" className="mt-16">
          <h2 id="policies-title" className="font-display text-2xl font-bold text-ink">
            {t("Car.policiesTitle")}
          </h2>
          {policies.length ? (
            <ul className="mt-5 flex flex-wrap gap-3">
              {policies.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`/${doc.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line px-4 text-sm font-medium text-ink hover:bg-muted"
                  >
                    <FileText aria-hidden className="size-4 text-accent-ink" />
                    {doc.title}
                    {doc.draft ? (
                      <span className="text-xs text-warning">({t("Common.draftBadge")})</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-2">
            {t("Car.policiesPending")}
          </p>
        </section>

        <section aria-labelledby="related-title" className="mt-20">
          <h2 id="related-title" className="font-display text-2xl font-bold text-ink">
            {t("Car.relatedTitle")}
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {getRelatedCars(car).map((other) => (
              <li key={other.id} className="flex">
                <CarCard car={other} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Mobile sticky enquiry action */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <PriceLine carId={car.id} className="min-w-0 truncate text-sm" />
          <ButtonLink href={{ pathname: "/book", query: { car: car.slug } }} size="md">
            {t("Fleet.enquire")}
          </ButtonLink>
        </div>
      </div>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("Common.home"), url: absoluteUrl(localizedPath(locale, "/")) },
          { name: t("Car.breadcrumbCars"), url: absoluteUrl(localizedPath(locale, "/cars")) },
          {
            name: unit ? `${car.displayName} ${unit}` : car.displayName,
            url: absoluteUrl(localizedPath(locale, `/cars/${car.slug}`)),
          },
        ])}
      />
      {car ? <JsonLd data={carProductJsonLd(car)} /> : null}
    </>
  );
}
