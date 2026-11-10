import { ArrowRight } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

export function CinematicCta() {
  return (
    <section
      aria-labelledby="cinematic-cta-title"
      className="relative overflow-hidden bg-muted text-ink dark:bg-[#090a0d] dark:text-white"
    >
      <div className="container-site relative z-10 py-20 sm:py-24 lg:py-32">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="eyebrow mb-4 text-accent scroll-reveal">Ready when you are</p>

          <h2
            id="cinematic-cta-title"
            className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink dark:text-white sm:text-5xl lg:text-6xl scroll-reveal stagger-1"
          >
            Your next drive
            <br />
            <span className="text-accent">starts here.</span>
          </h2>

          <p className="mt-5 max-w-lg text-[0.9375rem] leading-relaxed text-ink-2 dark:text-white/70 sm:text-lg scroll-reveal stagger-2">
            Prepare your self-drive rental enquiry in under a minute. Zippy confirms the price and
            availability personally on WhatsApp — no middleman.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4 scroll-reveal stagger-3">
            <a
              href="/book"
              className={buttonClass(
                "primary",
                "lg",
                "w-full justify-center sm:w-auto bg-accent text-[#090a0d] font-bold hover:bg-accent-hover gap-2.5 shadow-lg shadow-accent/25 transition-transform duration-150 hover:-translate-y-0.5",
              )}
            >
              <span>Book Now</span>
              <ArrowRight aria-hidden className="size-5" />
            </a>
            <a
              href="/cars"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-control border border-line bg-white/5 px-6 text-base font-semibold text-ink dark:border-white/20 dark:bg-white/5 dark:text-white backdrop-blur-sm transition-[border-color,background-color,transform] duration-200 hover:border-line-strong dark:hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5 sm:w-auto"
            >
              Search Cars
            </a>
          </div>

          {/* Truthful reminder */}
          <p className="mt-6 text-xs text-ink-3 dark:text-white/40 scroll-reveal stagger-4">
            Enquiries are requests only — no vehicle is reserved until confirmed directly by Zippy Car Rental.
          </p>
        </div>
      </div>
    </section>
  );
}
