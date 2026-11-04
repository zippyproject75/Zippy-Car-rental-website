import { getTranslations } from "next-intl/server";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export async function SimpleFlowChart() {
  const t = await getTranslations("Home");
  const steps = (["1", "2", "3"] as const).map((n) => ({
    n,
    title: t(`steps.${n}.title`),
  }));

  return (
    <div className="container-site py-12 sm:py-16">
      <ScrollReveal>
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:justify-center">
          {steps.map((step, index) => (
            <div key={step.n} className="flex items-center gap-3 sm:gap-4">
              {/* Step circle */}
              <div className="flex items-center justify-center">
                <div className="flex size-16 sm:size-20 items-center justify-center rounded-full border-2 border-accent bg-accent/10 text-accent-ink transition-all hover:scale-110 hover:bg-accent/20">
                  <span className="font-display text-xl sm:text-2xl font-bold">0{step.n}</span>
                </div>
              </div>

              {/* Step text */}
              <div className="text-center">
                <p className="font-display text-sm sm:text-base font-semibold text-ink">
                  {step.title}
                </p>
              </div>

              {/* Arrow between steps (not for last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block">
                  <svg
                    width="40"
                    height="24"
                    viewBox="0 0 40 24"
                    fill="none"
                    className="text-accent/60"
                  >
                    <path
                      d="M1 12H35M35 12L29 6M35 12L29 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
