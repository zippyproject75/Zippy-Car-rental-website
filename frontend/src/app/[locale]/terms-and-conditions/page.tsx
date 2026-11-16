import { LegalPage } from "@/components/sections/LegalPage";
import { legalMetadata } from "@/lib/legal-metadata";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export const generateMetadata = legalMetadata("terms-and-conditions");

export default async function Page({ params }: LocaleParams) {
  return <LegalPage slug="terms-and-conditions" locale={await resolveLocale(params)} />;
}
