"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ENQUIRY_PATH } from "@/data/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function HeaderCta({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  // On the /book page itself, hide redundant CTA linking back to the same form
  if (pathname === "/book") {
    return null;
  }

  return (
    <Link
      href={ENQUIRY_PATH}
      data-testid="header-cta"
      className={cn(
        "group inline-flex h-9 sm:h-10 items-center justify-center gap-1.5 sm:gap-2 rounded-control bg-accent px-2.5 sm:px-4 text-xs sm:text-[0.875rem] font-bold text-on-accent shadow-xs transition-[background-color,transform] hover:bg-accent-hover active:translate-y-px focus-visible:outline-2 focus-visible:outline-focus whitespace-nowrap shrink-0",
        className,
      )}
    >
      <span className="hidden sm:inline">{t("planMyRental")}</span>
      <span className="sm:hidden">{t("planRentalShort")}</span>
      <ArrowRight
        aria-hidden
        className="size-3.5 sm:size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
      />
    </Link>
  );
}
