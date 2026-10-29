"use client";

import { useRef, useCallback } from "react";

/**
 * Returns an onPointerMove + onPointerLeave handler pair that apply a 3D tilt
 * transform directly on the element ref via inline style (no new deps required).
 * Disabled on touch-only devices via pointer media query.
 */
export function useMouseTilt(maxDeg = 8) {
  const ref = useRef<HTMLElement | null>(null);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      // Only apply on devices with a fine pointer (mouse/trackpad)
      if (e.pointerType === "touch") return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rx = -dy * maxDeg;
      const ry = dx * maxDeg;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    },
    [maxDeg],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
