import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./button";

type Props = ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize };

export function ButtonLink({ variant = "primary", size = "md", className, ...props }: Props) {
  return <Link {...props} className={buttonClass(variant, size, className)} />;
}
