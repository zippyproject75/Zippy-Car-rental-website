import type { Car } from "@/types/car";
import { CarCard } from "./CarCard";

export function CarGrid({
  cars,
  headingLevel,
}: {
  cars: readonly Car[];
  headingLevel?: "h2" | "h3";
}) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="car-grid">
      {cars.map((car) => (
        <li key={car.id} className="flex">
          <div className="flex w-full">
            <CarCard car={car} headingLevel={headingLevel} />
          </div>
        </li>
      ))}
    </ul>
  );
}
