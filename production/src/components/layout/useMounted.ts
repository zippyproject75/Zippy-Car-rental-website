"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True after hydration; avoids rendering client-only state into server HTML. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
