import { useLocale, useTranslations } from "next-intl";
import { pricingConfig } from "@/data/pricing";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { formatInr } from "@/lib/formatting";
import { displayRate } from "@/lib/pricing";
import type { CarId } from "@/types/car";

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
  // Display daily rate (24 * hourly rate)
  const dailyRate = rate.amountInr * 24;
  return (
    <p className={cn("text-[0.9375rem] text-ink-2", className)}>
      <span className="font-display text-lg font-bold tabular-nums text-ink">
        {formatInr(dailyRate, locale)}
      </span>
    </p>
  );
}

export function PriceBlock({ carId }: { carId: CarId }) {
  const t = useTranslations("Car");
  const locale = useLocale() as Locale;
  const rate = displayRate(pricingConfig[carId]);
  const dailyRate = rate ? rate.amountInr * 24 : null;
  return (
    <div className="rounded-card border border-line bg-raised p-5">
      <p className="eyebrow">{t("priceTitle")}</p>
      <PriceLine carId={carId} className="mt-2 text-xl" />
      {!rate ? (
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{t("pricePending")}</p>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{formatInr(dailyRate!, locale)} rent per day</p>
      )}
    </div>
  );
}
