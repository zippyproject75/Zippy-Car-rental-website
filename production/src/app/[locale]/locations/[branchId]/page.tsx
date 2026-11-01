import { Navigation, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/data/site";
import { visibleFact } from "@/lib/content";
import { env } from "@/lib/env";
import { breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/jsonld";
import { localizedPath } from "@/lib/routes";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { Link } from "@/i18n/navigation";
import { isLocale, type Locale } from "@/i18n/routing";

type Params = { params: Promise<{ locale: string; branchId: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return site.branches.map((branch) => ({ branchId: branch.id }));
}

async function resolve(params: Params["params"]) {
  const { locale, branchId } = await params;
  const branch = site.branches.find((b) => b.id === branchId);
  if (!isLocale(locale) || !branch) notFound();
  setRequestLocale(locale);
  return { locale: locale as Locale, branch };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, branch } = await resolve(params);
  const t = await getTranslations({ locale, namespace: "Meta" });
  const branchName = branch.name[locale];
  return buildMetadata({
    locale,
    path: `/locations/${branch.id}`,
    title: `Self-Drive Car Rental in ${branchName}, Pune | Zippy Car Rental`,
    description: `Pickup self-drive rental cars at Zippy Car Rental's ${branchName} branch in Pune. Choose from Maruti Suzuki vehicles and enquire on WhatsApp.`,
  });
}

export default async function BranchPage({ params }: Params) {
  const { locale, branch } = await resolve(params);
  const t = await getTranslations();
  const address = visibleFact(branch.address, env.showPendingContent);
  const phone = visibleFact(branch.phone, env.showPendingContent);
  const hours = visibleFact(branch.hours, env.showPendingContent);

  if (!address) {
    return (
      <div className="container-site py-20">
        <p className="text-ink-2">{t("Common.pendingBadge")}</p>
      </div>
    );
  }

  const fullAddress = `${address.value.lines.join(", ")}, ${address.value.locality} ${address.value.postalCode}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const breadcrumbs = [
    { label: t("Common.home"), href: "/" },
    { label: "Locations", href: "/#pickup-locations" },
    { label: branch.name[locale] },
  ];
  const jsonLdCrumbs = [
    { name: t("Common.home"), url: absoluteUrl(localizedPath(locale, "/")) },
    { name: "Locations", url: absoluteUrl(localizedPath(locale, "/#pickup-locations")) },
    { name: branch.name[locale], url: absoluteUrl(localizedPath(locale, `/locations/${branch.id}`)) },
  ];

  return (
    <>
      <div className="container-site pt-8 pb-20">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-8 max-w-3xl">
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
            {branch.name[locale]} Branch
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            Pickup self-drive rental cars at our {branch.name[locale]} location in Pune. Enquire on WhatsApp to check availability and confirm your rental.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Address Card */}
          <div className="rounded-card border border-line bg-raised p-6 shadow-raised">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="size-5 text-accent-ink" aria-hidden />
              <h2 className="font-display text-xl font-bold text-ink">Address</h2>
            </div>
            <address className="text-ink-2 leading-relaxed not-italic">
              {address.value.lines.map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
              {address.value.locality}<br />
              {address.value.postalCode}
            </address>
            {address.pending && env.showPendingContent && (
              <p className="mt-3 text-xs text-warning">{t("Common.pendingBadge")}</p>
            )}
          </div>

          {/* Contact Card */}
          <div className="rounded-card border border-line bg-raised p-6 shadow-raised">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="size-5 text-accent-ink" aria-hidden />
              <h2 className="font-display text-xl font-bold text-ink">Contact</h2>
            </div>
            {phone ? (
              <p className="text-ink-2">
                {phone.value.display}
                {phone.pending && env.showPendingContent && (
                  <span className="ml-2 text-xs text-warning">({t("Common.pendingBadge")})</span>
                )}
              </p>
            ) : (
              <p className="text-ink-2 text-sm">Branch-specific phone number not confirmed. Use the main WhatsApp number for enquiries.</p>
            )}
          </div>
        </div>

        {/* Hours */}
        {hours ? (
          <div className="mt-8 rounded-card border border-line bg-raised p-6 shadow-raised">
            <h2 className="font-display text-xl font-bold text-ink mb-4">Opening Hours</h2>
            <p className="text-ink-2">{hours.value[locale]}</p>
            {hours.pending && env.showPendingContent && (
              <p className="mt-2 text-xs text-warning">{t("Common.pendingBadge")}</p>
            )}
          </div>
        ) : null}

        {/* CTA Section */}
        <div className="mt-12 rounded-card border border-line bg-muted/40 p-8">
          <h2 className="font-display text-2xl font-bold text-ink mb-4">Plan Your Rental from {branch.name[locale]}</h2>
          <p className="text-ink-2 mb-6">
            Choose your vehicle, pickup date and time, and send an enquiry on WhatsApp. Zippy will confirm availability and the final price.
          </p>
          <div className="flex flex-wrap gap-4">
            <ButtonLink href="/book" size="lg">
              Start an Enquiry
            </ButtonLink>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-control border border-line bg-raised px-6 py-3 font-semibold text-ink hover:border-line-strong hover:bg-muted transition-colors"
            >
              <Navigation aria-hidden className="size-4" />
              Get Directions
            </a>
          </div>
        </div>

        {/* Doorstep Delivery Note */}
        <div className="mt-8 rounded-xl border border-line bg-muted/40 p-6">
          <p className="text-sm leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">Free doorstep delivery:</span> Available within 3 km of our {branch.name[locale]} pickup location. A ₹500 charge applies beyond 3 km.
          </p>
        </div>
      </div>

      <JsonLd data={breadcrumbJsonLd(jsonLdCrumbs)} />
      {address && <JsonLd data={localBusinessJsonLd(branch, fullAddress)} />}
    </>
  );
}
