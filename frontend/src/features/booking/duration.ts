import { splitMinutes } from "@/lib/dates";

type Translate = (key: "days" | "hours" | "minutes", values: { count: number }) => string;

/** "2 days, 3 hours, 30 minutes" in the active language. */
export function formatDuration(totalMinutes: number, t: Translate): string {
  const { days, hours, minutes } = splitMinutes(totalMinutes);
  const parts: string[] = [];
  if (days) parts.push(t("days", { count: days }));
  if (hours) parts.push(t("hours", { count: hours }));
  if (minutes || parts.length === 0) parts.push(t("minutes", { count: minutes }));
  return parts.join(", ");
}
