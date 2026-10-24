"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Global client behaviour for the public site:
 * - Lenis inertial smooth scrolling (skipped for reduced motion / touch)
 * - records the pointer position so the iris page transition expands from the click point
 */
export function ClientEffects() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      lenis.current = new Lenis({ autoRaf: true, lerp: 0.09, anchors: { offset: -96 } });
    }
    const root = document.documentElement;
    const onDown = (e: PointerEvent) => {
      root.style.setProperty("--iris-x", `${e.clientX}px`);
      root.style.setProperty("--iris-y", `${e.clientY}px`);
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onDown);
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    if (!window.location.hash) lenis.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
