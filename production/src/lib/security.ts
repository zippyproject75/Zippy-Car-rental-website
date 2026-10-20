/**
 * Shared by next.config.ts (build time) and the app. Keep this file free of path aliases
 * so the Next.js config loader can import it directly.
 */
export type SiteEnv = "development" | "preview" | "production";

export function resolveSiteEnv(): SiteEnv {
  const value = process.env.NEXT_PUBLIC_SITE_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (value === "production" || value === "preview" || value === "development") return value;
  return "development";
}

export function isProductionSite(): boolean {
  return resolveSiteEnv() === "production";
}

export function buildContentSecurityPolicy(options: {
  isDev: boolean;
  mapsEnabled: boolean;
}): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // Static prerendering is incompatible with per-request nonces; Next.js and next-themes
    // inline bootstrap scripts therefore need 'unsafe-inline'. No third-party scripts load.
    "script-src": ["'self'", "'unsafe-inline'", ...(options.isDev ? ["'unsafe-eval'"] : [])],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'"],
    "connect-src": ["'self'", ...(options.isDev ? ["ws:", "wss:"] : [])],
    // Google Maps Embed API iframes load only after a visitor clicks "View map".
    "frame-src": options.mapsEnabled ? ["https://www.google.com"] : ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "manifest-src": ["'self'"],
  };
  const policy = Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");
  return options.isDev ? policy : `${policy}; upgrade-insecure-requests`;
}
