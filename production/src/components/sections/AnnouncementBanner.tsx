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
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap motion-reduce:animate-none">
          {messages.map((message, index) => (
            <span
              key={index}
              className="mx-8 inline-block py-2 text-sm font-medium"
            >
              {message}
            </span>
          ))}
          {/* Duplicate messages for seamless infinite scroll */}
          {messages.map((message, index) => (
            <span
              key={`dup-${index}`}
              className="mx-8 inline-block py-2 text-sm font-medium"
            >
              {message}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
