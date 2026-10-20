import { calculateElapsedMinutes } from "@/lib/dates";
import type { CarPricing, EstimateLine, EstimateResult, PricingConfig } from "@/types/booking";
import type { CarId } from "@/types/car";

const DAY = 1440;
const toPaise = (inr: number) => Math.round(inr * 100);

function isAmount(n: number): boolean {
  return Number.isFinite(n) && n >= 0;
}

type ApprovedPricing = Extract<CarPricing, { status: "approved" }>;

function isUsable(p: ApprovedPricing): boolean {
  const m = p.model;
  const interval = m.kind === "daily" ? DAY : m.billableIntervalMinutes;
  const amounts =
    m.kind === "daily-plus-hourly" ? [m.dailyAmountInr, m.hourlyAmountInr] : [m.amountInr];
  return (
    amounts.every(isAmount) &&
    Number.isInteger(interval) &&
    interval > 0 &&
    m.rounding === "ceil" &&
    Number.isInteger(p.minimumBillableMinutes) &&
    p.minimumBillableMinutes >= 0 &&
    p.surcharges.every((s) => isAmount(s.value)) &&
    (p.tax.mode === "included-in-rates" || isAmount(p.tax.percent))
  );
}

/**
 * The single pricing function. Produces a numeric estimate ONLY when the selected vehicle
 * has an approved, complete pricing configuration. It never guesses rates, rounding,
 * minimums, taxes, deposits, fuel, kilometre or late charges.
 */
export function calculateEstimate(
  input: { carId: CarId | null; pickupAt: Date; returnAt: Date },
  pricingConfig: PricingConfig,
): EstimateResult {
  const elapsed = calculateElapsedMinutes(input.pickupAt, input.returnAt);
  if (elapsed === null) {
    const invalidDates =
      !Number.isFinite(input.pickupAt.getTime()) || !Number.isFinite(input.returnAt.getTime());
    return {
      kind: "invalid",
      errors: invalidDates ? { pickupDate: "invalid" } : { returnTime: "returnNotAfterPickup" },
    };
  }
  if (!input.carId) return { kind: "price-on-request", reason: "no-vehicle-selected" };

  const pricing = Object.hasOwn(pricingConfig, input.carId)
    ? pricingConfig[input.carId]
    : undefined;
  if (!pricing) return { kind: "price-on-request", reason: "unknown-vehicle" };
  if (pricing.status !== "approved" || !isUsable(pricing)) {
    return { kind: "price-on-request", reason: "pricing-not-approved" };
  }

  const billable = Math.max(elapsed, pricing.minimumBillableMinutes);
  const lines: EstimateLine[] = [];
  const m = pricing.model;

  if (m.kind === "hourly") {
    const units = Math.ceil(billable / m.billableIntervalMinutes);
    lines.push({
      kind: "hourly",
      units,
      unitAmountInr: m.amountInr,
      intervalMinutes: m.billableIntervalMinutes,
      amountInr: units * m.amountInr,
    });
  } else if (m.kind === "daily") {
    const units = Math.ceil(billable / DAY);
    lines.push({
      kind: "daily",
      units,
      unitAmountInr: m.amountInr,
      amountInr: units * m.amountInr,
    });
  } else {
    const days = Math.floor(billable / DAY);
    const residual = billable - days * DAY;
    if (days > 0) {
      lines.push({
        kind: "daily",
        units: days,
        unitAmountInr: m.dailyAmountInr,
        amountInr: days * m.dailyAmountInr,
      });
    }
    if (residual > 0) {
      const units = Math.ceil(residual / m.billableIntervalMinutes);
      let amount = units * m.hourlyAmountInr;
      if (m.capResidualAtDailyRate && amount > m.dailyAmountInr) amount = m.dailyAmountInr;
      lines.push({
        kind: "hourly",
        units,
        unitAmountInr: m.hourlyAmountInr,
        intervalMinutes: m.billableIntervalMinutes,
        amountInr: amount,
      });
    }
  }

  const basePaise = lines.reduce((sum, l) => sum + toPaise(l.amountInr), 0);
  let subtotalPaise = basePaise;
  for (const s of pricing.surcharges) {
    const paise = s.kind === "fixed" ? toPaise(s.value) : Math.round((basePaise * s.value) / 100);
    lines.push({ kind: "surcharge", label: s.label, amountInr: paise / 100 });
    subtotalPaise += paise;
  }
  let totalPaise = subtotalPaise;
  if (pricing.tax.mode === "added") {
    const taxPaise = Math.round((subtotalPaise * pricing.tax.percent) / 100);
    lines.push({ kind: "tax", label: pricing.tax.label, amountInr: taxPaise / 100 });
    totalPaise += taxPaise;
  }

  return {
    kind: "estimate",
    carId: input.carId,
    amountInr: totalPaise / 100,
    elapsedMinutes: elapsed,
    billableMinutes: billable,
    minimumApplied: billable > elapsed,
    breakdown: lines,
    disclaimer: "estimate-final-price-confirmed-by-zippy",
  };
}

/** Approved headline rate for display. Null means "Price on request". */
export function displayRate(
  pricing: CarPricing,
): { amountInr: number; basis: "day" | "interval"; intervalMinutes: number } | null {
  if (pricing.status !== "approved" || !isUsable(pricing)) return null;
  const m = pricing.model;
  if (m.kind === "hourly") {
    return {
      amountInr: m.amountInr,
      basis: "interval",
      intervalMinutes: m.billableIntervalMinutes,
    };
  }
  if (m.kind === "daily") return { amountInr: m.amountInr, basis: "day", intervalMinutes: DAY };
  return { amountInr: m.dailyAmountInr, basis: "day", intervalMinutes: DAY };
}
