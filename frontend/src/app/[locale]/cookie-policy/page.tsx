import { LegalPage } from "@/components/sections/LegalPage";
import { legalMetadata } from "@/lib/legal-metadata";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export const generateMetadata = legalMetadata("cookie-policy");

export default async function Page({ params }: LocaleParams) {
  return <LegalPage slug="cookie-policy" locale={await resolveLocale(params)} />;
}
