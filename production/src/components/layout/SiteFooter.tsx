import { Mail, Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { visibleLegalLinks } from "@/data/legal";
import { ENQUIRY_PATH } from "@/data/navigation";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getVisibleContacts } from "@/lib/contacts";
import { env } from "@/lib/env";
import { Wordmark } from "./Wordmark";

const linkClass = "inline-flex min-h-10 items-center text-[0.9375rem] text-ink-2 hover:text-ink";

export async function SiteFooter() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const tc = await getTranslations("Common");
  const legal = visibleLegalLinks(locale, env.showPendingContent);
  const contacts = getVisibleContacts(env.showPendingContent);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-canvas text-ink">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]">
        <div className="max-w-xs space-y-4">
          <Wordmark tagline={tc("brandTagline")} />
          <p className="text-[0.9375rem] leading-relaxed text-ink-2">{t("tagline")}</p>
        </div>
        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="eyebrow mb-3">
            {t("explore")}
          </h2>
          <ul>
            <li>
              <Link href="/" className={linkClass}>
                {nav("home")}
              </Link>
            </li>
            <li>
              <Link href="/cars" className={linkClass}>
                {nav("cars")}
              </Link>
            </li>
            <li>
              <Link href={ENQUIRY_PATH} className={linkClass}>
                {t("enquire")}
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-labelledby="footer-company">
          <h2 id="footer-company" className="eyebrow mb-3">
            {t("company")}
          </h2>
          <ul>
            <li>
              <Link href="/about" className={linkClass}>
                {nav("about")}
              </Link>
            </li>
            <li>
              <Link href="/faq" className={linkClass}>
                {nav("faq")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className={linkClass}>
                {nav("contact")}
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-labelledby="footer-legal">
          <h2 id="footer-legal" className="eyebrow mb-3">
            {t("legal")}
          </h2>
          {legal.length ? (
            <ul>
              {legal.map((doc) => (
                <li key={doc.slug} className="flex flex-wrap items-center gap-2">
                  <Link href={`/${doc.slug}`} className={linkClass}>
                    {doc.title}
                  </Link>
                  {doc.draft ? <PendingBadge label={tc("draftBadge")} /> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-3">{t("legalPending")}</p>
          )}
        </nav>
        <div>
          <h2 className="eyebrow mb-3">{t("contact")}</h2>
          {contacts.phones.length || contacts.email ? (
            <ul className="space-y-1">
              {contacts.phones.map((p) => (
                <li key={p.e164} className="flex flex-wrap items-center gap-2">
                  <a href={`tel:${p.e164}`} className={`${linkClass} gap-2 tabular-nums`}>
                    <Phone aria-hidden className="size-4 text-accent-ink" />
                    {p.display}
                  </a>
                  {p.pending ? <PendingBadge /> : null}
                </li>
              ))}
              {contacts.email ? (
                <li className="flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${contacts.email.value}`}
                    className={`${linkClass} gap-2 break-all`}
                  >
                    <Mail aria-hidden className="size-4 shrink-0 text-accent-ink" />
                    {contacts.email.value}
                  </a>
                  {contacts.email.pending ? <PendingBadge /> : null}
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="text-sm text-ink-3">{t("contactsPending")}</p>
          )}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-2 py-6 text-sm text-ink-3 md:flex-row md:items-center md:justify-between">
          <p>
            <Link href="/copyright" className="hover:text-ink">
              {t("rights", { year })}
            </Link>
          </p>
          <p>{t("honesty")}</p>
        </div>
      </div>
    </footer>
  );
}
