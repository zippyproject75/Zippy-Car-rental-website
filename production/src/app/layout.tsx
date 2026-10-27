import type { Metadata } from "next";
import type { ReactNode } from "react";
import { metadataOrigin } from "@/lib/env";
import "./globals.css";

// Covers routes rendered outside the locale layout (root not-found, global error).
export const metadata: Metadata = {
  metadataBase: new URL(metadataOrigin()),
  icons: {
    icon: "/zippy_main_logo.png",
    shortcut: "/zippy_main_logo.png",
    apple: "/zippy_main_logo.png",
  },
};

/** The <html> element is rendered by app/[locale]/layout.tsx so its lang matches the URL. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
