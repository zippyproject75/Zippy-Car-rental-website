import type { SiteConfig } from "@/types/site";

const LEGACY = "Listed on the previous Zippy website; requires owner re-confirmation";

/**
 * Authoritative business facts. Values marked `pending` came from the previous website
 * and are shown only in preview builds (with a marker) until the owner re-confirms them.
 */
export const site: SiteConfig = {
  name: "Zippy Car Rental",
  legalName: { status: "pending", value: null, note: "Legal business identity required" },
  city: "Pune",
  region: "Maharashtra",
  country: "IN",
  contacts: {
    primaryPhone: {
      status: "pending",
      value: { display: "+91 99212 08410", e164: "+919921208410" },
      note: LEGACY,
    },
    alternatePhone: {
      status: "pending",
      value: { display: "+91 92843 06071", e164: "+919284306071" },
      note: LEGACY,
    },
    email: { status: "pending", value: "zippycarrental.official@gmail.com", note: LEGACY },
    whatsapp: { status: "confirmed", value: { display: "+91 99212 08410", e164: "+919921208410" }, note: "Owner-confirmed WhatsApp business number" },
    grievanceContact: {
      status: "pending",
      value: null,
      note: "Privacy/grievance contact required",
    },
  },
  branches: [
    {
      id: "kondhwa",
      name: { en: "Kondhwa", hi: "कोंढवा", mr: "कोंढवा" },
      address: {
        status: "pending",
        value: {
          lines: ["Khadi Machine Chowk", "Kondhwa Saswad Road"],
          locality: "Pune",
          postalCode: "411048",
        },
        note: LEGACY,
      },
      hours: { status: "pending", value: null, note: "Branch hours not confirmed" },
      phone: { status: "pending", value: null, note: "No branch-specific number confirmed" },
    },
    {
      id: "gangadham",
      name: { en: "Gangadham", hi: "गंगाधाम", mr: "गंगाधाम" },
      address: {
        status: "pending",
        value: {
          lines: ["Gangadham Chowk", "Beside Solitaire Premier", "Ganga Dham Road, Phase 1"],
          locality: "Pune",
          postalCode: "411037",
        },
        note: LEGACY,
      },
      hours: { status: "pending", value: null, note: "Branch hours not confirmed" },
      phone: { status: "pending", value: null, note: "No branch-specific number confirmed" },
    },
    {
      id: "undri",
      name: { en: "Undri", hi: "उंड्री", mr: "उंड्री" },
      address: {
        status: "pending",
        value: {
          lines: ["Opposite Euro School", "Undri Marg", "Near My Toy Trolly"],
          locality: "Undri",
          postalCode: "411060",
        },
        note: LEGACY,
      },
      hours: { status: "pending", value: null, note: "Branch hours not confirmed" },
      phone: { status: "pending", value: null, note: "No branch-specific number confirmed" },
    },
  ],
  brand: {
    logo: {
      status: "confirmed",
      value: { src: "/zippy_main_logo.png", width: 120, height: 80 },
      note: "Official Zippy logo",
    },
  },
  aboutStory: { status: "pending", value: null, note: "Owner-approved company story required" },
  copyReview: { en: "approved", hi: "approved", mr: "approved" },
};
