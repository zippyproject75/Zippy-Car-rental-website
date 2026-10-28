import Image from "next/image";
import { cn } from "@/lib/cn";

/** Brand wordmark with official Zippy logo emblem. */
export function Wordmark({ tagline, className }: { tagline: string; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/zippy_main_logo.png"
        alt="Zippy Car Rental"
        width={36}
        height={24}
        className="h-8 w-auto object-contain shrink-0"
        priority
      />
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
