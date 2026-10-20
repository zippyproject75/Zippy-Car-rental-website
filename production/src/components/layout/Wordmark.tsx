import { cn } from "@/lib/cn";

/** Temporary typographic wordmark until the owner supplies approved brand assets. */
export function Wordmark({ tagline, className }: { tagline: string; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg aria-hidden viewBox="0 0 32 32" className="size-8 shrink-0">
        <rect width="32" height="32" rx="7" className="fill-ink" />
        <path
          d="M9 10h14l-10 12h10"
          fill="none"
          strokeWidth="2.6"
          strokeLinecap="square"
          className="stroke-accent"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.0625rem] font-extrabold tracking-[0.14em] text-ink">
          ZIPPY
        </span>
        <span className="mt-1 text-[0.625rem] font-semibold tracking-[0.22em] text-ink-3 uppercase">
          {tagline}
        </span>
      </span>
    </span>
  );
}
