import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

/** Marks a preview-only, unconfirmed fact. Never rendered in production builds. */
export function PendingBadge({ className, label }: { className?: string; label?: string }) {
  const t = useTranslations("Common");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[0.375rem] border border-dashed border-warning/70 bg-warning-surface px-2 py-0.5 text-xs font-semibold text-warning",
        className,
      )}
      title={t("pendingHint")}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-warning" />
      {label ?? t("pendingBadge")}
    </span>
  );
}
