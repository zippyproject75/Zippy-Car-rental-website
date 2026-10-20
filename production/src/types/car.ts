import type { Fact, ImageAsset, Localized } from "./content";

export const carIds = ["fronx", "brezza", "baleno", "ertiga-1", "ertiga-2"] as const;
export type CarId = (typeof carIds)[number];

export type BodyType = "hatchback" | "compact-suv" | "mpv";
export type Transmission = "manual" | "automatic";
export type FuelType = "petrol" | "diesel" | "cng" | "petrol-cng";

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
  make: "Maruti Suzuki";
  model: "Fronx" | "Brezza" | "Baleno" | "Ertiga";
  /** Full approved display name, e.g. "Maruti Suzuki Fronx". */
  displayName: string;
  /** Only set for the two separate Ertiga units. */
  unitNumber?: 1 | 2;
  /** Owner-approved vehicle-specific description. Pending until supplied. */
  description: Fact<Localized<string>>;
  /** Owner-approved facts that distinguish the two Ertiga units (colour, variant …). */
  distinguishingDetails: Fact<Localized<string>>;
  specs: CarSpecs;
  images: { primary: ImageAsset | null; gallery: ImageAsset[] };
  faqTags: string[];
  /** False keeps the page noindex and out of the sitemap. */
  indexable: boolean;
  indexingNote?: string;
  sortOrder: number;
};
