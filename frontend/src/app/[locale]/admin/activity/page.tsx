import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getRecentAdminActivity } from "@/lib/auth";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { localizedPath } from "@/lib/routes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Owner activity log",
  robots: { index: false, follow: false },
};

export default async function AdminActivityPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    redirect(localizedPath(locale, user?.role === "CUSTOMER" ? "/account" : "/admin/login"));
  }
  const activity = await getRecentAdminActivity(100);

  return (
    <section className="container-site mx-auto px-4 py-12 sm:px-6 sm:py-16">
      <Link
        className="text-sm font-medium text-accent-ink underline underline-offset-4"
        href={localizedPath(locale, "/admin")}
      >
        Back to administration
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-ink">Owner activity log</h1>
      <p className="mt-2 text-sm text-ink-2">
        Showing the latest 100 security and administrative events.
      </p>
      <ol className="mt-8 divide-y divide-line rounded-card border border-line bg-raised px-5 shadow-raised sm:px-7">
        {activity.map((entry) => (
          <li className="py-5" key={entry.id}>
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-semibold text-ink">{entry.action}</p>
              <time
                className="text-xs text-ink-3"
                dateTime={new Date(entry.createdAt).toISOString()}
              >
                {new Date(entry.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Kolkata",
                })}
              </time>
            </div>
            <p className="mt-1 text-sm text-ink-2">
              {entry.actorEmail ?? "Unknown actor"}
              {entry.subjectType ? ` · ${entry.subjectType}` : ""}
              {entry.subjectId ? ` ${entry.subjectId}` : ""}
            </p>
            {Object.keys(entry.summary).length ? (
              <pre className="mt-2 overflow-auto text-xs text-ink-3">
                {JSON.stringify(entry.summary, null, 2)}
              </pre>
            ) : null}
          </li>
        ))}
        {!activity.length ? (
          <li className="py-5 text-sm text-ink-2">No activity recorded.</li>
        ) : null}
      </ol>
    </section>
  );
}
