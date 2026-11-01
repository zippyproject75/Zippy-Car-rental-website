import Image from "next/image";
import { cn } from "@/lib/cn";

/** Brand wordmark with official Zippy logo emblem. */
export function Wordmark({ tagline, className }: { tagline: string; className?: string }) {
  return (
    <span className={cn("flex items-center gap-1.5 sm:gap-2.5", className)}>
      <Image
        src="/zippy_main_logo.png"
        alt="Zippy Car Rental"
        width={36}
        height={24}
        className="h-7 sm:h-8 w-auto object-contain shrink-0"
        priority
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.9375rem] sm:text-[1.0625rem] font-extrabold tracking-[0.14em] text-ink dark:text-white">
          ZIPPY
        </span>
        <span className="mt-0.5 sm:mt-1 text-[0.5625rem] sm:text-[0.625rem] font-semibold tracking-[0.2em] sm:tracking-[0.22em] text-ink-3 dark:text-white/50 uppercase">
          {tagline}
        </span>
      </span>
    </span>
  );
}
