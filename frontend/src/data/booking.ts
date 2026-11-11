import type { BookingRules } from "@/types/booking";

export const BUSINESS_TIME_ZONE = "Asia/Kolkata" as const;

/**
 * Provisional request-window defaults (plans/plan.md §2.3). They restrict only what can be
 * requested; they never represent vehicle availability. Replace with approved rules.
 */
export const bookingRules: BookingRules = {
  timeZone: BUSINESS_TIME_ZONE,
  slotMinutes: 30,
  maxAdvanceDays: 180,
  minLeadMinutes: 0,
  minDurationMinutes: null,
  pickupWindow: null,
  status: "provisional-default",
};

export const NOTE_MAX_LENGTH = 300;
export const NAME_MAX_LENGTH = 80;
