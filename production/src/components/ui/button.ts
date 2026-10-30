import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "quiet";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap cursor-pointer transition-all duration-150 active:scale-[0.97] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 aria-disabled:cursor-not-allowed aria-disabled:opacity-55";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover active:shadow-inner",
  secondary: "border border-line-strong bg-transparent text-ink hover:border-ink-3 hover:bg-muted active:bg-muted/80",
  ghost: "text-ink hover:bg-muted active:bg-muted/80",
  quiet: "text-accent-ink underline-offset-4 hover:underline px-0! active:scale-100",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3.5 text-sm",
  md: "min-h-11 px-5 text-[0.9375rem]",
  lg: "min-h-12 px-6 text-base",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra?: string,
): string {
  const baseClasses = extra?.includes("hidden") ? base.replace("inline-flex ", "") : base;
  return cn(baseClasses, variants[variant], sizes[size], extra);
}
