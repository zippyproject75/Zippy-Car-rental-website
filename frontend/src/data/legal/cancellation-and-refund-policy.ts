import type { LegalDocument } from "@/types/legal";

const base = {
  status: "draft",
  version: "0.0-awaiting-owner",
  effectiveDate: null,
  lastUpdated: null,
} as const;

/** Approved-content gate: no cancellation windows, fees or refund timelines are invented. */
export const cancellationAndRefundPolicy: LegalDocument = {
  slug: "cancellation-and-refund-policy",
  launchRequired: false,
  content: {
    en: {
      ...base,
      translation: "source",
      title: "Cancellation & Refund Policy",
      summary: "Awaiting Zippy Car Rental’s approved policy.",
      sections: [
        {
          id: "status",
          heading: "Policy not yet available",
          body: [
            "Zippy Car Rental has not yet published a cancellation and refund policy on this website. No cancellation windows, fees or refund timelines are stated here. Please contact Zippy Car Rental directly about cancellations.",
          ],
        },
      ],
    },
    hi: {
      ...base,
      translation: "unreviewed-draft",
      title: "रद्दीकरण और धनवापसी नीति",
      summary: "Zippy Car Rental की स्वीकृत नीति की प्रतीक्षा है।",
      sections: [
        {
          id: "status",
          heading: "नीति अभी उपलब्ध नहीं है",
          body: [
            "Zippy Car Rental ने अभी इस वेबसाइट पर रद्दीकरण और धनवापसी नीति प्रकाशित नहीं की है। यहां कोई रद्दीकरण अवधि, शुल्क या धनवापसी समय-सीमा नहीं बताई गई है। रद्दीकरण के बारे में कृपया सीधे Zippy Car Rental से संपर्क करें।",
          ],
        },
      ],
    },
    mr: {
      ...base,
      translation: "unreviewed-draft",
      title: "रद्दीकरण आणि परतावा धोरण",
      summary: "Zippy Car Rental च्या मान्य धोरणाची प्रतीक्षा आहे.",
      sections: [
        {
          id: "status",
          heading: "धोरण अद्याप उपलब्ध नाही",
          body: [
            "Zippy Car Rental ने अद्याप या वेबसाइटवर रद्दीकरण आणि परतावा धोरण प्रकाशित केलेले नाही. येथे रद्दीकरणाची मुदत, शुल्क किंवा परताव्याची कालमर्यादा दिलेली नाही. रद्दीकरणाबाबत कृपया थेट Zippy Car Rental शी संपर्क साधा.",
          ],
        },
      ],
    },
  },
};
