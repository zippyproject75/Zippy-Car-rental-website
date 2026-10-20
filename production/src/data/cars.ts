import type { Car, CarSpecs } from "@/types/car";
import type { Fact, Localized } from "@/types/content";

const pendingSpecs = (): CarSpecs => ({
  bodyType: pending("Body type to be confirmed by the owner"),
  seats: pending("Seating capacity to be confirmed by the owner"),
  transmission: pending("Transmission to be confirmed by the owner"),
  fuel: pending("Fuel type to be confirmed by the owner"),
  modelYear: pending("Model year to be confirmed by the owner"),
  variant: pending("Variant to be confirmed by the owner"),
  colour: pending("Colour to be confirmed by the owner"),
});

function pending<T>(note: string): Fact<T> {
  return { status: "pending", value: null, note };
}

const pendingDescription = (): Fact<Localized<string>> =>
  pending("Owner-approved vehicle description not yet supplied");

/**
 * THE authoritative fleet. Exactly five separate units. No specification, price, photo or
 * description is published until the owner confirms it.
 */
export const cars: readonly Car[] = [
  {
    id: "fronx",
    slug: "fronx",
    make: "Maruti Suzuki",
    model: "Fronx",
    displayName: "Maruti Suzuki Fronx",
    description: pendingDescription(),
    distinguishingDetails: pending("Not required for a single unit"),
    specs: pendingSpecs(),
    images: { primary: null, gallery: [] },
    faqTags: ["enquiry"],
    indexable: true,
    sortOrder: 1,
  },
  {
    id: "brezza",
    slug: "brezza",
    make: "Maruti Suzuki",
    model: "Brezza",
    // Owner input: confirm whether the unit is badged "Brezza" or the older "Vitara Brezza".
    displayName: "Maruti Suzuki Brezza",
    description: pendingDescription(),
    distinguishingDetails: pending("Not required for a single unit"),
    specs: pendingSpecs(),
    images: { primary: null, gallery: [] },
    faqTags: ["enquiry"],
    indexable: true,
    sortOrder: 2,
  },
  {
    id: "baleno",
    slug: "baleno",
    make: "Maruti Suzuki",
    model: "Baleno",
    displayName: "Maruti Suzuki Baleno",
    description: pendingDescription(),
    distinguishingDetails: pending("Not required for a single unit"),
    specs: pendingSpecs(),
    images: { primary: null, gallery: [] },
    faqTags: ["enquiry"],
    indexable: true,
    sortOrder: 3,
  },
  {
    id: "ertiga-1",
    slug: "ertiga-1",
    make: "Maruti Suzuki",
    model: "Ertiga",
    displayName: "Maruti Suzuki Ertiga",
    unitNumber: 1,
    description: pendingDescription(),
    distinguishingDetails: pending("Owner to confirm what distinguishes Ertiga Vehicle 1"),
    specs: pendingSpecs(),
    images: { primary: null, gallery: [] },
    faqTags: ["enquiry", "ertiga"],
    indexable: true,
    sortOrder: 4,
  },
  {
    id: "ertiga-2",
    slug: "ertiga-2",
    make: "Maruti Suzuki",
    model: "Ertiga",
    displayName: "Maruti Suzuki Ertiga",
    unitNumber: 2,
    description: pendingDescription(),
    distinguishingDetails: pending("Owner to confirm what distinguishes Ertiga Vehicle 2"),
    specs: pendingSpecs(),
    images: { primary: null, gallery: [] },
    faqTags: ["enquiry", "ertiga"],
    // Planning V2: noindex + excluded from sitemap until approved distinguishing details
    // and unique factual copy exist.
    indexable: false,
    indexingNote: "Awaiting approved distinguishing details and unique copy",
    sortOrder: 5,
  },
] as const;
