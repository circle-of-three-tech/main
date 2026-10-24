"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Co3Mark } from "@/components/brand/co3-mark";
import { GlyphScramble } from "./glyph-scramble";

export const PRELOAD_KEY = "co3:intro";

/**
 * First-visit intro. Visibility is decided before paint by an inline script in the root layout
 * (adds `html.preload`), so returning visitors and reduced-motion users never see a flash.
 */
export function Preloader() {
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!document.documentElement.classList.contains("preload")) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      setActive(true);
      const p = Math.min(1, (t - start) / 2000);
      setProgress(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        window.setTimeout(() => {
          setActive(false);
          document.documentElement.classList.remove("preload");
          try {
            sessionStorage.setItem(PRELOAD_KEY, "1");
          } catch {}
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          id="preloader"
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
          <motion.div exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.6 }} className="relative h-36 w-36 text-fg drop-shadow-[0_0_30px_rgba(61,242,255,0.35)]">
            <Co3Mark assemble className="h-full w-full" />
          </motion.div>
          <GlyphScramble text="CIRCLE OF THREE TECHNOLOGIES" trigger="mount" delay={500} className="mt-8 font-display text-sm tracking-[0.4em] text-fg" />
          <div className="mt-8 h-px w-56 overflow-hidden bg-line">
            <div className="h-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${progress}%` }} />
          </div>
          <span className="hud-label mt-3 tabular-nums">{String(progress).padStart(3, "0")} / 100</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
