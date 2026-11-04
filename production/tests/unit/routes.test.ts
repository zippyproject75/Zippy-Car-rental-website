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
      "/how-it-works",
      "/about",
      "/contact",
      "/faq",
      "/terms-and-conditions",
      "/privacy-policy",
      "/cookie-policy",
      "/cancellation-and-refund-policy",
      "/copyright",
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
    const approvedConfig: SiteConfig = {
      ...site,
      copyReview: { en: "approved", hi: "approved", mr: "approved" },
    };
    // Confirmed car: indexable
    expect(isPathContentIndexable("/cars/fronx", "en", approvedConfig)).toBe(true);
    // Duplicate car marked unindexable: excluded
    expect(isPathContentIndexable("/cars/ertiga-2", "en", approvedConfig)).toBe(false);
    // Booking enquiry flow: never indexed
    expect(isPathContentIndexable("/book", "en", approvedConfig)).toBe(false);
    // Static core pages
    expect(isPathContentIndexable("/", "en", approvedConfig)).toBe(true);
    expect(isPathContentIndexable("/cars", "en", approvedConfig)).toBe(true);
    expect(isPathContentIndexable("/how-it-works", "en", approvedConfig)).toBe(true);
  });
  it("populates sitemap entries with canonical URLs and locale alternates", () => {
    const entries = sitemapEntries({
      isProduction: true,
      siteUrl: "https://www.zippycarrental.in",
    });
    const urls = entries.map((e) => e.url);

    expect(urls).toHaveLength(36);
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
    const entries = sitemapEntries({
      isProduction: true,
      siteUrl: "https://www.zippycarrental.in",
    });
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/book"))).toBe(false);
  });
});

describe("content security policy", () => {
  it("blocks framing and third-party scripts and only allows Google frames when maps are on", () => {
    const csp = buildContentSecurityPolicy({
      isDev: false,
      mapsEnabled: true,
    });
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("frame-src https://www.google.com");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("object-src 'none'");
  });
});
