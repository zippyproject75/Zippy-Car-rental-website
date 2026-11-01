"use client";

import { ArrowRight, CircleAlert, Clock, Info, RefreshCw, ShieldCheck } from "lucide-react";
import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, useEffect, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/button";
import { bookingRules } from "@/data/booking";
import { packagePricing, pricingConfig } from "@/data/pricing";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import type { VisibleContacts } from "@/lib/contacts";
import { requestDateBounds, timeSlots, validateRequest, parseBusinessDateTime, businessDateKey, businessTimeKey } from "@/lib/dates";
import { formatDateTime, formatInr, formatTimeKey } from "@/lib/formatting";
import { calculateEstimate } from "@/lib/pricing";
import { enquiryService, type EnquiryResult } from "@/services/enquiry";
import type { RequestErrorCode, RequestField } from "@/types/booking";
import type { CarId } from "@/types/car";
import type { BranchId } from "@/types/site";
import { DateField } from "./DateField";
import { formatDuration } from "./duration";
import { EnquiryResultPanel } from "./EnquiryResultPanel";
import { FieldError, fieldControlClass } from "./fields";

export type BookingCarOption = { id: CarId; label: string };
export type BookingBranchOption = { id: BranchId; name: string; pending: boolean };
export type BookingPickupLocationOption = { id: string; name: string; googleMapsUrl: string };

type PackageType = "12-hour" | "24-hour";
type FieldKey = RequestField | "branchId" | "pickupLocationId";
type Errors = Partial<Record<FieldKey, string>>;

const SLOTS = timeSlots(bookingRules.slotMinutes);
const FIELD_ORDER: FieldKey[] = [
  "pickupLocationId",
  "branchId",
  "pickupDate",
  "pickupTime",
  "returnDate",
  "returnTime",
];

