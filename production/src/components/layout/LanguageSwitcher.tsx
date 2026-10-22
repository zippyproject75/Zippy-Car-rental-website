"use client";

import { Check, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { cars } from "@/data/cars";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { localeNames, localeTags, locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const shortLocaleLabels: Record<Locale, string> = {
  en: "EN",
  hi: "HI",
  mr: "MR",
};

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
                "flex min-h-11 items-center justify-center rounded-control border px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-focus",
                l === current
                  ? "border-accent bg-accent text-on-accent shadow-xs"
                  : "border-line bg-canvas text-ink hover:border-line-strong hover:bg-muted",
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

/** Compact disclosure (desktop header: EN ▾). */
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
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-label={`${t("label")}: ${localeNames[current]}`}
        title={`${t("label")}: ${localeNames[current]}`}
        onClick={() => setOpen((v) => !v)}
        data-testid="language-button"
        className="inline-flex h-10 items-center gap-1.5 rounded-control border border-line bg-canvas px-2.5 text-xs font-semibold text-ink transition-colors hover:border-line-strong hover:bg-muted/70 focus-visible:outline-2 focus-visible:outline-focus"
      >
        <span className="tracking-wider">{shortLocaleLabels[current]}</span>
        <ChevronDown
          aria-hidden
          className={cn("size-3.5 text-ink-3 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <ul
        id={listId}
        hidden={!open}
        role="listbox"
        aria-label={t("label")}
        className="absolute right-0 z-50 mt-2 min-w-40 overflow-hidden rounded-card border border-line bg-raised p-1.5 shadow-raised animate-in fade-in zoom-in-95 duration-100"
      >
        {locales.map((l) => (
          <li key={l} role="option" aria-selected={l === current}>
            <Link
              href={pathname}
              locale={l}
              lang={localeTags[l]}
              hrefLang={localeTags[l]}
              onClick={(e) => {
                onSelect(e, l);
                setOpen(false);
              }}
              className={cn(
                "flex min-h-10 items-center justify-between gap-3 rounded-control px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-focus",
                l === current
                  ? "bg-muted text-ink font-semibold"
                  : "text-ink-2 hover:bg-muted/70 hover:text-ink",
              )}
            >
              <span>{localeNames[l]}</span>
              {l === current ? <Check aria-hidden className="size-4 text-accent-ink shrink-0" /> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
