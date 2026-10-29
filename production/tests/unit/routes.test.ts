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
  it("indexes nothing when the copy for a language is pending-review", () => {
    const unapprovedConfig: SiteConfig = {
      ...site,
      copyReview: { en: "pending-review", hi: "pending-review", mr: "pending-review" },
    };
    for (const path of allPublicPaths()) {
      expect(isPathContentIndexable(path, "en", unapprovedConfig)).toBe(false);
    }
  });
  it("indexes eligible pages and excludes unconfirmed/duplicate pages with approved copy", () => {
    expect(isPathContentIndexable("/", "en")).toBe(true);
    expect(isPathContentIndexable("/cars", "en")).toBe(true);
    expect(isPathContentIndexable("/cars/fronx", "en")).toBe(true);
    expect(isPathContentIndexable("/cars/brezza", "en")).toBe(true);
    expect(isPathContentIndexable("/cars/baleno", "en")).toBe(true);
    expect(isPathContentIndexable("/cars/ertiga-1", "en")).toBe(true);
    expect(isPathContentIndexable("/faq", "en")).toBe(true);
    expect(isPathContentIndexable("/contact", "en")).toBe(true);

    // Excluded pages
    expect(isPathContentIndexable("/cars/ertiga-2", "en")).toBe(false);
    expect(isPathContentIndexable("/book", "en")).toBe(false);
    expect(isPathContentIndexable("/about", "en")).toBe(false);
    // Terms & Conditions and Privacy Policy are now approved and indexable
    expect(isPathContentIndexable("/terms-and-conditions", "en")).toBe(true);
    expect(isPathContentIndexable("/privacy-policy", "en")).toBe(true);
  });
  it("populates sitemap entries with canonical URLs and locale alternates", () => {
    const entries = sitemapEntries({
      isProduction: true,
      siteUrl: "https://www.zippycarrental.in",
    });
    const urls = entries.map((e) => e.url);

    // Exactly 10 pages * 3 locales = 30 URLs (added Terms & Conditions and Privacy Policy)
    expect(urls).toHaveLength(30);
    expect(urls).toContain("https://www.zippycarrental.in");
    expect(urls).toContain("https://www.zippycarrental.in/hi");
    expect(urls).toContain("https://www.zippycarrental.in/mr");
    expect(urls).toContain("https://www.zippycarrental.in/cars/ertiga-1");
    expect(urls).not.toContain("https://www.zippycarrental.in/cars/ertiga-2");
    expect(urls.some((u) => u.includes("/book"))).toBe(false);
    expect(urls.some((u) => u.includes("/about"))).toBe(false);

    // Check language alternates format
    const homeEntry = entries.find((e) => e.url === "https://www.zippycarrental.in");
    expect(homeEntry?.languages).toEqual({
      "en-IN": "https://www.zippycarrental.in",
      "hi-IN": "https://www.zippycarrental.in/hi",
      "mr-IN": "https://www.zippycarrental.in/mr",
      "x-default": "https://www.zippycarrental.in",
    });
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
