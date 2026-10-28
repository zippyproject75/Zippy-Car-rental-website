import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { embedUrl, staticEmbedUrl, type PostalAddress } from "./maps";

/**
 * Static Google Maps embed frame. Uses standard static Google Maps embed without requiring
 * dynamic Maps API keys or billing.
 */
export function MapEmbed({
  apiKey,
  address,
  branchName,
}: {
  apiKey?: string;
  address: PostalAddress;
  branchName: string;
}) {
  const t = useTranslations("Maps");
  const locale = useLocale() as Locale;

  const mapSrc = apiKey ? embedUrl(apiKey, address, locale) : staticEmbedUrl(address);

  return (
    <div
      className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-sunken"
      data-testid="map"
    >
      <iframe
        title={t("mapTitle", { branch: branchName })}
        src={mapSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
        data-testid="map-iframe"
      />
    </div>
  );
}


