import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function HowItWorks({ withHeading = true }: { withHeading?: boolean }) {
  const t = await getTranslations("Home");
  const steps = (["1", "2", "3", "4"] as const).map((n) => ({
    n,
    title: t(`steps.${n}.title`),
    body: t(`steps.${n}.body`),
  }));
  return (
    <div className="space-y-10">
      {withHeading ? <SectionHeading eyebrow={t("howEyebrow")} title={t("howTitle")} /> : null}
      <ol className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} className="relative bg-raised p-6">
            <span aria-hidden className="absolute inset-x-6 top-0 h-0.5 bg-accent" />
            <p className="font-display text-sm font-bold tabular-nums text-accent-ink">0{s.n}</p>
            <h3 className="mt-4 font-display text-lg font-bold text-ink">{s.title}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
