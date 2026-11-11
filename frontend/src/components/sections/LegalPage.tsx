import { FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/sections/PageIntro";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { Notice } from "@/components/ui/Notice";
import { getLegalDocument, isLegalApproved } from "@/data/legal";
import type { Locale } from "@/i18n/routing";
import { env } from "@/lib/env";
import { formatDateKey } from "@/lib/formatting";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { localizedPath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";
import type { LegalSlug } from "@/types/legal";

/** Shared template for every policy. Unapproved content is never shown in production. */
export async function LegalPage({ slug, locale }: { slug: LegalSlug; locale: Locale }) {
  const t = await getTranslations();
  const doc = getLegalDocument(slug);
  const version = doc.content[locale];
  const approved = isLegalApproved(version);
  const crumbs = [{ label: t("Common.home"), href: "/" }, { label: version.title }];

  if (!approved && !env.showPendingContent) {
    return (
      <>
        <PageIntro crumbs={crumbs} title={version.title} />
        <div className="container-site py-14">
          <Notice title={t("Legal.notPublishedTitle")} className="max-w-2xl">
            <p>{t("Legal.notPublished")}</p>
            <p className="mt-1">{t("Legal.notPublishedBody")}</p>
          </Notice>
          <ButtonLink href="/contact" variant="secondary" className="mt-6">
            {t("Legal.contactCta")}
          </ButtonLink>
        </div>
      </>
    );
  }

  return (
    <>
      <PageIntro crumbs={crumbs} title={version.title} intro={version.summary}>
        <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-3">
          <div className="flex gap-1.5">
            <dt className="sr-only">Version</dt>
            <dd className="tabular-nums">{t("Legal.version", { version: version.version })}</dd>
          </div>
          <div>
            <dd className="tabular-nums">
              {version.effectiveDate
                ? t("Legal.effective", { date: formatDateKey(version.effectiveDate, locale) })
                : t("Legal.effectivePending")}
            </dd>
          </div>
          {version.lastUpdated ? (
            <div>
              <dd className="tabular-nums">
                {t("Legal.updated", { date: formatDateKey(version.lastUpdated, locale) })}
              </dd>
            </div>
          ) : null}
        </dl>
      </PageIntro>
      <div className="container-site grid gap-10 py-12 lg:grid-cols-[16rem_1fr] lg:gap-16 lg:py-16">
        <nav aria-labelledby="legal-toc" className="h-fit lg:sticky lg:top-24">
          <h2 id="legal-toc" className="eyebrow mb-3">
            {t("Legal.contents")}
          </h2>
          <ol className="space-y-1 border-l border-line">
            {version.sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="-ml-px flex min-h-10 items-center border-l border-transparent pl-4 text-sm text-ink-2 hover:border-accent hover:text-ink"
                >
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="max-w-3xl space-y-10">
          {!approved ? (
            <Notice tone="warning" title={t("Common.draftBadge")}>
              <p>{t("Legal.draftBanner")}</p>
              {version.translation === "unreviewed-draft" ? (
                <p className="mt-1">{t("Legal.translationDraft")}</p>
              ) : null}
            </Notice>
          ) : null}
          {version.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28">
              <h2
                id={`${s.id}-h`}
                className="flex items-center gap-2.5 font-display text-xl font-bold text-ink"
              >
                <FileText aria-hidden className="size-4 text-accent-ink" />
                {s.heading}
              </h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 text-[1.0625rem] leading-relaxed text-ink-2">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
      </div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("Common.home"), url: absoluteUrl(localizedPath(locale, "/")) },
          { name: version.title, url: absoluteUrl(localizedPath(locale, `/${slug}`)) },
        ])}
      />
    </>
  );
}
