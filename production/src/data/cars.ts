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
      gallery: [
        {
          src: "/images/cars/fronx_front_view.png",
          width: 1600,
          height: 900,
          alt: {
            en: "Maruti Suzuki Fronx front view",
            hi: "मारुति सुजुकी फ्रोंक्स का सामने का दृश्य",
            mr: "मारुती सुझुकी फ्रॉन्क्सचा पुढील दृश्य",
          },
        },
        {
          src: "/images/cars/fronx_side_view.png",
          width: 1600,
          height: 900,
          alt: {
            en: "Maruti Suzuki Fronx side view",
            hi: "मारुति सुजुकी फ्रोंक्स का साइड व्यू",
            mr: "मारुती सुझुकी फ्रॉन्क्सचा बाजूचा दृश्य",
          },
        },
      ],
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
      gallery: [
        {
          src: "/images/cars/breeza_front_view.png",
          width: 1600,
          height: 900,
          alt: {
            en: "Maruti Suzuki Brezza front view",
            hi: "मारुति सुजुकी ब्रेज़ा का सामने का दृश्य",
            mr: "मारुती सुझुकी ब्रेझाचा पुढील दृश्य",
          },
        },
        {
          src: "/images/cars/breeza_side_view.png",
          width: 1600,
          height: 900,
          alt: {
            en: "Maruti Suzuki Brezza side view",
            hi: "मारुति सुजुकी ब्रेज़ा का साइड व्यू",
            mr: "मारुती सुझुकी ब्रेझाचा बाजूचा दृश्य",
          },
        },
      ],
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
      gallery: [
        {
          src: "/images/cars/baleno_front_view.png",
          width: 1600,
          height: 900,
          alt: {
            en: "Maruti Suzuki Baleno front view",
            hi: "मारुति सुजुकी बलेनो का सामने का दृश्य",
            mr: "मारुती सुझुकी बलेनोचा पुढील दृश्य",
          },
        },
        {
          src: "/images/cars/baleno_side_view.png",
          width: 1600,
          height: 900,
          alt: {
            en: "Maruti Suzuki Baleno side view",
            hi: "मारुति सुजुकी बलेनो का साइड व्यू",
            mr: "मारुती सुझुकी बलेनोचा बाजूचा दृश्य",
          },
        },
      ],
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
      gallery: [
        {
          src: "/images/cars/ertiga_front_view.png",
          width: 1600,
          height: 900,
          alt: {
            en: "Maruti Suzuki Ertiga front view",
            hi: "मारुति सुजुकी अर्टिगा का सामने का दृश्य",
            mr: "मारुती सुझुकी एर्टिगाचा पुढील दृश्य",
          },
        },
        {
          src: "/images/cars/ertiga_side_view.png",
          width: 1600,
          height: 900,
          alt: {
            en: "Maruti Suzuki Ertiga side view",
            hi: "मारुति सुजुकी अर्टिगा का साइड व्यू",
            mr: "मारुती सुझुकी एर्टिगाचा बाजूचा दृश्य",
          },
        },
      ],
    },
    faqTags: ["enquiry", "ertiga"],
    indexable: true,
    sortOrder: 4,
  },
  {
    id: "xl6",
    slug: "xl6",
    make: "Maruti Suzuki",
    model: "XL6",
    displayName: "Maruti Suzuki XL6",
    unitNumber: 2,
    description: pendingDescription(),
    distinguishingDetails: pending("Owner to confirm what distinguishes XL6 Vehicle 2"),
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
        src: "/images/cars/XL6_front_view.png",
        width: 1600,
        height: 900,
        alt: {
          en: "Maruti Suzuki XL6 (Vehicle 2) in Pune",
          hi: "पुणे में मारुति सुजुकी XL6 (वाहन 2)",
          mr: "पुण्यातील मारुती सुझुकी XL6 (वाहन 2)",
        },
      },
      gallery: [
        {
          src: "/images/cars/XL6_front_view.png",
          width: 1600,
          height: 900,
          alt: {
            en: "Maruti Suzuki XL6 front view",
            hi: "मारुति सुजुकी XL6 का सामने का दृश्य",
            mr: "मारुती सुझुकी XL6चा पुढील दृश्य",
          },
        },
        {
          src: "/images/cars/XL6_side_view.png",
          width: 1600,
          height: 900,
          alt: {
            en: "Maruti Suzuki XL6 side view",
            hi: "मारुति सुजुकी XL6 का साइड व्यू",
            mr: "मारुती सुझुकी XL6चा बाजूचा दृश्य",
          },
        },
      ],
    },
    faqTags: ["enquiry", "xl6"],
    indexable: false,
    indexingNote: "Awaiting approved distinguishing details and unique copy",
    sortOrder: 5,
  },
] as const;
