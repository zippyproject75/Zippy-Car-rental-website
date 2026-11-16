"use client";

import "react-day-picker/style.css";
import { DayPicker, TZDate } from "react-day-picker";
import { enIN, hi } from "react-day-picker/locale";
import { BUSINESS_TIME_ZONE } from "@/data/booking";
import type { Locale } from "@/i18n/routing";
import { businessDateKey } from "@/lib/dates";
import { intlLocale } from "@/lib/formatting";

function toZoned(key: string): TZDate {
  const [y, m, d] = key.split("-").map(Number) as [number, number, number];
  return new TZDate(y, m - 1, d, BUSINESS_TIME_ZONE);
}

export type CalendarLabels = { next: string; previous: string; today: string; selected: string };

/** Loaded on demand. Disabled days reflect request rules only, never availability. */
export default function Calendar({
  value,
  first,
  last,
  locale,
  labels,
  onSelect,
}: {
  value: string | null;
  first: string;
  last: string;
  locale: Locale;
  labels: CalendarLabels;
  onSelect: (key: string) => void;
}) {
  const tag = intlLocale(locale);
  const caption = new Intl.DateTimeFormat(tag, {
    month: "long",
    year: "numeric",
    timeZone: BUSINESS_TIME_ZONE,
  });
  const weekday = new Intl.DateTimeFormat(tag, { weekday: "short", timeZone: BUSINESS_TIME_ZONE });
  const full = new Intl.DateTimeFormat(tag, { dateStyle: "full", timeZone: BUSINESS_TIME_ZONE });
  const selected = value ? toZoned(value) : undefined;

  return (
    <DayPicker
      mode="single"
      timeZone={BUSINESS_TIME_ZONE}
      locale={locale === "en" ? enIN : hi}
      selected={selected}
      defaultMonth={selected ?? toZoned(first)}
      startMonth={toZoned(first)}
      endMonth={toZoned(last)}
      disabled={[{ before: toZoned(first) }, { after: toZoned(last) }]}
      onSelect={(date) => {
        if (date) onSelect(businessDateKey(date));
      }}
      autoFocus
      formatters={{
        formatCaption: (month) => caption.format(month),
        formatWeekdayName: (day) => weekday.format(day),
      }}
      labels={{
        labelNext: () => labels.next,
        labelPrevious: () => labels.previous,
        labelDayButton: (date, modifiers) =>
          [
            full.format(date),
            modifiers.today ? labels.today : null,
            modifiers.selected ? labels.selected : null,
          ]
            .filter(Boolean)
            .join(", "),
      }}
      className="zippy-calendar"
    />
  );
}
