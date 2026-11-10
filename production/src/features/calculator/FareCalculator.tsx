"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getCars } from "@/lib/catalog";
import { displayRate } from "@/lib/pricing";
import { pricingConfig, packagePricing } from "@/data/pricing";
import { formatInr } from "@/lib/formatting";
import { Link } from "@/i18n/navigation";
import type { Car, CarId } from "@/types/car";
import type { Locale } from "@/i18n/routing";

const GST_RATE = 0.18;
const DEPOSIT_AMOUNT = 10000;

type PricingMode = "hourly" | "12-hour";

export function FareCalculator() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const cars = getCars();
  const [selectedCarId, setSelectedCarId] = useState<CarId | null>(null);
  const [pricingMode, setPricingMode] = useState<PricingMode>("hourly");
  const [durationHours, setDurationHours] = useState(12);

  const selectedCar = cars.find((c) => c.id === selectedCarId);
  const rate = selectedCar ? displayRate(pricingConfig[selectedCar.id]) : null;
  const packagePrice = selectedCar ? packagePricing["12-hour"][selectedCar.id as keyof typeof packagePricing["12-hour"]] : null;

  // Calculate fare
  let baseAmount = 0;
  let taxAmount = 0;
  let totalAmount = 0;

  if (selectedCar) {
    if (pricingMode === "12-hour" && packagePrice) {
      // Use fixed 12-hour package price
      baseAmount = packagePrice.price;
    } else if (rate) {
      // Use hourly rate
      baseAmount = rate.amountInr * durationHours;
    }
    taxAmount = baseAmount * GST_RATE;
    totalAmount = baseAmount + taxAmount;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      {/* Left: Car Selection */}
      <div className="space-y-6">
        <div>
          <h2 className="eyebrow mb-3">SELECT YOUR ASSET</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {cars.map((car) => {
              const carRate = displayRate(pricingConfig[car.id]);
              const carPackagePrice = packagePricing["12-hour"][car.id as keyof typeof packagePricing["12-hour"]];
              const isSelected = selectedCarId === car.id;

              return (
                <button
                  key={car.id}
                  onClick={() => setSelectedCarId(car.id)}
                  className={`relative flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-accent bg-accent/5"
                      : "border-line bg-raised hover:border-line-strong"
                  }`}
                >
                  <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded bg-muted">
                    {car.images.primary ? (
                      <img
                        src={car.images.primary.src}
                        alt={car.images.primary.alt[locale] || car.displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="media-placeholder h-full w-full" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-display font-bold text-ink">{car.displayName}</p>
                    {carRate ? (
                      <p className="text-sm text-ink-2">
                        {formatInr(carRate.amountInr, locale)} <span className="text-xs">/hour</span>
                      </p>
                    ) : (
                      <p className="text-sm text-ink-3">Price on request</p>
                    )}
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-accent flex items-center justify-center">
                      <svg
                        className="h-3 w-3 text-on-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Mode & Duration Input */}
        <div className="rounded-lg border border-line bg-raised p-6">
          <h3 className="eyebrow mb-4">USAGE CONFIGURATION</h3>
          
          {/* Pricing Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setPricingMode("hourly")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                pricingMode === "hourly"
                  ? "bg-accent text-on-accent"
                  : "bg-muted text-ink-2 hover:text-ink"
              }`}
            >
              Hourly Rate
            </button>
            <button
              type="button"
              onClick={() => setPricingMode("12-hour")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                pricingMode === "12-hour"
                  ? "bg-accent text-on-accent"
                  : "bg-muted text-ink-2 hover:text-ink"
              }`}
            >
              12-Hour Package
            </button>
          </div>

          {pricingMode === "hourly" ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="duration" className="text-sm font-semibold text-ink">
                DURATION (HOURS)
              </label>
              <input
                id="duration"
                type="number"
                min="1"
                max="24"
                value={durationHours}
                onChange={(e) => setDurationHours(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-control border border-line bg-canvas px-4 py-3 text-ink focus:border-accent focus:outline-none"
              />
              <p className="text-xs text-ink-3">
                {durationHours} {durationHours === 1 ? "HOUR" : "HOURS"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-ink">12-HOUR PACKAGE</p>
              <p className="text-xs text-ink-3">
                Fixed price for 12 hours of rental
              </p>
              {selectedCar && packagePrice ? (
                <p className="text-sm text-ink-2 mt-2">
                  Package price: {formatInr(packagePrice.price, locale)}
                </p>
              ) : (
                <p className="text-sm text-ink-3 mt-2">Select a vehicle to see package price</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Fare Breakdown (Dark Theme) */}
      <div className="bg-muted border border-line rounded-2xl p-6 space-y-6 dark:bg-sunken dark:border-line-strong">
        <div>
          <h2 className="eyebrow mb-2 text-accent-ink">ESTIMATED TOTAL COST</h2>
          {selectedCar ? (
            <p className="text-sm text-ink-2 mb-2 dark:text-ink-3">BASED ON {selectedCar.displayName.toUpperCase()}</p>
          ) : (
            <p className="text-sm text-ink-2 mb-2 dark:text-ink-3">SELECT A VEHICLE ABOVE</p>
          )}
          <p className="font-display text-4xl font-bold text-ink dark:text-ink">
            {selectedCar ? formatInr(totalAmount, locale) : "₹0"}
          </p>
        </div>

        <div className="space-y-4 border-t border-line pt-4 dark:border-line-strong">
          <h3 className="eyebrow text-accent-ink">FARE CALCULATION</h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-ink-2 dark:text-ink-3">BASE CALCULATION</span>
              <span className="text-ink font-medium dark:text-ink">
                {selectedCar ? (
                  pricingMode === "12-hour" && packagePrice ? (
                    `12-hour package`
                  ) : (
                    `${durationHours} HOURS × ${formatInr(rate?.amountInr || 0, locale)}/hour`
                  )
                ) : "-"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-ink-2 dark:text-ink-3">SUBTOTAL</span>
              <span className="text-ink font-medium dark:text-ink">
                {selectedCar ? formatInr(baseAmount, locale) : "₹0"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-ink-2 dark:text-ink-3">TAX (GST {GST_RATE * 100}%)</span>
              <span className="text-ink font-medium dark:text-ink">
                {selectedCar ? formatInr(taxAmount, locale) : "₹0"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-ink-2 dark:text-ink-3">PLATFORM UTILITY FEE</span>
              <span className="text-accent-ink font-medium">INCLUDED</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-ink-2 dark:text-ink-3">INSURANCE POLICY</span>
              <span className="text-accent-ink font-medium">COMPLIMENTARY</span>
            </div>
          </div>
        </div>

        <div className="border-t border-line pt-4 dark:border-line-strong">
          <p className="text-xs text-ink-3 leading-relaxed mb-4 dark:text-ink-3">
            THIS IS A CLINICAL APPROXIMATION. ACTUAL FARE MIGHT DEVIATE BY 10% BASED ON REAL-WORLD
            TRAFFIC OR ROUTE DYNAMICS.
          </p>

          <Link
            href={selectedCar ? `/book?car=${selectedCar.slug}` : "/book"}
            className="block w-full rounded-lg bg-accent px-6 py-4 text-center font-display font-bold text-on-accent hover:bg-accent-hover transition-colors"
          >
            INITIATE BOOKING PROTOCOL
          </Link>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-ink-2 dark:text-ink-3">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-accent-ink" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>VERIFIED RIDES</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-accent-ink" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              <span>INSTANT REFUND</span>
            </div>
          </div>
        </div>

        <div className="border-t border-line pt-4 dark:border-line-strong">
          <p className="text-xs text-ink-3 text-center dark:text-ink-3">
            LOGIN TO VIEW PERSONALIZED DISCOUNTS BASED ON YOUR FLEET SELECTION.
          </p>
        </div>
      </div>
    </div>
  );
}
