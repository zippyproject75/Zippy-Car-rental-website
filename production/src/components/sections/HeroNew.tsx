"use client";

import { ArrowRight, CheckCircle2, MapPin, Sparkles, Star } from "lucide-react";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "motion/react";
import { useRef } from "react";
import { buttonClass } from "@/components/ui/button";

const trustBadges = [
  { icon: CheckCircle2, label: "Premium Maruti Suzuki Fleet" },
  { icon: Star, label: "5-Star Owner Rating" },
  { icon: MapPin, label: "3 Strategic Pickup Points" },
];

export function HeroNew() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={sectionRef}
        aria-labelledby="hero-title"
        className="relative w-full overflow-hidden bg-canvas text-ink pt-6 pb-10 sm:py-12 lg:min-h-[96vh] lg:py-0 lg:flex lg:items-center dark:bg-[#07080a] dark:text-white"
      >
        {/* ── Subtle Background Gradient (Desktop Only) ── */}
        <div className="hidden lg:block absolute inset-0 size-full pointer-events-none select-none overflow-hidden z-0">
          {/* Subtle gradient overlay */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, var(--muted) 0%, var(--canvas) 50%, var(--muted) 100%)",
            }}
          />

          {/* Dark mode gradient */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none hidden dark:block"
            style={{
              background:
                "linear-gradient(135deg, #07080a 0%, #0a0c12 50%, #07080a 100%)",
            }}
          />

          {/* Top header subtle shade */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-28 pointer-events-none bg-gradient-to-b from-canvas/80 to-transparent dark:from-[#07080a]/80"
          />

          {/* Bottom horizon blend into page canvas */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none bg-gradient-to-t from-canvas to-transparent dark:from-[#07080a]"
          />
        </div>

        {/* ── 2. CONTENT CONTAINER (Both Mobile and Desktop) ── */}
        <div className="container-site relative z-20 w-full py-2 sm:py-6 lg:py-36">
          <div className="max-w-5xl mx-auto text-center">
            {/* Pill Eyebrow Badge */}
            <m.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 sm:mb-6 lg:mb-8 inline-flex w-fit items-center gap-1.5 sm:gap-2 rounded-full border border-accent/40 bg-ink/10 px-4 py-1.5 sm:px-5 sm:py-2 backdrop-blur-md shadow-sm dark:bg-black/60 mx-auto"
            >
              <Sparkles aria-hidden className="size-3.5 sm:size-4 text-accent" />
              <span className="text-[0.75rem] sm:text-xs font-bold tracking-[0.2em] uppercase text-accent">
                Premium Self-Drive Experience
              </span>
            </m.div>

            {/* Main Headline */}
            <h1
              id="hero-title"
              className="font-display text-4xl sm:text-5xl lg:text-[5.5rem] font-black leading-[1.05] lg:leading-[1.02] tracking-[-0.04em] text-ink dark:text-white mb-4"
            >
              <m.span
                className="block bg-gradient-to-r from-ink via-ink-2 to-ink bg-clip-text text-transparent dark:from-white dark:via-white/90 dark:to-white/70"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                Drive Your Way
              </m.span>
              <m.span
                className="block mt-1 sm:mt-2 lg:mt-0"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-accent italic font-normal lg:font-medium">Through</span>
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-accent via-accent-hover to-accent bg-clip-text text-transparent">
                    Pune
                  </span>
                  <span className="absolute -bottom-2 left-0 right-0 h-2 sm:h-3 bg-accent/20 -skew-x-12 dark:bg-accent/30"></span>
                </span>
              </m.span>
            </h1>

            {/* Subtitle with decorative element */}
            <m.div
              className="flex items-center justify-center gap-4 mb-6 lg:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/50"></div>
              <p className="text-sm sm:text-base font-semibold tracking-widest uppercase text-accent">
                Your Journey, Your Rules
              </p>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent/50"></div>
            </m.div>

            {/* Supporting Copy (Mobile: minimal single line; Desktop: rich description) */}
            <m.p
              className="mt-4 text-sm sm:text-base font-medium text-ink-2 lg:hidden dark:text-white/85 text-center leading-relaxed"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.45, delay: prefersReducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              Premium Maruti Suzuki fleet. Direct owner pricing. Instant WhatsApp confirmation.
            </m.p>

            <m.p
              className="mt-6 max-w-2xl mx-auto text-base lg:text-lg leading-relaxed text-ink-2 font-normal hidden lg:block dark:text-white/85"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              Experience the freedom of premium self-drive rentals across Pune. Choose from our curated fleet of
              <span className="font-semibold text-accent"> Fronx, Brezza, Baleno</span>,
              <span className="font-semibold text-accent"> Ertiga</span>, and
              <span className="font-semibold text-accent"> XL6</span>. No middlemen, no hidden fees — just transparent pricing and direct confirmation from the owner.
            </m.p>



            {/* ── 5. Action Buttons ── */}
            <m.div
              className="mt-2 lg:mt-10 flex flex-col gap-2.5 sm:flex-row sm:gap-4 justify-center"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href="#enquiry"
                className={buttonClass(
                  "primary",
                  "lg",
                  "w-full justify-center sm:w-auto gap-2.5 bg-accent text-on-accent font-bold text-base px-8 py-3.5 sm:py-4 hover:bg-accent-hover shadow-xl shadow-accent/25 transition-transform duration-200 hover:-translate-y-0.5",
                )}
              >
                <span>Start Your Journey</span>
                <ArrowRight aria-hidden className="size-5" />
              </a>
              <a
                href="#fleet"
                className="inline-flex min-h-11 sm:min-h-12 w-full items-center justify-center gap-2 rounded-control border border-line bg-muted/50 px-6 py-2.5 sm:py-4 text-sm sm:text-base font-semibold text-ink backdrop-blur-md transition-all duration-200 hover:border-line-strong hover:bg-muted/70 hover:-translate-y-0.5 sm:w-auto text-center dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/50 dark:hover:bg-white/20"
              >
                View Our Cars
              </a>
            </m.div>

            {/* ── 6. Compact Trust Indicators ── */}
            {/* Mobile: Horizontal compact inline strip */}
            <m.div
              className="mt-3.5 flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 text-xs text-ink-2 font-medium lg:hidden dark:text-white/80"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-accent shrink-0" />
                <span>Premium Fleet</span>
              </span>
              <span className="text-ink-3 dark:text-white/30" aria-hidden>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-3.5 text-accent shrink-0" />
                <span>5-Star Rated</span>
              </span>
              <span className="text-ink-3 dark:text-white/30" aria-hidden>•</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-accent shrink-0" />
                <span>3 Pickup Points</span>
              </span>
            </m.div>

            {/* Desktop: Vertical list */}
            <m.ul
              className="hidden lg:flex flex-col gap-3 mt-12 items-center"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {trustBadges.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 text-sm text-ink-2 dark:text-white/85"
                >
                  <Icon aria-hidden className="size-4 shrink-0 text-accent" />
                  <span>{label}</span>
                </li>
              ))}
            </m.ul>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
