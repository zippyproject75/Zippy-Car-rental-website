import type { Localized, PublicationStatus } from "./content";

export const legalSlugs = [
  "terms-and-conditions",
  "privacy-policy",
  "cookie-policy",
  "cancellation-and-refund-policy",
  "copyright",
] as const;
export type LegalSlug = (typeof legalSlugs)[number];

export type LegalSection = { id: string; heading: string; body: string[] };

export type LegalVersion = {
  status: PublicationStatus;
  /** `source` = original language; translations need separate review. */
  translation: "source" | "unreviewed-draft" | "reviewed";
  version: string;
  effectiveDate: string | null;
  lastUpdated: string | null;
  title: string;
  summary: string;
  sections: LegalSection[];
};

export type LegalDocument = {
  slug: LegalSlug;
  /** Must be approved before production launch (plans/plan.md §18.2). */
  launchRequired: boolean;
  content: Localized<LegalVersion>;
};
