import { MapPin, Phone, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import { notFound } from "next/navigation";
import type { BranchId } from "@/types/site";
import { isLocale, type Locale, locales } from "@/i18n/routing";

type BranchPageParams = Promise<{ locale: string; branchId: string }>;

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    site.branches.map((branch) => ({
      locale,
      branchId: branch.id,
    }))
  );
}

export async function generateMetadata({ params }: { params: BranchPageParams }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    path: "/locations",
    title: t("locationsTitle"),
    description: t("locationsDescription"),
    absoluteTitle: true,
  });
}

export default async function BranchPage({ params }: { params: BranchPageParams }) {
  const { locale, branchId } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const branch = site.branches.find((b) => b.id === branchId as BranchId);

  if (!branch) {
    notFound();
  }

  const t = await getTranslations("Meta");

  return (
    <div className="container-site py-16 sm:py-20 lg:py-24">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-ink mb-4">
          {branch.name[locale]}
        </h1>
        <p className="text-lg text-ink-2 mb-12">{t("locationsDescription")}</p>

        <div className="rounded-card border border-line bg-raised p-6 shadow-raised">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 rounded-full bg-accent/10">
                <MapPin className="size-6 text-accent-ink" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-lg font-bold text-ink mb-2">Address</h2>
                {branch.address.value ? (
                  <>
                    {branch.address.value.lines.map((line, i) => (
                      <p key={i} className="text-sm text-ink-2 leading-relaxed">
                        {line}
                      </p>
                    ))}
                    <p className="text-sm text-ink-2 leading-relaxed mt-1">
                      {branch.address.value.locality}, {branch.address.value.postalCode}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-ink-3 italic">Address not available</p>
                )}
              </div>
            </div>

            {branch.hours.value ? (
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-full bg-accent/10">
                  <Clock className="size-6 text-accent-ink" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-lg font-bold text-ink mb-2">Hours</h2>
                  <p className="text-sm text-ink-2 leading-relaxed">{branch.hours.value[locale]}</p>
                </div>
              </div>
            ) : null}

            {branch.phone.value ? (
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-full bg-accent/10">
                  <Phone className="size-6 text-accent-ink" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-lg font-bold text-ink mb-2">Phone</h2>
                  <p className="text-sm text-ink-2 leading-relaxed">{branch.phone.value.display}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
