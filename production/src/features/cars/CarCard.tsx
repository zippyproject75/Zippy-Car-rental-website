import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Link } from "@/i18n/navigation";
import { env } from "@/lib/env";
import type { Car } from "@/types/car";
import { CarMedia } from "./CarMedia";
import { PriceLine } from "./PriceBlock";
import { useSpecValue } from "./SpecList";
import { getPublicSpecs } from "./specs";

export function carLabel(car: Car, unitText: (unit: number) => string): string {
  return car.unitNumber ? `${car.displayName} — ${unitText(car.unitNumber)}` : car.displayName;
}

export function CarCard({ car, headingLevel = "h3" }: { car: Car; headingLevel?: "h2" | "h3" }) {
  const t = useTranslations();
  const format = useSpecValue();
  const Heading = headingLevel;
  const fullName = carLabel(car, (unit) => t("Common.vehicleUnit", { unit }));
  const specs = getPublicSpecs(car, env.showPendingContent).slice(0, 3);

  return (
    <article
      data-testid="car-card"
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-raised transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong focus-within:border-line-strong"
    >
      <Link href={`/cars/${car.slug}`} tabIndex={-1} aria-hidden className="block">
        <CarMedia car={car} />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-ink-3 uppercase">{car.make}</p>
          <Heading className="mt-1 font-display text-xl font-bold tracking-[-0.01em] text-ink">
            {car.model}
            {car.unitNumber ? (
              <span className="ml-2 align-middle text-sm font-semibold text-accent-ink">
                {t("Common.vehicleUnit", { unit: car.unitNumber })}
              </span>
            ) : null}
          </Heading>
        </div>
        {specs.length ? (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2">
            {specs.map((s) => (
              <li key={s.key}>{format(s)}</li>
            ))}
          </ul>
        ) : null}
        <PriceLine carId={car.id} className="mt-auto" />
        <div className="grid grid-cols-2 gap-2 border-t border-line pt-4">
          <ButtonLink
            href={`/cars/${car.slug}`}
            variant="secondary"
            size="sm"
            aria-label={t("Fleet.viewDetailsFor", { car: fullName })}
          >
            {t("Fleet.viewDetails")}
          </ButtonLink>
          <ButtonLink
            href={{ pathname: "/book", query: { car: car.slug } }}
            size="sm"
            aria-label={t("Fleet.enquireFor", { car: fullName })}
          >
            {t("Fleet.enquire")}
            <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
