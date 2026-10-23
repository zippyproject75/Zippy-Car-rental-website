import type { MetadataRoute } from "next";
import { CANONICAL_PRODUCTION_ORIGIN, env } from "@/lib/env";
import { sitemapEntries } from "@/lib/routes";

/**
 * Populated XML sitemap containing all eligible, canonical public URLs.
 * Emits the canonical HTTPS production origin (https://www.zippycarrental.in).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = env.siteUrl ?? CANONICAL_PRODUCTION_ORIGIN;
  return sitemapEntries({ isProduction: true, siteUrl }).map((entry) => ({
    url: entry.url,
    alternates: { languages: entry.languages },
  }));
}
