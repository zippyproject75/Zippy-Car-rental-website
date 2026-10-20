"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { cars } from "@/data/cars";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { localeNames, localeTags, locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/** Keeps a valid ?car= preselection when switching language; nothing else is carried. */
function preservedQuery(): Record<string, string> | undefined {
  if (typeof window === "undefined") return undefined;
  const car = new URLSearchParams(window.location.search).get("car");
  return car && cars.some((c) => c.slug === car) ? { car } : undefined;
}

function useLocaleNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  return {
    pathname,
    onSelect(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
      const query = preservedQuery();
      if (!query) return; // Plain link navigation preserves the equivalent route.
      event.preventDefault();
      router.replace({ pathname, query }, { locale });
    },
  };
}

/** Inline list (mobile menu). */
export function LanguageList({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("Language");
  const current = useLocale() as Locale;
  const { pathname, onSelect } = useLocaleNavigation();
  return (
    <nav aria-label={t("label")}>
      <ul className="grid grid-cols-3 gap-2">
        {locales.map((l) => (
          <li key={l}>
            <Link
              href={pathname}
              locale={l}
              lang={localeTags[l]}
              hrefLang={localeTags[l]}
              aria-current={l === current ? "true" : undefined}
              onClick={(e) => {
                onSelect(e, l);
                onNavigate?.();
              }}
              className={cn(
                "flex min-h-11 items-center justify-center rounded-control border px-3 text-sm font-semibold",
                l === current
                  ? "border-accent bg-accent text-on-accent"
                  : "border-line text-ink hover:border-line-strong hover:bg-muted",
              )}
            >
              {localeNames[l]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Compact disclosure (desktop header). */
export function LanguageSwitcher() {
  const t = useTranslations("Language");
  const current = useLocale() as Locale;
  const { pathname, onSelect } = useLocaleNavigation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        data-testid="language-button"
        className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line px-3 text-sm font-medium text-ink hover:border-line-strong hover:bg-muted"
      >
        <Languages aria-hidden className="size-4 text-ink-3" />
        <span className="sr-only">{t("label")}: </span>
        <span lang={localeTags[current]}>{localeNames[current]}</span>
        <ChevronDown
          aria-hidden
          className={cn("size-4 text-ink-3 transition-transform", open && "rotate-180")}
        />
      </button>
      <ul
        id={listId}
        hidden={!open}
        className="absolute right-0 z-50 mt-2 min-w-44 overflow-hidden rounded-card border border-line bg-raised p-1.5 shadow-raised"
      >
        {locales.map((l) => (
          <li key={l}>
            <Link
              href={pathname}
              locale={l}
              lang={localeTags[l]}
              hrefLang={localeTags[l]}
              aria-current={l === current ? "true" : undefined}
              onClick={(e) => {
                onSelect(e, l);
                setOpen(false);
              }}
              className="flex min-h-11 items-center justify-between gap-4 rounded-[0.375rem] px-3 text-sm font-medium text-ink hover:bg-muted"
            >
              {localeNames[l]}
              {l === current ? <Check aria-hidden className="size-4 text-accent-ink" /> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
