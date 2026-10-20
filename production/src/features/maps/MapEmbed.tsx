"use client";

import { LoaderCircle, Map as MapIcon, TriangleAlert } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { embedUrl, type PostalAddress } from "./maps";

type State = "idle" | "loading" | "loaded" | "error";
const LOAD_TIMEOUT_MS = 15_000;

/**
 * Click-to-load Google Maps Embed API frame. Nothing from Google loads until the visitor
 * asks for the map. Without a configured key the facade explains the fallback.
 */
export function MapEmbed({
  apiKey,
  address,
  branchName,
}: {
  apiKey: string | undefined;
  address: PostalAddress;
  branchName: string;
}) {
  const t = useTranslations("Maps");
  const locale = useLocale() as Locale;
  const [state, setState] = useState<State>("idle");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (state !== "loading") return;
    const timer = window.setTimeout(() => setState("error"), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [state, attempt]);

  const showFrame = apiKey && (state === "loading" || state === "loaded");

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-control border border-line bg-sunken"
      data-testid="map"
    >
      {showFrame ? (
        <iframe
          key={attempt}
          title={t("mapTitle", { branch: branchName })}
          src={embedUrl(apiKey, address, locale)}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          onLoad={() => setState("loaded")}
          className="absolute inset-0 size-full border-0"
          data-testid="map-iframe"
        />
      ) : null}

      {state !== "loaded" ? (
        <div
          className="media-placeholder absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center"
          aria-label={t("facadeLabel", { branch: branchName })}
          role="group"
        >
          {state === "loading" ? (
            <p role="status" className="flex items-center gap-2 text-sm font-medium text-ink-2">
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
              {t("loading")}
            </p>
          ) : !apiKey ? (
            <p
              className="max-w-xs text-sm leading-relaxed text-ink-2"
              data-testid="map-not-configured"
            >
              {t("notConfigured")}
            </p>
          ) : state === "error" ? (
            <>
              <p
                role="alert"
                className="flex max-w-xs items-start gap-2 text-sm leading-relaxed text-ink"
              >
                <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
                {t("unavailable")}
              </p>
              <button
                type="button"
                className={buttonClass("secondary", "sm")}
                onClick={() => {
                  setAttempt((a) => a + 1);
                  setState("loading");
                }}
              >
                {t("retry")}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setState("loading")}
                aria-label={t("viewMapFor", { branch: branchName })}
                className={buttonClass("secondary", "sm", "bg-raised")}
                data-testid="map-load"
              >
                <MapIcon aria-hidden className="size-4" />
                {t("viewMap")}
              </button>
              <p className="max-w-xs text-xs leading-relaxed text-ink-3">{t("privacy")}</p>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
