"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { usePageTransition } from "./PageTransitionContext";

export function PageContentWrapper({ children }: { children: ReactNode }) {
  const { isTransitioning } = usePageTransition();
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className={`size-full animate-page-enter transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isTransitioning ? "opacity-85 scale-[0.992] pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {children}
    </div>
  );
}
