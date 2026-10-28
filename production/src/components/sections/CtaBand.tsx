import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ENQUIRY_PATH } from "@/data/navigation";

export async function CtaBand() {
  const t = await getTranslations("Home");
  return (
    <section aria-labelledby="cta-title" className="bg-canvas text-ink">
      <div className="container-site relative overflow-hidden py-20 lg:py-28">
        {/* Decorative accent line */}
        <div
          aria-hidden
          className="absolute left-4 top-0 h-px w-20 bg-accent sm:left-6 lg:left-8"
        />
        {/* Decorative background accent glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--accent), transparent)" }}
        />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Get started</p>
            <h2
              id="cta-title"
              className="font-display text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl"
            >
              {t("ctaTitle")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">{t("ctaBody")}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:shrink-0">
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
