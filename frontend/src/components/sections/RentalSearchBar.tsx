"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { site } from "@/data/site";
import { bookingRules } from "@/data/booking";
import {
  timeSlots,
  requestDateBounds,
  validateRequest,
} from "@/lib/dates";
import { formatDateKey } from "@/lib/formatting";
import { cn } from "@/lib/cn";
import type { RequestField, RequestErrorCode } from "@/types/booking";

// ---------------------------------------------------------------------------
// Lazy-load the Calendar
// ---------------------------------------------------------------------------
const Calendar = dynamic(() => import("@/features/booking/Calendar"), {
  ssr: false,
  loading: () => (
    <p className="grid h-72 place-items-center text-sm text-white/50">
      Loading calendar…
    </p>
  ),
});

// ---------------------------------------------------------------------------
// Branch display-name map
// ---------------------------------------------------------------------------
const BRANCH_LABELS: Record<string, string> = {
  "khadi-machine-chowk": "Kondhwa",
  "ganga-dham": "Gangadham",
  undri: "Undri",
};

// ---------------------------------------------------------------------------
// Error-code → human message
// ---------------------------------------------------------------------------
function errorMessage(code: RequestErrorCode | undefined): string {
  switch (code) {
    case "required":
      return "This field is required";
    case "pickupInPast":
      return "Pickup time is in the past";
    case "pickupTooSoon":
      return "Please allow more lead time";
    case "returnNotAfterPickup":
      return "Return must be after pickup";
    case "durationTooShort":
      return "Minimum rental duration not met";
    default:
      return "Invalid value";
  }
}

