import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/button";
import { PendingBadge } from "@/components/ui/PendingBadge";
import type { Locale } from "@/i18n/routing";
import type { PublishedBranch } from "@/lib/catalog";
import { visibleFact } from "@/lib/content";
import { env } from "@/lib/env";
import { directionsUrl } from "./maps";
import { MapEmbed } from "./MapEmbed";

export function BranchCard({
  branch,
  headingLevel = "h3",
}: {
  branch: PublishedBranch;
  headingLevel?: "h2" | "h3";
}) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const name = branch.name[locale];
  const Heading = headingLevel;
  const hours = visibleFact(branch.hours, env.showPendingContent);
  const phone = visibleFact(branch.phone, env.showPendingContent);
  const a = branch.publicAddress;

  return (
    <article
      className="flex flex-col gap-4 rounded-card border border-line bg-raised p-4 sm:p-5"
      data-testid="branch-card"
    >
      <MapEmbed apiKey={env.mapsEmbedKey} address={a} branchName={name} />
      <div className="flex flex-wrap items-center gap-2">
        <Heading className="font-display text-xl font-bold text-ink">{name}</Heading>
        {branch.pending ? <PendingBadge /> : null}
      </div>
      <address className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2 not-italic">
        <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-accent-ink" />
        <span>
          {a.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="block tabular-nums">
            {a.locality} {a.postalCode}
          </span>
        </span>
      </address>
      {hours ? (
        <p className="flex items-center gap-2.5 text-sm text-ink-2">
          <Clock aria-hidden className="size-4 text-accent-ink" />
          <span className="sr-only">{t("Contact.hours")}: </span>
          {hours.value[locale]}
        </p>
      ) : null}
      {phone ? (
        <a
          href={`tel:${phone.value.e164}`}
          className="flex items-center gap-2.5 text-sm text-ink-2 hover:text-ink"
        >
          <Phone aria-hidden className="size-4 text-accent-ink" />
          <span className="sr-only">{t("Contact.branchPhone")}: </span>
          {phone.value.display}
        </a>
      ) : null}
      <a
        href={directionsUrl(a)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t("Maps.directionsFor", { branch: name })} ${t("Common.opensInNewTab")}`}
        className={buttonClass("secondary", "md", "mt-auto w-full")}
        data-testid="directions-link"
      >
        {t("Maps.directions")}
        <ArrowUpRight aria-hidden className="size-4" />
      </a>
    </article>
  );
}
