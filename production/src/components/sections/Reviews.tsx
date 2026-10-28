"use client";

import { MessageSquareShare, ShieldCheck, Star } from "lucide-react";
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

export function Reviews() {
  return (
    <section aria-labelledby="reviews-title" className="border-t border-line bg-canvas">
      <div className="container-site py-16 sm:py-20 lg:py-24">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
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
        </div>

        {/* 3 Review Cards (Structured placeholders awaiting owner-verified reviews) */}
        <div className="grid gap-6 md:grid-cols-3">
          {REVIEW_SLOTS.map((slot) => (
            <article
              key={slot.id}
              className="flex flex-col justify-between rounded-card border border-line bg-raised p-6 shadow-raised transition-[border-color,transform] hover:border-line-strong hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-ink">
                    {slot.category}
                  </span>
                  <div className="flex gap-0.5 text-accent" aria-label="5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} aria-hidden className="size-3.5 fill-current" />
                    ))}
                  </div>
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
            </article>
          ))}
        </div>

        {/* Customer Review Invitation Card */}
        <div className="mt-8 rounded-card border border-line bg-muted/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
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
              "whitespace-nowrap shrink-0 hover:bg-raised"
            )}
          >
            Submit Feedback on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
