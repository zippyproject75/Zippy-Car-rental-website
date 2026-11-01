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
    label: c.unitNumber
      ? `${c.displayName} — ${t("vehicleUnit", { unit: c.unitNumber })}`
      : c.displayName,
  }));
  const branches: BookingBranchOption[] = getPublishedBranches(env.showPendingContent).map((b) => ({
    id: b.id,
    name: b.name[locale],
    pending: b.pending,
  }));
  const pickupLocations: BookingPickupLocationOption[] = site.branches
    .map((branch) => {
      const address = visibleFact(branch.address, env.showPendingContent);
      if (!address) return null;
      const fullAddress = `${address.value.lines.join(", ")}, ${address.value.locality} ${address.value.postalCode}`;
      return {
        id: branch.id,
        name: branch.name[locale],
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
      };
    })
    .filter((loc): loc is NonNullable<typeof loc> => loc !== null);
  return { cars, branches, pickupLocations, contacts: getVisibleContacts(env.showPendingContent) };
}
