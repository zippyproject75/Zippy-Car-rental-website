"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";
import { BookingForm } from "./BookingForm";

/** Reads an optional, validated ?car=<slug> preselection on the client (page stays static). */
export function BookFromSearchParams(
  props: Omit<ComponentProps<typeof BookingForm>, "initialCarId">,
) {
  const requested = useSearchParams().get("car");
  const match = props.cars.find((c) => c.id === requested);
  return <BookingForm key={match?.id ?? "any"} {...props} initialCarId={match?.id ?? null} />;
}
