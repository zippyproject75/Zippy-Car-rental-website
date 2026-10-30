import type { Locale } from "@/i18n/routing";
import type { LegalDocument, LegalSlug, LegalVersion } from "@/types/legal";
import { cancellationAndRefundPolicy } from "./cancellation-and-refund-policy";
import { copyright } from "./copyright";
import { cookiePolicy } from "./cookie-policy";
import { privacyPolicy } from "./privacy-policy";
import { termsAndConditions } from "./terms-and-conditions";

export const legalDocuments: readonly LegalDocument[] = [
  termsAndConditions,
  privacyPolicy,
  cookiePolicy,
  cancellationAndRefundPolicy,
  copyright,
];

export function getLegalDocument(slug: LegalSlug): LegalDocument {
  const doc = legalDocuments.find((d) => d.slug === slug);
  if (!doc) throw new Error(`Unknown legal document: ${slug}`);
  return doc;
}

/** A policy version is published only when approved (and, for translations, reviewed). */
export function isLegalApproved(version: LegalVersion): boolean {
  return version.status === "approved" && version.translation !== "unreviewed-draft";
}

/** Legal links shown in navigation: approved only in production; drafts are marked in preview. */
export function visibleLegalLinks(locale: Locale, showPending: boolean) {
  return legalDocuments.flatMap((doc) => {
    const version = doc.content[locale];
    const approved = isLegalApproved(version);
    if (!approved && !showPending) return [];
    return [{ slug: doc.slug, title: version.title, draft: !approved }];
  });
}
