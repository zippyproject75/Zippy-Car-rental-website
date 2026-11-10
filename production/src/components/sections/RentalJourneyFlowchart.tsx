"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const JOURNEY_STEPS = [
  {
    step: 1,
    title: "Choose Your Car",
    description: "Select your vehicle",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        <rect
          x="8"
          y="28"
          width="48"
          height="16"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 28V20C16 17.7909 17.7909 16 20 16H24L28 28H16Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M48 28V20C48 17.7909 46.2091 16 44 16H40L36 28H48Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="48" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="44" cy="48" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="48" r="2" fill="currentColor" />
        <circle cx="44" cy="48" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    step: 2,
    title: "Choose Package",
    description: "12hr or 24hr rental",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        <circle
          cx="32"
          cy="32"
          r="24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 16V32L40 40"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    step: 3,
    title: "Pickup Location",
    description: "Choose pickup point",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        <path
          d="M32 8C20.9543 8 12 16.9543 12 28C12 41.2531 32 56 32 56C32 56 52 41.2531 52 28C52 16.9543 43.0457 8 32 8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="28" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="28" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    step: 4,
    title: "Send Enquiry",
    description: "Submit via WhatsApp",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        <path
          d="M8 12C8 9.79086 9.79086 8 12 8H52C54.2091 8 56 9.79086 56 12V40C56 42.2091 54.2091 44 52 44H20L8 56V12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="26" r="3" fill="currentColor" />
        <circle cx="32" cy="26" r="3" fill="currentColor" />
        <circle cx="44" cy="26" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    step: 5,
    title: "Confirm Rental",
    description: "Owner confirms",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        <circle
          cx="32"
          cy="32"
          r="24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 32L30 40L44 24"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function RentalJourneyFlowchart({ id, embedded = false }: { id?: string; embedded?: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id={id}
      aria-labelledby="journey-title"
      className={`relative w-full ${embedded ? '' : 'border-y border-line bg-muted/30'}`}
    >
      <div className={`container-site ${embedded ? 'py-6 sm:py-8 lg:py-10' : 'py-12 sm:py-16 lg:py-20'}`}>
        <LazyMotion features={domAnimation}>
          {!embedded && (
            <ScrollReveal>
              <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
                <p className="eyebrow mb-3">YOUR JOURNEY</p>
                <h2
                  id="journey-title"
                  className="font-display text-3xl font-extrabold tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl"
                >
                  Your Journey to a Perfect Rental
                </h2>
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink-2">
                  From choosing your car to confirming your rental, everything is simple and straightforward.
                </p>
              </div>
            </ScrollReveal>
          )}

          {/* Vertical Layout (All Screen Sizes - Stacked Top to Bottom) */}
          <div className="max-w-2xl mx-auto">
            {JOURNEY_STEPS.map((step, index) => (
              <m.div
                key={step.step}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.6,
                  delay: prefersReducedMotion ? 0 : index * 0.15,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="relative group pb-10 sm:pb-12 last:pb-0"
              >
                {/* Vertical Connector Line with Gradient */}
                {index < JOURNEY_STEPS.length - 1 && (
                  <m.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: prefersReducedMotion ? 0.01 : 0.8,
                      delay: prefersReducedMotion ? 0 : index * 0.15 + 0.3,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="absolute left-6 sm:left-8 top-14 sm:top-16 bottom-[-1.5rem] sm:bottom-[-2rem] w-0.5 bg-gradient-to-b from-accent via-accent/60 to-accent/20 origin-top"
                    aria-hidden="true"
                  />
                )}

                {/* Arrow between steps */}
                {index < JOURNEY_STEPS.length - 1 && (
                  <m.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: prefersReducedMotion ? 0.01 : 0.5,
                      delay: prefersReducedMotion ? 0 : index * 0.15 + 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="absolute left-6 sm:left-8 top-[5.5rem] sm:top-[6.5rem] transform -translate-x-1/2"
                    aria-hidden="true"
                  >
                    <svg
                      width="24"
                      height="28"
                      viewBox="0 0 24 28"
                      fill="none"
                      className="text-accent"
                    >
                      <path
                        d="M12 0V24M12 24L6 18M12 24L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </m.div>
                )}

                <div className="flex gap-4 sm:gap-6 items-start">
                  {/* Icon Container with Glow Effect */}
                  <div className="relative shrink-0">
                    <m.div
                      className="absolute inset-0 rounded-xl bg-accent/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: prefersReducedMotion ? 0.01 : 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <m.div
                      className="relative flex size-12 sm:size-14 items-center justify-center rounded-xl border-2 border-accent/30 bg-raised text-accent-ink transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent group-hover:scale-110 group-hover:shadow-raised"
                      whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7">
                        {step.icon}
                      </div>
                    </m.div>
                    {/* Step Number Badge */}
                    <m.div
                      className="absolute -top-2 -right-2 sm:-top-2.5 sm:-right-2.5 flex size-5 sm:size-6 items-center justify-center rounded-full border-2 border-raised bg-accent text-on-accent font-display text-xs sm:text-sm font-bold tabular-nums shadow-sm group-hover:scale-110 transition-transform"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
                    >
                      {step.step}
                    </m.div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 pt-1">
                    <m.div
                      className="rounded-lg border border-line/50 bg-muted/30 p-3 sm:p-4 transition-all duration-300 group-hover:border-accent/30 group-hover:bg-muted/50"
                      whileHover={{ 
                        x: prefersReducedMotion ? 0 : 4,
                        scale: prefersReducedMotion ? 1 : 1.02
                      }}
                      transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
                    >
                      <h3 className="font-display text-sm sm:text-base font-bold text-ink mb-1.5 group-hover:text-accent transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-ink-2">
                        {step.description}
                      </p>
                    </m.div>
                  </div>
                </div>
              </m.div>
            ))}
          </div>

          {/* Optional CTA - Only show if not embedded */}
          {!embedded && (
            <ScrollReveal delay={0.3}>
              <div className="mt-8 sm:mt-12 text-center">
                <p className="text-sm font-semibold text-ink-2 mb-4">
                  Ready to plan your rental?
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-control border border-accent bg-accent px-6 py-3 text-sm font-bold text-on-accent transition-all duration-200 hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-raised"
                >
                  Plan My Rental
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8H11M11 8L7 4M11 8L7 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          )}
        </LazyMotion>
      </div>
    </section>
  );
}
