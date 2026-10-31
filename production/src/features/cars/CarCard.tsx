"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRef, useCallback } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Link } from "@/i18n/navigation";
import { env } from "@/lib/env";
import { formatInr } from "@/lib/formatting";
import { displayRate } from "@/lib/pricing";
import { pricingConfig } from "@/data/pricing";
import type { Car } from "@/types/car";
import type { Locale } from "@/i18n/routing";
import { CarMedia } from "./CarMedia";
import { useSpecValue } from "./SpecList";
import { getPublicSpecs } from "./specs";

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
  const dailyRate = rate ? rate.amountInr * 24 : null;

  // Get fuel type for badge
  const fuelSpec = specs.find((s) => s.key === "fuel");
  const fuelType = fuelSpec ? format(fuelSpec).toUpperCase() : null;

  // Build specs string excluding fuel (shown as badge)
  const otherSpecs = specs.filter((s) => s.key !== "fuel").slice(0, 3);
  const specsString = otherSpecs.map((s) => format(s)).join(" • ");

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
      <Link href={`/cars/${car.slug}`} tabIndex={-1} aria-hidden className="block overflow-hidden relative">
        {fuelType && (
          <span className="absolute top-3 left-3 z-10 bg-black/75 dark:bg-black/75 backdrop-blur-md px-3 py-1 text-[0.65rem] font-bold tracking-wider text-white uppercase rounded">
            {fuelType}
          </span>
        )}
        <CarMedia car={car} />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div>
          <Heading className="font-display text-lg font-bold tracking-[-0.01em] text-ink">
            {car.make} {car.model}
            {car.unitNumber ? (
              <span className="ml-2 align-middle text-xs font-semibold text-accent-ink bg-accent/15 px-2 py-0.5 rounded-full">
                {t("Common.vehicleUnit", { unit: car.unitNumber })}
              </span>
            ) : null}
          </Heading>
        </div>

        {specsString && (
          <p className="text-xs text-ink-2">
            {specsString} • 350 km/day limit
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          {dailyRate ? (
            <p className="font-display text-base font-bold text-ink">
              {formatInr(dailyRate, locale)} <span className="text-sm font-normal text-ink-2">PER DAY</span>
            </p>
          ) : (
            <p className="text-sm font-semibold text-ink-2">{t("Common.priceOnRequest")}</p>
          )}
        </div>

        <ButtonLink
          href={{ pathname: "/book", query: { car: car.slug } }}
          size="sm"
          aria-label={t("Fleet.enquireFor", { car: fullName })}
          className="w-full justify-center text-xs font-bold bg-accent text-on-accent hover:bg-accent-hover transition-transform duration-150 hover:-translate-y-0.5"
        >
          BOOK
        </ButtonLink>
      </div>
    </article>
  );
}
