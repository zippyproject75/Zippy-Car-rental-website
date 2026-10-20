import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";
import { buildContentSecurityPolicy, isProductionSite } from "./src/lib/security";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isFigmaPreview = Boolean(process.env.FIGMA);
const cspMode = process.env.CSP_MODE === "enforce" ? "enforce" : "report-only";
const baseCsp = buildContentSecurityPolicy({
  isDev: process.env.NODE_ENV === "development",
  mapsEnabled: Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY),
});
const csp = isFigmaPreview ? baseCsp.replace("; frame-ancestors 'none'", "") : baseCsp;

const securityHeaders = [
  {
    key: cspMode === "enforce" ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
    value: csp,
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  ...(isFigmaPreview ? [] : [{ key: "X-Frame-Options", value: "DENY" }]),
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Non-production builds must never be indexed, even when robots.txt allows crawling
  // (crawlers need to fetch a page to observe its noindex directive).
  ...(isProductionSite() ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false,
  // production/ is a standalone app inside the prototype repository (two lockfiles).
  turbopack: { root: path.resolve(__dirname) },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Legacy routes from the previous site. Only same-model routes are redirected.
    // /booking/city, /booking/i20, /booking/swift and /booking/xl6 intentionally 404
    // until the legacy content and traffic are verified (see plans/plan.md §4.3).
    return [
      { source: "/booking/fronx", destination: "/cars/fronx", permanent: true },
      { source: "/booking/brezza", destination: "/cars/brezza", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
