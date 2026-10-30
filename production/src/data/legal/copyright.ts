import type { LegalDocument } from "@/types/legal";

const base = {
  status: "approved",
  version: "1.0",
  effectiveDate: "2026-10-30",
  lastUpdated: "2026-10-30",
} as const;

export const copyright: LegalDocument = {
  slug: "copyright",
  launchRequired: true,
  content: {
    en: {
      ...base,
      translation: "source",
      title: "Copyright",
      summary:
        "Copyright information for the Zippy Car Rental website, including permitted use, prohibited use, and third-party materials.",
      sections: [
        {
          id: "copyright-notice",
          heading: "Copyright notice",
          body: [
            "Unless otherwise stated, the original text, website design elements, graphics, and other original materials published on this website are protected by applicable intellectual property laws.",
            "This website is operated for Zippy Car Rental, a self-drive car rental business based in Pune, Maharashtra, India.",
          ],
        },
        {
          id: "website-content",
          heading: "Website content",
          body: [
            "Original website content may include:",
            "• Original written content",
            "• Original page layouts and design elements",
            "• Original graphics and promotional material",
            "• Original photographs created for the business",
            "• Original website code and components, to the extent protected by applicable law",
            "Third-party material remains subject to its respective owner's rights and applicable licence terms.",
            "We do not claim ownership of third-party material, manufacturer trademarks, vehicle logos, stock images, maps, fonts, or other assets unless ownership or licensing has been verified.",
          ],
        },
        {
          id: "permitted-use",
          heading: "Permitted use",
          body: [
            "Visitors may access this website for personal, informational, and legitimate rental-related purposes.",
            "You may view pages, download content for personal use, and share links to pages on this website.",
            "This does not grant permission to reproduce, republish, sell, or commercially exploit protected original material without authorization.",
          ],
        },
        {
          id: "prohibited-use",
          heading: "Prohibited use",
          body: [
            "To the extent permitted by applicable law, visitors must not reproduce, redistribute, republish, or commercially exploit protected website material without the relevant permission or legal authorization.",
            "This notice does not override statutory exceptions, fair dealing, applicable licences, or other rights provided by law.",
          ],
        },
        {
          id: "third-party-trademarks",
          heading: "Third-party trademarks and materials",
          body: [
            "Vehicle manufacturers' names, logos, trademarks, product names, and other third-party marks belong to their respective owners.",
            "Their appearance on this website is for identification, description, or informational purposes and does not automatically imply sponsorship, endorsement, or affiliation.",
            "Maruti Suzuki and related trademarks are the property of their respective owners.",
          ],
        },
        {
          id: "copyright-concerns",
          heading: "Copyright concerns and permission requests",
          body: [
            "For copyright questions, permission requests, or suspected infringement, please contact Zippy Car Rental through the contact page.",
            "Use the contact details provided on this website to reach us with your inquiry.",
          ],
        },
        {
          id: "updates",
          heading: "Updates to this notice",
          body: [
            "This copyright notice may be updated when website content, business practices, or legal requirements change.",
            "Material changes will be posted on this page with an updated effective date.",
          ],
        },
      ],
    },
    hi: {
      ...base,
      translation: "reviewed",
      title: "कॉपीराइट",
      summary:
        "Zippy Car Rental वेबसाइट के लिए कॉपीराइट जानकारी, जिसमें अनुमत उपयोग, प्रतिबंधित उपयोग और तीसरे पक्ष की सामग्री शामिल है।",
      sections: [
        {
          id: "copyright-notice",
          heading: "कॉपीराइट नोटिस",
          body: [
            "जब तक अन्यथा न कहा गया हो, इस वेबसाइट पर प्रकाशित मूल पाठ, वेबसाइट डिज़ाइन तत्व, ग्राफिक्स और अन्य मूल सामग्री लागू बौद्धिक संपदा कानूनों द्वारा संरक्षित है।",
            "यह वेबसाइट Zippy Car Rental के लिए संचालित है, जो पुणे, महाराष्ट्र, भारत में स्थित एक सेल्फ-ड्राइव कार किराये का व्यवसाय है।",
          ],
        },
        {
          id: "website-content",
          heading: "वेबसाइट सामग्री",
          body: [
            "मूल वेबसाइट सामग्री में शामिल हो सकती है:",
            "• मूल लिखित सामग्री",
            "• मूल पेज लेआउट और डिज़ाइन तत्व",
            "• मूल ग्राफिक्स और प्रचार सामग्री",
            "• व्यवसाय के लिए बनाई गई मूल तस्वीरें",
            "• लागू कानून के अनुसार संरक्षित मूल वेबसाइट कोड और घटक",
            "तीसरे पक्ष की सामग्री अपने संबंधित मालिक के अधिकारों और लागू लाइसेंस शर्तों के अधीन रहती है।",
            "हमारा दावा नहीं है कि तीसरे पक्ष की सामग्री, निर्माता ट्रेडमार्क, वाहन लोगो, स्टॉक चित्र, मानचित्र, फ़ॉन्ट या अन्य संपत्तियों का स्वामित्व हमारा है, जब तक कि स्वामित्व या लाइसेंसिंग की पुष्टि न हो।",
          ],
        },
        {
          id: "permitted-use",
          heading: "अनुमत उपयोग",
          body: [
            "आगंतुक व्यक्तिगत, सूचनात्मक और वैध किराया संबंधित उद्देश्यों के लिए इस वेबसाइट तक पहुंच सकते हैं।",
            "आप पेज देख सकते हैं, व्यक्तिगत उपयोग के लिए सामग्री डाउनलोड कर सकते हैं, और इस वेबसाइट के पेजों के लिंक साझा कर सकते हैं।",
            "यह अनुमति, प्राधिकरण के बिना संरक्षित मूल सामग्री को पुनरुत्पादित, पुनः प्रकाशित, बेचने या वाणिज्यिक रूप से शोषण करने की अनुमति नहीं देता है।",
          ],
        },
        {
          id: "prohibited-use",
          heading: "प्रतिबंधित उपयोग",
          body: [
            "लागू कानून के अनुसार, आगंतुकों को प्रासंगिक अनुमति या कानूनी प्राधिकरण के बिना संरक्षित वेबसाइट सामग्री को पुनरुत्पादित, पुनर्वितरित, पुनः प्रकाशित या वाणिज्यिक रूप से शोषण नहीं करना चाहिए।",
            "यह नोटिस कानूनी अपवादों, फेयर डीलिंग, लागू लाइसेंस या कानून द्वारा प्रदान किए गए अन्य अधिकारों को ओवरराइड नहीं करता है।",
          ],
        },
        {
          id: "third-party-trademarks",
          heading: "तीसरे पक्ष के ट्रेडमार्क और सामग्री",
          body: [
            "वाहन निर्माताओं के नाम, लोगो, ट्रेडमार्क, उत्पाद नाम और अन्य तीसरे पक्ष के चिह्न उनके संबंधित मालिकों के स्वामित्व में हैं।",
            "इस वेबसाइट पर उनकी उपस्थिति पहचान, विवरण या सूचनात्मक उद्देश्यों के लिए है और इसका स्वतः प्रायोजन, समर्थन या संबद्धता नहीं है।",
            "Maruti Suzuki और संबंधित ट्रेडमार्क उनके संबंधित मालिकों की संपत्ति हैं।",
          ],
        },
        {
          id: "copyright-concerns",
          heading: "कॉपीराइट चिंताएं और अनुमति अनुरोध",
          body: [
            "कॉपीराइट प्रश्नों, अनुमति अनुरोधों या संदिग्ध उल्लंघन के लिए, कृपया संपर्क पृष्ठ के माध्यम से Zippy Car Rental से संपर्क करें।",
            "अपनी पूछताछ के साथ हमसे संपर्क करने के लिए इस वेबसाइट पर प्रदान किए गए संपर्क विवरण का उपयोग करें।",
          ],
        },
        {
          id: "updates",
          heading: "इस नोटिस में अपडेट",
          body: [
            "जब वेबसाइट सामग्री, व्यावसायिक प्रथाएं या कानूनी आवश्यकताएं बदलती हैं, तो यह कॉपीराइट नोटिस अपडेट किया जा सकता है।",
            "सामग्री परिवर्तन इस पृष्ठ पर अपडेटेड प्रभावी तिथि के साथ पोस्ट किए जाएंगे।",
          ],
        },
      ],
    },
    mr: {
      ...base,
      translation: "reviewed",
      title: "कॉपीराइट",
      summary:
        "Zippy Car Rental वेबसाइटसाठी कॉपीराइट माहिती, ज्यात परवानगी दिलेला वापर, निषिद्ध वापर आणि तिसरे पक्ष सामग्री समाविष्ट आहे.",
      sections: [
        {
          id: "copyright-notice",
          heading: "कॉपीराइट सूचना",
          body: [
            "जोपर्यंत अन्यथा म्हटले नाही, तोपर्यंत या वेबसाइटवर प्रकाशित मूळ मजकूर, वेबसाइट डिझाइन घटक, ग्राफिक्स आणि इतर मूळ सामग्री लागू बौद्धिक संपदा कायद्यांनी संरक्षित आहे.",
            "ही वेबसाइट Zippy Car Rental साठी चालवली जाते, जी पुणे, महाराष्ट्र, भारत येथील सेल्फ-ड्राइव्ह कार भाड्याचा व्यवसाय आहे.",
          ],
        },
        {
          id: "website-content",
          heading: "वेबसाइट सामग्री",
          body: [
            "मूळ वेबसाइट सामग्रीमध्ये समाविष्ट असू शकते:",
            "• मूळ लिखित सामग्री",
            "• मूळ पृष्ठ लेआउट आणि डिझाइन घटक",
            "• मूळ ग्राफिक्स आणि प्रचार सामग्री",
            "• व्यवसायासाठी तयार केलेली मूळ छायाचित्रे",
            "• लागू कायद्यानुसार संरक्षित मूळ वेबसाइट कोड आणि घटक",
            "तिसरे पक्ष सामग्री त्यांच्या संबंधित मालकांच्या अधिकारांची आणि लागू परवाना अटींची पालन करते.",
            "आम्ही तिसरे पक्ष सामग्री, निर्माता ट्रेडमार्क, वाहन लोगो, स्टॉक चित्रे, नकाशे, फॉन्ट किंवा इतर मालमत्तेची मालकी होती असल्याचा दावा करत नाही, जोपर्यंत मालकी किंवा परवाना सत्यापित नाही.",
          ],
        },
        {
          id: "permitted-use",
          heading: "परवानगी दिलेला वापर",
          body: [
            "भेट देणारे वैयक्तिक, माहितीपूर्ण आणि वैध भाडा-संबंधित हेतूंसाठी या वेबसाइटवर प्रवेश करू शकतात.",
            "आपण पृष्ठे पाहू शकता, वैयक्तिक वापरासाठी सामग्री डाउनलोड करू शकता, आणि या वेबसाइटवरील पृष्ठांचे लिंक शेअर करू शकता.",
            "हे अधिकृततेशिवाय संरक्षित मूळ सामग्रीचे पुनरुत्पादन, पुनःप्रकाशन, विक्री किंवा व्यावसायिक शोषण करण्याची परवानगी देत नाही.",
          ],
        },
        {
          id: "prohibited-use",
          heading: "निषिद्ध वापर",
          body: [
            "लागू कायद्यानुसार, भेट देणाऱ्यांनी संबंधित परवानगी किंवा कायदेशीर अधिकारांशिवाय संरक्षित वेबसाइट सामग्रीचे पुनरुत्पादन, पुनर्वितरण, पुनःप्रकाशन किंवा व्यावसायिक शोषण करू नये.",
            "ही सूचना कायदेशीर अपवाद, फेयर डीलिंग, लागू परवाने किंवा कायद्याद्वारे दिलेले इतर अधिकार ओव्हरराइड करत नाही.",
          ],
        },
        {
          id: "third-party-trademarks",
          heading: "तिसरे पक्ष ट्रेडमार्क आणि सामग्री",
          body: [
            "वाहन निर्मात्यांची नावे, लोगो, ट्रेडमार्क, उत्पादन नावे आणि इतर तिसरे पक्ष चिन्हे त्यांच्या संबंधित मालकांच्या मालकीची आहेत.",
            "या वेबसाइटवर त्यांची उपस्थिती ओळख, वर्णन किंवा माहितीपूर्ण हेतूंसाठी आहे आणि याचा अर्थ स्वयंचलितपणे प्रायोजन, समर्थन किंवा संबद्धता नाही.",
            "Maruti Suzuki आणि संबंधित ट्रेडमार्क त्यांच्या संबंधित मालकांची मालमत्ता आहे.",
          ],
        },
        {
          id: "copyright-concerns",
          heading: "कॉपीराइट चिंता आणि परवानगी विनंती",
          body: [
            "कॉपीराइट प्रश्न, परवानगी विनंती किंवा संशयित उल्लंघनासाठी, कृपया संपर्क पृष्ठाद्वारे Zippy Car Rental शी संपर्क साधा.",
            "आपल्या चौकशीसह आमच्याशी संपर्क साधण्यासाठी या वेबसाइटवर दिलेले संपर्क तपशील वापरा.",
          ],
        },
        {
          id: "updates",
          heading: "या सूचनेतील अपडेट",
          body: [
            "जेव्हा वेबसाइट सामग्री, व्यावसायिक पद्धती किंवा कायदेशीर आवश्यकता बदलतात, तेव्हा ही कॉपीराइट सूचना अपडेट केली जाऊ शकते.",
            "सामग्री बदल अपडेट केलेल्या प्रभावी तारखेसह या पृष्ठावर पोस्ट केले जातील.",
          ],
        },
      ],
    },
  },
};
