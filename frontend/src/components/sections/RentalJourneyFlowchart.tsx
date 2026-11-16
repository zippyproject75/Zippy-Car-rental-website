"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";

interface StepItem {
  stepNumber: string;
  title: string;
  description: string;
  icon: () => React.JSX.Element;
}

// ── 1. Precise Custom SVG Icons Matching the Approved Design ──
function CarFrontIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="size-11 sm:size-13 text-white" aria-hidden="true">
      {/* Sleek Modern Car Silhouette */}
      <path
        d="M14 34L19.5 20C20.3 17.8 22.4 16.5 24.7 16.5H39.3C41.6 16.5 43.7 17.8 44.5 20L50 34"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Main Body */}
      <path
        d="M10 36C10 34.3 11.3 33 13 33H51C52.7 33 54 34.3 54 36V46C54 47.7 52.7 49 51 49H48V52C48 53.7 46.7 55 45 55H42C40.3 55 39 53.7 39 52V49H25V52C25 53.7 23.7 55 22 55H19C17.3 55 16 53.7 16 52V49H13C11.3 49 10 47.7 10 46V36Z"
        fill="#1a1c23"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* Windshield */}
      <path
        d="M18 31L22 21.5H42L46 31H18Z"
        fill="white"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Headlights (Warm Yellow/Gold) */}
      <circle cx="17.5" cy="40.5" r="3.5" fill="#facc15" className="drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
      <circle cx="46.5" cy="40.5" r="3.5" fill="#facc15" className="drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
      {/* Grille */}
      <rect x="25" y="40" width="14" height="4" rx="2" fill="white" fillOpacity="0.3" />
    </svg>
  );
}

function CalendarClockIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="size-11 sm:size-13" aria-hidden="true">
      {/* Calendar Base */}
      <rect
        x="10"
        y="14"
        width="44"
        height="38"
        rx="8"
        fill="#1e1b13"
        stroke="#e5c57e"
        strokeWidth="2.8"
        className="drop-shadow-[0_0_8px_rgba(229,197,126,0.3)]"
      />
      {/* Top Rings */}
      <line x1="20" y1="8" x2="20" y2="16" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="8" x2="44" y2="16" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
      {/* Divider */}
      <line x1="10" y1="24" x2="54" y2="24" stroke="#e5c57e" strokeWidth="2.2" />
      {/* Grid dots */}
      <circle cx="20" cy="32" r="2" fill="#fde047" />
      <circle cx="28" cy="32" r="2" fill="#fde047" />
      <circle cx="20" cy="40" r="2" fill="#fde047" />
      {/* Clock Badge (Bottom Right) */}
      <circle cx="43" cy="43" r="11" fill="#14151a" stroke="#fde047" strokeWidth="2.8" />
      <path d="M43 37V43L47 45.5" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="size-11 sm:size-13" aria-hidden="true">
      {/* Folded Map Layers */}
      <path
        d="M10 22L24 16L40 22L54 16V46L40 52L24 46L10 52V22Z"
        fill="#ede4d0"
        stroke="#d4b373"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Map Folds / Creases */}
      <path d="M24 16V46" stroke="#b89343" strokeWidth="2" strokeDasharray="3 3" />
      <path d="M40 22V52" stroke="#b89343" strokeWidth="2" strokeDasharray="3 3" />
      {/* Prominent Red Pin in the Center */}
      <g className="drop-shadow-[0_4px_10px_rgba(239,68,68,0.5)]">
        <path
          d="M32 18C28.1 18 25 21.1 25 25C25 31 32 39 32 39C32 39 39 31 39 25C39 21.1 35.9 18 32 18Z"
          fill="#ef4444"
          stroke="#b91c1c"
          strokeWidth="1.8"
        />
        <circle cx="32" cy="25" r="3" fill="white" />
      </g>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="size-11 sm:size-13" aria-hidden="true">
      {/* Green Glowing Circle */}
      <circle
        cx="32"
        cy="32"
        r="24"
        fill="#25D366"
        className="drop-shadow-[0_0_16px_rgba(37,211,102,0.5)]"
      />
      {/* Crisp White Phone Handset */}
      <path
        d="M40.5 35.5C39.8 35.1 36.5 33.5 35.9 33.3C35.3 33.1 34.9 33 34.4 33.7C34 34.4 32.7 35.9 32.3 36.3C31.9 36.7 31.5 36.8 30.8 36.4C30.1 36 27.8 35.2 25.1 32.8C23 30.9 21.6 28.5 21.2 27.8C20.8 27.1 21.2 26.7 21.6 26.3C21.9 26 22.4 25.4 22.8 24.9C23.2 24.4 23.3 24.1 23.6 23.6C23.8 23.1 23.7 22.7 23.5 22.3C23.3 21.9 21.9 18.6 21.3 17.2C20.7 15.8 20.1 16 19.7 16H18.5C18 16 17.2 16.3 16.6 16.9C16 17.7 14.2 19.3 14.2 22.6C14.2 25.9 16.6 29 17 29.4C17.4 29.9 21.8 36.8 28.7 39.7C30.3 40.5 31.6 40.9 32.6 41.3C34.2 41.8 35.6 41.7 36.7 41.5C38 41.3 40.5 39.9 41.1 38.4C41.6 36.9 41.6 35.8 41.5 35.5C41.3 35.5 41.2 35.5 40.5 35.5Z"
        fill="white"
      />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="size-11 sm:size-13" aria-hidden="true">
      {/* Shield Base */}
      <path
        d="M32 10L50 16.5V30C50 42 42 52.5 32 56C22 52.5 14 42 14 30V16.5L32 10Z"
        fill="#1e1b13"
        stroke="#e5c57e"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_16px_rgba(229,197,126,0.35)]"
      />
      {/* Inner Accent Line */}
      <path
        d="M32 14L46 19.5V30C46 39.5 39.5 48.5 32 51.5C24.5 48.5 18 39.5 18 30V19.5L32 14Z"
        stroke="#fde047"
        strokeWidth="1.2"
        strokeOpacity="0.4"
      />
      {/* Bold Checkmark */}
      <path
        d="M23 32L29 38L41 26"
        stroke="#fde047"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
      />
    </svg>
  );
}

