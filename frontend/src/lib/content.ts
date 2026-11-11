import type { Fact } from "@/types/content";

export type VisibleFact<T> = { value: T; pending: boolean };

/**
 * Publication gate for a single fact. Confirmed facts always render. Pending facts with a
 * candidate value render only when `showPending` (preview builds) and must be marked.
 */
export function visibleFact<T>(fact: Fact<T>, showPending: boolean): VisibleFact<T> | null {
  if (fact.status === "confirmed") return { value: fact.value, pending: false };
  if (showPending && fact.value !== null) return { value: fact.value, pending: true };
  return null;
}
