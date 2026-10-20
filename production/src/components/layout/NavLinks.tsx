"use client";

import { useTranslations } from "next-intl";
import { mainNavigation } from "@/data/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function isActivePath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({
  orientation = "horizontal",
  onNavigate,
}: {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
}) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const vertical = orientation === "vertical";
  return (
    <ul className={cn(vertical ? "flex flex-col" : "flex items-center gap-1")}>
      {mainNavigation.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <li key={item.key}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "relative inline-flex items-center font-medium transition-colors",
                vertical
                  ? "min-h-14 w-full border-b border-line font-display text-2xl font-semibold text-ink"
                  : "min-h-11 px-3 text-[0.9375rem] text-ink-2 hover:text-ink",
                active &&
                  !vertical &&
                  "text-ink after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:bg-accent",
                active && vertical && "text-accent-ink",
              )}
            >
              {t(item.key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
