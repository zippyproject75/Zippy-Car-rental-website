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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  /* ── Video Autoplay Guarantee ── */
  useEffect(() => {
    if (videoRef.current && !prefersReducedMotion) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoLoaded(true))
          .catch(() => {
            // Browser autoplay policy handled safely
          });
      }
    }
  }, [prefersReducedMotion]);

  /* ── Scroll parallax ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgParallaxY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 35]);

  /* ── Interactive chase-camera perspective tilt on mouse move ── */
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
    // Gentle 3D perspective shift (up to ±3 deg)
    mouseX.set(((e.clientX - cx) / (rect.width / 2)) * 3);
    mouseY.set(((e.clientY - cy) / (rect.height / 2)) * -2);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={sectionRef}
        aria-labelledby="hero-title"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative w-full min-h-[92vh] lg:min-h-[96vh] overflow-hidden bg-[#07080a] text-white flex items-center"
      >
        {/* ── 1. AUTHENTIC HIGHWAY DRIVING VIDEO LAYER ── */}
        <m.div
          className="absolute inset-0 size-full pointer-events-none select-none overflow-hidden"
          style={{
            y: bgParallaxY,
            rotateX: cameraTiltY,
            rotateY: cameraTiltX,
            transformStyle: "preserve-3d",
            perspective: 1200,
          }}
        >
          {/* Static high-res fallback poster image when reduced-motion is active */}
          {prefersReducedMotion ? (
            <Image
              src="/images/hero-highway-perfect.jpg"
              alt="Cinematic Pune Highway Sunset with Zippy Car Rental"
              fill
              priority
              quality={96}
              className="object-cover object-[72%_center] sm:object-center select-none"
              sizes="100vw"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/images/hero-highway-perfect.jpg"
              onLoadedData={() => setVideoLoaded(true)}
              className="size-full object-cover object-[72%_center] sm:object-center select-none transition-opacity duration-700"
              style={{ opacity: videoLoaded ? 1 : 0.9 }}
            >
              <source src="/videos/zippy-hero-driving.mp4" type="video/mp4" />
            </video>
          )}

          {/* Left-side cinematic vignette ensuring 100% crisp typography contrast without touching the vehicle or sunset */}
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

        {/* ── 2. BRAND 'Z' WATERMARK IN SKY ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-4 sm:top-8 right-6 sm:right-12 select-none font-display text-[12rem] sm:text-[16rem] lg:text-[20rem] font-black text-white/[0.04] leading-none tracking-tighter"
        >
          Z
        </div>

        {/* ── 3. LEFT-ALIGNED TYPOGRAPHY & CALL-TO-ACTIONS ── */}
        <div className="container-site relative z-20 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            {/* Pill Eyebrow Badge */}
            <m.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-black/60 px-4 py-1.5 backdrop-blur-md shadow-sm"
            >
              <Sparkles aria-hidden className="size-3.5 text-accent" />
              <span className="text-[0.6875rem] sm:text-xs font-bold tracking-[0.18em] uppercase text-accent">
                PUNE&apos;S PREMIER SELF-DRIVE SERVICE
              </span>
            </m.div>

            {/* Main Headline */}
            <h1
              id="hero-title"
              className="font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-white"
            >
              <m.span
                className="block"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                Drive Pune
              </m.span>
              <m.span
                className="text-accent underline decoration-accent/40 decoration-wavy underline-offset-8 inline-block"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                on your terms.
              </m.span>
            </h1>

            {/* Supporting Copy */}
            <m.p
              className="mt-6 max-w-xl text-sm sm:text-base lg:text-[1.0625rem] leading-relaxed text-white/85 font-normal"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              Premium self-drive Maruti Suzuki cars ready for your journey across Pune and Maharashtra.
              Direct WhatsApp pricing and instant availability confirmation — no middleman, transparent rates.
            </m.p>

            {/* Action Buttons */}
            <m.div
              className="mt-8 sm:mt-10 flex flex-col gap-3.5 sm:flex-row sm:gap-4"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href="#enquiry"
                className={buttonClass(
                  "primary",
                  "lg",
                  "w-full justify-center sm:w-auto gap-2.5 bg-accent text-[#07080a] font-bold text-base px-8 py-4 hover:bg-accent-hover shadow-xl shadow-accent/25 transition-transform duration-200 hover:-translate-y-0.5",
                )}
              >
                <span>Plan My Rental</span>
                <ArrowRight aria-hidden className="size-5" />
              </a>
              <a
                href="#fleet"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-control border border-white/25 bg-white/10 px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-white/50 hover:bg-white/20 hover:-translate-y-0.5 sm:w-auto"
              >
                Explore Fleet
              </a>
            </m.div>

            {/* Feature / Trust Bullet Points */}
            <m.ul
              className="mt-10 sm:mt-12 flex flex-col gap-3"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {trustBadges.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-white/85"
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
