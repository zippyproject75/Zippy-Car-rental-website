"use client";

import { Car, CheckCircle2, MapPin, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

const staggerClasses = ["stagger-1", "stagger-2", "stagger-3", "stagger-4"] as const;

export function TrustStrip() {
  const t = useTranslations("TrustStrip");

  const benefits = [
    {
      icon: Car,
      title: t("benefits.1.title"),
      body: t("benefits.1.body"),
    },
    {
      icon: CheckCircle2,
      title: t("benefits.2.title"),
      body: t("benefits.2.body"),
    },
    {
      icon: MapPin,
      title: t("benefits.3.title"),
      body: t("benefits.3.body"),
    },
    {
      icon: MessageCircle,
      title: t("benefits.4.title"),
      body: t("benefits.4.body"),
    },
  ];

  return (
    <section
      aria-label="Why choose Zippy"
      className="border-y border-line bg-raised"
    >
      <div className="container-site py-12 sm:py-16">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className={`flex gap-4 scroll-reveal ${staggerClasses[i]}`}
            >
              <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-muted transition-[border-color,background-color] duration-300 group-hover:border-accent/30">
                <Icon aria-hidden className="size-5 text-accent-ink" />
              </div>
              <div>
                <h3 className="font-display text-[0.9375rem] font-bold text-ink">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-3">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
