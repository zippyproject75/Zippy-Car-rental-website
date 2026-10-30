import type { Car } from "@/types/car";
import type { Fact, Localized } from "@/types/content";

function confirmed<T>(value: T, source = "Fleet specification"): Fact<T> {
  return { status: "confirmed", value, source };
}

function pending<T>(note: string): Fact<T> {
  return { status: "pending", value: null, note };
}

const pendingDescription = (): Fact<Localized<string>> =>
  pending("Owner-approved vehicle description not yet supplied");

/**
 * THE authoritative fleet. Exactly five separate units.
 * Confirmed specifications: body type, seating capacity, transmission, and fuel.
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
    specs: {
      bodyType: confirmed("compact-suv"),
      seats: confirmed(5),
      transmission: confirmed("manual"),
      fuel: confirmed("petrol"),
      modelYear: pending("Model year to be confirmed by the owner"),
      variant: pending("Variant to be confirmed by the owner"),
      colour: pending("Colour to be confirmed by the owner"),
    },
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
    displayName: "Maruti Suzuki Brezza",
    description: pendingDescription(),
    distinguishingDetails: pending("Not required for a single unit"),
    specs: {
      bodyType: confirmed("compact-suv"),
      seats: confirmed(5),
      transmission: confirmed("manual"),
      fuel: confirmed("petrol"),
      modelYear: pending("Model year to be confirmed by the owner"),
      variant: pending("Variant to be confirmed by the owner"),
      colour: pending("Colour to be confirmed by the owner"),
    },
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
    specs: {
      bodyType: confirmed("hatchback"),
      seats: confirmed(5),
      transmission: confirmed("manual"),
      fuel: confirmed("petrol"),
      modelYear: pending("Model year to be confirmed by the owner"),
      variant: pending("Variant to be confirmed by the owner"),
      colour: pending("Colour to be confirmed by the owner"),
    },
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
    specs: {
      bodyType: confirmed("mpv"),
      seats: confirmed(7),
      transmission: confirmed("manual"),
      fuel: confirmed("petrol-cng"),
      modelYear: pending("Model year to be confirmed by the owner"),
      variant: pending("Variant to be confirmed by the owner"),
      colour: pending("Colour to be confirmed by the owner"),
    },
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
    specs: {
      bodyType: confirmed("mpv"),
      seats: confirmed(7),
      transmission: confirmed("manual"),
      fuel: confirmed("petrol-cng"),
      modelYear: pending("Model year to be confirmed by the owner"),
      variant: pending("Variant to be confirmed by the owner"),
      colour: pending("Colour to be confirmed by the owner"),
    },
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
    indexable: false,
    indexingNote: "Awaiting approved distinguishing details and unique copy",
    sortOrder: 5,
  },
] as const;
