import { CarFront, CalendarDays, MessageCircle, CheckCircle2, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEP_ICONS: LucideIcon[] = [CarFront, CalendarDays, MessageCircle, CheckCircle2];

export async function HowItWorks({ withHeading = true }: { withHeading?: boolean }) {
  const t = await getTranslations("Home");
  const steps = (["1", "2", "3", "4"] as const).map((n, i) => ({
    n,
    Icon: STEP_ICONS[i]!,
    title: t(`steps.${n}.title`),
    body: t(`steps.${n}.body`),
  }));
  return (
    <div className="space-y-10">
      {withHeading ? (
        <SectionHeading eyebrow={t("howEyebrow")} title={t("howTitle")} />
      ) : null}
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
            <li
              key={s.n}
              className="relative flex flex-col gap-4 rounded-card border border-line bg-raised p-6 transition-[border-color] hover:border-line-strong"
            >
              {/* Connector line (desktop) */}
              {i < 3 && (
                <div
                  aria-hidden
                  className="absolute -right-2.5 top-10 hidden h-px w-5 bg-line lg:block"
                />
              )}
              {/* Step number + icon */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                  <s.Icon aria-hidden className="size-5 text-accent-ink" />
                </div>
                <span className="font-display text-xs font-bold tabular-nums text-accent-ink opacity-70">
                  Step 0{s.n}
                </span>
              </div>
              {/* Accent bar */}
              <span aria-hidden className="h-0.5 w-8 rounded-full bg-accent" />
              <h3 className="font-display text-[1.0625rem] font-bold text-ink">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-2">{s.body}</p>
            </li>
          ))}
      </ol>
    </div>
  );
}
