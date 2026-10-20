import type { EnquiryMessageFields, EnquiryMessageLabels } from "./types";

const clean = (value: string | undefined) => value?.replace(/\s+/g, " ").trim() ?? "";

/** Builds the prefilled message. Contains only what is needed to answer the enquiry. */
export function buildEnquiryMessage(
  fields: EnquiryMessageFields,
  labels: EnquiryMessageLabels,
): string {
  const lines = [
    labels.greeting,
    "",
    `${labels.car}: ${fields.carName ?? labels.anyCar}`,
    `${labels.branch}: ${fields.branchName ?? labels.branchToConfirm}`,
    `${labels.pickup}: ${fields.pickup}`,
    `${labels.return}: ${fields.return}`,
    `${labels.duration}: ${fields.duration}`,
  ];
  if (fields.estimate) lines.push(`${labels.estimate}: ${fields.estimate}`);
  const name = clean(fields.name);
  if (name) lines.push(`${labels.name}: ${name}`);
  const note = fields.note?.trim();
  if (note) lines.push(`${labels.note}: ${note}`);
  lines.push("", labels.closing);
  return lines.join("\n");
}

/** `https://wa.me/<digits>?text=<encoded>` — opens WhatsApp; the visitor must press Send. */
export function buildWhatsAppUrl(e164: string, message: string): string {
  const digits = e164.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) throw new Error("Invalid WhatsApp number");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
