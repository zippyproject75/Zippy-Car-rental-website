"use client";

import { useTranslations } from "next-intl";
import { headerNavigation, mobileNavigation } from "@/data/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function isActivePath(pathname: string, href: string): boolean {
  const basePath = href.split("#")[0] || "/";
  const hasHash = href.includes("#");

  // Don't match hash-only links (like /#pickup-locations) as the homepage
  if (basePath === "/" && hasHash) {
    return false;
  }

  if (basePath === "/") {
    return pathname === "/";
  }
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
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
  const items = vertical ? mobileNavigation : headerNavigation;

  return (
    <ul className={cn(vertical ? "flex flex-col" : "flex items-center gap-1 xl:gap-1.5")}>
      {items.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <li key={item.key}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "relative inline-flex items-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-focus",
                vertical
                  ? "min-h-12 w-full border-b border-line/70 font-display text-lg font-semibold text-ink hover:text-accent-ink py-3"
                  : "min-h-10 rounded-control px-3 py-1.5 text-[0.9375rem] text-ink-2 hover:text-ink hover:bg-muted/50",
                active &&
                  !vertical &&
                  "text-ink font-semibold after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-accent after:rounded-full",
                active && vertical && "text-accent-ink font-bold",
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
