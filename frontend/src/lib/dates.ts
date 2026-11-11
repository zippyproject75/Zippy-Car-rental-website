import { TZDate } from "@date-fns/tz";
import { BUSINESS_TIME_ZONE } from "@/data/booking";
import type {
  BookingRules,
  RequestDraft,
  RequestErrorCode,
  RequestField,
  RequestValidation,
} from "@/types/booking";

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
const MINUTE = 60_000;

const pad = (n: number) => String(n).padStart(2, "0");

export function isValidDateKey(key: string): boolean {
  return parseBusinessDateTime(key, "12:00") !== null;
}

export function isValidTimeKey(key: string): boolean {
  return TIME_RE.test(key);
}

/**
 * Interprets a `YYYY-MM-DD` date and `HH:mm` time as wall-clock time in Asia/Kolkata and
 * returns the absolute instant. Returns null for malformed or impossible values
 * (e.g. 2026-02-30). The visitor's device time zone is never consulted.
 */
export function parseBusinessDateTime(
  date: string,
  time: string,
  timeZone: string = BUSINESS_TIME_ZONE,
): Date | null {
  const dm = DATE_RE.exec(date);
  const tm = TIME_RE.exec(time);
  if (!dm || !tm) return null;
  const [y, mo, d] = [Number(dm[1]), Number(dm[2]), Number(dm[3])];
  const [h, mi] = [Number(tm[1]), Number(tm[2])];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const zoned = new TZDate(y, mo - 1, d, h, mi, timeZone);
  if (
    zoned.getFullYear() !== y ||
    zoned.getMonth() !== mo - 1 ||
    zoned.getDate() !== d ||
    zoned.getHours() !== h ||
    zoned.getMinutes() !== mi
  ) {
    return null;
  }
  return new Date(zoned.getTime());
}

/** `YYYY-MM-DD` of an instant in the business time zone. */
export function businessDateKey(instant: Date, timeZone: string = BUSINESS_TIME_ZONE): string {
  const z = new TZDate(instant.getTime(), timeZone);
  return `${z.getFullYear()}-${pad(z.getMonth() + 1)}-${pad(z.getDate())}`;
}

/** `HH:mm` of an instant in the business time zone. */
export function businessTimeKey(instant: Date, timeZone: string = BUSINESS_TIME_ZONE): string {
  const z = new TZDate(instant.getTime(), timeZone);
  return `${pad(z.getHours())}:${pad(z.getMinutes())}`;
}

/** Calendar arithmetic on a business-zone date key (noon anchor avoids edge effects). */
export function addDaysToDateKey(key: string, days: number): string {
  const base = parseBusinessDateTime(key, "12:00");
  if (!base) throw new Error(`Invalid date key: ${key}`);
  const z = new TZDate(base.getTime(), BUSINESS_TIME_ZONE);
  const shifted = new TZDate(
    z.getFullYear(),
    z.getMonth(),
    z.getDate() + days,
    12,
    0,
    BUSINESS_TIME_ZONE,
  );
  return businessDateKey(new Date(shifted.getTime()));
}

/**
 * Elapsed rental duration between two instants, in whole minutes.
 * Contract: returns null when either value is invalid or when `returnAt <= pickupAt`.
 * Uses absolute instants, so calendar-day subtraction, device zones and DST never apply.
 */
export function calculateElapsedMinutes(pickupAt: Date, returnAt: Date): number | null {
  const a = pickupAt.getTime();
  const b = returnAt.getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return null;
  return Math.floor((b - a) / MINUTE);
}

export function splitMinutes(total: number): { days: number; hours: number; minutes: number } {
  const days = Math.floor(total / 1440);
  const hours = Math.floor((total % 1440) / 60);
  return { days, hours, minutes: total % 60 };
}

/** Selectable request times, e.g. every 30 minutes from 00:00 to 23:30. */
export function timeSlots(slotMinutes: number): string[] {
  const slots: string[] = [];
  for (let m = 0; m < 1440; m += slotMinutes) {
    slots.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  }
  return slots;
}

/** The first and last selectable request dates for the configured window. */
export function requestDateBounds(now: Date, rules: BookingRules): { first: string; last: string } {
  const earliest = new Date(now.getTime() + rules.minLeadMinutes * MINUTE);
  const first = businessDateKey(earliest);
  return { first, last: addDaysToDateKey(businessDateKey(now), rules.maxAdvanceDays) };
}

/**
 * Validates a requested rental period against the configured request rules.
 * The rules restrict what may be *requested*; they say nothing about vehicle availability.
 */
export function validateRequest(
  draft: RequestDraft,
  now: Date,
  rules: BookingRules,
): RequestValidation {
  const errors: Partial<Record<RequestField, RequestErrorCode>> = {};
  const set = (field: RequestField, code: RequestErrorCode) => {
    errors[field] ??= code;
  };

  for (const field of ["pickupDate", "pickupTime", "returnDate", "returnTime"] as const) {
    if (!draft[field]) set(field, "required");
  }
  if (draft.pickupDate && !isValidDateKey(draft.pickupDate)) set("pickupDate", "invalid");
  if (draft.returnDate && !isValidDateKey(draft.returnDate)) set("returnDate", "invalid");
  if (draft.pickupTime && !isValidTimeKey(draft.pickupTime)) set("pickupTime", "invalid");
  if (draft.returnTime && !isValidTimeKey(draft.returnTime)) set("returnTime", "invalid");

  const pickupAt =
    errors.pickupDate || errors.pickupTime
      ? null
      : parseBusinessDateTime(draft.pickupDate, draft.pickupTime);
  const returnAt =
    errors.returnDate || errors.returnTime
      ? null
      : parseBusinessDateTime(draft.returnDate, draft.returnTime);

  const todayKey = businessDateKey(now);
  const lastKey = addDaysToDateKey(todayKey, rules.maxAdvanceDays);

  if (pickupAt) {
    if (draft.pickupDate < todayKey) set("pickupDate", "pickupInPast");
    else if (pickupAt.getTime() < now.getTime()) set("pickupTime", "pickupInPast");
    else if (pickupAt.getTime() < now.getTime() + rules.minLeadMinutes * MINUTE) {
      set("pickupTime", "pickupTooSoon");
    }
    if (draft.pickupDate > lastKey) set("pickupDate", "pickupTooFar");
    if (rules.pickupWindow) {
      const t = draft.pickupTime;
      if (t < rules.pickupWindow.from || t > rules.pickupWindow.to) {
        set("pickupTime", "outsideHours");
      }
    }
  }
  if (returnAt && draft.returnDate > lastKey) set("returnDate", "returnTooFar");
  if (pickupAt && returnAt) {
    const elapsed = calculateElapsedMinutes(pickupAt, returnAt);
    if (elapsed === null) {
      set(
        draft.returnDate < draft.pickupDate ? "returnDate" : "returnTime",
        "returnNotAfterPickup",
      );
    } else if (rules.minDurationMinutes !== null && elapsed < rules.minDurationMinutes) {
      set("returnTime", "durationTooShort");
    }
  }

  if (Object.keys(errors).length > 0 || !pickupAt || !returnAt) return { ok: false, errors };
  return {
    ok: true,
    pickupAt,
    returnAt,
    durationMinutes: calculateElapsedMinutes(pickupAt, returnAt) ?? 0,
  };
}
