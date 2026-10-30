import { FileText, Fuel, Shield, UserCheck, MessageCircle } from "lucide-react";
<<<<<<< HEAD
=======
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
>>>>>>> 66cbda335ef48fff6786f18579afd18c2a560795

export async function RentalGuidelines() {
  const t = await getTranslations("RentalGuidelines");

  const GUIDELINES = [
    {
      icon: FileText,
      num: "01",
      title: t("guidelines.1.title"),
      badge: t("guidelines.1.badge"),
      desc: t("guidelines.1.desc"),
    },
    {
      icon: UserCheck,
      num: "02",
      title: t("guidelines.2.title"),
      badge: t("guidelines.2.badge"),
      desc: t("guidelines.2.desc"),
    },
    {
      icon: Shield,
      num: "03",
      title: t("guidelines.3.title"),
      badge: t("guidelines.3.badge"),
      desc: t("guidelines.3.desc"),
    },
    {
      icon: Fuel,
      num: "04",
      title: t("guidelines.4.title"),
      badge: t("guidelines.4.badge"),
      desc: t("guidelines.4.desc"),
    },
  ];

  return (
    <section
      id="guidelines"
      aria-labelledby="guidelines-title"
      className="scroll-mt-20 border-t border-line bg-canvas relative z-10"
    >
      <div className="container-site py-16 sm:py-20 lg:py-24">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">{t("eyebrow")}</p>
          <h2
            id="guidelines-title"
            className="font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink-2">
            {t("subtitle")}
          </p>
        </div>

        {/* 4 Clean Scannable Policy Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDELINES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="group relative flex flex-col justify-between rounded-2xl border border-line bg-raised p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-raised"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-ink transition-colors group-hover:bg-accent group-hover:text-on-accent">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <span className="font-display text-sm font-bold text-ink-3 tabular-nums">
                      {item.num}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-lg font-bold text-ink">
                    {item.title}
                  </h3>
                  <span className="mt-1 inline-block text-[0.6875rem] font-bold uppercase tracking-wider text-accent-ink">
                    {item.badge}
                  </span>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink-2">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 border-t border-line/60 pt-3">
                  <span className="text-[0.6875rem] font-medium text-ink-3">
                    {t("verifiedLabel")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassuring WhatsApp Support Callout */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-line bg-muted/40 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
              <MessageCircle aria-hidden className="size-4.5 fill-white text-white" />
            </span>
            <p className="text-sm font-medium text-ink">
              {t("whatsappPrompt")}
            </p>
          </div>
          <a
            href="https://wa.me/919921208410?text=Hello%20Zippy!%20I'd%20like%20to%20clarify%20the%20rental%20guidelines%20and%20deposit."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-control bg-raised border border-line px-4 py-2.5 text-xs font-bold text-ink hover:border-line-strong hover:bg-canvas transition-colors"
          >
            {t("whatsappCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
