"use client";

import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

const WA_NUMBER = "919921208410";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Floating WA button on mobile — always visible */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Zippy! I'd like to enquire about self-drive car rental in Pune.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Zippy on WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95 sm:hidden"
        style={{ background: "#25D366" }}
      >
        <MessageCircle aria-hidden className="size-6 fill-white text-white" />
      </a>

      {/* Desktop tooltip pill */}
      {showTooltip && !dismissed && (
        <div className="fixed bottom-6 right-6 z-50 hidden items-center gap-3 rounded-2xl border border-line bg-raised px-4 py-3 shadow-raised sm:flex animate-in fade-in slide-in-from-bottom-2 duration-200">
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Zippy! I'd like to enquire about self-drive car rental in Pune.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 font-semibold text-ink hover:text-accent-ink"
          >
            <span
              className="flex size-8 items-center justify-center rounded-full"
              style={{ background: "#25D366" }}
            >
              <MessageCircle
                aria-hidden
                className="size-4 fill-white text-white"
              />
            </span>
            <span className="text-sm font-semibold">Chat on WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss WhatsApp prompt"
            className="ml-1 flex size-6 items-center justify-center rounded-full text-ink-3 hover:text-ink hover:bg-muted"
          >
            <X aria-hidden className="size-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
