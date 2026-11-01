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
      id: "kondhwa",
      name: locale === "hi" ? "कोंढवा - रघुनंदन कस्तुरी" : locale === "mr" ? "कोंढवा - रघुनंदन कस्तुरी" : "Kondhwa - Raghunandan Kasturi",
      googleMapsUrl: "https://maps.app.goo.gl/djJbgsDjYRjmRTS46?g_st=awb",
    },
    {
      id: "kondhwa-2",
      name: locale === "hi" ? "कोंढवा - टिलकर नगर" : locale === "mr" ? "कोंढवा - टिलकर नगर" : "Kondhwa - Tilekar Nagar",
      googleMapsUrl: "https://maps.app.goo.gl/mCiepbpm1HKzLvdFA?g_st=awb",
    },
    {
      id: "undri",
      name: locale === "hi" ? "उंड्री - RK कॉम्प्लेक्स" : locale === "mr" ? "उंड्री - RK कॉम्प्लेक्स" : "Undri - RK Complex",
      googleMapsUrl: "https://maps.app.goo.gl/Q7BcqGz99FZdcB2U8?g_st=awb",
    },
  ];
  return { cars, branches, pickupLocations, contacts: getVisibleContacts(env.showPendingContent) };
}
