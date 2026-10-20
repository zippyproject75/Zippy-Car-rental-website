import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getCars } from "@/lib/catalog";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations();
  return (
    <div className="container-site py-20 lg:py-28">
      <p className="eyebrow">{t("NotFound.eyebrow")}</p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
        {t("NotFound.title")}
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">{t("NotFound.body")}</p>
      <ul className="mt-8 grid max-w-xl gap-2 sm:grid-cols-2">
        {getCars().map((car) => (
          <li key={car.id}>
            <Link
              href={`/cars/${car.slug}`}
              className="flex min-h-12 items-center justify-between rounded-control border border-line px-4 text-[0.9375rem] font-medium text-ink hover:border-line-strong hover:bg-muted"
            >
              {car.displayName}
              {car.unitNumber ? ` — ${t("Common.vehicleUnit", { unit: car.unitNumber })}` : ""}
              <ArrowRight aria-hidden className="size-4 text-ink-3" />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/">{t("NotFound.home")}</ButtonLink>
        <ButtonLink href="/cars" variant="secondary">
          {t("NotFound.cars")}
        </ButtonLink>
        <ButtonLink href="/contact" variant="ghost">
          {t("NotFound.contact")}
        </ButtonLink>
      </div>
    </div>
  );
}
