import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
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
      className="flex flex-col justify-between gap-5 rounded-2xl border border-[#232a3e] bg-[#10141f] p-6 shadow-lg transition-colors hover:border-[#3a4460]"
      data-testid="branch-card"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-[#26251b] border border-[#4d441e] flex items-center justify-center shrink-0">
            <MapPin aria-hidden className="size-5 text-[#facc15]" />
          </div>
          <div className="flex items-center gap-2">
            <Heading className="font-display text-xl font-bold text-white">{name}</Heading>
            {branch.pending ? <PendingBadge /> : null}
          </div>
        </div>

        <address className="text-sm leading-relaxed text-[#9ca3af] not-italic">
          {a.lines.join(", ")}, {a.locality} – {a.postalCode}, Maharashtra
        </address>

        {hours ? (
          <p className="flex items-center gap-2 text-xs text-[#9ca3af]">
            <Clock aria-hidden className="size-3.5 text-[#facc15]" />
            {hours.value[locale]}
          </p>
        ) : null}

        {phone ? (
          <a
            href={`tel:${phone.value.e164}`}
            className="flex items-center gap-2 text-xs text-[#9ca3af] hover:text-white"
          >
            <Phone aria-hidden className="size-3.5 text-[#facc15]" />
            {phone.value.display}
          </a>
        ) : null}
      </div>

      <div className="space-y-4 pt-2">
        <MapEmbed apiKey={env.mapsEmbedKey} address={a} branchName={name} />

        <div>
          <a
            href={directionsUrl(a)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t("Maps.directionsFor", { branch: name })} ${t("Common.opensInNewTab")}`}
            className="inline-flex items-center gap-2 rounded-lg bg-[#facc15] hover:bg-[#eab308] text-[#0a0a0b] font-bold text-sm px-4 py-2.5 transition-colors shadow-sm"
            data-testid="directions-link"
          >
            <Navigation aria-hidden className="size-4 fill-current shrink-0" />
            {t("Maps.directions")}
          </a>
        </div>
      </div>
    </article>
  );
}
