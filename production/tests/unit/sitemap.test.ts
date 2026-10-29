import { describe, expect, it } from "vitest";
import { sitemapEntries } from "@/lib/routes";

describe("sitemap validation", () => {
  it("validates sitemap structure and content for production", () => {
    const entries = sitemapEntries({
      isProduction: true,
      siteUrl: "https://www.zippycarrental.in",
    });

    // Verify sitemap is not empty in production
    expect(entries.length).toBeGreaterThan(0);

    // Verify all URLs are absolute HTTPS
    for (const entry of entries) {
      expect(entry.url).toMatch(/^https:\/\//);
      expect(entry.url).not.toContain("localhost");
      expect(entry.url).not.toContain("127.0.0.1");
      expect(entry.url).not.toContain("preview");
    }

    // Verify no duplicate URLs
    const urls = entries.map((e) => e.url);
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBe(urls.length);

    // Verify language alternates are present and well-formed
    for (const entry of entries) {
      expect(entry.languages).toBeDefined();
      expect(Object.keys(entry.languages).length).toBeGreaterThan(0);

      // Check that all alternates are absolute HTTPS URLs
      for (const url of Object.values(entry.languages)) {
        expect(url).toMatch(/^https:\/\//);
        expect(url).not.toContain("localhost");
        expect(url).not.toContain("127.0.0.1");
      }

      // Verify x-default is present when English is indexable
      if (entry.url.includes("www.zippycarrental.in") && !entry.url.includes("/hi") && !entry.url.includes("/mr")) {
        expect(entry.languages["x-default"]).toBeDefined();
      }
    }
  });

  it("excludes non-indexable pages from sitemap", () => {
    const entries = sitemapEntries({
      isProduction: true,
      siteUrl: "https://www.zippycarrental.in",
    });
    const urls = entries.map((e) => e.url);

    // /book should never be in sitemap
    expect(urls.some((u) => u.includes("/book"))).toBe(false);

    // /about should not be in sitemap (story not confirmed)
    expect(urls.some((u) => u.includes("/about"))).toBe(false);

    // /cars/ertiga-2 should not be in sitemap (noindex)
    expect(urls.some((u) => u.includes("/cars/ertiga-2"))).toBe(false);
  });

  it("includes approved legal pages and excludes draft legal pages", () => {
    const entries = sitemapEntries({
      isProduction: true,
      siteUrl: "https://www.zippycarrental.in",
    });
    const urls = entries.map((e) => e.url);

    // Terms & Conditions should be included (approved)
    expect(urls.some((u) => u.includes("/terms-and-conditions"))).toBe(true);

    // Privacy Policy should be included (approved)
    expect(urls.some((u) => u.includes("/privacy-policy"))).toBe(true);

    // Cookie Policy should not be included (draft)
    expect(urls.some((u) => u.includes("/cookie-policy"))).toBe(false);

    // Cancellation & Refund Policy should not be included (draft)
    expect(urls.some((u) => u.includes("/cancellation-and-refund-policy"))).toBe(false);
  });

  it("emits empty sitemap outside production or without confirmed domain", () => {
    expect(sitemapEntries({ isProduction: false, siteUrl: "https://example.test" })).toEqual([]);
    expect(sitemapEntries({ isProduction: true, siteUrl: undefined })).toEqual([]);
  });

  it("generates correct locale-prefixed URLs", () => {
    const entries = sitemapEntries({
      isProduction: true,
      siteUrl: "https://www.zippycarrental.in",
    });
    const urls = entries.map((e) => e.url);

    // English (default locale) should be unprefixed
    expect(urls.includes("https://www.zippycarrental.in")).toBe(true);
    expect(urls.includes("https://www.zippycarrental.in/cars")).toBe(true);

    // Hindi should be prefixed with /hi
    expect(urls.includes("https://www.zippycarrental.in/hi")).toBe(true);
    expect(urls.includes("https://www.zippycarrental.in/hi/cars")).toBe(true);

    // Marathi should be prefixed with /mr
    expect(urls.includes("https://www.zippycarrental.in/mr")).toBe(true);
    expect(urls.includes("https://www.zippycarrental.in/mr/cars")).toBe(true);
  });

  it("generates consistent language alternates across equivalent pages", () => {
    const entries = sitemapEntries({
      isProduction: true,
      siteUrl: "https://www.zippycarrental.in",
    });

    // Find homepage entry
    const homeEntry = entries.find((e) => e.url === "https://www.zippycarrental.in");
    expect(homeEntry).toBeDefined();
    expect(homeEntry?.languages).toEqual({
      "en-IN": "https://www.zippycarrental.in",
      "hi-IN": "https://www.zippycarrental.in/hi",
      "mr-IN": "https://www.zippycarrental.in/mr",
      "x-default": "https://www.zippycarrental.in",
    });

    // Find a car page entry
    const carEntry = entries.find((e) => e.url === "https://www.zippycarrental.in/cars/fronx");
    expect(carEntry).toBeDefined();
    expect(carEntry?.languages).toEqual({
      "en-IN": "https://www.zippycarrental.in/cars/fronx",
      "hi-IN": "https://www.zippycarrental.in/hi/cars/fronx",
      "mr-IN": "https://www.zippycarrental.in/mr/cars/fronx",
      "x-default": "https://www.zippycarrental.in/cars/fronx",
    });
  });

  it("does not include API routes or internal routes", () => {
    const entries = sitemapEntries({
      isProduction: true,
      siteUrl: "https://www.zippycarrental.in",
    });
    const urls = entries.map((e) => e.url);

    // No API routes
    expect(urls.some((u) => u.includes("/api/"))).toBe(false);

    // No internal routes
    expect(urls.some((u) => u.includes("/_next/"))).toBe(false);
  });
});
