import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/sections/PageIntro";
import { JsonLd } from "@/components/ui/JsonLd";
import { FareCalculator } from "@/features/calculator/FareCalculator";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { localizedPath } from "@/lib/routes";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    path: "/calculator",
    title: "Fare Calculator",
    description: "Calculate your car rental fare with our transparent pricing calculator",
  });
}

export default async function CalculatorPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations();
  const crumbs = [
    { name: t("Common.home"), url: absoluteUrl(localizedPath(locale, "/")) },
    { name: "Fare Calculator", url: absoluteUrl(localizedPath(locale, "/calculator")) },
  ];

  return (
    <>
      <PageIntro
        crumbs={[{ label: t("Common.home"), href: "/" }, { label: "Fare Calculator" }]}
        title="Know Your Fare Before You Book"
        intro="Get an instant estimate for your car rental. Select your vehicle and duration to see the complete fare breakdown."
      />
      <section className="container-site py-12 lg:py-16">
        <FareCalculator />
      </section>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
