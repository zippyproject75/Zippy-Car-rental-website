import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getLegalDocument } from "@/data/legal";
import { resolveLocale } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import type { LegalSlug } from "@/types/legal";

export function legalMetadata(slug: LegalSlug) {
  return async ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> => {
    const locale = await resolveLocale(params);
    const t = await getTranslations({ locale, namespace: "Meta" });
    const title = getLegalDocument(slug).content[locale].title;
    return buildMetadata({
      locale,
      path: `/${slug}`,
      title,
      description: t("legalDescription", { title }),
    });
  };
}
