import type { LegalDocument } from "@/types/legal";

const base = {
  status: "draft",
  version: "0.1-draft",
  effectiveDate: null,
  lastUpdated: null,
} as const;

export const privacyPolicy: LegalDocument = {
  slug: "privacy-policy",
  launchRequired: true,
  content: {
    en: {
      ...base,
      translation: "source",
      title: "Privacy Policy",
      summary:
        "A draft describing how this website currently handles information. It has not yet been approved by Zippy Car Rental or legally reviewed.",
      sections: [
        {
          id: "who-we-are",
          heading: "Who we are",
          body: [
            "This website is operated for Zippy Car Rental, a self-drive car rental business in Pune, Maharashtra. The legal business name and privacy contact will be added once confirmed.",
          ],
        },
        {
          id: "information",
          heading: "Information this website handles",
          body: [
            "The website has no accounts, login or payment features, and it does not store enquiries on a server or in a database.",
            "The details you enter in the enquiry form — vehicle, branch, dates and times, and optionally your name and a note — stay in your browser until you choose what to do with them.",
          ],
        },
        {
          id: "whatsapp",
          heading: "WhatsApp enquiries",
          body: [
            "If you choose “Open WhatsApp”, the website opens WhatsApp with a prefilled message containing those details. Nothing is sent until you press Send in WhatsApp.",
            "Messages you send are handled by WhatsApp (Meta) under its own terms and privacy policy, and by Zippy Car Rental to answer your enquiry.",
          ],
        },
        {
          id: "maps",
          heading: "Google Maps",
          body: [
            "Branch maps are not loaded automatically. If you select “View map”, an embedded Google Maps frame is loaded from Google, which receives technical information such as your IP address and browser details and may set its own cookies.",
            "“Get directions” links open Google Maps directly. Google’s privacy policy applies to these services.",
          ],
        },
        {
          id: "hosting",
          heading: "Hosting and technical logs",
          body: [
            "The website is hosted on Vercel. The host may process technical request data, such as IP address, browser type and requested pages, in server logs for security and operation. Retention details will be confirmed at deployment.",
          ],
        },
        {
          id: "device-storage",
          heading: "Preferences stored on your device",
          body: [
            "Your light or dark theme choice is stored in your browser’s local storage so the website remembers it. It is not sent to Zippy Car Rental. The website does not use analytics or advertising cookies.",
          ],
        },
        {
          id: "contact",
          heading: "Questions and requests",
          body: [
            "Contact details for privacy questions and requests will be published once confirmed by Zippy Car Rental.",
          ],
        },
      ],
    },
    hi: {
      ...base,
      translation: "unreviewed-draft",
      title: "गोपनीयता नीति",
      summary:
        "यह मसौदा बताता है कि यह वेबसाइट वर्तमान में जानकारी को कैसे संभालती है। इसे अभी तक Zippy Car Rental द्वारा स्वीकृत या कानूनी रूप से समीक्षा नहीं किया गया है।",
      sections: [
        {
          id: "who-we-are",
          heading: "हम कौन हैं",
          body: [
            "यह वेबसाइट Zippy Car Rental के लिए संचालित है, जो पुणे, महाराष्ट्र में सेल्फ-ड्राइव कार किराये का व्यवसाय है। कानूनी व्यवसाय नाम और गोपनीयता संपर्क पुष्टि होने पर जोड़े जाएंगे।",
          ],
        },
        {
          id: "information",
          heading: "यह वेबसाइट कौन-सी जानकारी संभालती है",
          body: [
            "वेबसाइट पर कोई खाता, लॉगिन या भुगतान सुविधा नहीं है, और यह पूछताछ को किसी सर्वर या डेटाबेस में संग्रहीत नहीं करती।",
            "पूछताछ फ़ॉर्म में आप जो विवरण भरते हैं — वाहन, शाखा, तारीख और समय, और वैकल्पिक रूप से आपका नाम और नोट — वे तब तक आपके ब्राउज़र में ही रहते हैं जब तक आप तय नहीं करते कि उनका क्या करना है।",
          ],
        },
        {
          id: "whatsapp",
          heading: "WhatsApp पूछताछ",
          body: [
            "यदि आप “WhatsApp खोलें” चुनते हैं, तो वेबसाइट इन विवरणों वाले पहले से भरे संदेश के साथ WhatsApp खोलती है। जब तक आप WhatsApp में Send नहीं दबाते, कुछ भी नहीं भेजा जाता।",
            "आपके भेजे गए संदेश WhatsApp (Meta) द्वारा उसकी अपनी शर्तों और गोपनीयता नीति के अनुसार, और आपकी पूछताछ का उत्तर देने के लिए Zippy Car Rental द्वारा संभाले जाते हैं।",
          ],
        },
        {
          id: "maps",
          heading: "Google Maps",
          body: [
            "शाखा के नक्शे अपने-आप लोड नहीं होते। यदि आप “नक्शा देखें” चुनते हैं, तो Google से एक Google Maps फ़्रेम लोड होता है, जिसे आपका IP पता और ब्राउज़र विवरण जैसी तकनीकी जानकारी मिलती है और जो अपनी कुकीज़ सेट कर सकता है।",
            "“दिशा-निर्देश पाएं” लिंक सीधे Google Maps खोलते हैं। इन सेवाओं पर Google की गोपनीयता नीति लागू होती है।",
          ],
        },
        {
          id: "hosting",
          heading: "होस्टिंग और तकनीकी लॉग",
          body: [
            "यह वेबसाइट Vercel पर होस्ट की जाती है। होस्ट सुरक्षा और संचालन के लिए सर्वर लॉग में IP पता, ब्राउज़र प्रकार और देखे गए पेज जैसी तकनीकी जानकारी संसाधित कर सकता है। संग्रहण अवधि की पुष्टि डिप्लॉयमेंट के समय की जाएगी।",
          ],
        },
        {
          id: "device-storage",
          heading: "आपके डिवाइस पर संग्रहीत प्राथमिकताएं",
          body: [
            "आपकी लाइट या डार्क थीम की पसंद आपके ब्राउज़र के लोकल स्टोरेज में रखी जाती है ताकि वेबसाइट उसे याद रखे। यह Zippy Car Rental को नहीं भेजी जाती। वेबसाइट एनालिटिक्स या विज्ञापन कुकीज़ का उपयोग नहीं करती।",
          ],
        },
        {
          id: "contact",
          heading: "प्रश्न और अनुरोध",
          body: [
            "गोपनीयता संबंधी प्रश्नों और अनुरोधों के लिए संपर्क विवरण Zippy Car Rental द्वारा पुष्टि होने पर प्रकाशित किए जाएंगे।",
          ],
        },
      ],
    },
    mr: {
      ...base,
      translation: "unreviewed-draft",
      title: "गोपनीयता धोरण",
      summary:
        "ही वेबसाइट सध्या माहिती कशी हाताळते याचे वर्णन करणारा मसुदा. याला अद्याप Zippy Car Rental ची मान्यता किंवा कायदेशीर पुनरावलोकन मिळालेले नाही.",
      sections: [
        {
          id: "who-we-are",
          heading: "आम्ही कोण आहोत",
          body: [
            "ही वेबसाइट Zippy Car Rental साठी चालवली जाते, जो पुणे, महाराष्ट्र येथील सेल्फ-ड्राइव्ह कार भाड्याचा व्यवसाय आहे. कायदेशीर व्यवसायाचे नाव आणि गोपनीयता संपर्क निश्चित झाल्यावर जोडले जातील.",
          ],
        },
        {
          id: "information",
          heading: "ही वेबसाइट कोणती माहिती हाताळते",
          body: [
            "वेबसाइटवर खाते, लॉगिन किंवा पेमेंटची सुविधा नाही, आणि ती चौकशी कोणत्याही सर्व्हरवर किंवा डेटाबेसमध्ये साठवत नाही.",
            "चौकशी फॉर्ममध्ये तुम्ही भरलेले तपशील — वाहन, शाखा, तारीख व वेळ, आणि ऐच्छिकपणे तुमचे नाव व टीप — तुम्ही त्यांचे काय करायचे ते ठरवेपर्यंत तुमच्या ब्राउझरमध्येच राहतात.",
          ],
        },
        {
          id: "whatsapp",
          heading: "WhatsApp चौकशी",
          body: [
            "तुम्ही “WhatsApp उघडा” निवडल्यास, वेबसाइट हे तपशील असलेल्या आधीच भरलेल्या संदेशासह WhatsApp उघडते. तुम्ही WhatsApp मध्ये Send दाबेपर्यंत काहीही पाठवले जात नाही.",
            "तुम्ही पाठवलेले संदेश WhatsApp (Meta) त्याच्या स्वतःच्या अटी व गोपनीयता धोरणानुसार, आणि तुमच्या चौकशीला उत्तर देण्यासाठी Zippy Car Rental हाताळते.",
          ],
        },
        {
          id: "maps",
          heading: "Google Maps",
          body: [
            "शाखांचे नकाशे आपोआप लोड होत नाहीत. तुम्ही “नकाशा पहा” निवडल्यास, Google कडून Google Maps फ्रेम लोड होते, ज्याला तुमचा IP पत्ता आणि ब्राउझर तपशील यांसारखी तांत्रिक माहिती मिळते आणि ते स्वतःच्या कुकीज सेट करू शकते.",
            "“दिशा मिळवा” लिंक थेट Google Maps उघडतात. या सेवांना Google चे गोपनीयता धोरण लागू होते.",
          ],
        },
        {
          id: "hosting",
          heading: "होस्टिंग आणि तांत्रिक लॉग",
          body: [
            "ही वेबसाइट Vercel वर होस्ट केली जाते. सुरक्षा आणि कामकाजासाठी होस्ट सर्व्हर लॉगमध्ये IP पत्ता, ब्राउझरचा प्रकार आणि पाहिलेली पेजेस यांसारखी तांत्रिक माहिती प्रक्रिया करू शकतो. साठवणुकीचा कालावधी डिप्लॉयमेंटच्या वेळी निश्चित केला जाईल.",
          ],
        },
        {
          id: "device-storage",
          heading: "तुमच्या डिव्हाइसवर साठवलेल्या पसंती",
          body: [
            "तुमची लाइट किंवा डार्क थीमची निवड तुमच्या ब्राउझरच्या लोकल स्टोरेजमध्ये ठेवली जाते, जेणेकरून वेबसाइट ती लक्षात ठेवते. ती Zippy Car Rental ला पाठवली जात नाही. वेबसाइट अॅनालिटिक्स किंवा जाहिरात कुकीज वापरत नाही.",
          ],
        },
        {
          id: "contact",
          heading: "प्रश्न आणि विनंत्या",
          body: [
            "गोपनीयतेशी संबंधित प्रश्न आणि विनंत्यांसाठी संपर्क तपशील Zippy Car Rental ने निश्चित केल्यावर प्रकाशित केले जातील.",
          ],
        },
      ],
    },
  },
};
