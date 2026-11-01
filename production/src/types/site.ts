import type { Fact, Localized } from "./content";

export type BranchId = "kondhwa" | "kondhwa-2" | "undri";

export type Branch = {
  id: BranchId;
  name: Localized<string>;
  /** Full postal address as supplied, used for display, directions and the map query. */
  address: Fact<{ lines: string[]; locality: string; postalCode: string }>;
  hours: Fact<Localized<string>>;
  phone: Fact<{ display: string; e164: string }>;
};

export type Phone = { display: string; e164: string };

export type SiteConfig = {
  name: string;
  legalName: Fact<string>;
  city: string;
  region: string;
  country: "IN";
  contacts: {
    primaryPhone: Fact<Phone>;
    alternatePhone: Fact<Phone>;
    email: Fact<string>;
    /** WhatsApp destination for click-to-chat (E.164 digits). */
    whatsapp: Fact<Phone>;
    grievanceContact: Fact<string>;
  };
  branches: Branch[];
  brand: { logo: Fact<{ src: string; width: number; height: number }> };
  aboutStory: Fact<Localized<string[]>>;
  /** Owner review state of the customer-facing copy per language. */
  copyReview: Localized<"pending-review" | "approved">;
};
