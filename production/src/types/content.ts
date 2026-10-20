import type { Locale } from "@/i18n/routing";

/**
 * Every business fact carries its confirmation state. Only `confirmed` facts render in
 * production; `pending` facts may render in preview builds with a visible marker.
 */
export type ContentStatus = "confirmed" | "pending";

export type Fact<T> =
  | { status: "confirmed"; value: T; source: string }
  | { status: "pending"; value: T | null; note: string };

export type Localized<T> = Record<Locale, T>;

export type PublicationStatus = "draft" | "owner-reviewed" | "approved";

export type ImageAsset = {
  src: string;
  width: number;
  height: number;
  alt: Localized<string>;
};
