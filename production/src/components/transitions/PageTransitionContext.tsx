"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface PageTransitionContextValue {
  isTransitioning: boolean;
  startTransition: (href: string) => void;
  closeTransition: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    throw new Error("usePageTransition must be used within a PageTransitionProvider");
  }
  return ctx;
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const prevPathRef = useRef(pathname);
  const watchdogTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear watchdog timer
  const clearTimers = useCallback(() => {
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    if (navigateTimerRef.current) {
      clearTimeout(navigateTimerRef.current);
      navigateTimerRef.current = null;
    }
  }, []);

  const closeTransition = useCallback(() => {
    clearTimers();
    setIsTransitioning(false);
  }, [clearTimers]);

  // Route change completion listener
  useEffect(() => {
    const hasPathChanged = pathname !== prevPathRef.current;

    if (hasPathChanged) {
      prevPathRef.current = pathname;

      // Small delay on arrival to smoothly dissolve overlay and introduce new page
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        clearTimers();
      }, 140);

      return () => clearTimeout(timer);
    }
  }, [pathname, clearTimers]);

  // Programmatic transition trigger
  const startTransition = useCallback(
    (href: string) => {
      // Check for reduced motion
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        router.push(href);
        return;
      }

      clearTimers();
      setIsTransitioning(true);

      // Transition exit duration before routing
      navigateTimerRef.current = setTimeout(() => {
        router.push(href);
      }, 200);

      // Watchdog safety: Ensure overlay never hangs if navigation is cancelled or stalled
      watchdogTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 1500);
    },
    [router, clearTimers],
  );

  // Global delegated click listener across entire website
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Only handle primary (left) button clicks
      if (e.button !== 0) return;

      // Ignore if modified keys are pressed (open in new tab/window)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      // Find closest anchor tag
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      // Ignore if marked to opt out
      if (anchor.hasAttribute("data-no-transition") || anchor.getAttribute("download") !== null) {
        return;
      }

      // Ignore external tabs
      if (anchor.target && anchor.target !== "_self") return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      // Ignore non-navigation protocols
      if (
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("javascript:") ||
        rawHref.includes("wa.me") ||
        rawHref.includes("whatsapp.com")
      ) {
        return;
      }

      // Ignore pure hash links on the current page (e.g., #enquiry, #fleet)
      if (rawHref.startsWith("#")) {
        return;
      }

      // Parse target URL
      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(anchor.href, window.location.href);

        // Check if different origin
        if (targetUrl.origin !== currentUrl.origin) return;

        // Check if same pathname and search (only hash changed)
        if (
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search
        ) {
          // In-page anchor navigation: let browser perform native smooth scroll
          return;
        }

        // Prevent immediate hard jump; trigger animated transition
        e.preventDefault();
        const destination = targetUrl.pathname + targetUrl.search + targetUrl.hash;
        startTransition(destination);
      } catch {
        // Fallback to native navigation if URL parsing fails
      }
    };

    // Attach to document with capture to intercept before other handlers
    document.addEventListener("click", handleClick, { capture: false });

    // Handle browser back/forward buttons
    const handlePopState = () => {
      clearTimers();
      setIsTransitioning(false);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
      clearTimers();
    };
  }, [startTransition, clearTimers]);

  return (
    <PageTransitionContext.Provider
      value={{
        isTransitioning,
        startTransition,
        closeTransition,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}
