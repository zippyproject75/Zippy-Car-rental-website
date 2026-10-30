"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useCallback } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Link } from "@/i18n/navigation";
import { env } from "@/lib/env";
import type { Car } from "@/types/car";
import { CarMedia } from "./CarMedia";
import { PriceLine } from "./PriceBlock";
import { useSpecValue } from "./SpecList";
import { getPublicSpecs } from "./specs";

export function carLabel(car: Car, unitText: (unit: number) => string): string {
  return car.unitNumber ? `${car.displayName} — ${unitText(car.unitNumber)}` : car.displayName;
}

export function CarCard({ car, headingLevel = "h3" }: { car: Car; headingLevel?: "h2" | "h3" }) {
  const t = useTranslations();
  const format = useSpecValue();
  const Heading = headingLevel;
  const fullName = carLabel(car, (unit) => t("Common.vehicleUnit", { unit }));
  const specs = getPublicSpecs(car, env.showPendingContent).slice(0, 3);

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
      <Link href={`/cars/${car.slug}`} tabIndex={-1} aria-hidden className="block overflow-hidden">
        <CarMedia car={car} />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div>
          <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-accent-ink uppercase">
            {car.make}
          </p>
          <Heading className="mt-1 font-display text-xl font-bold tracking-[-0.01em] text-ink">
            {car.model}
            {car.unitNumber ? (
              <span className="ml-2 align-middle text-xs font-semibold text-accent-ink bg-accent/15 px-2 py-0.5 rounded-full">
                {t("Common.vehicleUnit", { unit: car.unitNumber })}
              </span>
            ) : null}
          </Heading>
        </div>

        {specs.length ? (
          <ul className="flex flex-wrap gap-1.5 text-xs">
            {specs.map((s) => (
              <li
                key={s.key}
                className="inline-flex items-center rounded-md border border-line bg-muted/50 px-2.5 py-1 font-medium text-ink-2"
              >
                {format(s)}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-2">
          <PriceLine carId={car.id} />
        </div>

        <div className="grid grid-cols-2 gap-2.5 border-t border-line/70 pt-4">
          <ButtonLink
            href={`/cars/${car.slug}`}
            variant="secondary"
            size="sm"
            aria-label={t("Fleet.viewDetailsFor", { car: fullName })}
            className="w-full justify-center text-xs font-semibold transition-transform duration-150 hover:-translate-y-0.5"
          >
            {t("Fleet.viewDetails")}
          </ButtonLink>
          <ButtonLink
            href={{ pathname: "/book", query: { car: car.slug } }}
            size="sm"
            aria-label={t("Fleet.enquireFor", { car: fullName })}
            className="w-full justify-center text-xs font-bold bg-accent text-on-accent hover:bg-accent-hover transition-transform duration-150 hover:-translate-y-0.5"
          >
            {t("Fleet.enquire")}
            <ArrowRight aria-hidden className="size-3.5" />
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
