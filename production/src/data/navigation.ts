export const mainNavigation = [
  { key: "home", href: "/" },
  { key: "cars", href: "/cars" },
  { key: "about", href: "/about" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

export type NavKey = (typeof mainNavigation)[number]["key"];

export const ENQUIRY_PATH = "/book";
