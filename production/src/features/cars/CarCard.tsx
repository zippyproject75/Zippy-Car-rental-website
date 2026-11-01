"use client";

import { MessageCircle, Users, Gauge } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRef, useCallback, useState } from "react";
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

type PackageType = "12-hour" | "24-hour";
const EXCESS_KM_RATE = 10; // ₹10 per additional km from terms

export function carLabel(car: Car, unitText: (unit: number) => string): string {
  return car.unitNumber ? `${car.displayName} — ${unitText(car.unitNumber)}` : car.displayName;
}

export function CarCard({ car, headingLevel = "h3" }: { car: Car; headingLevel?: "h2" | "h3" }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const format = useSpecValue();
  const Heading = headingLevel;
  const fullName = carLabel(car, (unit) => t("Common.vehicleUnit", { unit }));
  const specs = getPublicSpecs(car, env.showPendingContent);
  const rate = displayRate(pricingConfig[car.id]);
  
  // Package state
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("12-hour");
  const packagePrice = packagePricing[selectedPackage][car.id as keyof typeof packagePricing["12-hour"]];
  const has24HourPackage = packagePricing["24-hour"][car.id as keyof typeof packagePricing["24-hour"]] !== null;

  // Get fuel type for badge
  const fuelSpec = specs.find((s) => s.key === "fuel");
  const fuelType = fuelSpec ? format(fuelSpec).toUpperCase() : null;

  // Get transmission and seats for display
  const transmissionSpec = specs.find((s) => s.key === "transmission");
  const seatsSpec = specs.find((s) => s.key === "seats");

  // WhatsApp message generation
  const whatsappNumber = site.contacts.whatsapp.status === "confirmed" && site.contacts.whatsapp.value 
    ? site.contacts.whatsapp.value.e164 
    : null;
  const generateWhatsAppMessage = () => {
    const price = packagePrice ? formatInr(packagePrice.price, locale) : "Price on request";
    const kmAllowance = packagePrice ? `${packagePrice.limitKm} km` : "N/A";
    const message = `Hello, I would like to enquire about renting ${car.displayName}. Package: ${selectedPackage}. Price: ${price}. Included kilometres: ${kmAllowance}. Additional kilometres: ₹${EXCESS_KM_RATE}/km. Please share availability and booking details.`;
    return encodeURIComponent(message);
  };

  const whatsappUrl = whatsappNumber 
    ? `https://wa.me/${whatsappNumber.replace("+", "")}?text=${generateWhatsAppMessage()}`
    : "#";

  /* ── 3D pointer-tracking tilt (mouse/trackpad only) ── */
  const cardRef = useRef<HTMLElement | null>(null);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rx = -dy * 6;
    const ry = dx * 6;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.015)`;
  }, []);

  const onPointerLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
  }, []);

  return (
    <article
      ref={cardRef as React.RefObject<HTMLElement>}
      data-testid="car-card"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="car-card-3d group flex flex-col overflow-hidden rounded-2xl border border-line bg-raised shadow-raised focus-within:border-line-strong w-full transition-[border-color] duration-300 hover:border-accent/40"
    >
      <Link href={`/cars/${car.slug}`} tabIndex={-1} aria-hidden className="block overflow-hidden relative aspect-[4/3]">
        {fuelType && (
          <span className="absolute top-3 left-3 z-10 bg-black/75 dark:bg-black/75 backdrop-blur-md px-3 py-1.5 text-[0.65rem] font-bold tracking-wider text-white uppercase rounded-lg">
            {fuelType}
          </span>
        )}
        <CarMedia car={car} />
      </Link>
      
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
        {/* Vehicle Name and Unit */}
        <div>
          <Heading className="font-display text-base sm:text-lg font-bold tracking-[-0.01em] text-ink leading-tight">
            {car.make} {car.model}
            {car.unitNumber ? (
              <span className="ml-2 align-middle text-xs font-semibold text-accent-ink bg-accent/15 px-2 py-0.5 rounded-full inline-block">
                {t("Common.vehicleUnit", { unit: car.unitNumber })}
              </span>
            ) : null}
          </Heading>
        </div>

        {/* Vehicle Specifications */}
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-ink-2">
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
        </div>

        {/* Divider */}
        <div className="h-px bg-line" />

        {/* Price and Package Information */}
        <div className="space-y-2">
          {rate && packagePrice ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-xl font-bold text-ink">
                    {formatInr(packagePrice.price, locale)}
                  </p>
                  <p className="text-xs text-ink-2">
                    {selectedPackage} package
                  </p>
                </div>
                {/* Package Selector */}
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPackage("12-hour")}
                    aria-pressed={selectedPackage === "12-hour"}
                    className={`min-h-[2.75rem] px-3 py-1.5 text-xs sm:text-sm font-medium transition-all rounded-md ${
                      selectedPackage === "12-hour"
                        ? "bg-accent text-on-accent"
                        : "bg-muted text-ink-2 hover:bg-muted/80"
                    }`}
                  >
                    12h
                  </button>
                  {has24HourPackage && (
                    <button
                      type="button"
                      onClick={() => setSelectedPackage("24-hour")}
                      aria-pressed={selectedPackage === "24-hour"}
                      className={`min-h-[2.75rem] px-3 py-1.5 text-xs sm:text-sm font-medium transition-all rounded-md ${
                        selectedPackage === "24-hour"
                          ? "bg-accent text-on-accent"
                          : "bg-muted text-ink-2 hover:bg-muted/80"
                      }`}
                    >
                      24h
                    </button>
                  )}
                </div>
              </div>
              
              {/* Hourly Rate */}
              <p className="text-xs text-ink-2">
                or {formatInr(rate.amountInr, locale)}/hour
              </p>
              
              {/* Kilometre Allowance */}
              <div className="flex items-center gap-2 text-xs text-ink-2">
                <span>{packagePrice.limitKm} km included</span>
                <span className="text-ink-3">•</span>
                <span>₹{EXCESS_KM_RATE}/km extra</span>
              </div>
            </>
          ) : (
            <p className="text-sm font-semibold text-ink-2">{t("Common.priceOnRequest")}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2">
          <ButtonLink
            href={{ pathname: "/book", query: { car: car.slug } }}
            size="sm"
            aria-label={`Check availability for ${fullName}`}
            className="flex-1 justify-center text-xs sm:text-sm font-semibold min-h-[2.75rem]"
          >
            Check Availability
          </ButtonLink>
          {whatsappNumber && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enquire on WhatsApp about ${fullName}`}
              className="inline-flex items-center justify-center min-h-[2.75rem] min-w-[2.75rem] px-3 rounded-control border border-line bg-transparent text-ink hover:border-line-strong hover:bg-muted transition-all"
            >
              <MessageCircle className="size-4 sm:size-5" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
