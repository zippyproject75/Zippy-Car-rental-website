"use client";

import { Check, Copy, Mail, MessageCircle, Pencil, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import type { VisibleContacts } from "@/lib/contacts";
import type { EnquiryResult } from "@/services/enquiry";

type CopyState = "idle" | "copied" | "failed";

export function EnquiryResultPanel({
  result,
  contacts,
  pendingLabel,
  onEdit,
}: {
  result: EnquiryResult;
  contacts: VisibleContacts;
  pendingLabel: string;
  onEdit: () => void;
}) {
  const t = useTranslations("Booking");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [copy, setCopy] = useState<CopyState>("idle");
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(result.message);
      setCopy("copied");
    } catch {
      textRef.current?.select();
      setCopy("failed");
    }
  }

  return (
    <section
      aria-labelledby="enquiry-ready-title"
      className="space-y-5"
      data-testid="enquiry-result"
    >
      <h3
        id="enquiry-ready-title"
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-2xl font-bold tracking-[-0.01em] text-ink"
      >
        {t("readyTitle")}
      </h3>
      <p className="text-[0.9375rem] leading-relaxed text-ink-2">
        {result.kind === "whatsapp-ready" ? t("readyBody") : t("whatsappUnavailable")}
      </p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="enquiry-message" className="text-sm font-semibold text-ink">
          {t("messageLabel")}
        </label>
        <textarea
          id="enquiry-message"
          ref={textRef}
          readOnly
          value={result.message}
          rows={9}
          className="w-full resize-y rounded-control border border-line-strong bg-canvas p-3.5 font-mono text-[0.8125rem] leading-relaxed text-ink"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {result.kind === "whatsapp-ready" ? (
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpened(true)}
            className={buttonClass("primary", "lg")}
            data-testid="open-whatsapp"
          >
            <MessageCircle aria-hidden className="size-5" />
            {t("openWhatsApp")}
          </a>
        ) : null}
        <button
          type="button"
          onClick={copyMessage}
          className={buttonClass(result.kind === "whatsapp-ready" ? "secondary" : "primary", "lg")}
          data-testid="copy-message"
        >
          {copy === "copied" ? (
            <Check aria-hidden className="size-5" />
          ) : (
            <Copy aria-hidden className="size-5" />
          )}
          {t("copy")}
        </button>
        <button type="button" onClick={onEdit} className={buttonClass("ghost", "lg")}>
          <Pencil aria-hidden className="size-4" />
          {t("edit")}
        </button>
      </div>

      <p role="status" aria-live="polite" className="min-h-5 text-sm font-medium">
        {copy === "copied" ? <span className="text-success">{t("copied")}</span> : null}
        {copy === "failed" ? <span className="text-danger">{t("copyFailed")}</span> : null}
      </p>
      {opened ? <p className="text-sm text-ink-2">{t("afterOpen")}</p> : null}

      <div className="border-t border-line pt-5">
        <h4 className="text-sm font-semibold text-ink">{t("otherWays")}</h4>
        {contacts.phones.length || contacts.email ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {contacts.phones.map((p) => (
              <li key={p.e164}>
                <a
                  href={`tel:${p.e164}`}
                  className={buttonClass("secondary", "sm", "tabular-nums")}
                >
                  <Phone aria-hidden className="size-4" />
                  {t("call", { number: p.display })}
                  {p.pending ? (
                    <span className="text-xs font-medium text-warning">· {pendingLabel}</span>
                  ) : null}
                </a>
              </li>
            ))}
            {contacts.email ? (
              <li>
                <a
                  href={`mailto:${contacts.email.value}`}
                  className={buttonClass("secondary", "sm")}
                >
                  <Mail aria-hidden className="size-4" />
                  {t("email", { email: contacts.email.value })}
                  {contacts.email.pending ? (
                    <span className="text-xs font-medium text-warning">· {pendingLabel}</span>
                  ) : null}
                </a>
              </li>
            ) : null}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink-3">{t("noOtherContacts")}</p>
        )}
      </div>
    </section>
  );
}
