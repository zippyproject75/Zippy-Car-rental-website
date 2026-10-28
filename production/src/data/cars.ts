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

function confirmed<T>(value: T, source = "Fleet specification"): Fact<T> {
  return { status: "confirmed", value, source };
}

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
    images: {
      primary: {
        src: "/images/cars/fronx.jpeg",
        width: 1600,
        height: 728,
        alt: {
          en: "Maruti Suzuki Fronx in Pune",
          hi: "पुणे में मारुति सुजुकी फ्रोंक्स",
          mr: "पुण्यातील मारुती सुझुकी फ्रॉन्क्स",
        },
      },
      gallery: [],
    },
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
    images: {
      primary: {
        src: "/images/cars/brezza.jpeg",
        width: 1086,
        height: 1448,
        alt: {
          en: "Maruti Suzuki Brezza in Pune",
          hi: "पुणे में मारुति सुजुकी ब्रेज़ा",
          mr: "पुण्यातील मारुती सुझुकी ब्रेझा",
        },
      },
      gallery: [],
    },
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
    images: {
      primary: {
        src: "/images/cars/baleno.jpeg",
        width: 1280,
        height: 960,
        alt: {
          en: "Maruti Suzuki Baleno in Pune",
          hi: "पुणे में मारुति सुजुकी बलेनो",
          mr: "पुण्यातील मारुती सुझुकी बलेनो",
        },
      },
      gallery: [],
    },
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
    images: {
      primary: {
        src: "/images/cars/ertiga.jpeg",
        width: 1280,
        height: 960,
        alt: {
          en: "Maruti Suzuki Ertiga (Vehicle 1) in Pune",
          hi: "पुणे में मारुति सुजुकी अर्टिगा (वाहन 1)",
          mr: "पुण्यातील मारुती सुझुकी एर्टिगा (वाहन 1)",
        },
      },
      gallery: [],
    },
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
    images: {
      primary: {
        src: "/images/cars/ertiga.jpeg",
        width: 1280,
        height: 960,
        alt: {
          en: "Maruti Suzuki Ertiga (Vehicle 2) in Pune",
          hi: "पुणे में मारुति सुजुकी अर्टिगा (वाहन 2)",
          mr: "पुण्यातील मारुती सुझुकी एर्टिगा (वाहन 2)",
        },
      },
      gallery: [],
    },
    faqTags: ["enquiry", "ertiga"],
    // Planning V2: noindex + excluded from sitemap until approved distinguishing details
    // and unique factual copy exist.
    indexable: false,
    indexingNote: "Awaiting approved distinguishing details and unique copy",
    sortOrder: 5,
  },
] as const;
