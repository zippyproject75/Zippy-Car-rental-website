"use client";

import { Menu, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { ENQUIRY_PATH } from "@/data/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageList } from "./LanguageSwitcher";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

type ContactLink = { href: string; label: string };

export function MobileMenu({ contact }: { contact: ContactLink | null }) {
  const t = useTranslations("Nav");
  const tLang = useTranslations("Language");
  const tTheme = useTranslations("Theme");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Close when navigation completes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  const handleClose = () => {
    document.documentElement.style.overflow = "";
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        data-testid="menu-open"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-line text-ink hover:bg-muted lg:hidden"
      >
        <Menu aria-hidden className="size-5" />
        <span className="sr-only">{t("openMenu")}</span>
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="mobile-menu-title"
        onClose={handleClose}
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-canvas p-0 text-ink open:flex open:flex-col backdrop:bg-black/70"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="mobile-menu-title" className="eyebrow">
            {t("menuTitle")}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-line hover:bg-muted"
            data-testid="menu-close"
          >
            <X aria-hidden className="size-5" />
            <span className="sr-only">{t("closeMenu")}</span>
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-5 py-6">
          <nav aria-label={t("primary")}>
            <NavLinks orientation="vertical" onNavigate={() => setOpen(false)} />
          </nav>
          <div className="space-y-3">
            <p className="eyebrow">{tLang("label")}</p>
            <LanguageList onNavigate={() => setOpen(false)} />
          </div>
          <div className="space-y-3">
            <p className="eyebrow">{tTheme("label")}</p>
            <ThemeToggle withLabel className="w-full justify-start" />
          </div>
          <div className="mt-auto grid gap-3">
            <Link
              href={ENQUIRY_PATH}
              className={buttonClass("primary", "lg", "w-full")}
              onClick={() => setOpen(false)}
            >
              {t("enquire")}
            </Link>
            {contact ? (
              <a href={contact.href} className={buttonClass("secondary", "lg", "w-full")}>
                <Phone aria-hidden className="size-4" />
                {contact.label}
              </a>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
