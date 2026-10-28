"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "./ThemeProvider";
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
        "inline-flex h-10 items-center justify-center gap-2 rounded-control border border-line bg-canvas text-ink transition-colors hover:border-line-strong hover:bg-muted/70 focus-visible:outline-2 focus-visible:outline-focus",
        withLabel ? "w-full justify-start px-4 text-sm font-medium" : "w-10 min-w-10 shrink-0",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun aria-hidden className="size-4 text-accent transition-transform duration-300 rotate-0" />
        ) : (
          <Moon aria-hidden className="size-4 text-ink transition-transform duration-300 -rotate-12" />
        )
      ) : (
        <span className="size-4" />
      )}
      {withLabel ? <span className="text-sm font-medium">{label}</span> : null}
    </button>
  );
}
