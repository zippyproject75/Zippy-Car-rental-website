import { Navigation } from "lucide-react";
import { useTranslations } from "next-intl";

export function PickupLocations() {
  const t = useTranslations("PickupLocations");

  const locations = [
    {
      id: 1,
      name: t("location1"),
      address: t("address1"),
      googleMapsUrl: "https://maps.app.goo.gl/djJbgsDjYRjmRTS46?g_st=awb",
    },
    {
      id: 2,
      name: t("location2"),
      address: t("address2"),
      googleMapsUrl: "https://maps.app.goo.gl/mCiepbpm1HKzLvdFA?g_st=awb",
    },
    {
      id: 3,
      name: t("location3"),
      address: t("address3"),
      googleMapsUrl: "https://maps.app.goo.gl/Q7BcqGz99FZdcB2U8?g_st=awb",
    },
  ];

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
          {locations.map((location) => (
            <article
              key={location.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-line bg-raised p-5 sm:p-6 shadow-raised transition-colors hover:border-line-strong"
            >
              <div>
                <h3 className="font-display text-lg font-bold text-ink">
                  {location.name}
                </h3>
                {location.address && (
                  <address className="mt-2 text-sm leading-relaxed text-ink-2 not-italic">
                    {location.address}
                  </address>
                )}
              </div>

              <a
                href={location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent hover:bg-accent-hover text-on-accent font-bold text-sm px-4 py-2.5 transition-colors shadow-sm"
              >
                <Navigation aria-hidden className="size-4 fill-current shrink-0" />
                {t("getDirections")}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
