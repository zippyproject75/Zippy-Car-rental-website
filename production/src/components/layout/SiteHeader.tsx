import { MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getVisibleContacts } from "@/lib/contacts";
import { env } from "@/lib/env";
import { HeaderCta } from "./HeaderCta";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";

export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const tc = await getTranslations("Common");
  const tb = await getTranslations("Booking");
  const phone = getVisibleContacts(env.showPendingContent).phones[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-canvas/92 backdrop-blur-md transition-colors">
      {/* Top trust strip (desktop) */}
      <div className="hidden border-b border-line/60 bg-muted/40 py-1 text-[0.75rem] text-ink-3 sm:block">
        <div className="container-site flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden className="size-3 text-accent-ink" />
              <span>Pune, Maharashtra · Kondhwa · Gangadham · Undri</span>
            </span>
            <span aria-hidden className="text-line-strong">•</span>
            <span>Self-Drive Car Rental</span>
          </div>
          {phone ? (
            <a
              href={`tel:${phone.e164}`}
              className="inline-flex items-center gap-1 font-semibold text-ink-2 hover:text-ink transition-colors"
            >
              <Phone aria-hidden className="size-3 text-accent-ink" />
              <span>{phone.display}</span>
            </a>
          ) : null}
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="container-site flex h-[4.25rem] items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="rounded-control shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-focus"
          aria-label={tc("homeLink")}
        >
          <Wordmark tagline={tc("brandTagline")} />
        </Link>

        {/* Center: Primary Navigation (Desktop) */}
        <nav aria-label={t("primary")} className="hidden lg:flex items-center justify-center">
          <NavLinks orientation="horizontal" />
        </nav>

        {/* Right: Controls & Single Primary CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Primary CTA button */}
          <HeaderCta />

          {/* Mobile Navigation Drawer Trigger */}
          <MobileMenu
            contact={
              phone
                ? { href: `tel:${phone.e164}`, label: tb("call", { number: phone.display }) }
                : null
            }
          />
        </div>
      </div>
    </header>
  );
}
