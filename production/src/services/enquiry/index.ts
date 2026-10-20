import { site } from "@/data/site";
import type { Fact } from "@/types/content";
import type { Phone } from "@/types/site";
import type { EnquiryService } from "./types";
import { buildEnquiryMessage, buildWhatsAppUrl } from "./whatsapp";

export type { EnquiryMessageFields, EnquiryMessageLabels, EnquiryResult } from "./types";

/** Factory so tests can inject a WhatsApp destination; the app uses site data. */
export function createWhatsAppEnquiryService(whatsapp: Fact<Phone>): EnquiryService {
  return {
    prepare(fields, labels) {
      const message = buildEnquiryMessage(fields, labels);
      // Only an owner-confirmed number is ever used as a destination.
      if (whatsapp.status !== "confirmed") {
        return { kind: "copy-only", reason: "whatsapp-number-not-confirmed", message };
      }
      return {
        kind: "whatsapp-ready",
        url: buildWhatsAppUrl(whatsapp.value.e164, message),
        message,
      };
    },
  };
}

export const enquiryService: EnquiryService = createWhatsAppEnquiryService(site.contacts.whatsapp);
