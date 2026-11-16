import type { MetadataRoute } from "next";
import { CANONICAL_PRODUCTION_ORIGIN, env } from "@/lib/env";

/**
 * Crawling is allowed everywhere so crawlers can see each page's robots meta and the
 * X-Robots-Tag header. The canonical production origin advertises the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const origin = env.siteUrl ?? CANONICAL_PRODUCTION_ORIGIN;
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${origin}/sitemap.xml`,
  };
}
