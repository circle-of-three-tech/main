"use client";

import { useState, useSyncExternalStore } from "react";

/** SSR-safe media query subscription (false on the server). */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const noopSubscribe = () => () => {};

/** Reads a browser-only value once after hydration; `fallback` is used on the server. */
export function useClientValue<T>(read: () => T, fallback: T) {
  return useSyncExternalStore(noopSubscribe, read, () => fallback);
}

/** Runs `onChange` (as a render-phase state adjustment) whenever `value` changes. */
export function useOnChange<T>(value: T, onChange: () => void) {
  const [prev, setPrev] = useState(value);
  if (prev !== value) {
    setPrev(value);
    onChange();
  }
}
