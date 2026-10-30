/**
 * Primary header navigation (5 items).
 * Desktop header order:
 * 1. Our Cars (/cars)
 * 2. How It Works (/#how-it-works)
 * 3. Pickup Locations (/#pickup-locations)
 * 4. FAQ (/faq)
 * 5. Contact (/contact)
 */
export const headerNavigation = [
  { key: "cars", href: "/cars" },
  { key: "howItWorks", href: "/#how-it-works" },
  { key: "locations", href: "/#pickup-locations" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

export type HeaderNavKey = (typeof headerNavigation)[number]["key"];

/**
 * Mobile drawer navigation. Includes the 5 primary destinations plus secondary About link.
 */
export const mobileNavigation = [
  { key: "cars", href: "/cars" },
  { key: "howItWorks", href: "/#how-it-works" },
  { key: "locations", href: "/#pickup-locations" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
  { key: "about", href: "/about" },
] as const;

export type MobileNavKey = (typeof mobileNavigation)[number]["key"];

// Backwards-compatible alias for existing imports
export const mainNavigation = headerNavigation;
export type NavKey = HeaderNavKey;

export const ENQUIRY_PATH = "/book";
