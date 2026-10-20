import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { env } from "@/lib/env";
import type { Car } from "@/types/car";

type Variant = "card" | "detail";

const ratio: Record<Variant, string> = {
  card: "aspect-[3/2]",
  detail: "aspect-[4/5] md:aspect-video",
};

/**
 * Owner-supplied photo when present; otherwise a CSS-only placeholder in the same box,
 * so adding real photography never changes the layout and can never break an image.
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

  if (photo) {
    return (
      <div className={cn("relative overflow-hidden bg-sunken", ratio[variant])}>
        <Image
          src={photo.src}
          alt={photo.alt[locale]}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={t("Placeholder.alt", {
        car: unit ? `${car.displayName} ${unit}` : car.displayName,
      })}
      className={cn("media-placeholder relative isolate overflow-hidden", ratio[variant])}
    >
      <div aria-hidden className="absolute inset-x-0 bottom-[38%] h-px bg-accent/50" />
      <div
        aria-hidden
        className="absolute inset-x-[12%] bottom-[30%] h-[18%] rounded-[50%] bg-ink/[0.04] blur-xl"
      />
      <div aria-hidden className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
        <span className="eyebrow text-[0.6875rem]! text-ink-3!">{car.make}</span>
        <div>
          <p
            className={cn(
              "font-display leading-none font-extrabold tracking-[-0.03em] text-ink/[0.13]",
              variant === "detail" ? "text-7xl sm:text-8xl lg:text-9xl" : "text-5xl sm:text-6xl",
            )}
          >
            {car.model}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs font-medium text-ink-3">
            <span>{unit}</span>
            {env.showPendingContent ? <span>{t("Common.photoComingSoon")}</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
