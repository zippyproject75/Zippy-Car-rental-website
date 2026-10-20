import type { Localized } from "@/types/content";

export type Faq = {
  id: string;
  /** `approved`: answer describes confirmed website behaviour. `needs-owner`: never rendered. */
  status: "approved" | "needs-owner";
  tags: string[];
  content: Localized<{ question: string; answer: string | null }>;
};

export const faqs: Faq[] = [
  {
    id: "how-to-enquire",
    status: "approved",
    tags: ["enquiry", "home"],
    content: {
      en: {
        question: "How do I make a rental enquiry?",
        answer:
          "Choose a car (or “Any available car”), a pickup branch, and your pickup and return dates and times, then select “Prepare my enquiry”. You can open WhatsApp with the message ready to send, or copy it.",
      },
      hi: {
        question: "मैं किराये की पूछताछ कैसे करूँ?",
        answer:
          "एक कार (या “कोई भी उपलब्ध कार”), पिकअप शाखा और पिकअप व वापसी की तारीख व समय चुनें, फिर “मेरी पूछताछ तैयार करें” चुनें। आप तैयार संदेश के साथ WhatsApp खोल सकते हैं या संदेश कॉपी कर सकते हैं।",
      },
      mr: {
        question: "भाड्याची चौकशी कशी करावी?",
        answer:
          "एक कार (किंवा “कोणतीही उपलब्ध कार”), पिकअप शाखा आणि पिकअप व परतीची तारीख व वेळ निवडा, नंतर “माझी चौकशी तयार करा” निवडा. तुम्ही तयार संदेशासह WhatsApp उघडू शकता किंवा संदेश कॉपी करू शकता.",
      },
    },
  },
  {
    id: "not-a-booking",
    status: "approved",
    tags: ["enquiry", "home"],
    content: {
      en: {
        question: "Is my car booked when I send an enquiry?",
        answer:
          "No. An enquiry is a request only. Zippy Car Rental will reply to confirm availability and the final price. No car is reserved until Zippy confirms it with you.",
      },
      hi: {
        question: "क्या पूछताछ भेजने पर मेरी कार बुक हो जाती है?",
        answer:
          "नहीं। पूछताछ केवल एक अनुरोध है। Zippy Car Rental उपलब्धता और अंतिम कीमत की पुष्टि के लिए जवाब देगा। जब तक Zippy आपसे पुष्टि नहीं करता, कोई कार आरक्षित नहीं होती।",
      },
      mr: {
        question: "चौकशी पाठवल्यावर माझी कार बुक होते का?",
        answer:
          "नाही. चौकशी ही फक्त एक विनंती आहे. Zippy Car Rental उपलब्धता आणि अंतिम किंमत निश्चित करण्यासाठी उत्तर देईल. Zippy तुमच्याशी निश्चित करेपर्यंत कोणतीही कार राखीव ठेवली जात नाही.",
      },
    },
  },
  {
    id: "whatsapp-handoff",
    status: "approved",
    tags: ["enquiry", "home"],
    content: {
      en: {
        question: "What happens when I open WhatsApp?",
        answer:
          "WhatsApp opens with your enquiry already written. Nothing is sent until you press Send in WhatsApp. This website does not store your enquiry.",
      },
      hi: {
        question: "WhatsApp खोलने पर क्या होता है?",
        answer:
          "WhatsApp आपकी पहले से लिखी पूछताछ के साथ खुलता है। जब तक आप WhatsApp में Send नहीं दबाते, कुछ भी नहीं भेजा जाता। यह वेबसाइट आपकी पूछताछ संग्रहीत नहीं करती।",
      },
      mr: {
        question: "WhatsApp उघडल्यावर काय होते?",
        answer:
          "WhatsApp तुमची आधीच लिहिलेली चौकशी घेऊन उघडते. तुम्ही WhatsApp मध्ये Send दाबेपर्यंत काहीही पाठवले जात नाही. ही वेबसाइट तुमची चौकशी साठवत नाही.",
      },
    },
  },
  {
    id: "price-on-request",
    status: "approved",
    tags: ["pricing", "home"],
    content: {
      en: {
        question: "Why do I see “Price on request”?",
        answer:
          "Rates appear on this website only after Zippy Car Rental approves them. Until then, Zippy will confirm the applicable price for your dates when it replies to your enquiry.",
      },
      hi: {
        question: "मुझे “कीमत अनुरोध पर” क्यों दिखता है?",
        answer:
          "दरें इस वेबसाइट पर तभी दिखती हैं जब Zippy Car Rental उन्हें मंज़ूरी देता है। तब तक, Zippy आपकी पूछताछ का जवाब देते समय आपकी तारीखों के लिए लागू कीमत की पुष्टि करेगा।",
      },
      mr: {
        question: "मला “किंमत विनंतीनुसार” का दिसते?",
        answer:
          "Zippy Car Rental ने मान्यता दिल्यानंतरच दर या वेबसाइटवर दिसतात. तोपर्यंत, Zippy तुमच्या चौकशीला उत्तर देताना तुमच्या तारखांसाठी लागू किंमत निश्चित करेल.",
      },
    },
  },
  {
    id: "contact",
    status: "approved",
    tags: ["contact"],
    content: {
      en: {
        question: "How can I contact Zippy Car Rental?",
        answer:
          "The Contact page lists the confirmed ways to reach Zippy Car Rental. You can also prepare an enquiry from any car page.",
      },
      hi: {
        question: "मैं Zippy Car Rental से कैसे संपर्क करूँ?",
        answer:
          "संपर्क पेज पर Zippy Car Rental से संपर्क करने के पुष्ट तरीके दिए गए हैं। आप किसी भी कार पेज से पूछताछ भी तैयार कर सकते हैं।",
      },
      mr: {
        question: "Zippy Car Rental शी संपर्क कसा साधावा?",
        answer:
          "संपर्क पेजवर Zippy Car Rental शी संपर्क साधण्याचे निश्चित मार्ग दिले आहेत. तुम्ही कोणत्याही कार पेजवरून चौकशी तयार करू शकता.",
      },
    },
  },
  // Owner input required — never rendered until an approved answer exists.
  ...(["documents", "eligibility", "deposit", "fuel", "mileage", "cancellation"] as const).map(
    (id): Faq => ({
      id,
      status: "needs-owner",
      tags: ["policy"],
      content: {
        en: { question: id, answer: null },
        hi: { question: id, answer: null },
        mr: { question: id, answer: null },
      },
    }),
  ),
];

export function getApprovedFaqs(tag?: string): Faq[] {
  return faqs.filter((f) => f.status === "approved" && (!tag || f.tags.includes(tag)));
}
