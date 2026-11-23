"use client";

import { Users, Gauge, Fuel } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Link } from "@/i18n/navigation";
import { env } from "@/lib/env";
import { formatInr } from "@/lib/formatting";
import { displayRate } from "@/lib/pricing";
import { pricingConfig, packagePricing } from "@/data/pricing";
import { site } from "@/data/site";
import type { Car } from "@/types/car";
import type { Locale } from "@/i18n/routing";
import { CarMedia } from "./CarMedia";
import { useSpecValue } from "./SpecList";
import { getPublicSpecs } from "./specs";

function WhatsAppBrandIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="#25D366" />
      <path
        d="M17.5 14.4c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1-.2.2-.6.7-.8.9-.1.1-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.5-1.8-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.3-.1-.5-.1-.1-.5-1.2-.7-1.7-.2-.5-.4-.4-.5-.4h-.4c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.7 2.6 4.2 3.7.6.3 1.1.4 1.4.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z"
        fill="#ffffff"
      />
    </svg>
  );
}

type PackageType = "12-hour" | "24-hour";
const EXCESS_KM_RATE = 10;

export function carLabel(car: Car, unitText: (unit: number) => string): string {
  const unit = car.unitIdentifier ?? (car.unitNumber ? unitText(car.unitNumber) : null);
  return unit ? `${car.displayName} — ${unit}` : car.displayName;
}

