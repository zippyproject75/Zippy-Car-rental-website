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
    description: "Self-drive car rental in Pune, Maharashtra, India.",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
  };
  const phone = site.contacts.primaryPhone;
  if (phone.status === "confirmed") {
    data.contactPoint = {
      "@type": "ContactPoint",
      telephone: phone.value.e164,
      contactType: "customer service",
      areaServed: site.city,
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
      areaServed: {
        "@type": "City",
        name: site.city,
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

export function carProductJsonLd(car: {
  displayName: string;
  make: string;
  model: string;
  slug: string;
  unitNumber?: number;
  images?: { primary?: { src: string } | null };
}): JsonLd | null {
  if (!env.isProduction || !env.siteUrl) return null;
  const carUrl = `${env.siteUrl}/cars/${car.slug}`;
  const name = car.unitNumber ? `${car.displayName} — Vehicle ${car.unitNumber}` : car.displayName;
  const imageUrl = car.images?.primary?.src
    ? `${env.siteUrl}${car.images.primary.src}`
    : `${env.siteUrl}/opengraph-image`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image: imageUrl,
    description: `Self-drive rental of ${car.displayName} in Pune from Zippy Car Rental.`,
    brand: {
      "@type": "Brand",
      name: car.make,
    },
    category: "Car Rental",
    url: carUrl,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      url: carUrl,
      description: "Price on request - contact Zippy Car Rental for current rates.",
    },
  };
}

/** Safe JSON serialisation for an inline <script type="application/ld+json">. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
