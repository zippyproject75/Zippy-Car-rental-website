"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";
import { useMounted } from "./useMounted";

export function ThemeToggle({
  className,
  withLabel = false,
}: {
  className?: string;
  withLabel?: boolean;
}) {
  const t = useTranslations("Theme");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";
  const label = mounted ? (isDark ? t("toLight") : t("toDark")) : t("label");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={withLabel ? undefined : label}
      title={label}
      data-testid="theme-toggle"
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-control border border-line text-ink transition-colors hover:border-line-strong hover:bg-muted",
        withLabel && "px-4",
        className,
      )}
    >
      {/* Icons follow the applied theme attribute, so they are correct before hydration. */}
      <Moon aria-hidden className="size-[1.125rem] dark:hidden" />
      <Sun aria-hidden className="hidden size-[1.125rem] dark:block" />
      {withLabel ? <span className="text-sm font-medium">{label}</span> : null}
    </button>
  );
}
