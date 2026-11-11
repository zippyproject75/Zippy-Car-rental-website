import { CircleAlert, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  info: { box: "border-line bg-muted text-ink-2", icon: Info },
  warning: { box: "border-warning/40 bg-warning-surface text-ink", icon: TriangleAlert },
  danger: { box: "border-danger/50 bg-danger-surface text-ink", icon: CircleAlert },
} as const;

export function Notice({
  tone = "info",
  children,
  className,
  title,
}: {
  tone?: keyof typeof tones;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  const { box, icon: Icon } = tones[tone];
  return (
    <div
      className={cn(
        "flex gap-3 rounded-control border p-4 text-sm leading-relaxed",
        box,
        className,
      )}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div>
        {title ? <p className="font-semibold text-ink">{title}</p> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}
