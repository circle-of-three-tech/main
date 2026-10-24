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

/** Switches theme with an iris wipe expanding from (x, y), falling back to an instant swap. */
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !document.startViewTransition) return apply(theme);
  if (origin) {
    root.style.setProperty("--iris-x", `${origin.x}px`);
    root.style.setProperty("--iris-y", `${origin.y}px`);
  }
  root.classList.add("theme-swap");
  const transition = document.startViewTransition(() => apply(theme));
  transition.finished.finally(() => root.classList.remove("theme-swap"));
}
