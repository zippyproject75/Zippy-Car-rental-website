"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { pricingConfig, packagePricing } from "@/data/pricing";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { formatInr } from "@/lib/formatting";
import { displayRate } from "@/lib/pricing";
import type { CarId } from "@/types/car";

type PackageType = "12-hour" | "24-hour";
const EXCESS_KM_RATE = 10; // ₹10 per additional km from terms

/** Approved headline rate, or the honest "Price on request" state. */
export function PriceLine({ carId, className }: { carId: CarId; className?: string }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const rate = displayRate(pricingConfig[carId]);
  if (!rate) {
    return (
      <p className={cn("text-[0.9375rem] font-semibold text-ink", className)}>
        {t("Common.priceOnRequest")}
      </p>
    );
  }
  // Display hourly rate
  return (
    <p className={cn("text-[0.9375rem] text-ink-2", className)}>
      <span className="font-display text-lg font-bold tabular-nums text-ink">
        {formatInr(rate.amountInr, locale)}/hour
      </span>
    </p>
  );
}

export function PriceBlock({ carId }: { carId: CarId }) {
  const t = useTranslations("Car");
  const locale = useLocale() as Locale;
  const rate = displayRate(pricingConfig[carId]);
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("12-hour");
  const packagePrice = packagePricing[selectedPackage][carId as keyof typeof packagePricing["12-hour"]];
  const has24HourPackage = packagePricing["24-hour"][carId as keyof typeof packagePricing["24-hour"]] !== null;

  return (
    <div className="rounded-card border border-line bg-raised p-5">
      <p className="eyebrow">{t("priceTitle")}</p>
      
      {!rate ? (
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{t("pricePending")}</p>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Package Selector */}
          {packagePrice && (
            <div className="flex gap-2 rounded-lg bg-muted p-1">
              <button
                type="button"
                onClick={() => setSelectedPackage("12-hour")}
                aria-pressed={selectedPackage === "12-hour"}
                className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                  selectedPackage === "12-hour"
                    ? "bg-accent text-on-accent shadow-sm"
                    : "text-ink-2 hover:text-ink"
                }`}
              >
                12 Hour
              </button>
              {has24HourPackage && (
                <button
                  type="button"
                  onClick={() => setSelectedPackage("24-hour")}
                  aria-pressed={selectedPackage === "24-hour"}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                    selectedPackage === "24-hour"
                      ? "bg-accent text-on-accent shadow-sm"
                      : "text-ink-2 hover:text-ink"
                  }`}
                >
                  24 Hour
                </button>
              )}
            </div>
          )}

          {/* Price Display */}
          {packagePrice ? (
            <>
              <div className="flex items-baseline justify-between">
                <p className="font-display text-2xl font-bold text-ink">
                  {formatInr(packagePrice.price, locale)}
                </p>
                <p className="text-xs text-ink-2">
                  {selectedPackage} package
                </p>
              </div>
              
              {/* Hourly Rate */}
              <p className="text-sm leading-relaxed text-ink-2">
                Hourly rate: {formatInr(rate.amountInr, locale)}/hour
              </p>
              
              {/* Kilometre Allowance */}
              <div className="flex items-center gap-2 text-xs text-ink-2">
                <span className="font-medium">Included:</span>
                <span>{packagePrice.limitKm} km</span>
                <span className="text-ink-3">•</span>
                <span className="font-medium">Extra:</span>
                <span>₹{EXCESS_KM_RATE}/km</span>
              </div>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-ink-2">
              {formatInr(rate.amountInr, locale)}/hour
            </p>
          )}
        </div>
      )}
    </div>
  );
}
