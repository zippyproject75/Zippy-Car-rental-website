import { cars } from "@/data/cars";
import { getApprovedFaqs } from "@/data/faqs";
import { isLegalApproved, legalDocuments } from "@/data/legal";
import { site } from "@/data/site";
import { locales, type Locale } from "@/i18n/routing";
import type { SiteConfig } from "@/types/site";

/** Every public English path. Localized paths add a /hi or /mr prefix. */
export function allPublicPaths(): string[] {
  return [
    "/",
    "/cars",
    ...cars.map((c) => `/cars/${c.slug}`),
    "/book",
    "/about",
    "/contact",
    "/faq",
    ...legalDocuments.map((d) => `/${d.slug}`),
  ];
}

export function localizedPath(locale: Locale, path: string): string {
  if (locale === "en") return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

function contactConfirmed(config: SiteConfig): boolean {
  const c = config.contacts;
  return (
    c.primaryPhone.status === "confirmed" ||
    c.email.status === "confirmed" ||
    config.branches.some((b) => b.address.status === "confirmed")
  );
}

/** Whether the page's own content allows indexing (independent of environment). */
export function isPathContentIndexable(path: string, locale: Locale, config = site): boolean {
  if (config.copyReview[locale] !== "approved") return false;
  if (path === "/" || path === "/cars") return true;
  if (path.startsWith("/cars/"))
    return cars.find((c) => `/cars/${c.slug}` === path)?.indexable ?? false;
  if (path === "/book") return false;
  if (path === "/about") return config.aboutStory.status === "confirmed";
  if (path === "/contact") return contactConfirmed(config);
  if (path === "/faq") return getApprovedFaqs().length > 0;
  const doc = legalDocuments.find((d) => `/${d.slug}` === path);
  if (doc) return isLegalApproved(doc.content[locale]);
  return false;
}

export type SitemapEntry = { url: string; languages: Record<string, string> };

/** Sitemap entries: production only, indexable pages only, per locale. */
export function sitemapEntries(options: {
  isProduction: boolean;
  siteUrl: string | undefined;
  config?: SiteConfig;
}): SitemapEntry[] {
  const { isProduction, siteUrl, config = site } = options;
  if (!isProduction || !siteUrl) return [];
  const entries: SitemapEntry[] = [];
  for (const path of allPublicPaths()) {
    const indexableLocales = locales.filter((l) => isPathContentIndexable(path, l, config));
    for (const locale of indexableLocales) {
      entries.push({
        url: `${siteUrl}${localizedPath(locale, path) === "/" ? "" : localizedPath(locale, path)}`,
        languages: Object.fromEntries(
          indexableLocales.map((l) => [
            l,
            `${siteUrl}${localizedPath(l, path) === "/" ? "" : localizedPath(l, path)}`,
          ]),
        ),
      });
    }
  }
  return entries;
}
