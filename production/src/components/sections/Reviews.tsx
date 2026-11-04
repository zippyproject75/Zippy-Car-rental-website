"use client";

import { Clock, MapPin, FileText, Info } from "lucide-react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function Reviews() {
  const t = useTranslations("RentalProcess");
  const prefersReducedMotion = useReducedMotion();

  const processSteps = [
    {
      id: "vehicle-selection",
      icon: <Clock aria-hidden className="size-5 text-accent-ink" />,
      title: t("vehicleSelection.title"),
      description: t("vehicleSelection.description"),
    },
    {
      id: "package-understanding",
      icon: <FileText aria-hidden className="size-5 text-accent-ink" />,
      title: t("packageUnderstanding.title"),
      description: t("packageUnderstanding.description"),
    },
    {
      id: "pickup-arrangements",
      icon: <MapPin aria-hidden className="size-5 text-accent-ink" />,
      title: t("pickupArrangements.title"),
      description: t("pickupArrangements.description"),
    },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <section aria-labelledby="rental-process-title" className="border-t border-line bg-canvas">
        <div className="container-site py-16 sm:py-20 lg:py-24">
          {/* Section Heading */}
          <m.div
            className="mb-10 flex flex-col gap-3 sm:mb-14"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">{t("eyebrow")}</p>
              <h2
                id="rental-process-title"
                className="font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl"
              >
                {t("title")}
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
                {t("subtitle")}
              </p>
            </div>
          </m.div>

          {/* Process cards with staggered reveal */}
          <m.div
            className="grid gap-6 md:grid-cols-3"
            initial={prefersReducedMotion ? undefined : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "visible"}
            viewport={{ once: true, margin: "-8%" }}
            variants={prefersReducedMotion ? undefined : {
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
            }}
          >
            {processSteps.map((step) => (
              <m.article
                key={step.id}
                variants={prefersReducedMotion ? undefined : cardVariants}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col rounded-card border border-line bg-raised p-6 shadow-raised transition-[border-color,transform] hover:border-line-strong hover:-translate-y-1"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent/15 border border-accent/30">
                  {step.icon}
                </div>
                <h3 className="font-display text-base font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">
                  {step.description}
                </p>
              </m.article>
            ))}
          </m.div>

          {/* Additional information card */}
          <m.div
            className="mt-8 rounded-card border border-line bg-muted/40 p-5 sm:p-8"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-xl bg-ink/5 border border-line flex items-center justify-center shrink-0 mt-0.5">
                <Info aria-hidden className="size-5 text-ink-2" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-ink">
                  {t("confirmationNote.title")}
                </h4>
                <p className="mt-1 text-sm text-ink-2 max-w-xl">
                  {t("confirmationNote.description")}
                </p>
              </div>
            </div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
