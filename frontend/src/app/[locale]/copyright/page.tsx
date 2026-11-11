import { LegalPage } from "@/components/sections/LegalPage";
import { legalMetadata } from "@/lib/legal-metadata";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export const generateMetadata = legalMetadata("copyright");

export default async function Page({ params }: LocaleParams) {
  return <LegalPage slug="copyright" locale={await resolveLocale(params)} />;
}
