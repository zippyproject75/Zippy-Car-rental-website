import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  action,
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  id?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col gap-5 md:flex-row md:items-end md:justify-between", className)}
    >
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <Tag
          id={id}
          className={cn(
            "font-display font-bold tracking-[-0.02em] text-ink",
            Tag === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl",
          )}
        >
          {title}
        </Tag>
        {intro ? (
          <p className="mt-4 text-base leading-relaxed text-ink-2 sm:text-lg">{intro}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
