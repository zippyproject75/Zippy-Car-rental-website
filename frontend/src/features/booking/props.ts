import type { Locale } from "@/i18n/routing";
import { getPublicCars, getPublishedBranches } from "@/lib/catalog";
import { backendApiUrl } from "@/lib/auth-api";
import { getVisibleContacts } from "@/lib/contacts";
import { env } from "@/lib/env";
import type { Car } from "@/types/car";
import type {
  BookingBranchOption,
  BookingCarOption,
  BookingPickupLocationOption,
} from "./BookingForm";

/** Serializable, localized data for the client booking form (built on the server). */
export async function getBookingFormProps(locale: Locale, catalog?: readonly Car[]) {
  const vehicles = catalog ?? (await getPublicCars());
  const cars: BookingCarOption[] = vehicles.map((c) => ({
    id: c.id,
    label: c.model,
    rentalPricing: c.rentalPricing,
  }));
  const branches: BookingBranchOption[] = getPublishedBranches(env.showPendingContent).map((b) => ({
    id: b.id,
    name: b.name[locale],
    pending: b.pending,
  }));
  const fallbackPickupLocations: BookingPickupLocationOption[] = [
    {
      id: "home-delivery",
      name: locale === "hi" ? "होम डिलीवरी" : locale === "mr" ? "होम डिलीवरी" : "Home Delivery",
      googleMapsUrl: "",
    },
    {
      id: "khadi-machine-chowk",
      name:
        locale === "hi"
          ? "खादी मशीन चौक"
          : locale === "mr"
            ? "खादी मशीन चौक"
            : "Khadi Machine Chowk",
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
  let pickupLocations = fallbackPickupLocations;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const response = await fetch(backendApiUrl(`/api/public/locations/${locale}`), {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Pickup location request failed with status ${response.status}.`);
    }
    const result = (await response.json()) as {
      locations: { slug: string; name: string }[];
    };
    if (!Array.isArray(result.locations)) {
      throw new Error("The pickup location response has an invalid shape.");
    }
    pickupLocations = result.locations.map((location) => ({
      id: location.slug,
      name: location.name,
      googleMapsUrl:
        fallbackPickupLocations.find((item) => item.id === location.slug)?.googleMapsUrl ?? "",
    }));
  }
  return { cars, branches, pickupLocations, contacts: getVisibleContacts(env.showPendingContent) };
}
