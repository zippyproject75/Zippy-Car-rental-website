import { Navigation } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { site } from "@/data/site";
import { visibleFact } from "@/lib/content";
import { env } from "@/lib/env";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

export function PickupLocations() {
  const t = useTranslations("PickupLocations");
  const tc = useTranslations("Common");
  const locale = useLocale() as Locale;

  const locations = site.branches
    .map((branch) => {
      const address = visibleFact(branch.address, env.showPendingContent);
      if (!address) return null;
      return {
        id: branch.id,
        name: branch.name[locale],
        address: address.value.lines.join(", ") + ", " + address.value.locality + " " + address.value.postalCode,
        pending: address.pending,
      };
    })
    .filter((loc): loc is NonNullable<typeof loc> => loc !== null);

  return (
    <section
      id="pickup-locations"
      aria-labelledby="pickup-locations-title"
      className="scroll-mt-20 border-b border-line bg-muted/30"
    >
      <div className="container-site py-16 sm:py-20 lg:py-24">
        <div className="mb-10">
          <p className="eyebrow mb-2 sm:mb-3">{t("eyebrow")}</p>
          <h2
            id="pickup-locations-title"
            className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            {t("intro")}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => {
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
            return (
              <article
                key={location.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-line bg-raised p-5 sm:p-6 shadow-raised transition-colors hover:border-line-strong"
              >
                <div>
                  <Link
                    href={`/locations/${location.id}`}
                    className="group block"
                  >
                    <h3 className="font-display text-lg font-bold text-ink group-hover:text-accent-ink transition-colors">
                      {location.name}
                    </h3>
                  </Link>
                  {location.address && (
                    <address className="mt-2 text-sm leading-relaxed text-ink-2 not-italic">
                      {location.address}
                    </address>
                  )}
                  {location.pending && env.showPendingContent && (
                    <p className="mt-2 text-xs text-warning">
                      {tc("pendingBadge")}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/locations/${location.id}`}
                    className="flex-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent hover:bg-accent-hover text-on-accent font-bold text-sm px-4 py-2.5 transition-colors shadow-sm"
                  >
                    {t("viewDetails")}
                  </Link>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-transparent hover:bg-muted text-ink font-bold text-sm px-4 py-2.5 transition-colors"
                    aria-label={`Get directions to ${location.name}`}
                  >
                    <Navigation aria-hidden className="size-4 fill-current shrink-0" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Doorstep delivery note */}
        <div className="mt-8 rounded-xl border border-line bg-muted/40 p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">Free doorstep delivery:</span> Available within 3 km of our pickup locations. A ₹500 charge applies beyond 3 km.
          </p>
        </div>
      </div>
    </section>
  );
}
