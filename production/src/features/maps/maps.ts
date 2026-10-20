import type { Locale } from "@/i18n/routing";

export type PostalAddress = { lines: string[]; locality: string; postalCode: string };

/** Single-line address used for display, directions and the map query. Never coordinates. */
export function addressQuery(address: PostalAddress, region = "Maharashtra", country = "India") {
  return `${address.lines.join(", ")}, ${address.locality} ${address.postalCode}, ${region}, ${country}`;
}

export function directionsUrl(address: PostalAddress): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressQuery(address))}`;
}

/** Google Maps Embed API "place" mode URL. Requires a restricted browser key. */
export function embedUrl(apiKey: string, address: PostalAddress, locale: Locale): string {
  const params = new URLSearchParams({
    key: apiKey,
    q: addressQuery(address),
    language: locale,
    region: "IN",
  });
  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
}
