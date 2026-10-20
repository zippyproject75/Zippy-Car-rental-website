import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PageIntro } from "@/components/sections/PageIntro";
import { CarGrid } from "@/features/cars/CarGrid";
import { getCars } from "@/lib/catalog";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    path: "/cars",
    title: t("carsTitle"),
    description: t("carsDescription"),
  });
}

export default async function CarsPage({ params }: LocaleParams) {
  await resolveLocale(params);
  const t = await getTranslations();
  const cars = getCars();
  return (
    <>
      <PageIntro
        crumbs={[{ label: t("Common.home"), href: "/" }, { label: t("Car.breadcrumbCars") }]}
        title={t("Fleet.title")}
        intro={t("Fleet.intro")}
      >
        <p className="mt-6 text-sm font-semibold text-accent-ink tabular-nums">
          {t("Fleet.countLabel", { count: cars.length })}
        </p>
      </PageIntro>
      <section className="container-site py-14 lg:py-20" aria-label={t("Fleet.title")}>
        <CarGrid cars={cars} headingLevel="h2" />
      </section>
      <section
        aria-label={t("Home.howTitle")}
        className="border-t border-line bg-muted/60 py-16 lg:py-20"
      >
        <div className="container-site">
          <HowItWorks />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
