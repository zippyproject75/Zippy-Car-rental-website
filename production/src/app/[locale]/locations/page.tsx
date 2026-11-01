import { MapPin, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";

const PICKUP_LOCATIONS = [
  {
    id: "khadi-machine-chowk",
    name: {
      en: "Khadi Machine Chowk",
      hi: "खादी मशीन चौक",
      mr: "खादी मशीन चौक",
    },
    address: {
      en: "Khadi Machine Chowk, Pune, Maharashtra 411048",
      hi: "खादी मशीन चौक, पुणे, महाराष्ट्र 411048",
      mr: "खादी मशीन चौक, पुणे, महाराष्ट्र 411048",
    },
    mapUrl: "https://maps.app.goo.gl/NgJLjwf5Gz8Kayow9?g_st=awb",
  },
  {
    id: "ganga-dham",
    name: {
      en: "Ganga Dham",
      hi: "गंगा धाम",
      mr: "गंगा धाम",
    },
    address: {
      en: "Ganga Dham, Pune, Maharashtra 411048",
      hi: "गंगा धाम, पुणे, महाराष्ट्र 411048",
      mr: "गंगा धाम, पुणे, महाराष्ट्र 411048",
    },
    mapUrl: "https://maps.app.goo.gl/HhaVdxAMNHdPfZti7?g_st=awb",
  },
  {
    id: "undri",
    name: {
      en: "Undri",
      hi: "उंड्री",
      mr: "उंड्री",
    },
    address: {
      en: "Undri, Pune, Maharashtra 411060",
      hi: "उंड्री, पुणे, महाराष्ट्र 411060",
      mr: "उंड्री, पुणे, महाराष्ट्र 411060",
    },
    mapUrl: "https://maps.app.goo.gl/GgxcQBUnbwYiDJw87?g_st=awb",
  },
];

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    path: "/locations",
    title: t("locationsTitle"),
    description: t("locationsDescription"),
    absoluteTitle: true,
  });
}

export default async function LocationsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("Meta");

  return (
    <div className="container-site py-16 sm:py-20 lg:py-24">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-ink mb-4">
          {t("locationsTitle")}
        </h1>
        <p className="text-lg text-ink-2 mb-12">{t("locationsDescription")}</p>

        <div className="space-y-6">
          {PICKUP_LOCATIONS.map((location) => (
            <div
              key={location.id}
              className="rounded-card border border-line bg-raised p-6 shadow-raised hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-full bg-accent/10">
                  <MapPin className="size-6 text-accent-ink" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-xl font-bold text-ink mb-2">
                    {location.name[locale]}
                  </h2>
                  <p className="text-sm text-ink-2 leading-relaxed mb-4">
                    {location.address[locale]}
                  </p>
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent-ink hover:underline"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    {t("getDirections")}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
