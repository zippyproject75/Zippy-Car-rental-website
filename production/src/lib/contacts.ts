import { site } from "@/data/site";
import { visibleFact } from "@/lib/content";

export type VisibleContacts = {
  phones: { kind: "primary" | "alternate"; display: string; e164: string; pending: boolean }[];
  email: { value: string; pending: boolean } | null;
  whatsappConfirmed: boolean;
};

/** Contact methods that may be shown: confirmed, or pending (marked) in preview builds. */
export function getVisibleContacts(showPending: boolean): VisibleContacts {
  const phones: VisibleContacts["phones"] = [];
  const primary = visibleFact(site.contacts.primaryPhone, showPending);
  if (primary) phones.push({ kind: "primary", ...primary.value, pending: primary.pending });
  const alternate = visibleFact(site.contacts.alternatePhone, showPending);
  if (alternate) phones.push({ kind: "alternate", ...alternate.value, pending: alternate.pending });
  const email = visibleFact(site.contacts.email, showPending);
  return {
    phones,
    email: email ? { value: email.value, pending: email.pending } : null,
    whatsappConfirmed: site.contacts.whatsapp.status === "confirmed",
  };
}
