import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots.txt validation", () => {
  it("generates valid robots configuration", () => {
    const robotsConfig = robots();

    // Verify structure
    expect(robotsConfig).toHaveProperty("rules");
    expect(robotsConfig).toHaveProperty("sitemap");

    // Verify rules allow crawling
    expect(robotsConfig.rules).toEqual({ userAgent: "*", allow: "/" });

    // Verify sitemap URL is correct
    expect(robotsConfig.sitemap).toBe("https://www.zippycarrental.in/sitemap.xml");
  });

  it("does not accidentally block the entire site", () => {
    const robotsConfig = robots();

    // Should not have disallow: /
    if (Array.isArray(robotsConfig.rules)) {
      for (const rule of robotsConfig.rules) {
        expect(rule.disallow).not.toBe("/");
      }
    }
  });

  it("sitemap URL uses HTTPS and correct domain", () => {
    const robotsConfig = robots();

    expect(robotsConfig.sitemap).toMatch(/^https:\/\//);
    expect(robotsConfig.sitemap).toContain("www.zippycarrental.in");
    expect(robotsConfig.sitemap).not.toContain("localhost");
    expect(robotsConfig.sitemap).not.toContain("127.0.0.1");
  });
});
