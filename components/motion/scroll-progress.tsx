"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin azure reading-progress bar along the bottom edge of the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-cyan" style={{ scaleX }} />;
}
