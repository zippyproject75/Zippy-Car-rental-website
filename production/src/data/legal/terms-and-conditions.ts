import type { LegalDocument } from "@/types/legal";

const base = {
  status: "draft",
  version: "0.1-draft",
  effectiveDate: null,
  lastUpdated: null,
} as const;

/** Contains only website-behaviour facts. Rental terms must come from the owner. */
export const termsAndConditions: LegalDocument = {
  slug: "terms-and-conditions",
  launchRequired: true,
  content: {
    en: {
      ...base,
      translation: "source",
      title: "Terms & Conditions",
      summary:
        "A draft outline. Zippy Car Rental’s rental terms have not been supplied yet, so none are stated here.",
      sections: [
        {
          id: "enquiries",
          heading: "Website enquiries are not bookings",
          body: [
            "Sending an enquiry through this website or WhatsApp does not book, reserve or confirm a vehicle. Zippy Car Rental confirms availability and the final price directly with you.",
          ],
        },
        {
          id: "estimates",
          heading: "Estimated costs",
          body: [
            "Where the website shows an estimated rental cost, it is calculated only from rates approved by Zippy Car Rental and is not a final price or a quotation.",
          ],
        },
        {
          id: "rental-terms",
          heading: "Rental terms",
          body: [
            "Eligibility, documents, deposits, payment, fuel, mileage, tolls, damage and insurance terms have not yet been provided and are not published on this website. Zippy Car Rental will explain the applicable terms before any rental.",
          ],
        },
      ],
    },
    hi: {
      ...base,
      translation: "unreviewed-draft",
      title: "नियम और शर्तें",
      summary:
        "एक मसौदा रूपरेखा। Zippy Car Rental की किराये की शर्तें अभी प्रदान नहीं की गई हैं, इसलिए यहां कोई शर्त नहीं दी गई है।",
      sections: [
        {
          id: "enquiries",
          heading: "वेबसाइट पूछताछ बुकिंग नहीं है",
          body: [
            "इस वेबसाइट या WhatsApp के माध्यम से पूछताछ भेजने से कोई वाहन बुक, आरक्षित या पुष्ट नहीं होता। Zippy Car Rental उपलब्धता और अंतिम कीमत की पुष्टि सीधे आपसे करता है।",
          ],
        },
        {
          id: "estimates",
          heading: "अनुमानित लागत",
          body: [
            "जहां वेबसाइट अनुमानित किराया लागत दिखाती है, वह केवल Zippy Car Rental द्वारा स्वीकृत दरों से गणना की जाती है और अंतिम कीमत या कोटेशन नहीं है।",
          ],
        },
        {
          id: "rental-terms",
          heading: "किराये की शर्तें",
          body: [
            "पात्रता, दस्तावेज़, जमा राशि, भुगतान, ईंधन, माइलेज, टोल, क्षति और बीमा की शर्तें अभी प्रदान नहीं की गई हैं और इस वेबसाइट पर प्रकाशित नहीं हैं। Zippy Car Rental किसी भी किराये से पहले लागू शर्तें समझाएगा।",
          ],
        },
      ],
    },
    mr: {
      ...base,
      translation: "unreviewed-draft",
      title: "अटी आणि शर्ती",
      summary:
        "मसुदा रूपरेषा. Zippy Car Rental च्या भाड्याच्या अटी अद्याप मिळालेल्या नाहीत, त्यामुळे येथे कोणतीही अट दिलेली नाही.",
      sections: [
        {
          id: "enquiries",
          heading: "वेबसाइटवरील चौकशी म्हणजे बुकिंग नव्हे",
          body: [
            "या वेबसाइटवरून किंवा WhatsApp वरून चौकशी पाठवल्याने कोणतेही वाहन बुक, राखीव किंवा निश्चित होत नाही. Zippy Car Rental उपलब्धता आणि अंतिम किंमत थेट तुमच्याशी निश्चित करते.",
          ],
        },
        {
          id: "estimates",
          heading: "अंदाजित खर्च",
          body: [
            "वेबसाइट जिथे अंदाजित भाडे खर्च दाखवते, तो फक्त Zippy Car Rental ने मान्य केलेल्या दरांवरून मोजला जातो आणि ती अंतिम किंमत किंवा कोटेशन नाही.",
          ],
        },
        {
          id: "rental-terms",
          heading: "भाड्याच्या अटी",
          body: [
            "पात्रता, कागदपत्रे, अनामत रक्कम, पेमेंट, इंधन, मायलेज, टोल, नुकसान आणि विमा यांच्या अटी अद्याप मिळालेल्या नाहीत आणि या वेबसाइटवर प्रकाशित नाहीत. कोणत्याही भाड्यापूर्वी Zippy Car Rental लागू अटी समजावून सांगेल.",
          ],
        },
      ],
    },
  },
};
