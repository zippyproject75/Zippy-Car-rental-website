import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountForm } from "@/features/auth/AccountForm";
import { getCurrentUser } from "@/lib/auth";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { localizedPath } from "@/lib/routes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your customer account",
  robots: { index: false, follow: false },
};

export default async function AccountPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const user = await getCurrentUser();
  if (!user || user.role !== "CUSTOMER") {
    redirect(localizedPath(locale, "/login"));
  }
  return <AccountForm user={user} />;
}
