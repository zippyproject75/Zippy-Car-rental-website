import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ENQUIRY_PATH } from "@/data/navigation";

export async function CtaBand() {
  const t = await getTranslations("Home");
  return (
    <section aria-labelledby="cta-title" className="scheme-dark bg-canvas text-ink">
      <div className="container-site relative overflow-hidden py-20 lg:py-24">
        <div
          aria-hidden
          className="absolute top-0 left-5 h-px w-24 bg-accent sm:left-6 lg:left-8"
        />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2
              id="cta-title"
              className="font-display text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl"
            >
              {t("ctaTitle")}
            </h2>
            <p className="mt-4 text-lg text-ink-2">{t("ctaBody")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={ENQUIRY_PATH} size="lg">
              {t("ctaPrimary")}
              <ArrowRight aria-hidden className="size-5" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" size="lg">
              {t("ctaSecondary")}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
