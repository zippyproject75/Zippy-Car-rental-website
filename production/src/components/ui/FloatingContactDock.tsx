"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useMounted } from "@/components/layout/useMounted";

const PHONE_NUMBER_DISPLAY = "+91 99212 08410";
const PHONE_NUMBER_TEL = "+919921208410";
const WA_NUMBER = "919921208410";
const WA_MESSAGE = "Hello Zippy! I'd like to enquire about self-drive car rental in Pune.";

/**
 * Fixed vertical contact dock on the LEFT side of the viewport.
 * Houses:
 *  1. Animated Phone Button (opens native dialer via tel:)
 *  2. Animated WhatsApp Button (opens WhatsApp with prefilled enquiry)
 *
 * Requirements satisfied:
 *  - Fixed to left viewport edge throughout the entire page
 *  - Staggered gentle pulse/float animation
 *  - Respects prefers-reduced-motion via CSS
 *  - High-contrast accessible tooltips expanding to the right
 *  - Does not obscure center page content or forms
 */
export function FloatingContactDock() {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <aside
      aria-label="Direct contact options"
      className="fixed bottom-6 right-3.5 sm:left-6 sm:right-auto z-40 flex flex-col items-center gap-3.5 print:hidden select-none pb-[env(safe-area-inset-bottom)]"
    >
      {/* ── BUTTON A: Direct Phone Call ── */}
      <div className="group relative flex items-center">
        <a
          href={`tel:${PHONE_NUMBER_TEL}`}
          aria-label={`Call Zippy Car Rental at ${PHONE_NUMBER_DISPLAY}`}
          className="animate-dock-phone relative flex size-12 sm:size-13 items-center justify-center rounded-full border-2 border-accent bg-[#0d0f17] text-accent shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-[#07080a] hover:border-accent active:scale-95 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
        >
          <Phone aria-hidden className="size-5 sm:size-5.5 transition-transform duration-200 group-hover:scale-110" />
        </a>

        {/* Accessible Tooltip - left on mobile, right on desktop */}
        <div
          role="tooltip"
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-within:opacity-100 hidden sm:flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-line/80 bg-raised/95 px-3 py-1.5 text-xs font-bold text-ink shadow-raised backdrop-blur-md right-full mr-3 sm:left-full sm:mr-0 sm:ml-3"
        >
          <span className="size-1.5 rounded-full bg-accent" />
          <span>Call: {PHONE_NUMBER_DISPLAY}</span>
        </div>
      </div>

      {/* ── BUTTON B: Direct WhatsApp Chat ── */}
      <div className="group relative flex items-center">
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Zippy Car Rental on WhatsApp"
          className="animate-dock-whatsapp relative flex size-12 sm:size-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] active:scale-95 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
        >
          <MessageCircle
            aria-hidden
            className="size-5.5 sm:size-6 fill-white text-white transition-transform duration-200 group-hover:scale-110"
          />
        </a>

        {/* Accessible Tooltip - left on mobile, right on desktop */}
        <div
          role="tooltip"
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-within:opacity-100 hidden sm:flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-line/80 bg-raised/95 px-3 py-1.5 text-xs font-bold text-ink shadow-raised backdrop-blur-md right-full mr-3 sm:left-full sm:mr-0 sm:ml-3"
        >
          <span className="size-1.5 rounded-full bg-[#25D366]" />
          <span>WhatsApp: {PHONE_NUMBER_DISPLAY}</span>
        </div>
      </div>
    </aside>
  );
}

// Backwards-compatible alias for any legacy imports
export { FloatingContactDock as FloatingWhatsApp };
