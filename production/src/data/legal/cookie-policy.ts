import type { LegalDocument } from "@/types/legal";

const base = {
  status: "draft",
  version: "0.1-draft",
  effectiveDate: null,
  lastUpdated: null,
} as const;

export const cookiePolicy: LegalDocument = {
  slug: "cookie-policy",
  launchRequired: true,
  content: {
    en: {
      ...base,
      translation: "source",
      title: "Cookie Policy",
      summary:
        "A draft that lists the technologies this website actually uses. It has not yet been approved by Zippy Car Rental or legally reviewed.",
      sections: [
        {
          id: "summary",
          heading: "Summary",
          body: ["This website does not set analytics, advertising or tracking cookies."],
        },
        {
          id: "device",
          heading: "Stored on your device",
          body: [
            "The website stores your theme choice (light or dark) in your browser’s local storage under the key “zippy-theme”. It is functional, stays on your device and can be cleared through your browser settings.",
          ],
        },
        {
          id: "third-party",
          heading: "Third-party content",
          body: [
            "Google Maps is loaded only if you select “View map”. Google may then set its own cookies. WhatsApp and Google Maps links take you to those services, where their own policies apply.",
          ],
        },
        {
          id: "changes",
          heading: "Changes",
          body: [
            "If analytics or other optional technologies are introduced, this policy will be updated and the need for consent will be reassessed before they are used.",
          ],
        },
      ],
    },
    hi: {
      ...base,
      translation: "unreviewed-draft",
      title: "कुकी नीति",
      summary:
        "यह मसौदा उन तकनीकों को सूचीबद्ध करता है जिनका यह वेबसाइट वास्तव में उपयोग करती है। इसे अभी तक Zippy Car Rental द्वारा स्वीकृत या कानूनी रूप से समीक्षा नहीं किया गया है।",
      sections: [
        {
          id: "summary",
          heading: "सारांश",
          body: ["यह वेबसाइट एनालिटिक्स, विज्ञापन या ट्रैकिंग कुकीज़ सेट नहीं करती।"],
        },
        {
          id: "device",
          heading: "आपके डिवाइस पर संग्रहीत",
          body: [
            "वेबसाइट आपकी थीम की पसंद (लाइट या डार्क) को आपके ब्राउज़र के लोकल स्टोरेज में “zippy-theme” कुंजी के तहत रखती है। यह कार्यात्मक है, आपके डिवाइस पर ही रहती है और ब्राउज़र सेटिंग्स से हटाई जा सकती है।",
          ],
        },
        {
          id: "third-party",
          heading: "तृतीय-पक्ष सामग्री",
          body: [
            "Google Maps केवल तभी लोड होता है जब आप “नक्शा देखें” चुनते हैं। तब Google अपनी कुकीज़ सेट कर सकता है। WhatsApp और Google Maps लिंक आपको उन सेवाओं पर ले जाते हैं, जहां उनकी अपनी नीतियां लागू होती हैं।",
          ],
        },
        {
          id: "changes",
          heading: "बदलाव",
          body: [
            "यदि एनालिटिक्स या अन्य वैकल्पिक तकनीकें जोड़ी जाती हैं, तो उपयोग से पहले यह नीति अपडेट की जाएगी और सहमति की आवश्यकता का पुनर्मूल्यांकन किया जाएगा।",
          ],
        },
      ],
    },
    mr: {
      ...base,
      translation: "unreviewed-draft",
      title: "कुकी धोरण",
      summary:
        "ही वेबसाइट प्रत्यक्षात वापरत असलेल्या तंत्रज्ञानांची यादी देणारा मसुदा. याला अद्याप Zippy Car Rental ची मान्यता किंवा कायदेशीर पुनरावलोकन मिळालेले नाही.",
      sections: [
        {
          id: "summary",
          heading: "सारांश",
          body: ["ही वेबसाइट अॅनालिटिक्स, जाहिरात किंवा ट्रॅकिंग कुकीज सेट करत नाही."],
        },
        {
          id: "device",
          heading: "तुमच्या डिव्हाइसवर साठवलेले",
          body: [
            "वेबसाइट तुमची थीमची निवड (लाइट किंवा डार्क) तुमच्या ब्राउझरच्या लोकल स्टोरेजमध्ये “zippy-theme” या कीखाली ठेवते. ती कार्यात्मक आहे, तुमच्या डिव्हाइसवरच राहते आणि ब्राउझर सेटिंग्जमधून काढता येते.",
          ],
        },
        {
          id: "third-party",
          heading: "तृतीय-पक्ष सामग्री",
          body: [
            "Google Maps फक्त तुम्ही “नकाशा पहा” निवडल्यावरच लोड होते. त्यानंतर Google स्वतःच्या कुकीज सेट करू शकते. WhatsApp आणि Google Maps लिंक तुम्हाला त्या सेवांवर नेतात, जिथे त्यांची स्वतःची धोरणे लागू होतात.",
          ],
        },
        {
          id: "changes",
          heading: "बदल",
          body: [
            "अॅनालिटिक्स किंवा इतर ऐच्छिक तंत्रज्ञान जोडल्यास, वापरापूर्वी हे धोरण अद्ययावत केले जाईल आणि संमतीच्या आवश्यकतेचे पुनर्मूल्यांकन केले जाईल.",
          ],
        },
      ],
    },
  },
};
