"use client";

import { motion, useReducedMotion } from "motion/react";
import { CUBES } from "@/lib/mark";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;
// Where each cube flies in from during assembly (viewBox units).
const ORIGINS = [
  { x: 0, y: -60, rotate: -90 },
  { x: -70, y: 40, rotate: 120 },
  { x: 70, y: 40, rotate: -120 },
];

type Props = {
  className?: string;
  /** Plays the assemble sequence: cubes fly in, ring draws, label appears. */
  assemble?: boolean;
  label?: boolean;
  title?: string;
};

export function Co3Mark({ className, assemble = false, label = true, title = "Circle of Three Technologies" }: Props) {
  const reduce = useReducedMotion();
  const play = assemble && !reduce;

  return (
    <svg viewBox="0 0 100 100" className={cn("overflow-visible", className)} role="img" aria-label={title}>
      <motion.circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        initial={play ? { pathLength: 0, rotate: -90, opacity: 0 } : false}
        animate={{ pathLength: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 1.4, ease, delay: play ? 0.7 : 0 }}
        style={{ originX: "50px", originY: "50px" }}
      />
      {CUBES.map((c, i) => (
        <motion.g
          key={i}
          className="co3-cube"
          initial={play ? { ...ORIGINS[i], opacity: 0, scale: 0.4 } : false}
          animate={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease, delay: play ? i * 0.14 : 0 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <polygon points={c.top} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points={c.left} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points={c.right} fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </motion.g>
      ))}
      {label && (
        <motion.text
          x="50"
          y="84"
          textAnchor="middle"
          fill="currentColor"
          fontSize="11"
          fontWeight="700"
          letterSpacing="1"
          style={{ fontFamily: "var(--font-exo)" }}
          initial={play ? { opacity: 0, y: 6 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: play ? 1.3 : 0 }}
        >
          Co3
        </motion.text>
      )}
    </svg>
  );
}
