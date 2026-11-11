import { defineRouting } from "next-intl/routing";

export const locales = ["en", "hi", "mr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // English is served without a prefix; Hindi and Marathi use /hi and /mr.
  localePrefix: "as-needed",
  // A URL always resolves to one language: no Accept-Language redirects, no locale cookie.
  localeDetection: false,
  localeCookie: false,
  // hreflang alternates are emitted through the Metadata API (src/lib/seo.ts).
  alternateLinks: false,
});

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** BCP 47 tags used for <html lang>, hreflang and Intl formatting. */
export const localeTags: Record<Locale, string> = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

export const localeNames: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
};
