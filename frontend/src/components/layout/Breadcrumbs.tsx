import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export type Crumb = { label: string; href?: string };

export async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = await getTranslations("Common");
  return (
    <nav aria-label={t("breadcrumb")} className="text-sm w-full max-w-full overflow-x-hidden">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-ink-3">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5 flex-shrink-0">
            {i > 0 ? <ChevronRight aria-hidden className="size-3.5" /> : null}
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex min-h-8 items-center hover:text-ink hover:underline truncate max-w-[200px] sm:max-w-none"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-2 truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
