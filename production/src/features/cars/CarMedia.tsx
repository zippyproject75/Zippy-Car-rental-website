import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
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

  if (photo) {
    return (
      <div className={cn("relative overflow-hidden bg-sunken", ratio[variant])}>
        <Image
          src={photo.src}
          alt={photo.alt[locale]}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {car.unitNumber ? (
          <div className="absolute top-3 right-3 rounded-md bg-black/75 backdrop-blur-md px-2.5 py-1 text-[0.6875rem] font-bold tracking-wider text-accent uppercase">
            Unit {car.unitNumber}
          </div>
        ) : null}
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