export function CarCard({ car, headingLevel = "h3" }: { car: Car; headingLevel?: "h2" | "h3" }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const format = useSpecValue();
  const Heading = headingLevel;
  const fullName = carLabel(car, (unit) => t("Common.vehicleUnit", { unit }));
  const specs = getPublicSpecs(car, env.showPendingContent);
  const managed = car.rentalPricing;
  const hourlyPrice = managed?.find((item) => item.packageCode === "hourly");
  const storedRate = pricingConfig[car.id];
  const rate = managed
    ? hourlyPrice?.pricingStatus === "APPROVED" && hourlyPrice.amountInr !== null
      ? { amountInr: Number(hourlyPrice.amountInr) }
      : null
    : storedRate
      ? displayRate(storedRate)
      : null;

  // Package state
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("12-hour");
  const managedPackage = managed?.find((item) => item.packageCode === selectedPackage);
  const storedPackage = Object.hasOwn(packagePricing[selectedPackage], car.id)
    ? packagePricing[selectedPackage][car.id as keyof (typeof packagePricing)["12-hour"]]
    : null;
  const packagePrice = managed
    ? managedPackage?.pricingStatus === "APPROVED" && managedPackage.amountInr !== null
      ? {
        price: Number(managedPackage.amountInr),
        limitKm: managedPackage.includedKm,
        extraKmChargeInr: managedPackage.extraKmChargeInr,
      }
      : null
    : storedPackage
      ? { ...storedPackage, extraKmChargeInr: EXCESS_KM_RATE }
      : null;
  const extraKmCharge = managed ? managedPackage?.extraKmChargeInr : packagePrice?.extraKmChargeInr;
  // Check if 24-hour package has pricing configured for this specific car
  const managed24Hour = managed?.find((item) => item.packageCode === "24-hour");
  const has24HourPricing = managed
    ? managed24Hour?.pricingStatus === "APPROVED" && managed24Hour.amountInr !== null
    : Object.hasOwn(packagePricing["24-hour"], car.id) &&
    packagePricing["24-hour"][car.id as keyof (typeof packagePricing)["24-hour"]] !== null;

  // Get transmission, seats, and fuel for display
  const transmissionSpec = specs.find((s) => s.key === "transmission");
  const seatsSpec = specs.find((s) => s.key === "seats");
  const fuelSpec = specs.find((s) => s.key === "fuel");

  // WhatsApp message generation
  const whatsappNumber =
    site.contacts.whatsapp.status === "confirmed" && site.contacts.whatsapp.value
      ? site.contacts.whatsapp.value.e164
      : null;
  const generateWhatsAppMessage = () => {
    const price = packagePrice ? formatInr(packagePrice.price, locale) : "Price on request";
    const kmAllowance =
      packagePrice?.limitKm != null ? `${packagePrice.limitKm} km` : "To be confirmed";
    const extraCharge = extraKmCharge == null ? "To be confirmed" : `₹${extraKmCharge}/km`;
    const message = `Hello, I would like to enquire about renting ${car.displayName}. Package: ${selectedPackage}. Price: ${price}. Included kilometres: ${kmAllowance}. Additional kilometres: ${extraCharge}. Please share availability and booking details.`;
    return encodeURIComponent(message);
  };

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace("+", "")}?text=${generateWhatsAppMessage()}`
    : "#";

  return (
    <article
      data-testid="car-card"
      className="car-card-3d group flex flex-col overflow-hidden rounded-2xl border border-line bg-raised shadow-raised focus-within:border-line-strong w-full max-w-full transition-all duration-300 hover:border-accent/40"
    >
      <Link
        href={`/cars/${car.slug}`}
        tabIndex={-1}
        aria-hidden
        className="block overflow-hidden relative aspect-[4/3] w-full max-w-full"
      >
        <CarMedia car={car} />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6 w-full max-w-full">
        {/* Vehicle Name and Unit */}
        <div>
          <Heading className="font-display text-lg sm:text-xl font-bold tracking-[-0.01em] text-ink leading-tight">
            {car.model}
          </Heading>
        </div>

        {/* Vehicle Specifications */}
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-ink-2 w-full max-w-full">
          {transmissionSpec && (
            <div className="flex items-center gap-1.5">
              <Gauge className="size-3.5" aria-hidden />
              <span className="truncate">{format(transmissionSpec)}</span>
            </div>
          )}
          {seatsSpec && (
            <div className="flex items-center gap-1.5">
              <Users className="size-3.5" aria-hidden />
              <span className="truncate">{format(seatsSpec)}</span>
            </div>
          )}
          {fuelSpec && (
            <div className="flex items-center gap-1.5">
              <Fuel className="size-3.5" aria-hidden />
              <span className="truncate">{format(fuelSpec)}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-line" />

        {/* Price and Package Information */}
        <div className="space-y-2 w-full max-w-full">
          {packagePrice ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl font-bold text-ink truncate">
                    {formatInr(packagePrice.price, locale)} / per day
                  </p>
                  <p className="text-xs text-ink-2">{selectedPackage} package</p>
                </div>
                {/* Package Selector */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedPackage("12-hour")}
                    aria-pressed={selectedPackage === "12-hour"}
                    className={`min-h-[2.5rem] min-w-[3.5rem] px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all rounded-md ${selectedPackage === "12-hour"
                        ? "bg-accent text-on-accent shadow-sm"
                        : "bg-muted text-ink-2 hover:bg-muted/80"
                      }`}
                  >
                    12HR
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (has24HourPricing) {
                        setSelectedPackage("24-hour");
                      }
                    }}
                    aria-pressed={selectedPackage === "24-hour"}
                    className={`min-h-[2.5rem] min-w-[3.5rem] px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all rounded-md ${selectedPackage === "24-hour"
                        ? "bg-accent text-on-accent shadow-sm"
                        : "bg-muted text-ink-2 hover:bg-muted/80"
                      }`}
                  >
                    24HR
                  </button>
                </div>
              </div>

              {/* Hourly Rate */}
              {rate ? (
                <p className="text-xs text-ink-2">{formatInr(rate.amountInr, locale)}/hour</p>
              ) : null}

              {/* Kilometre Allowance */}
              <div className="flex items-center gap-2 text-xs text-ink-2 flex-wrap">
                {packagePrice.limitKm != null ? (
                  <span>{packagePrice.limitKm} km included</span>
                ) : null}
                {extraKmCharge != null ? (
                  <>
                    <span className="text-ink-3">•</span>
                    <span>₹{extraKmCharge}/km extra</span>
                  </>
                ) : null}
              </div>
            </>
          ) : (
            <p className="text-sm font-semibold text-ink-2">{t("Common.priceOnRequest")}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2 w-full max-w-full">
          <ButtonLink
            href={{ pathname: "/book", query: { car: car.slug } }}
            size="sm"
            aria-label={`Book ${fullName}`}
            className="flex-1 justify-center text-xs sm:text-sm font-semibold min-h-[2.75rem]"
          >
            Book Now
          </ButtonLink>
          {whatsappNumber && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enquire on WhatsApp about ${fullName}`}
              className="inline-flex items-center justify-center min-h-[2.75rem] min-w-[2.75rem] px-2.5 rounded-control border border-line bg-transparent hover:border-line-strong hover:bg-muted transition-all flex-shrink-0"
            >
              <WhatsAppBrandIcon className="size-6 sm:size-7" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
