"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/hooks";

/** Custom cursor: a precise dot plus a lagging ring that morphs over interactive elements and shows a label from `data-cursor`. */
export function Cursor() {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = fine && !reduce;
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-cursor], input, textarea, select, label");
      setHovering(Boolean(target));
      setLabel(target?.dataset.cursor ?? null);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const size = label ? 84 : hovering ? 56 : 34;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <motion.div className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan" style={{ x, y }} />
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-cyan/60"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: size, height: size, scale: down ? 0.8 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <motion.span className="absolute inset-0 rounded-full bg-cyan" animate={{ opacity: label ? 1 : 0 }} />
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="relative font-mono text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ink"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
