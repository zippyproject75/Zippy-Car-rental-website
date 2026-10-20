import { getTranslations } from "next-intl/server";
import { buttonClass } from "@/components/ui/button";
import { ENQUIRY_PATH } from "@/data/navigation";
import { Link } from "@/i18n/navigation";
import { getVisibleContacts } from "@/lib/contacts";
import { env } from "@/lib/env";
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
    <header className="sticky top-0 z-40 border-b border-line bg-canvas">
      <div className="container-site flex h-[4.25rem] items-center gap-4">
        <Link href="/" className="mr-auto rounded-control lg:mr-6" aria-label={tc("homeLink")}>
          <Wordmark tagline={tc("brandTagline")} />
        </Link>
        <nav aria-label={t("primary")} className="hidden lg:block lg:mr-auto">
          <NavLinks />
        </nav>
        <div className="hidden lg:block">
          <LanguageSwitcher />
        </div>
        <ThemeToggle />
        <Link href={ENQUIRY_PATH} className={buttonClass("primary", "md", "hidden sm:inline-flex")}>
          {t("enquire")}
        </Link>
        <MobileMenu
          contact={
            phone
              ? { href: `tel:${phone.e164}`, label: tb("call", { number: phone.display }) }
              : null
          }
        />
      </div>
    </header>
  );
}
