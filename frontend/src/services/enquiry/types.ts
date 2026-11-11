/**
 * Enquiry service contract. Release 1 has a single client-side adapter (WhatsApp
 * click-to-chat). A future, separately approved backend adapter can implement the same
 * contract (e.g. returning a reference number) without changing the UI.
 */
export type EnquiryMessageFields = {
  carName: string | null;
  branchName: string | null;
  pickupLocationName: string | null;
  pickup: string;
  return: string;
  duration: string;
  /** Only present when a valid estimate was calculated from approved pricing. */
  estimate: string | null;
  /** Rental package name (e.g., "12-Hour Package") */
  packageName?: string;
  /** Free kilometres included in the package (e.g., "180 km") */
  freeKm?: string | null;
  name?: string;
  note?: string;
};

export type EnquiryMessageLabels = {
  greeting: string;
  car: string;
  anyCar: string;
  branch: string;
  branchToConfirm: string;
  pickupLocation: string;
  pickup: string;
  return: string;
  duration: string;
  estimate: string;
  package: string;
  freeKm: string;
  name: string;
  note: string;
  closing: string;
};

export type EnquiryResult =
  | { kind: "whatsapp-ready"; url: string; message: string }
  /** No approved WhatsApp destination: the visitor can copy the message instead. */
  | { kind: "copy-only"; reason: "whatsapp-number-not-confirmed"; message: string };

export interface EnquiryService {
  prepare(fields: EnquiryMessageFields, labels: EnquiryMessageLabels): EnquiryResult;
}
