import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { sitemapEntries } from "@/lib/routes";

/** Production-only, indexable pages only. Empty in preview/development. */
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries({ isProduction: env.isProduction, siteUrl: env.siteUrl }).map((entry) => ({
    url: entry.url,
    alternates: { languages: entry.languages },
  }));
}
