import { MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { PageIntro } from "@/components/sections/PageIntro";
import { JsonLd } from "@/components/ui/JsonLd";
import { Link } from "@/i18n/navigation";
import { BookFromSearchParams } from "@/features/booking/BookFromSearchParams";
import { BookingForm } from "@/features/booking/BookingForm";
import { getBookingFormProps } from "@/features/booking/props";
import { getCurrentUser } from "@/lib/auth";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { localizedPath } from "@/lib/routes";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    path: "/book",
    title: t("bookTitle"),
    description: t("bookDescription"),
  });
}

export default async function BookPage({
  params,
  searchParams,
}: LocaleParams & {
  searchParams: Promise<{ car?: string | string[] }>;
}) {
  const locale = await resolveLocale(params);
  const [{ car }, userResult] = await Promise.all([
    searchParams,
    getCurrentUser()
      .then((user) => ({ user }))
      .catch((error: unknown) => ({ error })),
  ]);
  if ("error" in userResult) {
    console.error("Could not verify the customer session for the booking page.", userResult.error);
    return (
      <section
        role="alert"
        className="container-site my-12 max-w-2xl rounded-card border border-danger/50 bg-danger-surface p-6 text-ink"
      >
        <h1 className="font-display text-2xl font-bold">Account service unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-ink-2">
          We could not verify your account right now. Please try again later or contact Zippy Car
          Rental for help.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex min-h-11 items-center rounded-control bg-accent px-4 font-semibold text-on-accent hover:bg-accent-hover"
        >
          Go to sign in
        </Link>
      </section>
    );
  }
  const user = userResult.user;
  if (!user) {
    const requestedCar = Array.isArray(car) ? car[0] : car;
    const selectedCar =
      requestedCar && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(requestedCar)
        ? `?car=${encodeURIComponent(requestedCar)}`
        : "";
    const returnPath = `${localizedPath(locale, "/book")}${selectedCar}`;
    redirect(`${localizedPath(locale, "/login")}?next=${encodeURIComponent(returnPath)}`);
  }
  if (user.role !== "CUSTOMER") redirect(localizedPath(locale, "/admin"));

  const t = await getTranslations();
  const props = await getBookingFormProps(locale);
  const steps = (["1", "2", "3"] as const).map((n) => t(`Home.steps.${n}.title`));
  const crumbs = [
    { name: t("Common.home"), url: absoluteUrl(localizedPath(locale, "/")) },
    { name: t("Booking.pageTitle"), url: absoluteUrl(localizedPath(locale, "/book")) },
  ];

  return (
    <>
      <PageIntro
        crumbs={[{ label: t("Common.home"), href: "/" }, { label: t("Booking.pageTitle") }]}
        title={t("Booking.pageTitle")}
        intro={t("Booking.pageIntro")}
      />
      <div className="w-full max-w-full overflow-x-hidden">
        <div className="container-site grid gap-10 py-12 lg:grid-cols-[1fr_20rem] lg:py-16 px-4 sm:px-6">
          <section
            aria-labelledby="book-form-title"
            className="rounded-card border border-line bg-raised p-4 sm:p-5 md:p-8 shadow-raised w-full max-w-full overflow-x-hidden"
          >
            <h2 id="book-form-title" className="sr-only">
              {t("Booking.formLabel")}
            </h2>
            {/* Keep a simple fallback while the selected vehicle is read from the URL. */}
            <Suspense fallback={<BookingForm {...props} headingId="book-form-title" />}>
              <BookFromSearchParams {...props} headingId="book-form-title" />
            </Suspense>
          </section>
          <aside
            aria-labelledby="book-how-title"
            className="space-y-6 lg:pt-2 w-full max-w-full overflow-x-hidden"
          >
            <h2 id="book-how-title" className="eyebrow">
              {t("Home.howTitle")}
            </h2>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-3 text-[0.9375rem] text-ink">
                  <span className="font-display text-sm font-bold text-accent-ink tabular-nums">
                    0{i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="flex gap-2.5 border-t border-line pt-5 text-sm leading-relaxed text-ink-2">
              <MessageCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-ink" />
              {t("Booking.readyBody")}
            </p>
            {props.contacts.phones[0] ? (
              <a
                href={`tel:${props.contacts.phones[0].e164}`}
                className="flex items-center gap-2.5 text-sm font-medium text-ink hover:underline"
              >
                <Phone aria-hidden className="size-4 text-accent-ink" />
                {t("Booking.call", { number: props.contacts.phones[0].display })}
                {props.contacts.phones[0].pending ? (
                  <span className="text-xs text-warning">({t("Common.pendingBadge")})</span>
                ) : null}
              </a>
            ) : null}
          </aside>
        </div>
      </div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
