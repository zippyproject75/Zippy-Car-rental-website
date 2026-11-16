import { describe, expect, it } from "vitest";
import { bookingRules } from "@/data/booking";
import {
  addDaysToDateKey,
  businessDateKey,
  calculateElapsedMinutes,
  parseBusinessDateTime,
  requestDateBounds,
  splitMinutes,
  timeSlots,
  validateRequest,
} from "@/lib/dates";
import type { BookingRules } from "@/types/booking";

// 2026-03-10 10:00 IST
const NOW = new Date("2026-03-10T04:30:00.000Z");

describe("parseBusinessDateTime", () => {
  it("interprets wall time in Asia/Kolkata regardless of device zone", () => {
    expect(parseBusinessDateTime("2026-03-10", "10:00")?.toISOString()).toBe(
      "2026-03-10T04:30:00.000Z",
    );
  });
  it("rejects impossible or malformed values", () => {
    expect(parseBusinessDateTime("2026-02-30", "10:00")).toBeNull();
    expect(parseBusinessDateTime("2026-13-01", "10:00")).toBeNull();
    expect(parseBusinessDateTime("2026-03-10", "24:00")).toBeNull();
    expect(parseBusinessDateTime("10/03/2026", "10:00")).toBeNull();
  });
});

describe("date helpers", () => {
  it("computes the business date key across the UTC midnight boundary", () => {
    // 2026-03-10 20:00 UTC is 2026-03-11 01:30 IST
    expect(businessDateKey(new Date("2026-03-10T20:00:00Z"))).toBe("2026-03-11");
  });
  it("adds calendar days including month and leap-year rollover", () => {
    expect(addDaysToDateKey("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDaysToDateKey("2026-12-31", 1)).toBe("2027-01-01");
  });
  it("returns null for non-positive durations and whole minutes otherwise", () => {
    const a = new Date("2026-03-10T04:30:00Z");
    expect(calculateElapsedMinutes(a, a)).toBeNull();
    expect(calculateElapsedMinutes(a, new Date("2026-03-10T04:00:00Z"))).toBeNull();
    expect(calculateElapsedMinutes(a, new Date("2026-03-11T06:00:30Z"))).toBe(1530);
    expect(calculateElapsedMinutes(new Date(Number.NaN), a)).toBeNull();
  });
  it("splits minutes into days, hours and minutes", () => {
    expect(splitMinutes(1530)).toEqual({ days: 1, hours: 1, minutes: 30 });
  });
  it("produces 48 half-hour slots", () => {
    const slots = timeSlots(30);
    expect(slots).toHaveLength(48);
    expect(slots[0]).toBe("00:00");
    expect(slots.at(-1)).toBe("23:30");
  });
  it("bounds requests to the configured advance window", () => {
    expect(requestDateBounds(NOW, bookingRules)).toEqual({
      first: "2026-03-10",
      last: addDaysToDateKey("2026-03-10", bookingRules.maxAdvanceDays),
    });
  });
});

describe("validateRequest", () => {
  const base = {
    pickupDate: "2026-03-12",
    pickupTime: "10:00",
    returnDate: "2026-03-13",
    returnTime: "12:30",
  };

  it("accepts a valid future period and reports elapsed minutes", () => {
    const r = validateRequest(base, NOW, bookingRules);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.durationMinutes).toBe(26 * 60 + 30);
  });
  it("requires every field", () => {
    const r = validateRequest(
      { pickupDate: "", pickupTime: "", returnDate: "", returnTime: "" },
      NOW,
      bookingRules,
    );
    expect(r).toEqual({
      ok: false,
      errors: {
        pickupDate: "required",
        pickupTime: "required",
        returnDate: "required",
        returnTime: "required",
      },
    });
  });
  it("rejects a pickup in the past", () => {
    const r = validateRequest({ ...base, pickupDate: "2026-03-09" }, NOW, bookingRules);
    expect(r.ok === false && r.errors.pickupDate).toBe("pickupInPast");
    const earlier = validateRequest(
      { ...base, pickupDate: "2026-03-10", pickupTime: "09:30" },
      NOW,
      bookingRules,
    );
    expect(earlier.ok === false && earlier.errors.pickupTime).toBe("pickupInPast");
  });
  it("rejects a return that is not after pickup", () => {
    const same = validateRequest(
      { ...base, returnDate: "2026-03-12", returnTime: "10:00" },
      NOW,
      bookingRules,
    );
    expect(same.ok === false && same.errors.returnTime).toBe("returnNotAfterPickup");
    const before = validateRequest({ ...base, returnDate: "2026-03-11" }, NOW, bookingRules);
    expect(before.ok === false && before.errors.returnDate).toBe("returnNotAfterPickup");
  });
  it("rejects dates beyond the advance window", () => {
    const far = addDaysToDateKey("2026-03-10", bookingRules.maxAdvanceDays + 1);
    const r = validateRequest(
      { ...base, pickupDate: far, returnDate: far, returnTime: "18:00" },
      NOW,
      bookingRules,
    );
    expect(r.ok === false && r.errors.pickupDate).toBe("pickupTooFar");
  });
  it("applies optional approved rules: lead time, minimum duration and hours", () => {
    const strict: BookingRules = {
      ...bookingRules,
      minLeadMinutes: 120,
      minDurationMinutes: 240,
      pickupWindow: { from: "08:00", to: "20:00" },
    };
    const soon = validateRequest(
      { ...base, pickupDate: "2026-03-10", pickupTime: "11:00" },
      NOW,
      strict,
    );
    expect(soon.ok === false && soon.errors.pickupTime).toBe("pickupTooSoon");
    const short = validateRequest(
      { ...base, returnDate: "2026-03-12", returnTime: "12:00" },
      NOW,
      strict,
    );
    expect(short.ok === false && short.errors.returnTime).toBe("durationTooShort");
    const late = validateRequest({ ...base, pickupTime: "21:00" }, NOW, strict);
    expect(late.ok === false && late.errors.pickupTime).toBe("outsideHours");
  });
});
