"use client";

import { LazyMotion, domAnimation, m } from "motion/react";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
  className?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className,
  once = true,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          x: direction === "left" ? -24 : direction === "right" ? 24 : 0,
          y: direction === "up" ? 24 : 0,
        },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-10%" }}
        variants={variants}
        transition={{
          duration: prefersReducedMotion ? 0.01 : 0.6,
          delay: prefersReducedMotion ? 0 : delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
