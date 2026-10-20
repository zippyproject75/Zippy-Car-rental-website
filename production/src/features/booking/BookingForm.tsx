"use client";

import { ArrowRight, CircleAlert, Clock, ShieldCheck } from "lucide-react";
import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/button";
import { bookingRules, NAME_MAX_LENGTH, NOTE_MAX_LENGTH } from "@/data/booking";
import { pricingConfig } from "@/data/pricing";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import type { VisibleContacts } from "@/lib/contacts";
import { requestDateBounds, timeSlots, validateRequest } from "@/lib/dates";
import { formatDateTime, formatInr, formatTimeKey } from "@/lib/formatting";
import { calculateEstimate } from "@/lib/pricing";
import { enquiryService, type EnquiryResult } from "@/services/enquiry";
import type { EstimateResult, RequestErrorCode, RequestField } from "@/types/booking";
import type { CarId } from "@/types/car";
import type { BranchId } from "@/types/site";
import { DateField } from "./DateField";
import { formatDuration } from "./duration";
import { EnquiryResultPanel } from "./EnquiryResultPanel";
import { FieldError, fieldControlClass } from "./fields";
import { optionalFieldsSchema } from "./schema";

export type BookingCarOption = { id: CarId; label: string };
export type BookingBranchOption = { id: BranchId; name: string; pending: boolean };

type FieldKey = RequestField | "branchId" | "name" | "note";
type Errors = Partial<Record<FieldKey, string>>;

const SLOTS = timeSlots(bookingRules.slotMinutes);
const FIELD_ORDER: FieldKey[] = [
  "branchId",
  "pickupDate",
  "pickupTime",
  "returnDate",
  "returnTime",
  "name",
  "note",
];

