"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number; blur?: boolean };

/** Fades content in from a soft blur with a small lift when it enters the viewport (`blur={false}` to skip the blur). */
export function Reveal({ delay = 0, y = 14, blur, children, ...rest }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: Math.min(y, 16), filter: blur === false ? "blur(0px)" : "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: Math.min(delay, 0.24) }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
