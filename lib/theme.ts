"use client";

import { useSyncExternalStore } from "react";

import { DEFAULT_THEME, THEME_COLORS, THEME_KEY, type Theme } from "./theme-config";

export type { Theme };

function read(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function useTheme() {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_THEME);
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

/** Switches theme instantly; colours ease via CSS. `origin` is accepted for API compatibility. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  apply(theme);
}