export function BookingForm({
  cars,
  branches,
  contacts,
  initialCarId = null,
  headingId,
}: {
  cars: BookingCarOption[];
  branches: BookingBranchOption[];
  contacts: VisibleContacts;
  initialCarId?: CarId | null;
  headingId?: string;
}) {
  const t = useTranslations("Booking");
  const tPricing = useTranslations("Pricing");
  const tDuration = useTranslations("Duration");
  const tWa = useTranslations("WhatsApp");
  const tc = useTranslations("Common");
  const locale = useLocale() as Locale;

  const [carId, setCarId] = useState<CarId | "any">(initialCarId ?? "any");
  const [branchId, setBranchId] = useState<BranchId | "">(
    branches.length === 1 ? branches[0]!.id : "",
  );
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<EnquiryResult | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Bounds are computed from "now" on the client; the server render uses a stable window.
  const [now] = useState(() => new Date());
  const { first, last } = requestDateBounds(now, bookingRules);

  const draft = { pickupDate, pickupTime, returnDate, returnTime };
  const allDatesChosen = Boolean(pickupDate && pickupTime && returnDate && returnTime);
  const validation = allDatesChosen ? validateRequest(draft, new Date(), bookingRules) : null;
  const selectedCar = carId === "any" ? null : carId;
  const estimate: EstimateResult | null =
    validation?.ok === true
      ? calculateEstimate(
          { carId: selectedCar, pickupAt: validation.pickupAt, returnAt: validation.returnAt },
          pricingConfig,
        )
      : null;

  function errorText(code: RequestErrorCode): string {
    return t(`errors.${code}`, { days: bookingRules.maxAdvanceDays });
  }

  function collectErrors(): Errors {
    const next: Errors = {};
    const dateResult = validateRequest(draft, new Date(), bookingRules);
    if (!dateResult.ok) {
      for (const [field, code] of Object.entries(dateResult.errors) as [
        RequestField,
        RequestErrorCode,
      ][]) {
        next[field] = errorText(code);
      }
    }
    if (branches.length > 0 && !branchId) next.branchId = t("errors.branchRequired");
    const optional = optionalFieldsSchema.safeParse({ name, note });
    if (!optional.success) {
      for (const issue of optional.error.issues) {
        const field = issue.path[0] as "name" | "note";
        next[field] = t(`errors.${issue.message as "nameTooLong" | "noteTooLong"}`, {
          max: field === "name" ? NAME_MAX_LENGTH : NOTE_MAX_LENGTH,
        });
      }
    }
    return next;
  }

  // After the first submit attempt, errors update live as the visitor corrects fields.
  const liveErrors = submitted ? collectErrors() : errors;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const found = collectErrors();
    setErrors(found);
    const check = validateRequest(draft, new Date(), bookingRules);
    if (Object.keys(found).length > 0 || !check.ok) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const est = calculateEstimate(
      { carId: selectedCar, pickupAt: check.pickupAt, returnAt: check.returnAt },
      pricingConfig,
    );
    const carLabel = cars.find((c) => c.id === selectedCar)?.label ?? null;
    const branch = branches.find((b) => b.id === branchId);
    const prepared = enquiryService.prepare(
      {
        carName: carLabel,
        branchName: branch?.name ?? null,
        pickup: formatDateTime(check.pickupAt, locale),
        return: formatDateTime(check.returnAt, locale),
        duration: formatDuration(check.durationMinutes, tDuration),
        estimate: est.kind === "estimate" ? formatInr(est.amountInr, locale) : null,
        name,
        note,
      },
      {
        greeting: tWa("greeting"),
        car: tWa("car"),
        anyCar: tWa("anyCar"),
        branch: tWa("branch"),
        branchToConfirm: tWa("branchToConfirm"),
        pickup: tWa("pickup"),
        return: tWa("return"),
        duration: tWa("duration"),
        estimate: tWa("estimate"),
        name: tWa("name"),
        note: tWa("note"),
        closing: tWa("closing"),
      },
    );
    setResult(prepared);
  }

  const fieldLabel: Record<FieldKey, string> = {
    branchId: t("branch"),
    pickupDate: t("pickupDate"),
    pickupTime: t("pickupTime"),
    returnDate: t("returnDate"),
    returnTime: t("returnTime"),
    name: t("name"),
    note: t("note"),
  };
  const shownErrors = FIELD_ORDER.filter((f) => liveErrors[f]);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {result ? (
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <EnquiryResultPanel
              result={result}
              contacts={contacts}
              pendingLabel={tc("pendingBadge")}
              onEdit={() => setResult(null)}
            />
          </m.div>
        ) : (
          <form
            noValidate
            onSubmit={handleSubmit}
            aria-labelledby={headingId}
            aria-label={headingId ? undefined : t("formLabel")}
            className="space-y-6"
            data-testid="booking-form"
          >
            <div
              ref={summaryRef}
              tabIndex={-1}
              role="alert"
              className={cn(
                shownErrors.length && submitted
                  ? "rounded-control border border-danger/60 bg-danger-surface p-4 text-sm text-ink"
                  : "sr-only",
              )}
            >
              {submitted && shownErrors.length ? (
                <>
                  <p className="flex items-center gap-2 font-semibold">
                    <CircleAlert aria-hidden className="size-4 text-danger" />
                    {t("errorSummary", { count: shownErrors.length })}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-6">
                    {shownErrors.map((f) => (
                      <li key={f}>
                        <a href={`#booking-${f}`} className="underline underline-offset-2">
                          {fieldLabel[f]}: {liveErrors[f]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="booking-carId" className="text-sm font-semibold text-ink">
                  {t("car")}
                </label>
                <select
                  id="booking-carId"
                  value={carId}
                  onChange={(e) => setCarId(e.target.value as CarId | "any")}
                  aria-describedby="booking-carId-hint"
                  className={fieldControlClass(false)}
                >
                  <option value="any">{t("anyCar")}</option>
                  {cars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <p id="booking-carId-hint" className="text-xs leading-relaxed text-ink-3">
                  {carId === "any" ? t("anyCarHint") : t("honesty")}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                {branches.length ? (
                  <>
                    <label htmlFor="booking-branchId" className="text-sm font-semibold text-ink">
                      {t("branch")}
                    </label>
                    <select
                      id="booking-branchId"
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value as BranchId)}
                      aria-invalid={liveErrors.branchId ? true : undefined}
                      aria-describedby={liveErrors.branchId ? "booking-branchId-error" : undefined}
                      className={fieldControlClass(Boolean(liveErrors.branchId))}
                    >
                      <option value="">{t("branchPlaceholder")}</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.pending ? `${b.name} (${tc("pendingBadge")})` : b.name}
                        </option>
                      ))}
                    </select>
                    <FieldError id="booking-branchId-error" message={liveErrors.branchId} />
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold text-ink">{t("branch")}</span>
                    <p className="rounded-control border border-line bg-muted p-3.5 text-sm leading-relaxed text-ink-2">
                      {t("branchesPendingNotice")}
                    </p>
                  </>
                )}
              </div>
            </div>

            <fieldset className="grid gap-5 md:grid-cols-2">
              <legend className="sr-only">
                {t("pickup")} / {t("return")}
              </legend>
              {(["pickup", "return"] as const).map((kind) => {
                const dateKey = kind === "pickup" ? "pickupDate" : "returnDate";
                const timeKey = kind === "pickup" ? "pickupTime" : "returnTime";
                const dateValue = kind === "pickup" ? pickupDate : returnDate;
                const timeValue = kind === "pickup" ? pickupTime : returnTime;
                return (
                  <div key={kind} className="rounded-card border border-line bg-muted/50 p-4">
                    <p className="eyebrow mb-3">{t(kind)}</p>
                    <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr] md:grid-cols-1 xl:grid-cols-[1.3fr_1fr]">
                      <DateField
                        id={`booking-${dateKey}`}
                        label={t(dateKey)}
                        dialogTitle={t(
                          kind === "pickup" ? "pickupDialogTitle" : "returnDialogTitle",
                        )}
                        value={dateValue}
                        first={
                          kind === "return" && pickupDate && pickupDate > first ? pickupDate : first
                        }
                        last={last}
                        error={liveErrors[dateKey]}
                        onChange={(v) => {
                          if (kind === "pickup") {
                            setPickupDate(v);
                            if (returnDate && returnDate < v) setReturnDate("");
                          } else setReturnDate(v);
                        }}
                      />
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor={`booking-${timeKey}`}
                          className="text-sm font-semibold text-ink"
                        >
                          {t(timeKey)}
                        </label>
                        <select
                          id={`booking-${timeKey}`}
                          value={timeValue}
                          onChange={(e) =>
                            (kind === "pickup" ? setPickupTime : setReturnTime)(e.target.value)
                          }
                          aria-invalid={liveErrors[timeKey] ? true : undefined}
                          aria-describedby={
                            liveErrors[timeKey] ? `booking-${timeKey}-error` : "booking-tz-note"
                          }
                          className={cn(
                            fieldControlClass(Boolean(liveErrors[timeKey])),
                            "tabular-nums",
                          )}
                        >
                          <option value="">{t("selectTime")}</option>
                          {SLOTS.map((slot) => (
                            <option key={slot} value={slot}>
                              {formatTimeKey(slot, locale)}
                            </option>
                          ))}
                        </select>
                        <FieldError id={`booking-${timeKey}-error`} message={liveErrors[timeKey]} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </fieldset>
            <p id="booking-tz-note" className="-mt-3 flex items-center gap-1.5 text-xs text-ink-3">
              <Clock aria-hidden className="size-3.5" />
              {t("timeZoneNote")}
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="booking-name" className="text-sm font-semibold text-ink">
                  {t("name")} <span className="font-normal text-ink-3">({t("optional")})</span>
                </label>
                <input
                  id="booking-name"
                  type="text"
                  autoComplete="name"
                  maxLength={NAME_MAX_LENGTH}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={liveErrors.name ? true : undefined}
                  aria-describedby={liveErrors.name ? "booking-name-error" : "booking-name-hint"}
                  className={fieldControlClass(Boolean(liveErrors.name))}
                />
                <p id="booking-name-hint" className="text-xs text-ink-3">
                  {t("nameHint")}
                </p>
                <FieldError id="booking-name-error" message={liveErrors.name} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="booking-note" className="text-sm font-semibold text-ink">
                  {t("note")} <span className="font-normal text-ink-3">({t("optional")})</span>
                </label>
                <textarea
                  id="booking-note"
                  rows={2}
                  maxLength={NOTE_MAX_LENGTH}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  aria-invalid={liveErrors.note ? true : undefined}
                  aria-describedby={liveErrors.note ? "booking-note-error" : "booking-note-hint"}
                  className={cn(fieldControlClass(Boolean(liveErrors.note)), "py-3")}
                />
                <p id="booking-note-hint" className="flex justify-between text-xs text-ink-3">
                  <span>{t("noteHint", { max: NOTE_MAX_LENGTH })}</span>
                  <span className="tabular-nums" aria-hidden>
                    {t("noteCount", { count: note.length, max: NOTE_MAX_LENGTH })}
                  </span>
                </p>
                <FieldError id="booking-note-error" message={liveErrors.note} />
              </div>
            </div>

            <RequestSummary
              durationText={
                validation?.ok ? formatDuration(validation.durationMinutes, tDuration) : null
              }
              estimate={estimate}
              priceLabel={(e) => formatInr(e, locale)}
              t={{
                title: t("summaryTitle"),
                duration: t("durationLabel"),
                empty: t("durationEmpty"),
                estimateLabel: tPricing("estimateLabel"),
                disclaimer: tPricing("disclaimer"),
                priceOnRequest: tPricing("priceOnRequest"),
                reason: (r) => tPricing(`reasons.${r}`),
                lineDaily: (u, rate) => tPricing("lineDaily", { units: u, rate }),
                lineHourly: (u, interval, rate) =>
                  tPricing("lineHourly", { units: u, interval, rate }),
              }}
            />

            <div className="flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
              <p className="flex max-w-xl items-start gap-2 text-sm leading-relaxed text-ink-2">
                <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-ink" />
                {t("honesty")}
              </p>
              <button
                type="submit"
                className={buttonClass("primary", "lg", "md:shrink-0")}
                data-testid="booking-submit"
              >
                {t("submit")}
                <ArrowRight aria-hidden className="size-5" />
              </button>
            </div>
          </form>
        )}
      </LazyMotion>
    </MotionConfig>
  );
}

function RequestSummary({
  durationText,
  estimate,
  priceLabel,
  t,
}: {
  durationText: string | null;
  estimate: EstimateResult | null;
  priceLabel: (amount: number) => string;
  t: {
    title: string;
    duration: string;
    empty: string;
    estimateLabel: string;
    disclaimer: string;
    priceOnRequest: string;
    reason: (r: "no-vehicle-selected" | "pricing-not-approved" | "unknown-vehicle") => string;
    lineDaily: (units: number, rate: string) => string;
    lineHourly: (units: number, interval: number, rate: string) => string;
  };
}) {
  return (
    <section
      aria-label={t.title}
      aria-live="polite"
      className="grid gap-4 rounded-card border border-line bg-canvas p-5 sm:grid-cols-2"
      data-testid="request-summary"
    >
      <div>
        <p className="eyebrow">{t.duration}</p>
        {durationText ? (
          <p
            className="mt-1.5 font-display text-xl font-bold tabular-nums text-ink"
            data-testid="duration"
          >
            {durationText}
          </p>
        ) : (
          <p className="mt-1.5 text-sm text-ink-3">{t.empty}</p>
        )}
      </div>
      {estimate && estimate.kind !== "invalid" ? (
        <div data-testid="estimate">
          {estimate.kind === "estimate" ? (
            <>
              <p className="eyebrow">{t.estimateLabel}</p>
              <p className="mt-1.5 font-display text-2xl font-bold tabular-nums text-ink">
                {priceLabel(estimate.amountInr)}
              </p>
              <ul className="mt-2 space-y-0.5 text-xs text-ink-3 tabular-nums">
                {estimate.breakdown.map((line, i) => (
                  <li key={i}>
                    {line.kind === "daily" && line.units && line.unitAmountInr !== undefined
                      ? t.lineDaily(line.units, priceLabel(line.unitAmountInr))
                      : line.kind === "hourly" && line.units && line.unitAmountInr !== undefined
                        ? t.lineHourly(
                            line.units,
                            line.intervalMinutes ?? 60,
                            priceLabel(line.unitAmountInr),
                          )
                        : priceLabel(line.amountInr)}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs leading-relaxed text-ink-2">{t.disclaimer}</p>
            </>
          ) : (
            <>
              <p className="eyebrow">{t.estimateLabel}</p>
              <p className="mt-1.5 font-display text-xl font-bold text-ink">{t.priceOnRequest}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-2">{t.reason(estimate.reason)}</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
