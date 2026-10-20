import { z } from "zod";
import { resolveSiteEnv, type SiteEnv } from "./security";

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

const schema = z
  .object({
    siteEnv: z.enum(["development", "preview", "production"]),
    siteUrl: optionalString.pipe(
      z
        .url({ protocol: /^https?$/ })
        .refine((v) => !v.endsWith("/"), "NEXT_PUBLIC_SITE_URL must not end with a slash")
        .optional(),
    ),
    mapsEmbedKey: optionalString,
  })
  .superRefine((env, ctx) => {
    if (env.siteEnv === "production" && !env.siteUrl) {
      ctx.addIssue({
        code: "custom",
        path: ["siteUrl"],
        message:
          "NEXT_PUBLIC_SITE_URL (the owner-confirmed production domain) is required when NEXT_PUBLIC_SITE_ENV=production.",
      });
    }
    if (env.siteEnv === "production" && env.siteUrl && !env.siteUrl.startsWith("https://")) {
      ctx.addIssue({ code: "custom", path: ["siteUrl"], message: "Production must use HTTPS." });
    }
  });

export type Env = {
  siteEnv: SiteEnv;
  /** Owner-confirmed canonical origin. Undefined outside production until supplied. */
  siteUrl: string | undefined;
  mapsEmbedKey: string | undefined;
  isProduction: boolean;
  /** Pending (unconfirmed) facts may be shown, clearly marked, only outside production. */
  showPendingContent: boolean;
};

function readEnv(): Env {
  const parsed = schema.safeParse({
    siteEnv: resolveSiteEnv(),
    // NEXT_PUBLIC_* values must be referenced literally so Next.js can inline them.
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    mapsEmbedKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY,
  });
  if (!parsed.success) {
    throw new Error(
      `Invalid environment configuration:\n${parsed.error.issues
        .map((i) => `- ${i.path.join(".")}: ${i.message}`)
        .join("\n")}`,
    );
  }
  const isProduction = parsed.data.siteEnv === "production";
  return {
    siteEnv: parsed.data.siteEnv,
    siteUrl: parsed.data.siteUrl,
    mapsEmbedKey: parsed.data.mapsEmbedKey,
    isProduction,
    showPendingContent: !isProduction,
  };
}

export const env: Env = readEnv();

/** Origin used for metadataBase. Outside production a local origin is used and pages are noindex. */
export function metadataOrigin(): string {
  return env.siteUrl ?? "http://localhost:3000";
}
