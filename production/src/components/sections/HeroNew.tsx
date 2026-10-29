import { ArrowRight, CheckCircle2, MapPin, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import { buttonClass } from "@/components/ui/button";

export function HeroNew() {
  const trustBadges = [
    { icon: CheckCircle2, label: "Well-Maintained Maruti Suzuki Fleet" },
    { icon: MapPin, label: "3 Pune Branches: Kondhwa · Gangadham · Undri" },
    { icon: Star, label: "Direct Owner Confirmation on WhatsApp" },
  ];

  return (
    <section
      aria-labelledby="hero-title"
      className="relative w-full overflow-hidden bg-[#07080a] text-white"
    >
      {/* ── CINEMATIC ATMOSPHERE ── */}
      {/* Primary golden hour / road glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 60% at 75% 38%, rgb(212 179 115 / 0.2), transparent 60%), radial-gradient(circle 400px at 15% 20%, rgb(212 179 115 / 0.08), transparent 70%), linear-gradient(170deg, #07080a 0%, #0e1015 45%, #141720 100%)",
        }}
      />

      {/* Receding perspective highway illusion lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 opacity-20"
        style={{
          background:
            "linear-gradient(to top, rgba(212,179,115,0.15) 0%, transparent 100%)",
          maskImage: "linear-gradient(to top, black, transparent)",
        }}
      />

      {/* Technical coordinate grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── HERO CONTENT ── */}
      <div className="container-site relative z-10 py-16 sm:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 xl:gap-20">

          {/* ── LEFT: Typography & Conversions ── */}
          <div className="flex flex-col">
            {/* Eyebrow Pill */}
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 backdrop-blur-md">
              <Sparkles aria-hidden className="size-3.5 text-accent" />
              <span className="text-[0.6875rem] sm:text-xs font-bold tracking-[0.18em] uppercase text-accent">
                PUNE&apos;S PREMIER SELF-DRIVE SERVICE
              </span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-title"
              className="font-display text-[2.6rem] font-extrabold leading-[1.03] tracking-[-0.035em] text-white sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]"
            >
              Drive Pune
              <br />
              <span className="text-accent underline decoration-accent/30 decoration-wavy underline-offset-8">
                on your terms.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/75 font-normal">
              Premium self-drive Maruti Suzuki cars ready for your journey across Pune and Maharashtra.
              Direct WhatsApp pricing and instant availability confirmation — no middleman, transparent rates.
            </p>

            {/* High-Impact Actions */}
            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:gap-4">
              <a
                href="#enquiry"
                className={buttonClass(
                  "primary",
                  "lg",
                  "w-full justify-center sm:w-auto gap-2.5 bg-accent text-[#07080a] font-bold text-base px-8 py-4 hover:bg-accent-hover shadow-xl shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5",
                )}
              >
                <span>Plan My Rental</span>
                <ArrowRight aria-hidden className="size-5" />
              </a>
              <a
                href="#fleet"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-control border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5 sm:w-auto"
              >
                Explore Fleet
              </a>
            </div>

            {/* Verified Trust Strip */}
            <ul className="mt-12 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-7">
              {trustBadges.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-xs sm:text-sm text-white/70"
                >
                  <Icon aria-hidden className="size-4 shrink-0 text-accent" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── RIGHT: Cinematic Showcase Vehicle ── */}
          <div className="relative">
            {/* Dramatic background vehicle glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 scale-95 rounded-3xl opacity-35 blur-3xl"
              style={{ background: "radial-gradient(ellipse, rgb(212 179 115 / 0.5), transparent 70%)" }}
            />

            {/* Main Showcase Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] shadow-2xl backdrop-blur-xl">
              {/* Vehicle Photograph Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#16181f] to-[#0c0d12]">
                <Image
                  src="/images/cars/fronx.jpeg"
                  alt="Maruti Suzuki Fronx — Premium Self-Drive SUV in Pune"
                  fill
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                  loading="eager"
                />
                {/* Contrast gradient overlay */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(7,8,10,0.92) 0%, rgba(7,8,10,0.2) 45%, transparent 100%)",
                  }}
                />

                {/* Floating Category Pill */}
                <div className="absolute top-4 left-4 rounded-full border border-white/20 bg-black/60 px-3.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  Compact SUV · 5 Seater
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-white/[0.03] px-6 py-5">
                <div>
                  <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-accent">
                    Featured Vehicle
                  </p>
                  <h3 className="mt-0.5 text-lg sm:text-xl font-bold text-white font-display">
                    Maruti Suzuki Fronx
                  </h3>
                  <p className="mt-1 text-xs text-white/60">
                    Manual / Automatic · Petrol · Air Conditioned
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs font-bold text-accent">
                    Price on request
                  </span>
                  <span className="text-[0.625rem] text-white/50">
                    Confirmed upon enquiry
                  </span>
                </div>
              </div>
            </div>

            {/* Fleet Counter Overlay Badge */}
            <div className="absolute -bottom-4 -left-3 sm:-bottom-5 sm:-left-5 flex items-center gap-3.5 rounded-xl border border-white/15 bg-[#101218]/95 px-5 py-3 shadow-2xl backdrop-blur-lg">
              <div className="flex -space-x-2">
                {["fronx", "brezza", "baleno"].map((name) => (
                  <div
                    key={name}
                    className="size-8 overflow-hidden rounded-full border-2 border-[#101218] bg-[#1a1c24]"
                  >
                    <Image
                      src={`/images/cars/${name}.jpeg`}
                      alt=""
                      aria-hidden
                      width={32}
                      height={32}
                      className="size-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="leading-tight">
                <p className="text-xs sm:text-sm font-bold text-white">5 Fleet Units Ready</p>
                <p className="text-[0.6875rem] text-accent">Instant WhatsApp Booking</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Smooth transition into the content canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-canvas"
      />
    </section>
  );
}
