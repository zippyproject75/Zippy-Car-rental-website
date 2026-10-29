import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/sections/PageIntro";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { getApprovedFaqs } from "@/data/faqs";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { faqPageJsonLd } from "@/lib/jsonld";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    path: "/faq",
    title: t("faqTitle"),
    description: t("faqDescription"),
  });
}

export default async function FaqPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations();
  const items = getApprovedFaqs().map((f) => ({
    id: f.id,
    question: f.content[locale].question,
    answer: f.content[locale].answer ?? "",
  }));
  return (
    <>
      <PageIntro
        crumbs={[{ label: t("Common.home"), href: "/" }, { label: t("Nav.faq") }]}
        title={t("Faq.title")}
        intro={t("Faq.intro")}
      />
      <div className="container-site grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr] lg:gap-16 lg:py-20">
        <Accordion items={items} />
        <aside className="h-fit rounded-card border border-line bg-raised p-6">
          <h2 className="font-display text-xl font-bold text-ink">{t("Faq.moreQuestions")}</h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
            {t("Faq.moreQuestionsBody")}
          </p>
          <ButtonLink href="/contact" variant="secondary" className="mt-5">
            {t("Faq.contactCta")}
          </ButtonLink>
        </aside>
      </div>

      {/* FAQ structured data */}
      <JsonLd data={faqPageJsonLd(items)} />
    </>
  );
}
