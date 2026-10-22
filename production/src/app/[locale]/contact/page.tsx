import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/sections/PageIntro";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Notice } from "@/components/ui/Notice";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { site } from "@/data/site";
import { BranchCard } from "@/features/maps/BranchCard";
import { getPublishedBranches } from "@/lib/catalog";
import { getVisibleContacts } from "@/lib/contacts";
import { env } from "@/lib/env";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    path: "/contact",
    title: t("contactTitle"),
    description: t("contactDescription"),
  });
}

export default async function ContactPage({ params }: LocaleParams) {
  await resolveLocale(params);
  const t = await getTranslations();
  const contacts = getVisibleContacts(env.showPendingContent);
  const branches = getPublishedBranches(env.showPendingContent);
  const whatsapp = site.contacts.whatsapp;

  const methods = [
    ...contacts.phones.map((p) => ({
      key: p.e164,
      icon: Phone,
      label: p.kind === "primary" ? t("Contact.phone") : t("Contact.alternatePhone"),
      value: p.display,
      href: `tel:${p.e164}`,
      pending: p.pending,
    })),
    ...(contacts.email
      ? [
          {
            key: "email",
            icon: Mail,
            label: t("Contact.email"),
            value: contacts.email.value,
            href: `mailto:${contacts.email.value}`,
            pending: contacts.email.pending,
          },
        ]
      : []),
    ...(whatsapp.status === "confirmed"
      ? [
          {
            key: "whatsapp",
            icon: MessageCircle,
            label: t("Contact.whatsapp"),
            value: whatsapp.value.display,
            href: `https://wa.me/${whatsapp.value.e164.replace(/\D/g, "")}`,
            pending: false,
          },
        ]
      : []),
  ];

  return (
    <>
      <PageIntro
        crumbs={[{ label: t("Common.home"), href: "/" }, { label: t("Nav.contact") }]}
        title={t("Contact.title")}
        intro={t("Contact.intro")}
      />
      <div className="container-site space-y-16 py-14 lg:py-20">
        <section aria-labelledby="methods-title">
          <h2 id="methods-title" className="font-display text-2xl font-bold text-ink">
            {t("Contact.methodsTitle")}
          </h2>
          {methods.length ? (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {methods.map(({ key, icon: Icon, label, value, href, pending }) => (
                <li key={key}>
                  <a
                    href={href}
                    {...(href.startsWith("https://")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex min-h-24 flex-col justify-center gap-1 rounded-card border border-line bg-raised p-5 transition-colors hover:border-line-strong"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-ink-3">
                      <Icon aria-hidden className="size-4 text-accent-ink" />
                      {label}
                    </span>
                    <span className="font-display text-lg font-bold break-all text-ink tabular-nums">
                      {value}
                    </span>
                    {pending ? <PendingBadge className="mt-1 self-start" /> : null}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <Notice className="mt-6">{t("Contact.contactsPending")}</Notice>
          )}
        </section>

        <section id="branches" aria-labelledby="branches-title" className="scroll-mt-24">
          <h2 id="branches-title" className="font-display text-2xl font-bold text-ink">
            {t("Contact.branchesTitle")}
          </h2>
          {branches.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {branches.map((b) => (
                <BranchCard key={b.id} branch={b} />
              ))}
            </div>
          ) : (
            <Notice className="mt-6">{t("Contact.branchesPending")}</Notice>
          )}
        </section>

        <section
          aria-labelledby="contact-enquire-title"
          className="flex flex-col gap-6 rounded-card border border-line bg-muted/60 p-6 sm:p-8 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 id="contact-enquire-title" className="font-display text-2xl font-bold text-ink">
              {t("Contact.enquireTitle")}
            </h2>
            <p className="mt-2 text-ink-2">{t("Contact.enquireBody")}</p>
          </div>
          <ButtonLink href="/book" size="lg">
            {t("Contact.enquireCta")}
            <ArrowRight aria-hidden className="size-5" />
          </ButtonLink>
        </section>
      </div>
    </>
  );
}
