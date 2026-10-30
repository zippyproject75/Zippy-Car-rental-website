import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCars, getPublishedBranches } from "@/lib/catalog";
import { getVisibleContacts } from "@/lib/contacts";
import { env } from "@/lib/env";
import type { BookingBranchOption, BookingCarOption, BookingPickupLocationOption } from "./BookingForm";

/** Serializable, localized data for the client booking form (built on the server). */
export async function getBookingFormProps(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "Common" });
  const cars: BookingCarOption[] = getCars().map((c) => ({
    id: c.id,
    label: c.unitNumber
      ? `${c.displayName} — ${t("vehicleUnit", { unit: c.unitNumber })}`
      : c.displayName,
  }));
  const branches: BookingBranchOption[] = getPublishedBranches(env.showPendingContent).map((b) => ({
    id: b.id,
    name: b.name[locale],
    pending: b.pending,
  }));
  const pickupLocations: BookingPickupLocationOption[] = [
    {
      id: "1",
      name: "Pickup Location 1 - Kamthe Patil Business Center",
      googleMapsUrl: "https://maps.app.goo.gl/djJbgsDjYRjmRTS46?g_st=awb",
    },
    {
      id: "2",
      name: "Pickup Location 2 - S. No 47, Tilekar Nagar, Kondhwa Budruk",
      googleMapsUrl: "https://maps.app.goo.gl/mCiepbpm1HKzLvdFA?g_st=awb",
    },
    {
      id: "3",
      name: "Pickup Location 3 - RK COMPLEX, Undri Chowk",
      googleMapsUrl: "https://maps.app.goo.gl/Q7BcqGz99FZdcB2U8?g_st=awb",
    },
  ];
  return { cars, branches, pickupLocations, contacts: getVisibleContacts(env.showPendingContent) };
}
