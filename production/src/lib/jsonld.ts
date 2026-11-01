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
    description: "Self-drive car rental service in Pune, Maharashtra, India. Offers Maruti Suzuki vehicles with doorstep delivery options.",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: {
      "@type": "City",
      name: site.city,
    },
    availableLanguage: ["English", "Hindi", "Marathi"],
  };
  const phone = site.contacts.primaryPhone;
  if (phone.status === "confirmed") {
    data.contactPoint = {
      "@type": "ContactPoint",
      telephone: phone.value.e164,
      contactType: "customer service",
      areaServed: site.city,
      availableLanguage: ["English", "Hindi", "Marathi"],
    };
  }
  if (site.brand.logo.status === "confirmed") {
    data.logo = `${env.siteUrl}${site.brand.logo.value.src}`;
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
      description: "Self-drive car rental service in Pune, Maharashtra. Fleet includes Maruti Suzuki vehicles with doorstep delivery available.",
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
      availableLanguage: ["English", "Hindi", "Marathi"],
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

export function faqPageJsonLd(faqs: { question: string; answer: string }[]): JsonLd | null {
  if (!env.isProduction || !env.siteUrl || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function webSiteJsonLd(): JsonLd | null {
  if (!env.isProduction || !env.siteUrl) return null;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: env.siteUrl,
    description: "Self-drive car rental service in Pune, Maharashtra, India. Browse available Maruti Suzuki vehicles and send rental enquiries.",
    inLanguage: ["en-IN", "hi-IN", "mr-IN"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${env.siteUrl}/cars`,
        actionPlatform: "https://schema.org/DesktopWebPlatform",
      },
      "query-input": "required name",
    },
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
    description: `Self-drive rental of ${car.displayName} in Pune from Zippy Car Rental. Send an enquiry to check availability and rates.`,
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
      description: "Price on request - contact Zippy Car Rental for current rates via WhatsApp enquiry.",
    },
    areaServed: {
      "@type": "City",
      name: site.city,
    },
  };
}

export function localBusinessJsonLd(
  branch: { id: string; name: { en: string; hi: string; mr: string } },
  fullAddress: string
): JsonLd | null {
  if (!env.isProduction || !env.siteUrl) return null;
  const branchUrl = `${env.siteUrl}/locations/${branch.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: `${site.name} — ${branch.name.en}`,
    url: branchUrl,
    description: `Self-drive car rental pickup location at ${branch.name.en} in Pune, Maharashtra. Part of Zippy Car Rental's fleet of Maruti Suzuki vehicles.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: fullAddress,
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: {
      "@type": "City",
      name: site.city,
    },
    availableLanguage: ["English", "Hindi", "Marathi"],
  };
}

/** Safe JSON serialisation for an inline <script type="application/ld+json">. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
