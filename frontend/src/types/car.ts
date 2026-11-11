import type { Fact, ImageAsset, Localized } from "./content";

export const carIds = ["fronx", "brezza", "baleno", "ertiga-1", "xl6"] as const;
export type CarId = string;

export type BodyType = string;
export type Transmission = string;
export type FuelType = string;

export type CarSpecs = {
  bodyType: Fact<BodyType>;
  seats: Fact<number>;
  transmission: Fact<Transmission>;
  fuel: Fact<FuelType>;
  modelYear: Fact<number>;
  variant: Fact<string>;
  colour: Fact<string>;
};

export type Car = {
  id: CarId;
  slug: CarId;
  make: string;
  model: string;
  /** Full approved display name, e.g. "Maruti Suzuki Fronx". */
  displayName: string;
  /** Only set for the two separate MPV units (Ertiga and XL6). */
  unitNumber?: 1 | 2;
  unitIdentifier?: string | null;
  /** Owner-approved vehicle-specific description. Pending until supplied. */
  description: Fact<Localized<string>>;
  /** Owner-approved facts that distinguish the two MPV units (colour, variant …). */
  distinguishingDetails: Fact<Localized<string>>;
  specs: CarSpecs;
  images: { primary: ImageAsset | null; gallery: ImageAsset[] };
  faqTags: string[];
  /** False keeps the page noindex and out of the sitemap. */
  indexable: boolean;
  indexingNote?: string;
  sortOrder: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  rentalPricing?: {
    packageCode: string;
    pricingStatus: "APPROVED" | "PENDING" | "PRICE_ON_REQUEST";
    amountInr: number | null;
    includedKm: number | null;
    extraKmChargeInr: number | null;
  }[];
};