// ---------------------------------------------------------------------------
// Inline calendar-dialog button
// ---------------------------------------------------------------------------
function DateButton({
  id,
  value,
  first,
  last,
  locale,
  onChange,
}: {
  id: string;
  value: string;
  first: string;
  last: string;
  locale: Locale;
  onChange: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const display = value ? formatDateKey(value, locale) : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <div className="flex-1 min-w-0">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center text-left text-sm sm:text-[0.9375rem] font-medium text-white/90 hover:text-white transition-colors focus:outline-none truncate"
      >
        <span className={cn("truncate tabular-nums", display ? "text-white" : "text-white/80")}>
          {display ?? "Choose date"}
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="m-auto w-full max-w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#1a1a1d] p-0 text-white shadow-2xl max-sm:mb-0 max-sm:max-w-full max-sm:rounded-b-none"
      >
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="font-bold text-base text-white">Select Date</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            >
              <X aria-hidden className="size-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          {open ? (
            <Calendar
              value={value || null}
              first={first}
              last={last}
              locale={locale}
              labels={{
                next: "Next month",
                previous: "Previous month",
                today: "Today",
                selected: "Selected",
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

// ---------------------------------------------------------------------------
// Field-level error helper
// ---------------------------------------------------------------------------
function FieldErr({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-400 text-xs mt-1.5">{msg}</p>;
}

// ---------------------------------------------------------------------------
// RentalSearchBar
// ---------------------------------------------------------------------------
export function RentalSearchBar() {
  const locale = useLocale() as Locale;
  const [now] = useState(() => new Date());
  const { first, last } = requestDateBounds(now, bookingRules);
  const slots = timeSlots(bookingRules.slotMinutes);

  // --- state ---
  const [branchId, setBranchId] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [dropOpen, setDropOpen] = useState(false);

  // field-level errors
  const [branchErr, setBranchErr] = useState<string | undefined>();
  const [pickupDateErr, setPickupDateErr] = useState<string | undefined>();
  const [pickupTimeErr, setPickupTimeErr] = useState<string | undefined>();
  const [returnDateErr, setReturnDateErr] = useState<string | undefined>();
  const [returnTimeErr, setReturnTimeErr] = useState<string | undefined>();

  // dropdown ref for click-outside
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropOpen) return;
    function handleOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setDropOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [dropOpen]);

  // --- validation & submit ---
  function handleFindCars() {
    // reset
    setBranchErr(undefined);
    setPickupDateErr(undefined);
    setPickupTimeErr(undefined);
    setReturnDateErr(undefined);
    setReturnTimeErr(undefined);

    let hasError = false;

    if (!branchId) {
      setBranchErr("Please choose a pickup location");
      hasError = true;
    }

    const result = validateRequest(
      { pickupDate, pickupTime, returnDate, returnTime },
      now,
      bookingRules,
    );

    if (!result.ok) {
      hasError = true;
      const { errors } = result;
      const fieldMap: Record<RequestField, (msg: string) => void> = {
        pickupDate: setPickupDateErr,
        pickupTime: setPickupTimeErr,
        returnDate: setReturnDateErr,
        returnTime: setReturnTimeErr,
      };
      for (const [field, code] of Object.entries(errors) as [RequestField, RequestErrorCode][]) {
        fieldMap[field]?.(errorMessage(code));
      }
    }

    if (hasError) return;

    // persist selection
    try {
      sessionStorage.setItem(
        "zippy_search",
        JSON.stringify({ branchId, pickupDate, pickupTime, returnDate, returnTime }),
      );
    } catch {
      // sessionStorage may be unavailable
    }

    // scroll to fleet
    document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" });
  }

  const selectedBranchLabel = branchId ? BRANCH_LABELS[branchId] : null;

  return (
    <section aria-label="Search for a rental car" className="bg-[#0b0b0d] py-4 sm:py-5 border-y border-white/5">
      <div className="container-site">
        {/* Outer Bar Card */}
        <div className="bg-[#121215] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1.1fr_1.1fr_auto] gap-2.5 sm:gap-3 items-stretch">

            {/* ── FIELD 1: PICKUP LOCATION ── */}
            <div className={cn(
              "relative flex flex-col justify-between rounded-xl bg-[#1c1c21] border transition-all p-3 min-h-[4.5rem]",
              branchErr ? "border-red-500/60" : "border-white/10 hover:border-white/20"
            )}>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase text-[#d4b373]">
                <MapPin aria-hidden className="size-3.5 shrink-0 text-[#d4b373]" />
                <span>PICKUP LOCATION</span>
              </div>
              <div ref={dropRef} className="relative mt-1">
                <button
                  type="button"
                  onClick={() => setDropOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-2 text-left focus:outline-none"
                  aria-haspopup="listbox"
                  aria-expanded={dropOpen}
                >
                  <span className={cn("text-sm sm:text-[0.9375rem] font-medium truncate", selectedBranchLabel ? "text-white font-semibold" : "text-white/80")}>
                    {selectedBranchLabel ?? "Choose pickup location"}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={cn("size-4 shrink-0 text-white/50 transition-transform", dropOpen && "rotate-180")}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropOpen && (
                  <ul
                    role="listbox"
                    className="absolute left-0 right-0 top-full mt-2.5 z-50 bg-[#1c1c21] border border-white/15 rounded-xl shadow-2xl overflow-hidden py-1"
                  >
                    {site.branches.map((branch) => (
                      <li
                        key={branch.id}
                        role="option"
                        aria-selected={branch.id === branchId}
                        className={cn(
                          "px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between",
                          branch.id === branchId
                            ? "bg-[#d4b373]/15 text-[#d4b373] font-semibold"
                            : "text-white hover:bg-white/10"
                        )}
                        onClick={() => {
                          setBranchId(branch.id);
                          setBranchErr(undefined);
                          setDropOpen(false);
                        }}
                      >
                        <span>{BRANCH_LABELS[branch.id] ?? branch.name.en}</span>
                        {branch.id === branchId && (
                          <span className="text-xs text-[#d4b373]">Selected</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <FieldErr msg={branchErr} />
            </div>

            {/* ── FIELD 2: PICKUP DATE & TIME ── */}
            <div className={cn(
              "flex flex-col justify-between rounded-xl bg-[#1c1c21] border transition-all p-3 min-h-[4.5rem]",
              pickupDateErr || pickupTimeErr ? "border-red-500/60" : "border-white/10 hover:border-white/20"
            )}>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase text-[#d4b373]">
                <CalendarDays aria-hidden className="size-3.5 shrink-0 text-[#d4b373]" />
                <span>PICKUP DATE &amp; TIME</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <DateButton
                  id="pickup-date"
                  value={pickupDate}
                  first={first}
                  last={last}
                  locale={locale}
                  onChange={(k) => {
                    setPickupDate(k);
                    setPickupDateErr(undefined);
                  }}
                />
                <span className="text-white/20 select-none" aria-hidden>|</span>
                <div className="relative shrink-0 flex items-center">
                  <select
                    value={pickupTime}
                    onChange={(e) => {
                      setPickupTime(e.target.value);
                      setPickupTimeErr(undefined);
                    }}
                    className="bg-transparent text-sm sm:text-[0.9375rem] font-medium text-white/90 focus:outline-none cursor-pointer pr-4 appearance-none"
                    aria-label="Pickup time"
                  >
                    <option value="" disabled className="bg-[#1c1c21] text-white/60">Time</option>
                    {slots.map((s) => (
                      <option key={s} value={s} className="bg-[#1c1c21] text-white">{s}</option>
                    ))}
                  </select>
                  <Clock aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
                </div>
              </div>
              <FieldErr msg={pickupDateErr || pickupTimeErr} />
            </div>

            {/* ── FIELD 3: DROP DATE & TIME ── */}
            <div className={cn(
              "flex flex-col justify-between rounded-xl bg-[#1c1c21] border transition-all p-3 min-h-[4.5rem]",
              returnDateErr || returnTimeErr ? "border-red-500/60" : "border-white/10 hover:border-white/20"
            )}>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase text-[#d4b373]">
                <CalendarDays aria-hidden className="size-3.5 shrink-0 text-[#d4b373]" />
                <span>DROP DATE &amp; TIME</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <DateButton
                  id="return-date"
                  value={returnDate}
                  first={first}
                  last={last}
                  locale={locale}
                  onChange={(k) => {
                    setReturnDate(k);
                    setReturnDateErr(undefined);
                  }}
                />
                <span className="text-white/20 select-none" aria-hidden>|</span>
                <div className="relative shrink-0 flex items-center">
                  <select
                    value={returnTime}
                    onChange={(e) => {
                      setReturnTime(e.target.value);
                      setReturnTimeErr(undefined);
                    }}
                    className="bg-transparent text-sm sm:text-[0.9375rem] font-medium text-white/90 focus:outline-none cursor-pointer pr-4 appearance-none"
                    aria-label="Drop-off time"
                  >
                    <option value="" disabled className="bg-[#1c1c21] text-white/60">Time</option>
                    {slots.map((s) => (
                      <option key={s} value={s} className="bg-[#1c1c21] text-white">{s}</option>
                    ))}
                  </select>
                  <Clock aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
                </div>
              </div>
              <FieldErr msg={returnDateErr || returnTimeErr} />
            </div>

            {/* ── FIELD 4: FIND CARS BUTTON ── */}
            <button
              type="button"
              onClick={handleFindCars}
              className="w-full lg:w-auto h-full min-h-[4.5rem] flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-[#d4b373] hover:bg-[#c5a260] active:scale-[0.98] text-[#14120d] font-bold text-sm sm:text-base rounded-xl transition-all shadow-md shrink-0 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#d4b373]/60"
            >
              <Search aria-hidden className="size-4.5 stroke-[2.5]" />
              <span>Find Cars</span>
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}
