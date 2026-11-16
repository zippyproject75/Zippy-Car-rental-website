"use client";

import { useEffect, useState, type ReactNode } from "react";

interface StickyHeaderContainerProps {
  topStrip: ReactNode;
  children: ReactNode;
}

export function StickyHeaderContainer({ topStrip, children }: StickyHeaderContainerProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pt-[env(safe-area-inset-top)] ${
        scrolled
          ? "border-b border-line/90 bg-canvas/95 backdrop-blur-xl shadow-md shadow-black/10 dark:shadow-black/35 py-0"
          : "border-b border-line bg-canvas/92 backdrop-blur-md shadow-none"
      }`}
    >
      {/* Top trust strip: collapses smoothly when scrolling to optimize viewport real estate */}
      <div
        className={`hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:block ${
          scrolled
            ? "max-h-0 opacity-0 py-0 border-transparent pointer-events-none"
            : "max-h-12 opacity-100 border-b border-line/60 bg-muted/40 py-1"
        }`}
      >
        {topStrip}
      </div>

      {/* Main navigation bar: transitions height smoothly from 4.5rem to 3.75rem when scrolled */}
      <div
        className={`container-site flex items-center justify-between gap-1.5 sm:gap-4 px-2.5 sm:px-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? "h-14 sm:h-16" : "h-[4.25rem] sm:h-[4.5rem]"
        }`}
      >
        {children}
      </div>
    </header>
  );
}

