"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { env } from "@/lib/env";
import type { Car } from "@/types/car";

type Variant = "card" | "detail";

const ratio: Record<Variant, string> = {
  card: "aspect-[16/10]",
  detail: "aspect-[4/5] md:aspect-video",
};

/**
 * Owner-supplied photo when present; otherwise a CSS-only placeholder in the same box.
 */
export function CarMedia({
  car,
  variant = "card",
  priority = false,
  sizes,
}: {
  car: Car;
  variant?: Variant;
  priority?: boolean;
  sizes?: string;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const photo = car.images.primary;
  const unit = car.unitNumber ? t("Common.vehicleUnit", { unit: car.unitNumber }) : null;

  // Get all images (primary + gallery)
  const allImages = [photo, ...(car.images.gallery || [])];
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleImages = allImages.length > 1;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  if (photo) {
    const currentImage = allImages[currentIndex];
    if (!currentImage) {
      return null;
    }
    return (
      <div className={cn("relative overflow-hidden bg-sunken", ratio[variant])}>
        <Image
          src={currentImage.src}
          alt={currentImage.alt[locale]}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover object-center transition-transform duration-500 ease-out scale-100 group-hover:scale-105 active:scale-95"
        />
        
        {/* Available Badge */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-lg sm:top-3 sm:right-3 sm:px-2.5 sm:py-1">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
          <span className="text-[0.6rem] sm:text-[0.65rem] font-bold tracking-wider text-white uppercase">Available</span>
        </div>

        {/* Navigation Arrows - Hidden on mobile */}
        {hasMultipleImages && (
          <>
            <button
              onClick={goToPrevious}
              className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={goToNext}
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* Image Indicator Dots - Hidden on mobile */}
            <div className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 transition-opacity">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={t("Placeholder.alt", {
        car: unit ? `${car.displayName} — ${unit}` : car.displayName,
      })}
      className={cn(
        "media-placeholder relative flex flex-col items-center justify-center p-6 text-center text-ink-3",
        ratio[variant],
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent"
      />
      <p className="font-display text-sm font-semibold tracking-wide text-ink uppercase">
        {car.displayName}
      </p>
      {env.showPendingContent ? (
        <p className="mt-1 text-xs text-ink-3">{t("Common.photoComingSoon")}</p>
      ) : null}
    </div>
  );
}
