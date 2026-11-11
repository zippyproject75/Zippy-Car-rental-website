import { visibleFact } from "@/lib/content";
import type { Car, CarSpecs } from "@/types/car";

export type SpecKey = keyof CarSpecs;
export type PublicSpec = { key: SpecKey; value: string | number; pending: boolean };

const order: SpecKey[] = [
  "bodyType",
  "seats",
  "transmission",
  "fuel",
  "modelYear",
  "variant",
  "colour",
];

/** Only confirmed specifications (or marked pending values in preview) are returned. */
export function getPublicSpecs(car: Car, showPending: boolean): PublicSpec[] {
  return order.flatMap((key) => {
    const fact = visibleFact<string | number>(car.specs[key] as never, showPending);
    return fact ? [{ key, value: fact.value, pending: fact.pending }] : [];
  });
}
