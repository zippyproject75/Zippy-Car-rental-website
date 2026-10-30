import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Noto_Sans_Devanagari } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { JsonLd } from "@/components/ui/JsonLd";
import { FloatingContactDock } from "@/components/ui/FloatingContactDock";
import { AnnouncementBanner } from "@/components/sections/AnnouncementBanner";
import { PageTransitionProvider } from "@/components/transitions/PageTransitionContext";
import { PageTransitionOverlay } from "@/components/transitions/PageTransitionOverlay";
import { PageContentWrapper } from "@/components/transitions/PageContentWrapper";
import { localeTags } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { env, metadataOrigin } from "@/lib/env";
import { organizationJsonLd } from "@/lib/jsonld";
import { localeStaticParams, resolveLocale } from "@/lib/page";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
  preload: false,
});

/** Only these namespaces are needed by client components. */
const CLIENT_NAMESPACES = [
  "Booking",
  "Pricing",
  "Duration",
  "WhatsApp",
  "Maps",
  "Nav",
  "Theme",
  "Language",
  "Common",
  "Fleet",
  "Specs",
  "Reviews",
  "RentalGuidelines",
  "HeroNew",
  "CinematicCta",
  "TrustStrip",
  "Home",
  "AnnouncementBanner",
  "PickupLocations",
  "DoorstepDelivery",
];

export const dynamicParams = false;
export const generateStaticParams = localeStaticParams;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ed" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(metadataOrigin()),
    title: { default: "Zippy Car Rental", template: "%s | Zippy Car Rental" },
    applicationName: "Zippy Car Rental",
    icons: {
      icon: "/zippy_main_logo.png",
      shortcut: "/zippy_main_logo.png",
      apple: "/zippy_main_logo.png",
    },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(
    Object.entries(messages).filter(([key]) => CLIENT_NAMESPACES.includes(key)),
  );
  const t = await getTranslations("Common");

  return (
    <html
      lang={localeTags[locale]}
      suppressHydrationWarning
      className={cn(inter.variable, manrope.variable, devanagari.variable)}
    >
      <body className="min-h-dvh bg-canvas font-sans text-ink antialiased">
        <ThemeProvider>
          <NextIntlClientProvider messages={clientMessages}>
            <PageTransitionProvider>
              <PageTransitionOverlay />
              <a
                href="#main"
                className="sr-only z-50 rounded-control bg-accent px-4 py-3 font-semibold text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
              >
                {t("skipToContent")}
              </a>
              {env.showPendingContent ? (
                <p
                  className="border-b border-warning/40 bg-warning-surface px-4 py-1.5 text-center text-xs font-medium text-warning"
                  data-testid="preview-banner"
                >
                  {t("previewBanner")}
                </p>
              ) : null}
              <SiteHeader />
              <AnnouncementBanner />
              <main id="main" tabIndex={-1} className="outline-none">
                <PageContentWrapper>
                  {children}
                </PageContentWrapper>
              </main>
              <SiteFooter />
              {/* Fixed vertical contact dock on the left side of the viewport (Phone & WhatsApp) */}
              <FloatingContactDock />
            </PageTransitionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <JsonLd data={organizationJsonLd()} />
        <Analytics />
      </body>
    </html>
  );
}
