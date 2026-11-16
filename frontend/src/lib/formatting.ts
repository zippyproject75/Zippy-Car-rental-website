import { BUSINESS_TIME_ZONE } from "@/data/booking";
import { localeTags, type Locale } from "@/i18n/routing";
import { parseBusinessDateTime } from "@/lib/dates";

/** Latin digits are used in every language so prices, dates and times read consistently. */
export function intlLocale(locale: Locale): string {
  return `${localeTags[locale]}-u-nu-latn`;
}

export function formatDateTime(instant: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: BUSINESS_TIME_ZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(instant);
}

export function formatDateKey(key: string, locale: Locale): string {
  const instant = parseBusinessDateTime(key, "12:00");
  if (!instant) return key;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: BUSINESS_TIME_ZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(instant);
}

export function formatTimeKey(key: string, locale: Locale): string {
  const instant = parseBusinessDateTime("2024-01-01", key);
  if (!instant) return key;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: BUSINESS_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(instant);
}

export function formatInr(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
