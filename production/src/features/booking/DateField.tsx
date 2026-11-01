"use client";

import { CalendarDays, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { formatDateKey } from "@/lib/formatting";
import { FieldError, fieldControlClass } from "./fields";

const Calendar = dynamic(() => import("./Calendar"), {
  ssr: false,
  loading: () => <CalendarLoading />,
});

function CalendarLoading() {
  const t = useTranslations("Booking");
  return (
    <p role="status" className="grid h-80 place-items-center text-sm text-ink-3">
      {t("calendarLoading")}
    </p>
  );
}

export function DateField({
  id,
  label,
  dialogTitle,
  value,
  first,
  last,
  error,
  onChange,
}: {
  id: string;
  label: string;
  dialogTitle: string;
  value: string;
  first: string;
  last: string;
  error?: string;
  onChange: (key: string) => void;
}) {
  const t = useTranslations("Booking");
  const tc = useTranslations("Common");
  const locale = useLocale() as Locale;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const errorId = `${id}-error`;
  const titleId = `${id}-dialog-title`;
  const display = value ? formatDateKey(value, locale) : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-ink" aria-hidden>
        {label}
      </span>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-describedby={error ? errorId : undefined}
        aria-label={
          display ? t("changeDate", { label, date: display }) : t("chooseDateFor", { label })
        }
        onClick={() => setOpen(true)}
        className={cn(fieldControlClass(Boolean(error)), "flex items-center gap-2.5 text-left")}
      >
        <CalendarDays aria-hidden className="size-4 shrink-0 text-ink-3" />
        <span className={cn("truncate tabular-nums", !display && "text-ink-3")}>
          {display ?? t("chooseDate")}
        </span>
      </button>
      <FieldError id={errorId} message={error} />
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="m-auto w-full max-w-[min(28rem,calc(100vw-1rem))] rounded-card border border-line bg-raised p-0 text-ink shadow-raised max-sm:mb-0 max-sm:max-w-full max-sm:rounded-b-none max-sm:h-[calc(100dvh-1rem)] max-sm:my-auto"
      >
        <div className="p-5">
          <div className="mb-2 flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-display text-lg font-bold">
              {dialogTitle}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-mt-1 -mr-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-control hover:bg-muted"
            >
              <X aria-hidden className="size-5" />
              <span className="sr-only">{tc("close")}</span>
            </button>
          </div>
          <p className="mb-3 text-xs leading-relaxed text-ink-3">{t("calendarHint")}</p>
          {open ? (
            <Calendar
              value={value || null}
              first={first}
              last={last}
              locale={locale}
              labels={{
                next: t("calendarNext"),
                previous: t("calendarPrevious"),
                today: t("calendarToday"),
                selected: t("calendarSelected"),
              }}
              onSelect={(key) => {
                onChange(key);
                setOpen(false);
              }}
            />
          ) : null}
        </div>
      </dialog>
    </div>
  );
}
