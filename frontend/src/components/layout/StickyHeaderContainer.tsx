"use client";

import { useEffect, useState, type ReactNode } from "react";

interface StickyHeaderContainerProps {
  topStrip: ReactNode;
  children: ReactNode;
}

export function StickyHeaderContainer({ topStrip, children }: StickyHeaderContainerProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-canvas/95 backdrop-blur-md transition-colors pt-[env(safe-area-inset-top)] shadow-xs">
      {/* Top trust strip (desktop) */}
      <div className="hidden border-b border-line/60 bg-muted/40 py-1 text-[0.75rem] text-ink-3 sm:block">
        {topStrip}
      </div>

      {/* Main navigation bar */}
      <div className="container-site flex h-[4.25rem] sm:h-[4.5rem] items-center justify-between gap-1.5 sm:gap-4 px-2.5 sm:px-4">
        {children}
      </div>
    </header>
  );
}

