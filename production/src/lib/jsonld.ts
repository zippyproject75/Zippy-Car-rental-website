import { site } from "@/data/site";
import { env } from "@/lib/env";

type JsonLd = Record<string, unknown>;

/**
 * Structured data is emitted only with a confirmed production origin and only from
 * verified facts that are also visible on the page. No ratings, reviews, prices,
 * coordinates or opening hours are ever added.
 */
export function organizationJsonLd(): JsonLd | null {
  if (!env.isProduction || !env.siteUrl) return null;
  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: env.siteUrl,
  };
  const phone = site.contacts.primaryPhone;
  if (phone.status === "confirmed") {
    data.contactPoint = {
      "@type": "ContactPoint",
      telephone: phone.value.e164,
      contactType: "customer service",
    };
  }
  return data;
}

export function autoRentalJsonLd(): JsonLd[] {
  if (!env.isProduction || !env.siteUrl) return [];
  const phone = site.contacts.primaryPhone;
  return site.branches.flatMap((b) => {
    if (b.address.status !== "confirmed") return [];
    const data: JsonLd = {
      "@context": "https://schema.org",
      "@type": "AutoRental",
      name: `${site.name} — ${b.name.en}`,
      url: env.siteUrl,
      address: {
        "@type": "PostalAddress",
        streetAddress: b.address.value.lines.join(", "),
        addressLocality: b.address.value.locality,
        postalCode: b.address.value.postalCode,
        addressRegion: site.region,
        addressCountry: site.country,
      },
    };
    if (phone.status === "confirmed") data.telephone = phone.value.e164;
    return [data];
  });
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]): JsonLd | null {
  if (!env.isProduction || !env.siteUrl) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Safe JSON serialisation for an inline <script type="application/ld+json">. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
