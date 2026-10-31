import type { Metadata } from "next";
import { localeTags, locales, type Locale } from "@/i18n/routing";
import { env, metadataOrigin } from "@/lib/env";
import { isPathContentIndexable, localizedPath } from "@/lib/routes";

const ogLocale: Record<Locale, string> = { en: "en_IN", hi: "hi_IN", mr: "mr_IN" };

export function absoluteUrl(path: string): string {
  const origin = metadataOrigin();
  return path === "/" ? origin : `${origin}${path}`;
}

export function isIndexable(path: string, locale: Locale): boolean {
  return env.isProduction && Boolean(env.siteUrl) && isPathContentIndexable(path, locale);
}

/** The single metadata builder used by every page. */
export function buildMetadata(options: {
  locale: Locale;
  /** English (unprefixed) path, e.g. "/cars/fronx". */
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
  forceNoindex?: boolean;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
}): Metadata {
  const { locale, path, title, description, image } = options;
  const canonical = absoluteUrl(localizedPath(locale, path));
  const indexable = !options.forceNoindex && isIndexable(path, locale);
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [localeTags[l], absoluteUrl(localizedPath(l, path))]),
  );
  languages["x-default"] = absoluteUrl(localizedPath("en", path));

  const ogImages = image
    ? [
        {
          url: image.url.startsWith("http") ? image.url : absoluteUrl(image.url),
          width: image.width ?? 1200,
          height: image.height ?? 630,
          alt: image.alt ?? title,
        },
      ]
    : [
        {
          url: absoluteUrl("/images/hero-highway-perfect.jpg"),
          width: 1200,
          height: 630,
          alt: "Zippy Car Rental — self-drive car rental in Pune",
        },
      ];

  const twitterImages = image
    ? [image.url.startsWith("http") ? image.url : absoluteUrl(image.url)]
    : [absoluteUrl("/images/hero-highway-perfect.jpg")];

  return {
    title: options.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph: {
      type: "website",
      siteName: "Zippy Car Rental",
      title,
      description,
      url: canonical,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: twitterImages,
    },
  };
}
