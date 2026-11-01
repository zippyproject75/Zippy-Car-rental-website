import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCars, getPublishedBranches } from "@/lib/catalog";
import { getVisibleContacts } from "@/lib/contacts";
import { visibleFact } from "@/lib/content";
import { env } from "@/lib/env";
import { site } from "@/data/site";
import type { BookingBranchOption, BookingCarOption, BookingPickupLocationOption } from "./BookingForm";

/** Serializable, localized data for the client booking form (built on the server). */
export async function getBookingFormProps(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "Common" });
  const cars: BookingCarOption[] = getCars().map((c) => ({
    id: c.id,
    label: c.model,
  }));
  const branches: BookingBranchOption[] = getPublishedBranches(env.showPendingContent).map((b) => ({
    id: b.id,
    name: b.name[locale],
    pending: b.pending,
  }));
  const pickupLocations: BookingPickupLocationOption[] = [
    {
      id: "home-delivery",
      name: locale === "hi" ? "होम डिलीवरी" : locale === "mr" ? "होम डिलीवरी" : "Home Delivery",
      googleMapsUrl: "",
    },
    {
      id: "khadi-machine-chowk",
      name: locale === "hi" ? "खादी मशीन चौक" : locale === "mr" ? "खादी मशीन चौक" : "Khadi Machine Chowk",
      googleMapsUrl: "https://maps.app.goo.gl/NgJLjwf5Gz8Kayow9?g_st=awb",
    },
    {
      id: "ganga-dham",
      name: locale === "hi" ? "गंगा धाम" : locale === "mr" ? "गंगा धाम" : "Ganga Dham",
      googleMapsUrl: "https://maps.app.goo.gl/HhaVdxAMNHdPfZti7?g_st=awb",
    },
    {
      id: "undri",
      name: locale === "hi" ? "उंड्री" : locale === "mr" ? "उंड्री" : "Undri",
      googleMapsUrl: "https://maps.app.goo.gl/GgxcQBUnbwYiDJw87?g_st=awb",
    },
  ];
  return { cars, branches, pickupLocations, contacts: getVisibleContacts(env.showPendingContent) };
}
