"use client";

import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver hook for scroll-triggered animations.
 * Falls back gracefully if IntersectionObserver is unavailable.
 * Works reliably on mobile touch devices.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: "-5%" }
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(
    typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          // Optional: unobserve after triggering for one-time animation
          // observer.unobserve(element);
        }
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { ref, isVisible };
}
