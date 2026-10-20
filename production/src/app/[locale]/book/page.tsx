import { MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { PageIntro } from "@/components/sections/PageIntro";
import { BookFromSearchParams } from "@/features/booking/BookFromSearchParams";
import { BookingForm } from "@/features/booking/BookingForm";
import { getBookingFormProps } from "@/features/booking/props";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";

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

export default async function BookPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations();
  const props = await getBookingFormProps(locale);
  const steps = (["1", "2", "3", "4"] as const).map((n) => t(`Home.steps.${n}.title`));

  return (
    <>
      <PageIntro
        crumbs={[{ label: t("Common.home"), href: "/" }, { label: t("Booking.pageTitle") }]}
        title={t("Booking.pageTitle")}
        intro={t("Booking.pageIntro")}
      />
      <div className="container-site grid gap-10 py-12 lg:grid-cols-[1fr_20rem] lg:py-16">
        <section
          aria-labelledby="book-form-title"
          className="rounded-card border border-line bg-raised p-5 shadow-raised sm:p-8"
        >
          <h2 id="book-form-title" className="sr-only">
            {t("Booking.formLabel")}
          </h2>
          {/* useSearchParams keeps this page static; the fallback is the same form, unselected. */}
          <Suspense fallback={<BookingForm {...props} headingId="book-form-title" />}>
            <BookFromSearchParams {...props} headingId="book-form-title" />
          </Suspense>
        </section>
        <aside aria-labelledby="book-how-title" className="space-y-6 lg:pt-2">
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
    </>
  );
}
