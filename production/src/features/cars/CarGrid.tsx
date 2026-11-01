"use client";

import { useState, useRef, useEffect } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import type { Car } from "@/types/car";
import { CarCard } from "./CarCard";

type FilterId = "all" | "compact-suv" | "hatchback" | "mpv";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All Cars" },
  { id: "compact-suv", label: "SUVs" },
  { id: "hatchback", label: "Hatchback" },
  { id: "mpv", label: "MPVs" },
];

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function CarGrid({
  cars,
  headingLevel,
  showFilters = false,
}: {
  cars: readonly Car[];
  headingLevel?: "h2" | "h3";
  showFilters?: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const prefersReducedMotion = useReducedMotion();
  const gridRef = useRef<HTMLUListElement>(null);
  const [isVisible, setIsVisible] = useState(
    typeof IntersectionObserver === "undefined"
  );

  // IntersectionObserver for reliable scroll triggering on mobile
  useEffect(() => {
    const element = gridRef.current;
    if (!element || prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05, rootMargin: "-5%" }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion, activeFilter]);

  const filtered =
    activeFilter === "all"
      ? cars
      : cars.filter(
          (c) =>
            c.specs.bodyType.status === "confirmed" &&
            c.specs.bodyType.value === activeFilter,
        );

  const getCount = (id: FilterId) => {
    if (id === "all") return cars.length;
    return cars.filter(
      (c) =>
        c.specs.bodyType.status === "confirmed" &&
        c.specs.bodyType.value === id,
    ).length;
  };

  return (
    <LazyMotion features={domAnimation}>
      <div>
        {/* Category filter pills */}
        {showFilters && (
          <div
            className="mb-8 flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter cars by vehicle category"
          >
            {FILTERS.map((f) => {
              const count = getCount(f.id);
              if (count === 0 && f.id !== "all") return null;
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  aria-pressed={active}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-focus ${
                    active
                      ? "bg-accent text-on-accent shadow-sm scale-[1.03]"
                      : "border border-line bg-raised text-ink-2 hover:border-line-strong hover:bg-muted hover:text-ink hover:scale-[1.02]"
                  }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[0.6875rem] font-bold ${
                      active ? "bg-black/20 text-on-accent" : "bg-muted text-ink-3"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Staggered grid of cars */}
        <m.ul
          ref={gridRef}
          className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          data-testid="car-grid"
          key={activeFilter}
          variants={prefersReducedMotion ? undefined : listVariants}
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={isVisible ? "visible" : "hidden"}
        >
          {filtered.map((car) => (
            <m.li
              key={car.id}
              className="flex"
              variants={prefersReducedMotion ? undefined : itemVariants}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <CarCard car={car} headingLevel={headingLevel} />
            </m.li>
          ))}
        </m.ul>

        {filtered.length === 0 && (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-line bg-muted/30 text-center p-8">
            <p className="text-sm font-medium text-ink-3">No vehicles currently available in this category.</p>
          </div>
        )}
      </div>
    </LazyMotion>
  );
}
