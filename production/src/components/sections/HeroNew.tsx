"use client";

import { ArrowRight, CheckCircle2, MapPin, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/button";

const trustBadges = [
  { icon: CheckCircle2, label: "Well-Maintained Maruti Suzuki Fleet" },
  { icon: MapPin, label: "3 Pune Branches: Kondhwa · Gangadham · Undri" },
  { icon: Star, label: "Direct Owner Confirmation on WhatsApp" },
];

export function HeroNew() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  /* ── Video Autoplay Guarantee (both desktop and mobile) ── */
  useEffect(() => {
    if (prefersReducedMotion) return;

    const playVideos = () => {
      [desktopVideoRef.current, mobileVideoRef.current].forEach((vid) => {
        if (vid) {
          vid.defaultMuted = true;
          vid.muted = true;
          const p = vid.play();
          if (p !== undefined) {
            p.then(() => setVideoLoaded(true)).catch(() => {});
          }
        }
      });
    };

    playVideos();

    const handleFirstGesture = () => {
      playVideos();
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
    };

    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("scroll", handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
    };
  }, [prefersReducedMotion]);

  /* ── Scroll parallax for desktop ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgParallaxY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 35]);

  /* ── Interactive chase-camera perspective tilt on mouse move (desktop only) ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 80, damping: 20 };
  const cameraTiltX = useSpring(mouseX, springConfig);
  const cameraTiltY = useSpring(mouseY, springConfig);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || e.pointerType === "touch") return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set(((e.clientX - cx) / (rect.width / 2)) * 3);
    mouseY.set(((e.clientY - cy) / (rect.height / 2)) * -2);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={sectionRef}
        aria-labelledby="hero-title"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative w-full overflow-hidden bg-[#07080a] text-white pt-6 pb-10 sm:py-12 lg:min-h-[96vh] lg:py-0 lg:flex lg:items-center"
      >
        {/* ── 1. AUTHENTIC DESKTOP HIGHWAY DRIVING VIDEO LAYER (Desktop Only) ── */}
        <m.div
          className="hidden lg:block absolute inset-0 size-full pointer-events-none select-none overflow-hidden z-0"
          style={{
            y: bgParallaxY,
            rotateX: cameraTiltY,
            rotateY: cameraTiltX,
            transformStyle: "preserve-3d",
            perspective: 1200,
          }}
        >
          {prefersReducedMotion ? (
            <Image
              src="/images/hero-highway-perfect.jpg"
              alt="Cinematic Pune Highway Sunset with Zippy Car Rental"
              fill
              priority
              quality={96}
              className="object-cover object-[72%_center] select-none"
              sizes="100vw"
            />
          ) : (
            <video
              ref={desktopVideoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/images/hero-highway-perfect.jpg"
              onLoadedData={() => setVideoLoaded(true)}
              className="size-full object-cover object-[72%_center] select-none transition-opacity duration-700"
              style={{ opacity: videoLoaded ? 1 : 0.9 }}
            >
              <source src="/videos/zippy-hero-driving.mp4" type="video/mp4" />
            </video>
          )}

          {/* Desktop Left Vignette */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, #07080a 0%, #07080a 28%, rgba(7,8,10,0.85) 42%, rgba(7,8,10,0.3) 58%, transparent 72%)",
            }}
          />

          {/* Top header subtle shade */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-28 pointer-events-none bg-gradient-to-b from-[#07080a]/80 to-transparent"
          />

          {/* Bottom horizon blend into page canvas */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none bg-gradient-to-t from-canvas to-transparent"
          />
        </m.div>

        {/* ── 2. BRAND 'Z' WATERMARK IN SKY (Desktop Only) ── */}
        <div
          aria-hidden
          className="pointer-events-none hidden lg:block absolute top-8 right-12 select-none font-display text-[20rem] font-black text-white/[0.04] leading-none tracking-tighter z-10"
        >
          Z
        </div>

        {/* ── 3. CONTENT CONTAINER (Both Mobile and Desktop) ── */}
        <div className="container-site relative z-20 w-full py-2 sm:py-6 lg:py-36">
          <div className="max-w-2xl">
            {/* Pill Eyebrow Badge */}
            <m.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mb-2.5 sm:mb-4 lg:mb-6 inline-flex w-fit items-center gap-1.5 sm:gap-2 rounded-full border border-accent/40 bg-black/60 px-3 py-1 sm:px-4 sm:py-1.5 backdrop-blur-md shadow-sm"
            >
              <Sparkles aria-hidden className="size-3 sm:size-3.5 text-accent" />
              <span className="text-[0.6875rem] sm:text-xs font-bold tracking-[0.16em] uppercase text-accent">
                PUNE&apos;S PREMIER SELF-DRIVE SERVICE
              </span>
            </m.div>

            {/* Main Headline */}
            <h1
              id="hero-title"
              className="font-display text-3xl sm:text-4xl lg:text-[4.25rem] font-extrabold leading-[1.08] lg:leading-[1.04] tracking-[-0.03em] text-white"
            >
              <m.span
                className="block"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                Drive Pune
              </m.span>
              <m.span
                className="text-accent underline decoration-accent/40 decoration-wavy underline-offset-4 sm:underline-offset-8 inline-block"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                on your terms.
              </m.span>
            </h1>

            {/* Supporting Copy (Mobile: minimal single line; Desktop: rich description) */}
            <m.p
              className="mt-2 text-sm sm:text-base font-medium text-white/85 lg:hidden"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.45, delay: prefersReducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              Premium self-drive cars in Pune.
            </m.p>

            <m.p
              className="mt-6 max-w-xl text-base lg:text-[1.0625rem] leading-relaxed text-white/85 font-normal hidden lg:block"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              Premium self-drive Maruti Suzuki cars ready for your journey across Pune and Maharashtra.
              Direct WhatsApp pricing and instant availability confirmation — no middleman, transparent rates.
            </m.p>

            {/* ── 4. DEDICATED MOBILE ANIMATED VEHICLE STAGE (Mobile Only: < lg) ── */}
            <div className="lg:hidden relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl my-3.5 sm:my-5 bg-[#0b0c10]">
              {prefersReducedMotion ? (
                <Image
                  src="/images/hero-highway-perfect.jpg"
                  alt="Cinematic Pune Highway Sunset with Zippy Car Rental"
                  fill
                  priority
                  quality={96}
                  className="object-cover object-center select-none"
                  sizes="100vw"
                />
              ) : (
                <video
                  ref={mobileVideoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/images/hero-highway-perfect.jpg"
                  className="size-full object-cover object-center select-none"
                >
                  <source src="/videos/zippy-hero-driving.mp4" type="video/mp4" />
                </video>
              )}

              {/* Subtle glass border */}
              <div aria-hidden className="absolute inset-0 pointer-events-none rounded-2xl border border-white/10" />
            </div>

            {/* ── 5. Action Buttons ── */}
            <m.div
              className="mt-2 lg:mt-10 flex flex-col gap-2.5 sm:flex-row sm:gap-4"
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
                  "w-full justify-center sm:w-auto gap-2.5 bg-accent text-[#07080a] font-bold text-base px-8 py-3.5 sm:py-4 hover:bg-accent-hover shadow-xl shadow-accent/25 transition-transform duration-200 hover:-translate-y-0.5",
                )}
              >
                <span>Plan My Rental</span>
                <ArrowRight aria-hidden className="size-5" />
              </a>
              <a
                href="#fleet"
                className="inline-flex min-h-11 sm:min-h-12 w-full items-center justify-center gap-2 rounded-control border border-white/20 bg-white/10 px-6 py-2.5 sm:py-4 text-sm sm:text-base font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-white/50 hover:bg-white/20 hover:-translate-y-0.5 sm:w-auto text-center"
              >
                Explore Fleet
              </a>
            </m.div>

            {/* ── 6. Compact Trust Indicators ── */}
            {/* Mobile: Horizontal compact inline strip */}
            <m.div
              className="mt-3.5 flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 text-xs text-white/80 font-medium lg:hidden"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-accent shrink-0" />
                <span>Maruti Suzuki Fleet</span>
              </span>
              <span className="text-white/30" aria-hidden>•</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-accent shrink-0" />
                <span>3 Pune Branches</span>
              </span>
              <span className="text-white/30" aria-hidden>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-3.5 text-accent shrink-0" />
                <span>WhatsApp Confirmation</span>
              </span>
            </m.div>

            {/* Desktop: Vertical list */}
            <m.ul
              className="hidden lg:flex flex-col gap-3 mt-12"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {trustBadges.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 text-sm text-white/85"
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
