"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Holographic panel: 3D tilt toward the pointer, a moving specular sheen and a cursor-tracking glow. */
export function TiltCard({ children, className, max = 10, glow = "61 242 255" }: { children: ReactNode; className?: string; max?: number; glow?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 18 });
  const sy = useSpring(py, { stiffness: 160, damping: 18 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(520px circle at ${gx} ${gy}, rgb(${glow} / 0.16), transparent 45%)`;
  const shine = useMotionTemplate`linear-gradient(115deg, transparent 30%, rgb(255 255 255 / 0.08) ${gx}, transparent 70%)`;

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
      className={cn("group relative transform-gpu", className)}
    >
      {children}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: sheen }} />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-100" style={{ background: shine }} />
    </motion.div>
  );
}
