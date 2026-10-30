import { useTranslations } from "next-intl";

export function DoorstepDelivery() {
  const t = useTranslations("DoorstepDelivery");

  return (
    <section
      id="doorstep-delivery"
      aria-labelledby="doorstep-delivery-title"
      className="scroll-mt-20 border-b border-line bg-canvas"
    >
      <div className="container-site py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-2 sm:mb-3">{t("eyebrow")}</p>
            <h2
              id="doorstep-delivery-title"
              className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl"
            >
              {t("title")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              {t("intro")}
            </p>
          </div>

          <div className="lg:self-center space-y-6">
            <div className="rounded-xl border border-line bg-raised p-6 shadow-raised">
              <h3 className="font-bold text-lg text-ink mb-2">
                {t("beyond3km")}
              </h3>
              <p className="text-sm leading-relaxed text-ink-2">
                {t("beyond3kmIntro")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
