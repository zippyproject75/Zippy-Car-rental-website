import { ArrowRight, CarFront, KeyRound, MapPin, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ENQUIRY_PATH } from "@/data/navigation";
import { getCars } from "@/lib/catalog";
import { env } from "@/lib/env";

/** Cinematic, CSS-only automotive composition. Replaced by real photography when supplied. */
async function HeroMedia() {
  const t = await getTranslations();
  const cars = getCars();
  return (
    <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[5/4] w-full overflow-hidden rounded-card border border-line bg-sunken shadow-raised">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_34%,rgb(212_179_115/0.28),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-[34%] h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
      />
      {/* Road surface receding to the horizon */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[66%] bg-gradient-to-b from-[#19191c] to-[#26262a] [clip-path:polygon(44%_0,56%_0,100%_100%,0_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[66%] bg-accent/45 [clip-path:polygon(43.8%_0,44.1%_0,3%_100%,0_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[66%] bg-accent/45 [clip-path:polygon(55.9%_0,56.2%_0,100%_100%,97%_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[66%] bg-[repeating-linear-gradient(to_top,var(--accent)_0_22px,transparent_22px_46px)] opacity-80 [clip-path:polygon(49.85%_0,50.15%_0,51.2%_100%,48.8%_100%)] [mask-image:linear-gradient(to_top,black,transparent)]"
      />
      <div className="absolute inset-x-0 bottom-0 border-t border-line bg-canvas/90 p-3.5 sm:p-5">
        <p className="eyebrow mb-2 text-[0.6875rem]!">{t("Hero.fleetIndex")}</p>
        <ol className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm text-ink-2 sm:grid-cols-3">
          {cars.map((car, i) => (
            <li key={car.id} className="flex items-baseline gap-1.5 sm:gap-2 tabular-nums">
              <span className="text-xs text-accent-ink font-semibold">{String(i + 1).padStart(2, "0")}</span>
              <span className="truncate text-ink font-medium">
                {car.model}
                {car.unitNumber ? ` · ${car.unitNumber}` : ""}
              </span>
            </li>
          ))}
        </ol>
      </div>
      {env.showPendingContent ? (
        <p className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xs font-medium text-ink-3">
          {t("Hero.mediaCaption")}
        </p>
      ) : null}
    </div>
  );
}

export async function Hero() {
  const t = await getTranslations();
  const facts = [
    { icon: CarFront, label: t("Home.facts.selfDrive") },
    { icon: KeyRound, label: t("Home.facts.fleet") },
    { icon: MapPin, label: t("Home.facts.city") },
    { icon: ShieldCheck, label: t("Home.facts.confirm") },
  ];
  return (
    <section
      aria-labelledby="hero-title"
      className="relative w-full overflow-hidden bg-canvas text-ink"
    >
      <div aria-hidden className="cinema-stage absolute inset-0" />
      <div className="container-site relative grid gap-8 pt-8 pb-24 sm:gap-12 sm:pt-14 sm:pb-32 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pt-20 lg:pb-40">
        <div className="motion-safe:animate-rise w-full">
          <p className="eyebrow">{t("Hero.eyebrow")}</p>
          <h1
            id="hero-title"
            className="mt-3.5 sm:mt-5 font-display text-[2.15rem] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink sm:text-5xl lg:text-[4.25rem]"
          >
            {t("Hero.titleLead")} <span className="text-accent">{t("Hero.titleAccent")}</span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed text-ink-2">
            {t("Hero.subtitle")}
          </p>
          <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
            <ButtonLink
              href={ENQUIRY_PATH}
              size="lg"
              className="w-full sm:w-auto justify-center"
            >
              {t("Hero.primaryCta")}
              <ArrowRight aria-hidden className="size-4 sm:size-5" />
            </ButtonLink>
            <ButtonLink
              href="/cars"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto justify-center"
            >
              {t("Hero.secondaryCta")}
            </ButtonLink>
          </div>
          <ul className="mt-8 sm:mt-12 grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 border-t border-line pt-5 sm:pt-6 text-xs sm:text-sm text-ink-2">
            {facts.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-2 sm:gap-2.5">
                <Icon aria-hidden className="mt-0.5 size-3.5 sm:size-4 shrink-0 text-accent-ink" />
                <span className="leading-snug">{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <HeroMedia />
      </div>
    </section>
  );
}
