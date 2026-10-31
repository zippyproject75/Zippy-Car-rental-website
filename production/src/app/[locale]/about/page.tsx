import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageIntro } from "@/components/sections/PageIntro";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { Notice } from "@/components/ui/Notice";
import { site } from "@/data/site";
import { visibleFact } from "@/lib/content";
import { env } from "@/lib/env";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { localizedPath } from "@/lib/routes";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    path: "/about",
    title: t("aboutTitle"),
    description: t("aboutDescription"),
  });
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations();
  const story = visibleFact(site.aboutStory, env.showPendingContent);
  const facts = (["selfDrive", "fleet", "city", "confirm"] as const).map((k) =>
    t(`About.facts.${k}`),
  );
  const crumbs = [
    { name: t("Common.home"), url: absoluteUrl(localizedPath(locale, "/")) },
    { name: t("Nav.about"), url: absoluteUrl(localizedPath(locale, "/about")) },
  ];

  return (
    <>
      <PageIntro
        crumbs={[{ label: t("Common.home"), href: "/" }, { label: t("Nav.about") }]}
        title={t("About.title")}
        intro={t("About.intro")}
      />
      <div className="container-site grid gap-12 py-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:py-20">
        <section aria-labelledby="facts-title">
          <h2 id="facts-title" className="eyebrow">
            {t("About.factsTitle")}
          </h2>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {facts.map((fact) => (
              <li key={fact} className="flex gap-3 py-4 text-[1.0625rem] text-ink">
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent-ink" />
                {fact}
              </li>
            ))}
          </ul>
        </section>
        <div className="space-y-6">
          {story ? (
            story.value[locale].map((p) => (
              <p key={p} className="text-lg leading-relaxed text-ink-2">
                {p}
              </p>
            ))
          ) : (
            <Notice>{t("About.storyPending")}</Notice>
          )}
          <ButtonLink href="/cars" variant="secondary">
            {t("About.cta")}
            <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
      </div>
      <CtaBand />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
