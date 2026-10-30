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
      } bg-[#07080a] text-white dark:bg-[#07080a]`}
      style={{
        background:
          "radial-gradient(circle at center, #12141a 0%, #07080a 65%, #030405 100%)",
      }}
    >
      {/* ── Soft Ambient Gold Backlight Glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute size-56 sm:size-64 rounded-full blur-3xl opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(212,179,115,0.45) 0%, rgba(201,166,96,0.15) 50%, transparent 70%)",
        }}
      />

      {/* ── Central Branded Loading Stage ── */}
      <div
        className={`relative flex flex-col items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isTransitioning ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Ring & Logo Housing */}
        <div className="relative flex size-36 sm:size-40 items-center justify-center">
          {/* Continuous Rotating Metallic Gold Ring (Matching Reference Image 1) */}
          <svg
            viewBox="0 0 160 160"
            className="size-full animate-spin-ring drop-shadow-[0_0_18px_rgba(212,179,115,0.35)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Premium Multi-Stop Metallic Gold Gradient */}
              <linearGradient id="goldMetallicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4b373" />
                <stop offset="20%" stopColor="#fff4d4" />
                <stop offset="45%" stopColor="#c9a660" />
                <stop offset="70%" stopColor="#9e7b39" />
                <stop offset="85%" stopColor="#ffebad" />
                <stop offset="100%" stopColor="#d4b373" />
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
              r="62"
              stroke="rgba(212,179,115,0.12)"
              strokeWidth="12"
            />

            {/* Glowing Metallic Gold Ring */}
            <circle
              cx="80"
              cy="80"
              r="62"
              stroke="url(#goldMetallicGrad)"
              strokeWidth="13"
              strokeLinecap="round"
              filter="url(#goldGlow)"
            />

            {/* High-Velocity Specular Rim Highlight */}
            <circle
              cx="80"
              cy="80"
              r="62"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="45 340"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>

          {/* Centered Official Zippy Emblem with Gentle Breathing Pulse */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image
              src="/zippy_main_logo.png"
              alt="Zippy Car Rental"
              width={64}
              height={44}
              className="h-10 w-auto object-contain drop-shadow-[0_2px_12px_rgba(212,179,115,0.35)] animate-pulse-gentle"
              priority
            />
          </div>
        </div>

        {/* ── Brand Typography ── */}
        <div className="mt-6 flex flex-col items-center text-center">
          <span className="font-display text-sm sm:text-base font-extrabold tracking-[0.24em] text-white">
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

