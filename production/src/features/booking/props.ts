import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCars, getPublishedBranches } from "@/lib/catalog";
import { getVisibleContacts } from "@/lib/contacts";
import { env } from "@/lib/env";
import type { BookingBranchOption, BookingCarOption } from "./BookingForm";

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
  return { cars, branches, contacts: getVisibleContacts(env.showPendingContent) };
}
