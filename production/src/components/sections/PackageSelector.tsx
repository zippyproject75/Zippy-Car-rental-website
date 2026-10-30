"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { packagePricing } from "@/data/pricing";
import { getCars } from "@/lib/catalog";
import type { CarId } from "@/types/car";

type PackageType = "12-hour" | "24-hour";

export function PackageSelector() {
  const t = useTranslations("Home");
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("12-hour");
  const cars = getCars();

  const selectedCars = cars.filter((car) => {
    const pricing = packagePricing[selectedPackage][car.id as CarId];
    return pricing !== null;
  });

  return (
    <div className="rounded-card border border-line bg-raised p-6 shadow-raised sm:p-8">
      <div className="mb-6">
        <h3 className="font-display text-lg font-bold text-ink">{t("packageSelector")}</h3>
      </div>

      <div className="mb-6 flex gap-2 rounded-lg bg-muted p-1.5">
        <button
          onClick={() => setSelectedPackage("12-hour")}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
            selectedPackage === "12-hour"
              ? "bg-accent text-on-accent shadow-sm"
              : "text-ink-2 hover:text-ink"
          }`}
        >
          {t("package12Hour")}
        </button>
        <button
          onClick={() => setSelectedPackage("24-hour")}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
            selectedPackage === "24-hour"
              ? "bg-accent text-on-accent shadow-sm"
              : "text-ink-2 hover:text-ink"
          }`}
        >
          {t("package24Hour")}
        </button>
      </div>

      <div className="space-y-3">
        {selectedCars.map((car) => {
          const pricing = packagePricing[selectedPackage][car.id as CarId];
          if (!pricing) return null;

          return (
            <div
              key={car.id}
              className="flex items-center justify-between rounded-lg border border-line bg-muted/30 p-4"
            >
              <div>
                <p className="font-semibold text-ink">{car.displayName}</p>
                <p className="mt-1 text-sm text-ink-2">
                  {t("freeKmLimit", { km: pricing.limitKm })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-bold text-ink">₹{pricing.price}</p>
                <p className="text-xs text-ink-3">
                  {selectedPackage === "12-hour" ? "12 hours" : "24 hours"}
                </p>
              </div>
            </div>
          );
        })}

        {selectedCars.length === 0 && (
          <div className="rounded-lg border border-line bg-muted/30 p-4 text-center">
            <p className="text-sm text-ink-2">{t("priceUnavailable")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
