import type { PricingConfig } from "@/types/booking";

/**
 * Central rental pricing. No rate, rounding rule, minimum, surcharge or tax rule has been
 * approved, so every vehicle is "Price on request". Legacy-site prices are intentionally
 * NOT reused. When the owner approves pricing, replace a `pending` entry with an
 * `approved` entry (see src/types/booking.ts) — no component changes are required.
 */
export const pricingConfig: PricingConfig = {
  fronx: { status: "pending", note: "Owner to approve rates and rules" },
  brezza: { status: "pending", note: "Owner to approve rates and rules" },
  baleno: { status: "pending", note: "Owner to approve rates and rules" },
  "ertiga-1": { status: "pending", note: "Owner to approve rates and rules" },
  "ertiga-2": { status: "pending", note: "Owner to approve rates and rules" },
};