export function BookingForm({
  cars,
  branches,
  contacts,
  pickupLocations,
  initialCarId = null,
  headingId,
}: {
  cars: BookingCarOption[];
  branches: BookingBranchOption[];
  contacts: VisibleContacts;
  pickupLocations: BookingPickupLocationOption[];
  initialCarId?: CarId | null;
  headingId?: string;
}) {
  const t = useTranslations("Booking");
  const tDuration = useTranslations("Duration");
  const tWa = useTranslations("WhatsApp");
  const tc = useTranslations("Common");
  const locale = useLocale() as Locale;

  const [carId, setCarId] = useState<CarId | "any">(initialCarId ?? "any");
  const [branchId, setBranchId] = useState<BranchId | "">(
    branches.length === 1 ? branches[0]!.id : "",
  );
  const [pickupLocationId, setPickupLocationId] = useState<string>("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("12-hour");
  const [returnTimeManuallyEdited, setReturnTimeManuallyEdited] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<EnquiryResult | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Check if 24-hour package has any pricing configured
  const has24HourPricing = cars.some((car) => {
    return packagePricing["24-hour"][car.id as CarId] !== null;
  });

  // Bounds are computed from "now" on the client; the server render uses a stable window.
  const [now] = useState(() => new Date());
  const { first, last } = requestDateBounds(now, bookingRules);

  const draft = { pickupDate, pickupTime, returnDate, returnTime };
  const selectedCar = carId === "any" ? null : carId;

  // Calculate suggested return date/time based on package
  useEffect(() => {
    if (pickupDate && pickupTime && !returnTimeManuallyEdited) {
      const pickupAt = parseBusinessDateTime(pickupDate, pickupTime);
      if (pickupAt) {
        const packageHours = selectedPackage === "12-hour" ? 12 : 24;
        const suggestedReturn = new Date(pickupAt.getTime() + packageHours * 60 * 60 * 1000);
        const suggestedDate = businessDateKey(suggestedReturn);
        const suggestedTime = businessTimeKey(suggestedReturn);
        // Batch state updates to avoid cascading renders
        requestAnimationFrame(() => {
          setReturnDate(suggestedDate);
          setReturnTime(suggestedTime);
        });
      }
    }
  }, [pickupDate, pickupTime, selectedPackage, returnTimeManuallyEdited]);

  // Reset manual edit flag when package changes to allow auto-suggestion
  useEffect(() => {
    if (returnTimeManuallyEdited) {
      requestAnimationFrame(() => {
        setReturnTimeManuallyEdited(false);
      });
    }
  }, [selectedPackage, returnTimeManuallyEdited]);

  // Detect manual return time edit
  const handleReturnDateChange = (value: string) => {
    setReturnDate(value);
    setReturnTimeManuallyEdited(true);
  };

  const handleReturnTimeChange = (value: string) => {
    setReturnTime(value);
    setReturnTimeManuallyEdited(true);
  };

  // Reset return time auto-management when requested
  const useSuggestedReturn = () => {
    setReturnTimeManuallyEdited(false);
  };

  // Calculate rental summary
  const rentalSummary = (() => {
    const check = validateRequest(draft, new Date(), bookingRules);
    if (!check.ok) {
      return {
        valid: false,
        vehicleName: selectedCar ? cars.find((c) => c.id === selectedCar)?.label ?? null : t("anyCar"),
        packageName: selectedPackage === "12-hour" ? t("package12Hour") : t("package24Hour"),
        pickupLocationName: pickupLocations.find((l) => l.id === pickupLocationId)?.name ?? null,
        branchName: branches.find((b) => b.id === branchId)?.name ?? null,
        pickupDate: null,
        pickupTime: null,
        returnDate: null,
        returnTime: null,
        duration: null,
        packagePrice: null,
        freeKm: null,
      };
    }

    const est = calculateEstimate(
      { carId: selectedCar, pickupAt: check.pickupAt, returnAt: check.returnAt },
      pricingConfig,
    );

    const packageInfo = selectedCar ? packagePricing[selectedPackage][selectedCar] : null;
    const packagePrice = packageInfo?.price ?? null;
    const freeKm = packageInfo?.limitKm ?? null;

    return {
      valid: true,
      vehicleName: selectedCar ? cars.find((c) => c.id === selectedCar)?.label ?? null : t("anyCar"),
      packageName: selectedPackage === "12-hour" ? t("package12Hour") : t("package24Hour"),
      pickupLocationName: pickupLocations.find((l) => l.id === pickupLocationId)?.name ?? null,
      branchName: branches.find((b) => b.id === branchId)?.name ?? null,
      pickupDate: formatDateTime(check.pickupAt, locale),
      pickupTime: formatTimeKey(pickupTime, locale),
      returnDate: formatDateTime(check.returnAt, locale),
      returnTime: formatTimeKey(returnTime, locale),
      duration: formatDuration(check.durationMinutes, tDuration),
      packagePrice: packagePrice ? formatInr(packagePrice, locale) : null,
      freeKm,
      estimate: est.kind === "estimate" ? formatInr(est.amountInr, locale) : null,
    };
  })();

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
    if (!pickupLocationId) next.pickupLocationId = t("errors.pickupLocationRequired");
    // Branch selection is now optional - customers can choose from pickup locations on homepage
    // if (branches.length > 0 && !branchId) next.branchId = t("errors.branchRequired");
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
    const pickupLocation = pickupLocations.find((l) => l.id === pickupLocationId);
    const packageInfo = selectedCar ? packagePricing[selectedPackage][selectedCar] : null;
    const packageName = selectedPackage === "12-hour" ? t("package12Hour") : t("package24Hour");
    const packagePrice = packageInfo?.price ? formatInr(packageInfo.price, locale) : null;
    const freeKm = packageInfo?.limitKm ?? null;

    const prepared = enquiryService.prepare(
      {
        carName: carLabel,
        branchName: branch?.name ?? null,
        pickupLocationName: pickupLocation?.name ?? null,
        pickup: formatDateTime(check.pickupAt, locale),
        return: formatDateTime(check.returnAt, locale),
        duration: formatDuration(check.durationMinutes, tDuration),
        estimate: est.kind === "estimate" ? formatInr(est.amountInr, locale) : packagePrice,
        packageName,
        freeKm: freeKm ? `${freeKm} km` : null,
      },
      {
        greeting: tWa("greeting"),
        car: tWa("car"),
        anyCar: tWa("anyCar"),
        branch: tWa("branch"),
        branchToConfirm: tWa("branchToConfirm"),
        pickupLocation: tWa("pickupLocation"),
        pickup: tWa("pickup"),
        return: tWa("return"),
        duration: tWa("duration"),
        estimate: tWa("estimate"),
        name: tWa("name"),
        note: tWa("note"),
        closing: tWa("closing"),
        package: tWa("package"),
        freeKm: tWa("freeKm"),
      },
    );
    setResult(prepared);
  }

  const fieldLabel: Record<FieldKey, string> = {
    pickupLocationId: t("pickupLocation"),
    branchId: t("branch"),
    pickupDate: t("pickupDate"),
    pickupTime: t("pickupTime"),
    returnDate: t("returnDate"),
    returnTime: t("returnTime"),
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
                  {t("anyCarHint")}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="booking-pickupLocationId" className="text-sm font-semibold text-ink">
                  {t("pickupLocation")}
                </label>
                <select
                  id="booking-pickupLocationId"
                  value={pickupLocationId}
                  onChange={(e) => setPickupLocationId(e.target.value)}
                  aria-invalid={liveErrors.pickupLocationId ? true : undefined}
                  aria-describedby={liveErrors.pickupLocationId ? "booking-pickupLocationId-error" : undefined}
                  className={fieldControlClass(Boolean(liveErrors.pickupLocationId))}
                >
                  <option value="">{t("pickupLocationPlaceholder")}</option>
                  {pickupLocations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
                <FieldError id="booking-pickupLocationId-error" message={liveErrors.pickupLocationId} />
              </div>
            </div>

            {/* Rental Package Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-ink">{t("packageLabel")}</label>
              <div className="flex gap-2 rounded-lg bg-muted p-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedPackage("12-hour")}
                  className={`flex-1 rounded-md px-3 sm:px-4 py-2.5 text-sm font-semibold transition-all duration-150 min-h-[3rem] ${
                    selectedPackage === "12-hour"
                      ? "bg-accent text-on-accent shadow-sm scale-[1.02]"
                      : "text-ink-2 hover:text-ink active:scale-95"
                  }`}
                  aria-pressed={selectedPackage === "12-hour"}
                >
                  {t("package12Hour")}
                </button>
                <button
                  type="button"
                  disabled={!has24HourPricing}
                  onClick={() => setSelectedPackage("24-hour")}
                  className={`flex-1 rounded-md px-3 sm:px-4 py-2.5 text-sm font-semibold transition-all duration-150 min-h-[3rem] ${
                    selectedPackage === "24-hour"
                      ? "bg-accent text-on-accent shadow-sm scale-[1.02]"
                      : !has24HourPricing
                      ? "text-ink-3 cursor-not-allowed opacity-60"
                      : "text-ink-2 hover:text-ink active:scale-95"
                  }`}
                  aria-pressed={selectedPackage === "24-hour"}
                >
                  {t("package24Hour")}
                  {!has24HourPricing && <span className="ml-1.5 text-xs font-normal opacity-75">— Coming soon</span>}
                </button>
              </div>
              <p className="text-xs leading-relaxed text-ink-3">
                {selectedPackage === "12-hour" ? t("package12HourHint") : t("package24HourHint")}
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
                    <div className="grid gap-4 grid-cols-1">
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
                          } else {
                            handleReturnDateChange(v);
                          }
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
                          onChange={(e) => {
                            if (kind === "pickup") {
                              setPickupTime(e.target.value);
                            } else {
                              handleReturnTimeChange(e.target.value);
                            }
                          }}
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

            {/* Return time suggestion hint */}
            {returnTimeManuallyEdited && pickupDate && pickupTime && (
              <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-ink" />
                <div className="flex-1">
                  <p className="font-medium text-ink">{t("returnTimeManuallyEdited")}</p>
                  <button
                    type="button"
                    onClick={useSuggestedReturn}
                    className="mt-1 flex items-center gap-1.5 text-sm font-medium text-accent-ink hover:underline"
                  >
                    <RefreshCw aria-hidden className="size-3.5" />
                    {t("useSuggestedReturn")}
                  </button>
                </div>
              </div>
            )}

            {/* Live Rental Summary */}
            <div className="rounded-card border border-line bg-muted/50 p-4 sm:p-5">
              <h3 className="font-display text-lg font-bold text-ink">{t("summaryTitle")}</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-2 sm:gap-4">
                  <dt className="text-ink-2 shrink-0">{t("car")}</dt>
                  <dd className="font-medium text-ink text-right truncate">{rentalSummary.vehicleName}</dd>
                </div>
                <div className="flex justify-between gap-2 sm:gap-4">
                  <dt className="text-ink-2 shrink-0">{t("packageLabel")}</dt>
                  <dd className="font-medium text-ink text-right">{rentalSummary.packageName}</dd>
                </div>
                {rentalSummary.pickupLocationName && (
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <dt className="text-ink-2 shrink-0">{t("pickupLocation")}</dt>
                    <dd className="font-medium text-ink text-right truncate">{rentalSummary.pickupLocationName}</dd>
                  </div>
                )}
                {rentalSummary.branchName && (
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <dt className="text-ink-2 shrink-0">{t("branch")}</dt>
                    <dd className="font-medium text-ink text-right truncate">{rentalSummary.branchName}</dd>
                  </div>
                )}
                {rentalSummary.pickupDate && (
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <dt className="text-ink-2 shrink-0">{t("pickupDate")}</dt>
                    <dd className="font-medium text-ink text-right truncate">{rentalSummary.pickupDate}</dd>
                  </div>
                )}
                {rentalSummary.pickupTime && (
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <dt className="text-ink-2 shrink-0">{t("pickupTime")}</dt>
                    <dd className="font-medium text-ink text-right">{rentalSummary.pickupTime}</dd>
                  </div>
                )}
                {rentalSummary.returnDate && (
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <dt className="text-ink-2 shrink-0">{t("returnDate")}</dt>
                    <dd className="font-medium text-ink text-right truncate">{rentalSummary.returnDate}</dd>
                  </div>
                )}
                {rentalSummary.returnTime && (
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <dt className="text-ink-2 shrink-0">{t("returnTime")}</dt>
                    <dd className="font-medium text-ink text-right">{rentalSummary.returnTime}</dd>
                  </div>
                )}
                {rentalSummary.duration && (
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <dt className="text-ink-2 shrink-0">{t("durationLabel")}</dt>
                    <dd className="font-medium text-ink text-right">{rentalSummary.duration}</dd>
                  </div>
                )}
                {rentalSummary.packagePrice && (
                  <div className="flex justify-between gap-2 sm:gap-4 border-t border-line pt-3">
                    <dt className="text-ink-2 shrink-0">{t("packagePrice")}</dt>
                    <dd className="font-display text-lg font-bold text-ink text-right">{rentalSummary.packagePrice}</dd>
                  </div>
                )}
                {rentalSummary.freeKm && (
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <dt className="text-ink-2 shrink-0">{t("freeKm")}</dt>
                    <dd className="font-medium text-ink text-right">{rentalSummary.freeKm}</dd>
                  </div>
                )}
                {!rentalSummary.valid && (
                  <div className="flex justify-between gap-2 sm:gap-4 border-t border-line pt-3">
                    <dt className="text-ink-2 shrink-0">{t("durationLabel")}</dt>
                    <dd className="text-ink-3 text-right">{t("durationEmpty")}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
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
