import { describe, expect, it } from "vitest";
import { pricingConfig } from "@/data/pricing";
import { calculateEstimate, displayRate } from "@/lib/pricing";
import type { CarPricing, PricingConfig } from "@/types/booking";

const pickupAt = new Date("2026-03-12T04:30:00Z");
const at = (minutes: number) => new Date(pickupAt.getTime() + minutes * 60_000);

function withPricing(p: CarPricing): PricingConfig {
  return { ...pricingConfig, fronx: p };
}

const approvedBase = {
  status: "approved" as const,
  minimumBillableMinutes: 0,
  surcharges: [],
  tax: { mode: "included-in-rates" as const },
  approvedOn: "2026-01-01",
};

describe("calculateEstimate", () => {
  it("returns price-on-request for unapproved vehicles", () => {
    for (const carId of ["ertiga-1", "xl6"] as const) {
      expect(calculateEstimate({ carId, pickupAt, returnAt: at(600) }, pricingConfig)).toEqual({
        kind: "price-on-request",
        reason: "pricing-not-approved",
      });
    }
    expect(displayRate(pricingConfig["ertiga-1"])).toBeNull();
  });
  it("requires a vehicle and a valid period", () => {
    expect(calculateEstimate({ carId: null, pickupAt, returnAt: at(60) }, pricingConfig).kind).toBe(
      "price-on-request",
    );
    expect(
      calculateEstimate({ carId: "fronx", pickupAt, returnAt: pickupAt }, pricingConfig).kind,
    ).toBe("invalid");
  });
  it("bills hourly in the approved interval with ceil rounding", () => {
    const config = withPricing({
      ...approvedBase,
      model: { kind: "hourly", amountInr: 100, billableIntervalMinutes: 30, rounding: "ceil" },
    });
    const r = calculateEstimate({ carId: "fronx", pickupAt, returnAt: at(61) }, config);
    expect(r.kind === "estimate" && r.amountInr).toBe(300);
    expect(r.kind === "estimate" && r.breakdown[0]?.intervalMinutes).toBe(30);
  });
  it("applies minimums, residual caps, surcharges and tax in paise", () => {
    const config = withPricing({
      ...approvedBase,
      minimumBillableMinutes: 1440,
      surcharges: [
        {
          id: "clean",
          label: { en: "Cleaning", hi: "Cleaning", mr: "Cleaning" },
          kind: "fixed",
          value: 99.5,
        },
      ],
      tax: { mode: "added", percent: 18, label: { en: "GST", hi: "GST", mr: "GST" } },
      model: {
        kind: "daily-plus-hourly",
        dailyAmountInr: 2000,
        hourlyAmountInr: 300,
        billableIntervalMinutes: 60,
        rounding: "ceil",
        capResidualAtDailyRate: true,
      },
    });
    const short = calculateEstimate({ carId: "fronx", pickupAt, returnAt: at(120) }, config);
    expect(short.kind === "estimate" && short.minimumApplied).toBe(true);
    // 1 day (2000) + 99.50 = 2099.50; +18% = 377.91 → 2477.41
    expect(short.kind === "estimate" && short.amountInr).toBe(2477.41);
    const long = calculateEstimate({ carId: "fronx", pickupAt, returnAt: at(1440 + 600) }, config);
    // residual 10h × 300 = 3000 capped to 2000 → 4000 + 99.5 = 4099.5; +18% = 737.91 → 4837.41
    expect(long.kind === "estimate" && long.amountInr).toBe(4837.41);
  });
  it("treats incomplete approved pricing as price-on-request", () => {
    const config = withPricing({
      ...approvedBase,
      model: {
        kind: "hourly",
        amountInr: Number.NaN,
        billableIntervalMinutes: 60,
        rounding: "ceil",
      },
    });
    expect(calculateEstimate({ carId: "fronx", pickupAt, returnAt: at(60) }, config).kind).toBe(
      "price-on-request",
    );
  });
});
