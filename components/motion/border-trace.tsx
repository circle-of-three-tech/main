"use client";

import { motion, useReducedMotion } from "motion/react";

/** HUD border that draws itself around its parent when scrolled into view. Parent must be `relative`. */
export function BorderTrace({ radius = 24, delay = 0 }: { radius?: number; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <linearGradient id="trace-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--cyan)" />
          <stop offset="100%" stopColor="var(--violet)" />
        </linearGradient>
      </defs>
      <motion.rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx={radius}
        fill="none"
        stroke="url(#trace-grad)"
        strokeWidth="1"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.8 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay }}
      />
    </svg>
  );
}
