import { cars } from "@/data/cars";
import { site } from "@/data/site";
import { backendApiUrl } from "@/lib/auth-api";
import { visibleFact } from "@/lib/content";
import type { Car, CarId } from "@/types/car";
import type { Fact, Localized } from "@/types/content";
import type { Branch } from "@/types/site";

export function getCars(): readonly Car[] {
  return [...cars].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCarBySlug(slug: string): Car | undefined {
  return cars.find((c) => c.slug === slug);
}

export function isCarId(value: string | null | undefined): value is CarId {
  return Boolean(value && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value));
}

export function getRelatedCars(car: Car, catalog: readonly Car[] = getCars()): Car[] {
  return catalog.filter((c) => c.id !== car.id);
}

type PublicCatalogPhoto = {
  url: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
};

type PublicCatalogVehicle = {
  slug: string;
  make: string;
  model: string;
  displayName: string;
  variant: string | null;
  unitIdentifier: string | null;
  fuelType: string | null;
  transmission: string | null;
  seatingCapacity: number | null;
  bodyType: string | null;
  description: string;
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
  photos: PublicCatalogPhoto[];
  pricing: NonNullable<Car["rentalPricing"]>;
};

function localizedText(value: string): Localized<string> {
  return { en: value, hi: value, mr: value };
}

function fact<T>(value: T | null, label: string): Fact<T> {
  return value === null
    ? { status: "pending", value: null, note: `${label} has not been confirmed.` }
    : { status: "confirmed", value, source: "Owner-managed catalog" };
}

function mapPublicVehicle(vehicle: PublicCatalogVehicle, sortOrder: number): Car {
  const fallback = cars.find((car) => car.slug === vehicle.slug);
  const photos = vehicle.photos.map((photo) => ({
    src: photo.url,
    alt: localizedText(photo.altText || vehicle.displayName),
  }));
  const primaryIndex = Math.max(
    0,
    vehicle.photos.findIndex((photo) => photo.isPrimary),
  );
  const primary = photos[primaryIndex] ?? null;
  const gallery = photos.filter((_, index) => index !== primaryIndex);
  const description =
    vehicle.description.trim().length > 0
      ? {
          status: "confirmed" as const,
          value: localizedText(vehicle.description),
          source: "Owner-managed catalog",
        }
      : {
          status: "pending" as const,
          value: null,
          note: "Owner-approved vehicle description not yet supplied.",
        };
  const unitNumber = vehicle.unitIdentifier?.match(/\d+/)?.[0];

  return {
    id: vehicle.slug,
    slug: vehicle.slug,
    make: vehicle.make,
    model: vehicle.model,
    displayName: vehicle.displayName,
    unitNumber: unitNumber === "1" ? 1 : unitNumber === "2" ? 2 : undefined,
    unitIdentifier: vehicle.unitIdentifier,
    description,
    distinguishingDetails: fallback?.distinguishingDetails ?? {
      status: "pending",
      value: null,
      note: "Vehicle-specific details have not been confirmed.",
    },
    specs: {
      bodyType: fact(vehicle.bodyType, "Body type"),
      seats: fact(vehicle.seatingCapacity, "Seating capacity"),
      transmission: fact(vehicle.transmission, "Transmission"),
      fuel: fact(vehicle.fuelType, "Fuel type"),
      modelYear: fallback?.specs.modelYear ?? {
        status: "pending",
        value: null,
        note: "Model year has not been confirmed.",
      },
      variant: fact(vehicle.variant, "Variant"),
      colour: fallback?.specs.colour ?? {
        status: "pending",
        value: null,
        note: "Colour has not been confirmed.",
      },
    },
    images: {
      primary,
      gallery,
    },
    faqTags: fallback?.faqTags ?? [],
    indexable: true,
    sortOrder: vehicle.displayOrder ?? sortOrder,
    isAvailable: vehicle.isAvailable,
    isFeatured: vehicle.isFeatured,
    rentalPricing: vehicle.pricing,
  };
}

export async function getPublicCars(): Promise<Car[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [...getCars()];

  const response = await fetch(backendApiUrl("/api/public/catalog"), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Public vehicle catalog request failed with status ${response.status}.`);
  }
  const result = (await response.json()) as { vehicles: PublicCatalogVehicle[] };
  if (!Array.isArray(result.vehicles)) {
    throw new Error("The public vehicle catalog response has an invalid shape.");
  }
  return result.vehicles
    .map((vehicle, index) =>
      mapPublicVehicle(
        {
          ...vehicle,
          pricing: vehicle.pricing.map((price) => ({
            ...price,
            amountInr: price.amountInr === null ? null : Number(price.amountInr),
            includedKm: price.includedKm === null ? null : Number(price.includedKm),
            extraKmChargeInr:
              price.extraKmChargeInr === null ? null : Number(price.extraKmChargeInr),
          })),
        },
        index,
      ),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export type PublishedBranch = Branch & {
  publicAddress: { lines: string[]; locality: string; postalCode: string };
  pending: boolean;
};

/** Branches whose address may be shown (confirmed, or pending in preview builds). */
export function getPublishedBranches(showPending: boolean): PublishedBranch[] {
  return site.branches.flatMap((b) => {
    const address = visibleFact(b.address, showPending);
    return address ? [{ ...b, publicAddress: address.value, pending: address.pending }] : [];
  });
}
