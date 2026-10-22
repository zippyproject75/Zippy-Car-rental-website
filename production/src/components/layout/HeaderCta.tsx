"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ENQUIRY_PATH } from "@/data/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function HeaderCta({
  variant = "desktop",
  className,
}: {
  variant?: "desktop" | "mobile";
  className?: string;
}) {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  // On the /book page itself, hide redundant CTA linking back to the same form
  if (pathname === "/book") {
    return null;
  }

  if (variant === "mobile") {
    return (
      <Link
        href={ENQUIRY_PATH}
        data-testid="header-cta-mobile"
        className={cn(
          "inline-flex h-9 items-center justify-center gap-1 rounded-control bg-accent px-2.5 text-xs font-bold text-on-accent shadow-xs transition-[background-color,transform] hover:bg-accent-hover active:translate-y-px focus-visible:outline-2 focus-visible:outline-focus whitespace-nowrap",
          className,
        )}
      >
        <span>{t("planRentalShort")}</span>
        <ArrowRight aria-hidden className="size-3.5 shrink-0" />
      </Link>
    );
  }

  return (
    <Link
      href={ENQUIRY_PATH}
      data-testid="header-cta-desktop"
      className={cn(
        "group inline-flex h-10 items-center justify-center gap-2 rounded-control bg-accent px-4 text-[0.875rem] font-bold text-on-accent shadow-xs transition-[background-color,transform] hover:bg-accent-hover active:translate-y-px focus-visible:outline-2 focus-visible:outline-focus whitespace-nowrap",
        className,
      )}
    >
      <span>{t("planMyRental")}</span>
      <ArrowRight
        aria-hidden
        className="size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
      />
    </Link>
  );
}
