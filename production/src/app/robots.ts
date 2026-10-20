import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

/**
 * Crawling is allowed everywhere so crawlers can see each page's robots meta and the
 * X-Robots-Tag header. Non-production builds send noindex on every response; only the
 * confirmed production origin advertises a sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  if (env.isProduction && env.siteUrl) {
    return { rules: { userAgent: "*", allow: "/" }, sitemap: `${env.siteUrl}/sitemap.xml` };
  }
  return { rules: { userAgent: "*", allow: "/" } };
}
