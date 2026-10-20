import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

export function fieldControlClass(invalid: boolean): string {
  return cn(
    "min-h-12 w-full rounded-control border bg-canvas px-3.5 text-[0.9375rem] text-ink transition-colors hover:border-ink-3",
    invalid ? "border-danger" : "border-line-strong",
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm font-medium text-danger">
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
      {message}
    </p>
  );
}
