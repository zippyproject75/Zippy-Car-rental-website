import { MapPin, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";

const PICKUP_LOCATIONS = [
  {
    id: "kondhwa",
    name: {
      en: "Kondhwa",
      hi: "कोंढवा",
      mr: "कोंढवा",
    },
    address: {
      en: "Raghunandan kasturi, near sinhagad college, Antulya Nagar, Kondhwa Budruk, Pune, Maharashtra 411048",
      hi: "रघुनंदन कस्तुरी, सिंहगड कॉलेज के पास, अंतुल्या नगर, कोंढवा बुड्रुक, पुणे, महाराष्ट्र 411048",
      mr: "रघुनंदन कस्तुरी, सिंहगड कॉलेजच्या पास, अंतुल्या नगर, कोंढवा बुड्रुक, पुणे, महाराष्ट्र 411048",
    },
    mapUrl: "https://maps.app.goo.gl/djJbgsDjYRjmRTS46?g_st=awb",
  },
  {
    id: "kondhwa-2",
    name: {
      en: "Kondhwa - Tilekar Nagar",
      hi: "कोंढवा - टिलकर नगर",
      mr: "कोंढवा - टिलकर नगर",
    },
    address: {
      en: "S. No 47, Tilekar Nagar, Kondhwa Budruk, Pune, Maharashtra 411048",
      hi: "एस नंबर 47, टिलकर नगर, कोंढवा बुड्रुक, पुणे, महाराष्ट्र 411048",
      mr: "एस नंबर 47, टिलकर नगर, कोंढवा बुड्रुक, पुणे, महाराष्ट्र 411048",
    },
    mapUrl: "https://maps.app.goo.gl/mCiepbpm1HKzLvdFA?g_st=awb",
  },
  {
    id: "undri",
    name: {
      en: "Undri",
      hi: "उंड्री",
      mr: "उंड्री",
    },
    address: {
      en: "SHOP NO 1, GROUND FLOOR, RK COMPLEX, Road, opposite EURO INTERNATIONAL SCHOOL, Undri Chowk, Undri, Pune, Maharashtra 411060",
      hi: "शॉप नंबर 1, ग्राउंड फ्लोर, आरके कॉम्प्लेक्स, रोड, यूरो इंटरनेशनल स्कूल के विपरीत, उंड्री चौक, उंड्री, पुणे, महाराष्ट्र 411060",
      mr: "शॉप नंबर 1, ग्राउंड फ्लोर, आरके कॉम्प्लेक्स, रोड, यूरो इंटरनेशनल स्कूलच्या विरुद्ध, उंड्री चौक, उंड्री, पुणे, महाराष्ट्र 411060",
    },
    mapUrl: "https://maps.app.goo.gl/Q7BcqGz99FZdcB2U8?g_st=awb",
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
