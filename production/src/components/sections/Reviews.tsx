"use client";

import { MessageSquareShare, ShieldCheck, Star } from "lucide-react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { buttonClass } from "@/components/ui/button";

const WA_NUMBER = "919921208410";

type ReviewPlaceholder = {
  id: string;
  category: string;
  topic: string;
  description: string;
};

const REVIEW_SLOTS: ReviewPlaceholder[] = [
  {
    id: "fleet-quality",
    category: "Fleet Quality",
    topic: "Maruti Suzuki Condition",
    description: "Customer feedback on car cleanliness, maintenance, and driving performance.",
  },
  {
    id: "booking-ease",
    category: "Rental Process",
    topic: "WhatsApp Coordination",
    description: "Customer experience with transparent pricing, fast reply times, and zero hidden charges.",
  },
  {
    id: "branch-convenience",
    category: "Locations",
    topic: "Pune Branch Pickup",
    description: "Customer reviews regarding Kondhwa, Gangadham, and Undri pickup convenience.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const starVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -20 },
  visible: { opacity: 1, scale: 1, rotate: 0 },
};

export function Reviews() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <section aria-labelledby="reviews-title" className="border-t border-line bg-canvas">
        <div className="container-site py-16 sm:py-20 lg:py-24">
          {/* Section Heading */}
          <m.div
            className="mb-10 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">Customer feedback</p>
              <h2
                id="reviews-title"
                className="font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl"
              >
                Verified customer experiences
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
                We collect genuine reviews directly from customers who have driven our cars across Pune and Maharashtra.
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-muted/60 px-3 py-1 text-xs font-semibold text-ink-3">
                <ShieldCheck aria-hidden className="size-3.5 text-accent-ink" />
                Verified Feedback System
              </span>
            </div>
          </m.div>

          {/* Review cards with staggered reveal */}
          <m.div
            className="grid gap-6 md:grid-cols-3"
            initial={prefersReducedMotion ? undefined : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "visible"}
            viewport={{ once: true, margin: "-8%" }}
            variants={prefersReducedMotion ? undefined : {
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
            }}
          >
            {REVIEW_SLOTS.map((slot) => (
              <m.article
                key={slot.id}
                variants={prefersReducedMotion ? undefined : cardVariants}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col justify-between rounded-card border border-line bg-raised p-6 shadow-raised transition-[border-color,transform] hover:border-line-strong hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-accent-ink">
                      {slot.category}
                    </span>
                    {/* Stars with sequential pop animation */}
                    <m.div
                      className="flex gap-0.5 text-accent"
                      aria-label="5 stars"
                      initial={prefersReducedMotion ? undefined : "hidden"}
                      whileInView={prefersReducedMotion ? undefined : "visible"}
                      viewport={{ once: true }}
                      variants={prefersReducedMotion ? undefined : {
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
                      }}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <m.span
                          key={i}
                          variants={prefersReducedMotion ? undefined : starVariants}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Star aria-hidden className="size-3.5 fill-current" />
                        </m.span>
                      ))}
                    </m.div>
                  </div>

                  <h3 className="mt-4 font-display text-base font-bold text-ink">
                    {slot.topic}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-3">
                    {slot.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-line/60 pt-4">
                  <p className="text-xs italic text-ink-3">
                    Awaiting owner publication of verified customer submissions.
                  </p>
                </div>
              </m.article>
            ))}
          </m.div>

          {/* Review invitation card */}
          <m.div
            className="mt-8 rounded-card border border-line bg-muted/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquareShare aria-hidden className="size-5 text-accent-ink" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-ink">
                  Rented with Zippy Car Rental?
                </h4>
                <p className="mt-1 text-sm text-ink-2 max-w-xl">
                  Share your trip experience with us on WhatsApp. Verified reviews are published directly on our website.
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Zippy! I would like to share my rental feedback / review.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass(
                "secondary",
                "md",
                "whitespace-nowrap shrink-0 hover:bg-raised transition-transform duration-150 hover:-translate-y-0.5"
              )}
            >
              Submit Feedback on WhatsApp
            </a>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
