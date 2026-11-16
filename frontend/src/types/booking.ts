import type { CarId } from "./car";
import type { Localized } from "./content";
import type { BranchId } from "./site";

export type BookingRules = {
  timeZone: "Asia/Kolkata";
  slotMinutes: number;
  maxAdvanceDays: number;
  minLeadMinutes: number;
  /** null = no minimum approved by the business. */
  minDurationMinutes: number | null;
  /** null = no approved operating-hours restriction; all slots may be requested. */
  pickupWindow: { from: string; to: string } | null;
  status: "provisional-default" | "approved";
};

export type RequestDraft = {
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
};

export type RequestErrorCode =
  | "required"
  | "invalid"
  | "pickupInPast"
  | "pickupTooSoon"
  | "pickupTooFar"
  | "outsideHours"
  | "returnNotAfterPickup"
  | "returnTooFar"
  | "durationTooShort";

export type RequestField = "pickupDate" | "pickupTime" | "returnDate" | "returnTime";

export type RequestValidation =
  | { ok: true; pickupAt: Date; returnAt: Date; durationMinutes: number }
  | { ok: false; errors: Partial<Record<RequestField, RequestErrorCode>> };

/* ------------------------------ Pricing ------------------------------ */

export type Rounding = "ceil";

export type RateModel =
  | {
      kind: "hourly";
      /** Amount (INR) per billable interval. */
      amountInr: number;
      billableIntervalMinutes: number;
      rounding: Rounding;
    }
  | {
      kind: "daily";
      /** Amount (INR) per 24-hour unit. */
      amountInr: number;
      rounding: Rounding;
    }
  | {
      kind: "daily-plus-hourly";
      dailyAmountInr: number;
      hourlyAmountInr: number;
      /** Residual time after whole 24 h units is billed in these intervals. */
      billableIntervalMinutes: number;
      rounding: Rounding;
      /** Only when explicitly approved: residual charge never exceeds one daily rate. */
      capResidualAtDailyRate: boolean;
    };

export type Surcharge = {
  id: string;
  label: Localized<string>;
  kind: "fixed" | "percent";
  value: number;
};

export type TaxRule =
  | { mode: "included-in-rates" }
  | { mode: "added"; percent: number; label: Localized<string> };

export type CarPricing =
  | { status: "pending"; note: string }
  | {
      status: "approved";
      model: RateModel;
      /** Approved minimum billable duration in minutes (0 = explicitly no minimum). */
      minimumBillableMinutes: number;
      /** The complete, approved list of surcharges (may be empty). */
      surcharges: Surcharge[];
      tax: TaxRule;
      approvedOn: string;
    };

export type PricingConfig = Record<CarId, CarPricing>;

export type EstimateLine = {
  kind: "daily" | "hourly" | "surcharge" | "tax";
  label?: Localized<string>;
  units?: number;
  unitAmountInr?: number;
  intervalMinutes?: number;
  amountInr: number;
};

export type EstimateResult =
  | {
      kind: "estimate";
      carId: CarId;
      amountInr: number;
      elapsedMinutes: number;
      billableMinutes: number;
      minimumApplied: boolean;
      breakdown: EstimateLine[];
      disclaimer: "estimate-final-price-confirmed-by-zippy";
    }
  | {
      kind: "price-on-request";
      reason: "no-vehicle-selected" | "pricing-not-approved" | "unknown-vehicle";
    }
  | { kind: "invalid"; errors: Partial<Record<RequestField, RequestErrorCode>> };

export type EnquiryInput = {
  carId: CarId | null;
  branchId: BranchId | null;
  pickupAt: Date;
  returnAt: Date;
  name?: string;
  note?: string;
};
