"use client";

import { useTranslations } from "next-intl";

export function AnnouncementBanner() {
  const t = useTranslations("AnnouncementBanner");

  const messages = [
    t("message1"),
    t("message2"),
    t("message3"),
  ];

  return (
    <div className="w-full border-b border-line bg-accent text-on-accent">
      <div className="overflow-hidden">
        <div className="marquee-content">
          {messages.map((message, index) => (
            <span
              key={index}
              className="mx-4 sm:mx-8 inline-block py-2 text-sm sm:text-base font-medium whitespace-nowrap"
            >
              {message}
            </span>
          ))}
          {messages.map((message, index) => (
            <span
              key={`dup-${index}`}
              className="mx-4 sm:mx-8 inline-block py-2 text-sm sm:text-base font-medium whitespace-nowrap"
            >
              {message}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
