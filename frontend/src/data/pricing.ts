import type { PricingConfig } from "@/types/booking";

/**
 * Central rental pricing. Approved hourly rates for fronx, brezza, and baleno.
 * Ertiga and XL6 units remain pending until owner approval.
 */
export const pricingConfig: PricingConfig = {
  fronx: {
    status: "approved",
    model: {
      kind: "hourly",
      amountInr: 166,
      billableIntervalMinutes: 60,
      rounding: "ceil",
    },
    minimumBillableMinutes: 60,
    surcharges: [],
    tax: { mode: "included-in-rates" },
    approvedOn: "2026-10-30",
  },
  brezza: {
    status: "approved",
    model: {
      kind: "hourly",
      amountInr: 166,
      billableIntervalMinutes: 60,
      rounding: "ceil",
    },
    minimumBillableMinutes: 60,
    surcharges: [],
    tax: { mode: "included-in-rates" },
    approvedOn: "2026-10-30",
  },
  baleno: {
    status: "approved",
    model: {
      kind: "hourly",
      amountInr: 141,
      billableIntervalMinutes: 60,
      rounding: "ceil",
    },
    minimumBillableMinutes: 60,
    surcharges: [],
    tax: { mode: "included-in-rates" },
    approvedOn: "2026-10-30",
  },
  "ertiga-1": { status: "pending", note: "Owner to approve rates and rules" },
  xl6: { status: "pending", note: "Owner to approve rates and rules" },
};

/**
 * Package-specific display information for the homepage.
 * 12-hour packages have confirmed pricing; 24-hour packages are pending confirmation.
 * Hourly rates: Brezza ₹166/hr, Baleno ₹141/hr, Fronx ₹166/hr.
 */
export const packagePricing = {
  "12-hour": {
    fronx: { price: 2000, limitKm: 180 },
    brezza: { price: 2000, limitKm: 180 },
    baleno: { price: 1700, limitKm: 180 },
    "ertiga-1": null,
    xl6: null,
  },
  "24-hour": {
    fronx: null,
    brezza: null,
    baleno: null,
    "ertiga-1": null,
    xl6: null,
  },
} as const;
