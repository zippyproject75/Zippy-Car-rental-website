"use client";

import {
  ArrowRight,
  Car,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { RentalJourneyFlowchart } from "./RentalJourneyFlowchart";

interface HeroSlide {
  id: string;
  badge: string;
  headlinePrefix: string;
  headlineHighlight: string;
  headlineSuffix: string;
  description: string;
  features: string[];
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  bgImage: string;
  bgFallback: string;
  // Synchronized Car Showcase Data
  vehicleName: string;
  vehicleSpec: string;
  vehicleTagline: string;
  vehicleRate: string;
  vehicleImage: string;
  vehicleFallback: string;
  vehicleHref: string;
  ariaLabel: string;
}

const slides: HeroSlide[] = [
  {
    id: "pune-brezza",
    badge: "Self-Drive Pune",
    headlinePrefix: "Pune's Trusted",
    headlineHighlight: "Self-Drive",
    headlineSuffix: "Car Rental",
    description:
      "Drive your way with complete freedom, comfort, and zero hidden charges. Choose from sanitized hatchbacks, sedans, and compact SUVs across Pune.",
    features: [
      "Wide Fleet Options",
      "100% Sanitized & Inspected",
      "24/7 Roadside Assistance",
      "Zero Security Deposit Option",
    ],
    primaryCta: "Book Your Ride",
    primaryHref: "/book",
    secondaryCta: "Explore Fleet",
    secondaryHref: "/cars",
    bgImage: "/images/hero/bg-pune-twilight.webp",
    bgFallback: "/images/hero/bg-pune-twilight.jpg",
    vehicleName: "Maruti Suzuki Brezza",
    vehicleSpec: "Compact SUV · 5 Seater",
    vehicleTagline: "High ground clearance, easy Pune city & highway handling",
    vehicleRate: "₹1,499 / day",
    vehicleImage: "/images/cars/breeza_side_view.webp",
    vehicleFallback: "/images/cars/breeza_side_view.png",
    vehicleHref: "/book?car=brezza",
    ariaLabel: "Book Pune's trusted self-drive car rental with Maruti Brezza",
  },
  {
    id: "family-ertiga",
    badge: "Family & Group Getaways",
    headlinePrefix: "Family Trips &",
    headlineHighlight: "Group Travel",
    headlineSuffix: "Made Easy",
    description:
      "Spacious, ultra-comfortable 7-seater vehicles designed for memorable family adventures with generous luggage capacity and dual AC cooling.",
    features: [
      "7-Seater Spacious Cabin",
      "Extra Luggage Capacity",
      "Dual AC Zone Cooling",
      "Child & Elder Friendly",
    ],
    primaryCta: "Plan a Family Drive",
    primaryHref: "/book?car=ertiga-1",
    secondaryCta: "View 7-Seaters",
    secondaryHref: "/cars",
    bgImage: "/images/hero/bg-western-ghats.webp",
    bgFallback: "/images/hero/bg-western-ghats.jpg",
    vehicleName: "Maruti Suzuki Ertiga",
    vehicleSpec: "7-Seater MPV · Petrol / CNG",
    vehicleTagline: "The family favourite with rear AC and massive luggage space",
    vehicleRate: "₹1,899 / day",
    vehicleImage: "/images/cars/ertiga_side_view.webp",
    vehicleFallback: "/images/cars/ertiga_side_view.png",
    vehicleHref: "/book?car=ertiga-1",
    ariaLabel: "Plan family trips with spacious 7-seater Maruti Suzuki Ertiga",
  },
  {
    id: "flexible-baleno",
    badge: "Flexible Rental Packages",
    headlinePrefix: "Flexible Rental",
    headlineHighlight: "Packages for",
    headlineSuffix: "Every Plan",
    description:
      "Tailored duration options that fit your schedule and budget — unbeatable value on daily getaways, weekly commutes, or monthly subscriptions.",
    features: [
      "Daily Rental (1–7 Days)",
      "Weekly Rental (7–30 Days)",
      "Monthly Subscription (30+ Days)",
      "Save Up to 40% on Long Term",
    ],
    primaryCta: "Explore Rental Plans",
    primaryHref: "/cars",
    secondaryCta: "Get Instant Quote",
    secondaryHref: "/book",
    bgImage: "/images/hero/bg-night-highway.webp",
    bgFallback: "/images/hero/bg-night-highway.jpg",
    vehicleName: "Maruti Suzuki Baleno",
    vehicleSpec: "Premium Hatchback · 22 km/l",
    vehicleTagline: "Fuel-efficient premium hatchback ideal for daily & monthly rentals",
    vehicleRate: "₹1,199 / day",
    vehicleImage: "/images/cars/baleno_side_view.webp",
    vehicleFallback: "/images/cars/baleno_side_view.png",
    vehicleHref: "/book?car=baleno",
    ariaLabel: "Explore flexible rental plans with fuel-efficient Maruti Baleno",
  },
  {
    id: "doorstep-fronx",
    badge: "Doorstep Convenience",
    headlinePrefix: "Car Delivered Right",
    headlineHighlight: "at Your Doorstep",
    headlineSuffix: "in Pune",
    description:
      "Skip the rental counter. We deliver freshly sanitized, fully inspected self-drive cars right to your home, office, or Pune Airport on schedule.",
    features: [
      "Doorstep Drop & Pickup",
      "Pune Airport Express Delivery",
      "Quick 2-Minute Digital Handover",
      "Sanitized & Tank Full Ready",
    ],
    primaryCta: "Request Car Delivery",
    primaryHref: "/book",
    secondaryCta: "How Delivery Works",
    secondaryHref: "/how-it-works",
    bgImage: "/images/hero/bg-modern-driveway.webp",
    bgFallback: "/images/hero/bg-modern-driveway.jpg",
    vehicleName: "Maruti Suzuki Fronx",
    vehicleSpec: "Turbo Crossover · Automatic",
    vehicleTagline: "Sporty modern styling with effortless automatic city driving",
    vehicleRate: "₹1,599 / day",
    vehicleImage: "/images/cars/fronx_side_view.webp",
    vehicleFallback: "/images/cars/fronx_side_view.png",
    vehicleHref: "/book?car=fronx",
    ariaLabel: "Request doorstep car delivery in Pune with Maruti Fronx",
  },
  {
    id: "fleet-xl6",
    badge: "Verified Self-Drive Fleet",
    headlinePrefix: "Explore Our",
    headlineHighlight: "Diverse Fleet",
    headlineSuffix: "of Quality Cars",
    description:
      "From agile hatchbacks for Pune city streets to rugged SUVs for Western Ghats adventures — 100% verified, insured, and maintained to perfection.",
    features: [
      "Hatchbacks · Sedans · SUVs · MPVs",
      "Manual & Automatic Options",
      "Comprehensive Commercial Insurance",
      "All India Tourist Permit Included",
    ],
    primaryCta: "View Complete Fleet",
    primaryHref: "/cars",
    secondaryCta: "Book Instantly",
    secondaryHref: "/book",
    bgImage: "/images/hero/bg-showroom-stage.webp",
    bgFallback: "/images/hero/bg-showroom-stage.jpg",
    vehicleName: "Maruti Suzuki XL6",
    vehicleSpec: "Premium 6-Seater · Captain Seats",
    vehicleTagline: "Luxury individual captain seats with Smart Hybrid performance",
    vehicleRate: "₹2,199 / day",
    vehicleImage: "/images/cars/XL6_side_view.webp",
    vehicleFallback: "/images/cars/XL6_side_view.png",
    vehicleHref: "/book?car=xl6",
    ariaLabel: "Browse the complete fleet of verified self-drive cars including XL6",
  },
  {
    id: "weekend-creta",
    badge: "Road Trips & Holidays",
    headlinePrefix: "Unforgettable",
    headlineHighlight: "Weekend Getaways",
    headlineSuffix: "from Pune",
    description:
      "Escape the city rush. Hit the road to Lonavala, Mahabaleshwar, Alibaug, Mulshi, and Lavasa in premium comfort with unlimited kilometers available.",
    features: [
      "Lonavala & Khandala (65 km)",
      "Mahabaleshwar & Panchgani (120 km)",
      "Mulshi & Tamhini Ghat (45 km)",
      "Alibaug Coastal Drives (140 km)",
    ],
    primaryCta: "Plan Your Weekend Drive",
    primaryHref: "/book",
    secondaryCta: "Browse Road-Trip Cars",
    secondaryHref: "/cars",
    bgImage: "/images/hero/bg-mountain-sunset.webp",
    bgFallback: "/images/hero/bg-mountain-sunset.jpg",
    vehicleName: "Western Ghats Road-Trip SUV",
    vehicleSpec: "High Ground Clearance · Highway Ready",
    vehicleTagline: "Built for mountain twisties, ghats, and long highway touring",
    vehicleRate: "Unlimited Kms Option",
    vehicleImage: "/images/hero/creta-highway-sunset.webp",
    vehicleFallback: "/images/hero/creta-highway-sunset.jpg",
    vehicleHref: "/book",
    ariaLabel: "Plan your weekend getaways from Pune with our highway-ready SUVs",
  },
];

const AUTOPLAY_INTERVAL = 5000;

export function HeroNew() {
  const prefersReducedMotion = useReducedMotion();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = slides.length;

  // Autoplay function: starts or restarts the 5000ms timer
  const startAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActiveSlideIndex((prev) => (prev + 1) % totalSlides);
    }, AUTOPLAY_INTERVAL);
  }, [totalSlides]);

  // Start autoplay immediately on load and clean up properly on unmount
  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startAutoplay]);

  // Preload upcoming slide background & vehicle images
  useEffect(() => {
    if (typeof window === "undefined") return;
    const nextIndex = (activeSlideIndex + 1) % totalSlides;
    const nextSlideData = slides[nextIndex];
    if (nextSlideData) {
      const bgImg = new window.Image();
      bgImg.src = nextSlideData.bgImage;
      const vehImg = new window.Image();
      vehImg.src = nextSlideData.vehicleImage;
    }
  }, [activeSlideIndex, totalSlides]);

  // Manual navigation handlers that reset the 5s autoplay countdown
  const nextSlide = useCallback(() => {
    setDirection(1);
    setActiveSlideIndex((prev) => (prev + 1) % totalSlides);
    startAutoplay();
  }, [totalSlides, startAutoplay]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setActiveSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    startAutoplay();
  }, [totalSlides, startAutoplay]);

  const goToSlide = useCallback((idx: number) => {
    if (idx === activeSlideIndex) return;
    setDirection(idx > activeSlideIndex ? 1 : -1);
    setActiveSlideIndex(idx);
    startAutoplay();
  }, [activeSlideIndex, startAutoplay]);

  // Touch Swipe Support for mobile
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartXRef.current = touch.clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (touch && touchStartXRef.current !== null) {
      const diff = touchStartXRef.current - touch.clientX;
      if (diff > 45) {
        nextSlide();
      } else if (diff < -45) {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  const activeSlide: HeroSlide = slides[activeSlideIndex] ?? slides[0]!;

  // Horizontal sliding variants: The entire slide frame (background + car showcase + text + CTAs)
  // moves together as ONE unified frame horizontally!
  const fullSlideVariants = {
    enter: (dir: number) => ({
      x: prefersReducedMotion ? "0%" : dir > 0 ? "100%" : "-100%",
      opacity: prefersReducedMotion ? 0 : 1,
    }),
    center: {
      x: "0%",
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: prefersReducedMotion ? "0%" : dir > 0 ? "-100%" : "100%",
      opacity: prefersReducedMotion ? 0 : 1,
    }),
  };

  return (
    <LazyMotion features={domAnimation}>
      <section
        aria-label="Zippy Car Rental Promotional Showcase"
        className="relative w-full overflow-hidden bg-[#0d0e12] text-white select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── 1. IMMERSIVE FULL-WIDTH HERO SLIDER STAGE (75-85vh) ── */}
        <div className="relative w-full overflow-hidden min-h-[580px] sm:min-h-[640px] lg:h-[78vh] lg:min-h-[680px] lg:max-h-[840px] flex items-center">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <m.div
              key={activeSlide.id}
              custom={direction}
              variants={fullSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.65 },
                opacity: { duration: 0.35 },
              }}
              className="absolute inset-0 size-full overflow-hidden"
            >
              {/* Layer A: Full-Bleed High-Resolution Scenic Background Image */}
              <div className="absolute inset-0 size-full pointer-events-none">
                <picture>
                  <source srcSet={activeSlide.bgImage} type="image/webp" />
                  <Image
                    src={activeSlide.bgFallback}
                    alt=""
                    fill
                    priority={activeSlideIndex === 0}
                    sizes="100vw"
                    className="size-full object-cover object-center"
                  />
                </picture>

                {/* Cinematic multi-stop gradient washes ensuring 100% text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e12] via-[#0d0e12]/85 to-[#0d0e12]/40 lg:to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-transparent to-[#0d0e12]/60" />

                {/* Subtle atmospheric ambient glow */}
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full bg-[#d4b373]/15 blur-3xl pointer-events-none" />
              </div>

              {/* Layer B: Foreground Content Stage (Text on Left, Synchronized Car Showcase on Right) */}
              <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full py-12 sm:py-16 lg:py-0">
                  
                  {/* Left Column: Eyebrow, Headline, Description, Features & CTAs */}
                  <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center text-left">
                    
                    {/* Eyebrow Trust Pill */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md self-start mb-4 shadow-sm">
                      <Sparkles className="size-3.5 text-[#d4b373]" />
                      <span className="text-[0.72rem] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#d4b373]">
                        {activeSlide.badge}
                      </span>
                    </div>

                    {/* Animated High-Contrast Headline */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.12] mb-4 drop-shadow-md">
                      {activeSlide.headlinePrefix}{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4b373] via-amber-200 to-[#d4b373]">
                        {activeSlide.headlineHighlight}
                      </span>{" "}
                      {activeSlide.headlineSuffix}
                    </h1>

                    {/* Supporting Description */}
                    <p className="text-sm sm:text-base md:text-lg text-white/85 max-w-xl leading-relaxed mb-6 drop-shadow-sm font-normal">
                      {activeSlide.description}
                    </p>

                    {/* Key Highlights / Feature Chips */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-8">
                      {activeSlide.features.map((feature, fIdx) => (
                        <div
                          key={fIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 backdrop-blur-md text-xs sm:text-sm font-medium text-white/90 shadow-sm"
                        >
                          <CheckCircle2 className="size-3.5 sm:size-4 text-[#d4b373] shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Primary & Secondary Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <Link
                        href={activeSlide.primaryHref}
                        className="group relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-red-700/35 hover:shadow-red-600/55 hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <span>{activeSlide.primaryCta}</span>
                        <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>

                      <Link
                        href={activeSlide.secondaryHref}
                        className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-[#d4b373] text-white hover:text-[#d4b373] font-semibold text-sm sm:text-base backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4b373]"
                      >
                        <span>{activeSlide.secondaryCta}</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: SYNCHRONIZED CAR SHOWCASE BOX */}
                  <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center relative">
                    <div className="w-full max-w-[520px] rounded-3xl overflow-hidden bg-black/65 border border-white/20 backdrop-blur-xl shadow-2xl p-4 sm:p-6 transition-all duration-300 hover:border-[#d4b373]/50">
                      
                      {/* Showcase Box Header: Featured Fleet Badge & Spec */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent font-bold text-xs uppercase tracking-wider">
                          <Sparkles className="size-3.5" />
                          <span>Zippy Verified Fleet</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/85 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                          <Car className="size-3.5 text-[#d4b373]" />
                          <span>{activeSlide.vehicleSpec}</span>
                        </div>
                      </div>

                      {/* Vehicle Image Stage (Smooth, non-blank presentation) */}
                      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 via-white/0 to-transparent flex items-center justify-center p-2">
                        <picture>
                          <source srcSet={activeSlide.vehicleImage} type="image/webp" />
                          <Image
                            src={activeSlide.vehicleFallback}
                            alt={activeSlide.vehicleName}
                            fill
                            priority={true}
                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 520px"
                            className="size-full object-contain object-center transition-transform duration-500 hover:scale-105"
                          />
                        </picture>
                      </div>

                      {/* Showcase Box Footer: Synchronized Vehicle Name, Tagline & Rental Rate */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                            {activeSlide.vehicleName}
                          </h3>
                          <p className="text-xs text-white/70 line-clamp-1 mt-0.5">
                            {activeSlide.vehicleTagline}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-[0.68rem] uppercase font-bold tracking-wider text-[#d4b373]">
                            Starting
                          </p>
                          <p className="text-sm sm:text-base font-black text-white">
                            {activeSlide.vehicleRate}
                          </p>
                        </div>
                      </div>

                      {/* Direct Book Link */}
                      <div className="mt-3 pt-2">
                        <Link
                          href={activeSlide.vehicleHref}
                          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/10 hover:bg-accent text-white font-bold text-xs uppercase tracking-wider transition-colors duration-200"
                        >
                          <span>Rent This {activeSlide.vehicleName.split(" ")[2] || "Car"}</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </m.div>
          </AnimatePresence>

          {/* ── Slide Navigation Controls: Exactly 6 Indicators with Active State ── */}
          <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2 sm:gap-3 px-4">
            <div
              role="tablist"
              aria-label="Promotional hero slider navigation"
              className="flex items-center gap-2 sm:gap-2.5 px-4 py-2 rounded-full bg-black/50 border border-white/15 backdrop-blur-md shadow-lg"
            >
              {slides.map((slide, idx) => {
                const isActive = idx === activeSlideIndex;
                return (
                  <button
                    key={slide.id}
                    role="tab"
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}: ${slide.badge} - ${slide.vehicleName}`}
                    aria-selected={isActive}
                    className={`relative overflow-hidden transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4b373] ${
                      isActive
                        ? "h-2.5 w-8 sm:w-10 rounded-full bg-[#d4b373] shadow-md shadow-[#d4b373]/50 scale-100"
                        : "h-2.5 w-2.5 sm:w-3 rounded-full bg-white/30 hover:bg-white/70 hover:scale-125"
                    }`}
                  >
                    {/* Active Timer Animation Bar */}
                    {isActive && (
                      <m.span
                        key={`bar-${activeSlideIndex}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                        className="absolute inset-0 bg-white/40"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── 2. RENTAL JOURNEY FLOWCHART (Seamlessly Preserved Beneath Full-Screen Hero) ── */}
        <div className="container-site relative z-20 w-full pt-10 sm:pt-14 pb-12 sm:pb-16">
          <RentalJourneyFlowchart embedded={true} />
        </div>
      </section>
    </LazyMotion>
  );
}