// ── 2. The 5 Preserved Steps ──
const JOURNEY_STEPS: StepItem[] = [
  {
    stepNumber: "01",
    title: "Choose Your Car",
    description: "Select your vehicle.",
    icon: CarFrontIcon,
  },
  {
    stepNumber: "02",
    title: "Choose Package",
    description: "12hr or 24hr rental.",
    icon: CalendarClockIcon,
  },
  {
    stepNumber: "03",
    title: "Pickup Location",
    description: "Choose pickup point.",
    icon: MapPinIcon,
  },
  {
    stepNumber: "04",
    title: "Send Enquiry",
    description: "Submit via WhatsApp.",
    icon: WhatsAppIcon,
  },
  {
    stepNumber: "05",
    title: "Confirm Rental",
    description: "Owner confirms.",
    icon: ShieldCheckIcon,
  },
];

export function RentalJourneyFlowchart({
  id = "how-it-works-flowchart",
  embedded = false,
}: {
  id?: string;
  embedded?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id={id}
      aria-labelledby="journey-title"
      className={`relative w-full overflow-hidden bg-[#0d0e12] text-white select-none ${
        embedded ? "py-8 sm:py-10" : "py-16 sm:py-20 lg:py-24"
      }`}
    >
      {/* Atmospheric Ambient Lighting Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[380px] bg-[#d4b373]/8 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute -top-32 right-12 w-96 h-96 bg-red-600/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="container-site max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <LazyMotion features={domAnimation}>
          {/* Section Heading & Subtitle (Matching Screenshot) */}
          <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-16 lg:mb-20">
            {/* Eyebrow Label */}
            <div className="flex flex-col items-center justify-center mb-3">
              <span className="text-xs sm:text-[0.8125rem] font-bold tracking-[0.22em] text-[#d4b373] uppercase">
                YOUR JOURNEY
              </span>
              <div className="w-10 h-0.5 bg-[#d4b373] mt-2 rounded-full" />
            </div>

            {/* Main Headline */}
            <h2
              id="journey-title"
              className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight"
            >
              Your Journey to a{" "}
              <span className="italic font-serif text-[#e5c57e] drop-shadow-[0_2px_14px_rgba(229,197,126,0.35)]">
                Perfect Rental
              </span>
            </h2>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed font-normal">
              From choosing your car to confirming your rental, everything is simple and
              straightforward.
            </p>
          </div>

          {/* ── DESKTOP & TABLET: HORIZONTAL 5-STEP JOURNEY ROW ── */}
          <div className="hidden md:grid md:grid-cols-5 gap-3 lg:gap-4 xl:gap-6 relative items-stretch">
            {JOURNEY_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <m.div
                  key={step.stepNumber}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.55,
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative group flex flex-col items-center"
                >
                  {/* Curved Arched Golden Dotted Line (Connecting adjacent cards) */}
                  {index < JOURNEY_STEPS.length - 1 && (
                    <div className="absolute -right-[1.1rem] lg:-right-[1.4rem] xl:-right-[1.8rem] top-[48%] -translate-y-1/2 w-8 lg:w-11 xl:w-14 h-8 z-20 pointer-events-none">
                      <svg viewBox="0 0 60 36" fill="none" className="w-full h-full overflow-visible">
                        <path
                          d="M 2 24 Q 30 2 58 24"
                          stroke="#d4b373"
                          strokeWidth="2.5"
                          strokeDasharray="3 4.5"
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_6px_rgba(212,179,115,0.7)]"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Golden Numbered Circle (Positioned on top center) */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30">
                    <div className="relative flex items-center justify-center size-11 sm:size-12 rounded-full bg-gradient-to-b from-[#fffbeb] via-[#fde68a] to-[#d97706] border-2 border-[#fffbeb] shadow-[0_0_24px_rgba(253,230,138,0.75),_0_0_12px_rgba(217,119,6,0.5)] transform group-hover:scale-110 transition-transform duration-300">
                      <span className="font-display font-black text-sm sm:text-base text-[#1c1917] tracking-tight">
                        {step.stepNumber}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="relative w-full rounded-[26px] sm:rounded-[28px] bg-gradient-to-b from-[#181a20]/95 via-[#121317]/95 to-[#0b0c0f]/95 border border-[#d4b373]/30 pt-9 sm:pt-10 pb-7 sm:pb-8 px-3.5 sm:px-4 lg:px-5 flex flex-col items-center justify-center text-center shadow-[0_12px_32px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.12),_inset_0_-8px_16px_rgba(212,179,115,0.1)] group-hover:border-[#d4b373]/80 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.9),_0_0_25px_rgba(212,179,115,0.25)] group-hover:-translate-y-2 transition-all duration-300 min-h-[220px] sm:min-h-[235px]">
                    {/* Icon Container */}
                    <div className="flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-105">
                      <Icon />
                    </div>

                    {/* Step Title */}
                    <h3 className="font-display text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight leading-snug">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="mt-1.5 text-xs sm:text-[0.8125rem] text-white/65 leading-relaxed font-normal">
                      {step.description}
                    </p>

                    {/* Bottom Golden Rim Light Reflection */}
                    <div className="absolute -bottom-1.5 inset-x-6 h-3 bg-[#d4b373]/25 blur-md rounded-full pointer-events-none group-hover:bg-[#d4b373]/40 transition-colors" />
                  </div>
                </m.div>
              );
            })}
          </div>

          {/* ── MOBILE: CLEAN VERTICAL JOURNEY STACK ── */}
          <div className="md:hidden flex flex-col items-center max-w-sm mx-auto space-y-6 pt-3">
            {JOURNEY_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.stepNumber} className="w-full flex flex-col items-center">
                  <m.div
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{
                      duration: prefersReducedMotion ? 0.01 : 0.5,
                      delay: prefersReducedMotion ? 0 : index * 0.08,
                    }}
                    className="relative w-full group pt-5"
                  >
                    {/* Golden Numbered Circle (Positioned on top center) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30">
                      <div className="flex items-center justify-center size-11 rounded-full bg-gradient-to-b from-[#fffbeb] via-[#fde68a] to-[#d97706] border-2 border-[#fffbeb] shadow-[0_0_20px_rgba(253,230,138,0.7)]">
                        <span className="font-display font-black text-sm text-[#1c1917] tracking-tight">
                          {step.stepNumber}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#181a20]/95 via-[#121317]/95 to-[#0b0c0f]/95 border border-[#d4b373]/35 pt-9 pb-6 px-5 flex flex-col items-center justify-center text-center shadow-[0_10px_28px_rgba(0,0,0,0.8),_inset_0_-6px_14px_rgba(212,179,115,0.12)]">
                      <div className="flex items-center justify-center mb-3">
                        <Icon />
                      </div>
                      <h3 className="font-display text-base font-bold text-white tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs text-white/70">
                        {step.description}
                      </p>
                      <div className="absolute -bottom-1 inset-x-8 h-2.5 bg-[#d4b373]/25 blur-sm rounded-full pointer-events-none" />
                    </div>
                  </m.div>

                  {/* Vertical Golden Dotted Connector Between Steps */}
                  {index < JOURNEY_STEPS.length - 1 && (
                    <div className="py-2 flex justify-center">
                      <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
                        <path
                          d="M 10 0 V 28"
                          stroke="#d4b373"
                          strokeWidth="2.5"
                          strokeDasharray="3 4"
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_6px_rgba(212,179,115,0.7)]"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </LazyMotion>
      </div>
    </section>
  );
}
