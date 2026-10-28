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
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md transition-colors w-full">
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

          {/* Primary CTA: Only one single button */}
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
