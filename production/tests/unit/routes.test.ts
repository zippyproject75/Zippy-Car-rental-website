import { describe, expect, it } from "vitest";
import { site } from "@/data/site";
import {
  allPublicPaths,
  isPathContentIndexable,
  localizedPath,
  sitemapEntries,
} from "@/lib/routes";
import { buildContentSecurityPolicy } from "@/lib/security";
import type { SiteConfig } from "@/types/site";

describe("routes", () => {
  it("lists every public page", () => {
    expect(allPublicPaths()).toEqual([
      "/",
      "/cars",
      "/cars/fronx",
      "/cars/brezza",
      "/cars/baleno",
      "/cars/ertiga-1",
      "/cars/ertiga-2",
      "/book",
      "/about",
      "/contact",
      "/faq",
      "/terms-and-conditions",
      "/privacy-policy",
      "/cookie-policy",
      "/cancellation-and-refund-policy",
    ]);
  });
  it("prefixes only Hindi and Marathi", () => {
    expect(localizedPath("en", "/cars")).toBe("/cars");
    expect(localizedPath("hi", "/")).toBe("/hi");
    expect(localizedPath("mr", "/cars/fronx")).toBe("/mr/cars/fronx");
  });
});

describe("indexing", () => {
  it("emits no sitemap outside production or without a confirmed domain", () => {
    expect(sitemapEntries({ isProduction: false, siteUrl: "https://example.test" })).toEqual([]);
    expect(sitemapEntries({ isProduction: true, siteUrl: undefined })).toEqual([]);
  });
  it("indexes nothing until the copy for a language is approved", () => {
    for (const path of allPublicPaths()) {
      if (site.copyReview.en !== "approved") expect(isPathContentIndexable(path, "en")).toBe(false);
    }
  });
  it("never indexes /book and only approved languages appear in the sitemap", () => {
    const config: SiteConfig = {
      ...site,
      copyReview: { en: "approved", hi: "pending-review", mr: "pending-review" },
    };
    expect(isPathContentIndexable("/book", "en", config)).toBe(false);
    const entries = sitemapEntries({ isProduction: true, siteUrl: "https://example.test", config });
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://example.test");
    expect(urls).toContain("https://example.test/cars/ertiga-1");
    // Ertiga Vehicle 2 stays noindex until distinguishing details are approved.
    expect(urls).not.toContain("https://example.test/cars/ertiga-2");
    expect(urls.some((u) => u.includes("/book"))).toBe(false);
    expect(urls.some((u) => u.includes("/hi") || u.includes("/mr"))).toBe(false);
  });
});

describe("content security policy", () => {
  it("blocks framing and third-party scripts and only allows Google frames when maps are on", () => {
    const off = buildContentSecurityPolicy({ isDev: false, mapsEnabled: false });
    expect(off).toContain("frame-ancestors 'none'");
    expect(off).toContain("frame-src 'none'");
    expect(off).not.toContain("unsafe-eval");
    expect(buildContentSecurityPolicy({ isDev: false, mapsEnabled: true })).toContain(
      "frame-src https://www.google.com",
    );
  });
});
