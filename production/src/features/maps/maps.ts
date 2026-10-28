import type { Locale } from "@/i18n/routing";

export type PostalAddress = { lines: string[]; locality: string; postalCode: string };

/** Single-line address used for display, directions and the map query. Never coordinates. */
export function addressQuery(address: PostalAddress, region = "Maharashtra", country = "India") {
  return `${address.lines.join(", ")}, ${address.locality} ${address.postalCode}, ${region}, ${country}`;
}

/** Branch redirect links for Google Maps */
export const BRANCH_MAP_REDIRECTS: Record<string, string> = {
  kondhwa: "https://maps.app.goo.gl/NgJLjwf5Gz8Kayow9?g_st=awb",
  gangadham: "https://maps.app.goo.gl/HhaVdxAMNHdPfZti7?g_st=awb",
  undri: "https://maps.app.goo.gl/GgxcQBUnbwYiDJw87?g_st=awb",
  "411048": "https://maps.app.goo.gl/NgJLjwf5Gz8Kayow9?g_st=awb",
  "411037": "https://maps.app.goo.gl/HhaVdxAMNHdPfZti7?g_st=awb",
  "411060": "https://maps.app.goo.gl/GgxcQBUnbwYiDJw87?g_st=awb",
};

export function directionsUrl(address: PostalAddress, branchId?: string): string {
  const branchRedirect = branchId ? BRANCH_MAP_REDIRECTS[branchId] : undefined;
  if (branchRedirect) {
    return branchRedirect;
  }
  const postalRedirect = address.postalCode ? BRANCH_MAP_REDIRECTS[address.postalCode] : undefined;
  if (postalRedirect) {
    return postalRedirect;
  }
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

/** Static Google Maps embed URL that works directly without requiring an API key. */
export function staticEmbedUrl(address: PostalAddress): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery(address))}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
}
