import { cars } from "@/data/cars";
import { site } from "@/data/site";
import { visibleFact } from "@/lib/content";
import type { Car, CarId } from "@/types/car";
import type { Branch } from "@/types/site";

export function getCars(): readonly Car[] {
  return [...cars].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCarBySlug(slug: string): Car | undefined {
  return cars.find((c) => c.slug === slug);
}

export function isCarId(value: string | null | undefined): value is CarId {
  return !!value && cars.some((c) => c.id === value);
}

export function getRelatedCars(car: Car): Car[] {
  return getCars().filter((c) => c.id !== car.id);
}

export type PublishedBranch = Branch & {
  publicAddress: { lines: string[]; locality: string; postalCode: string };
  pending: boolean;
};

/** Branches whose address may be shown (confirmed, or pending in preview builds). */
export function getPublishedBranches(showPending: boolean): PublishedBranch[] {
  return site.branches.flatMap((b) => {
    const address = visibleFact(b.address, showPending);
    return address ? [{ ...b, publicAddress: address.value, pending: address.pending }] : [];
  });
}
