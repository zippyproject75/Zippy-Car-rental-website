import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminConsole } from "@/features/admin/AdminConsole";
import { getCurrentUser } from "@/lib/auth";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { localizedPath } from "@/lib/routes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Owner dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    redirect(localizedPath(locale, user?.role === "CUSTOMER" ? "/account" : "/admin/login"));
  }

  return <AdminConsole ownerEmail={user.email} />;
}
