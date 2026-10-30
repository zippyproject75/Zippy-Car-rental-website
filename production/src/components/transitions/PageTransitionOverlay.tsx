"use client";

import Image from "next/image";
import { usePageTransition } from "./PageTransitionContext";
import { useMounted } from "@/components/layout/useMounted";

export function PageTransitionOverlay() {
  const { isTransitioning } = usePageTransition();
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div
      aria-hidden={!isTransitioning}
      aria-live="polite"
      role="status"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isTransitioning
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } bg-[#040507] text-white dark:bg-[#040507]`}
      style={{
        background:
          "radial-gradient(circle at center, #0e1017 0%, #06070a 60%, #020304 100%)",
      }}
    >
      {/* ── Soft Ambient Gold Backlight Glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute size-64 sm:size-72 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(229,189,86,0.35) 0%, rgba(201,150,50,0.12) 50%, transparent 70%)",
        }}
      />

      {/* ── Central Branded Loading Stage ── */}
      <div
        className={`relative flex flex-col items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isTransitioning ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Ring & Logo Housing */}
        <div className="relative flex size-40 sm:size-44 items-center justify-center">
          {/* Continuous Rotating Metallic Gold Ring (Matching Exact Proportions & Sheen of Reference Image 1) */}
          <svg
            viewBox="0 0 160 160"
            className="size-full animate-spin-ring drop-shadow-[0_0_24px_rgba(212,175,85,0.4)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Premium Multi-Stop Metallic Gold Gradient */}
              <linearGradient id="goldMetallicGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7a5318" />
                <stop offset="15%" stopColor="#b4832c" />
                <stop offset="32%" stopColor="#dfb256" />
                <stop offset="50%" stopColor="#fff8e7" />
                <stop offset="68%" stopColor="#f3cb69" />
                <stop offset="85%" stopColor="#c79940" />
                <stop offset="100%" stopColor="#6e4912" />
              </linearGradient>

              {/* Soft Ring Glow Filter */}
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Track Guide */}
            <circle
              cx="80"
              cy="80"
              r="58"
              stroke="rgba(212,175,85,0.1)"
              strokeWidth="26"
            />

            {/* Glowing Solid Metallic Gold Torus Ring (Matching Reference Image 1) */}
            <circle
              cx="80"
              cy="80"
              r="58"
              stroke="url(#goldMetallicGrad)"
              strokeWidth="26"
              filter="url(#goldGlow)"
            />

            {/* Crisp Outer Bevel Rim */}
            <circle
              cx="80"
              cy="80"
              r="70.5"
              stroke="rgba(255,248,220,0.4)"
              strokeWidth="1"
            />

            {/* Crisp Inner Bevel Rim */}
            <circle
              cx="80"
              cy="80"
              r="45.5"
              stroke="rgba(255,248,220,0.35)"
              strokeWidth="1"
            />

            {/* High-Velocity Specular Rim Highlight Arc */}
            <circle
              cx="80"
              cy="80"
              r="58"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="50 310"
              strokeLinecap="round"
              opacity="0.92"
            />
          </svg>

          {/* Centered Official Zippy Emblem with Gentle Breathing Pulse */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image
              src="/zippy_main_logo.png"
              alt="Zippy Car Rental"
              width={54}
              height={36}
              className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_14px_rgba(212,175,85,0.4)] animate-pulse-gentle"
              priority
            />
          </div>
        </div>

        {/* ── Brand Typography ── */}
        <div className="mt-6 flex flex-col items-center text-center">
          <span className="font-display text-sm sm:text-base font-extrabold tracking-[0.26em] text-white">
            ZIPPY CAR RENTAL
          </span>
          <span className="mt-1.5 text-[0.6875rem] font-semibold tracking-[0.28em] text-accent uppercase">
            PREMIER SELF-DRIVE · PUNE
          </span>

          {/* Subtle micro-progress indicator bar */}
          <div className="mt-4 h-0.5 w-24 overflow-hidden rounded-full bg-white/10">
            <div className="size-full animate-gold-shimmer rounded-full bg-gradient-to-r from-transparent via-accent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
