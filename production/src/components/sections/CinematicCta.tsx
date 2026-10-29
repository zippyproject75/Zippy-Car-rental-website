import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { buttonClass } from "@/components/ui/button";

export function CinematicCta() {
  return (
    <section
      aria-labelledby="cinematic-cta-title"
      className="relative overflow-hidden bg-muted text-ink dark:bg-[#090a0d] dark:text-white"
    >
      {/* Background: real Brezza vehicle imagery */}
      <div className="absolute inset-0">
        <Image
          src="/images/cars/brezza.jpeg"
          alt="Maruti Suzuki Brezza on Maharashtra roads"
          aria-hidden
          fill
          className="object-cover object-center opacity-50 transition-transform duration-[8000ms] hover:scale-105"
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0 dark:hidden"
          style={{
            background:
              "linear-gradient(105deg, color-mix(in oklab, var(--muted) 40%, transparent) 35%, color-mix(in oklab, var(--canvas) 50%, transparent) 65%, color-mix(in oklab, var(--raised) 30%, transparent) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden dark:block"
          style={{
            background:
              "linear-gradient(105deg, #090a0d 35%, rgba(9,10,13,0.3) 65%, rgba(9,10,13,0.15) 100%)",
          }}
        />
      </div>

      {/* Warm ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-25"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 80% 50%, rgb(201 166 96 / 0.55), transparent 70%)",
        }}
      />

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
              href="#enquiry"
              className={buttonClass(
                "primary",
                "lg",
                "w-full justify-center sm:w-auto bg-accent text-[#090a0d] font-bold hover:bg-accent-hover gap-2.5 shadow-lg shadow-accent/25 transition-transform duration-150 hover:-translate-y-0.5",
              )}
            >
              <span>Plan My Rental</span>
              <ArrowRight aria-hidden className="size-5" />
            </a>
            <a
              href="#fleet"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-control border border-line bg-white/5 px-6 text-base font-semibold text-ink dark:border-white/20 dark:bg-white/5 dark:text-white backdrop-blur-sm transition-[border-color,background-color,transform] duration-200 hover:border-line-strong dark:hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5 sm:w-auto"
            >
              Explore Fleet
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
