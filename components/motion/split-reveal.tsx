"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";
import { HighlightText } from "./rise-text";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  /** Words shown in the quieter second tone. */
  highlight?: string[];
};

/** Heading that fades up once as it enters the viewport. */
export function SplitReveal({ text, as: Tag = "h2", className, delay = 0, highlight = [] }: Props) {
  const reduce = useReducedMotion();
  return (
    <Tag className={cn("[text-wrap:balance]", className)}>
      <motion.span
        className="block"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      >
        <HighlightText text={text} highlight={highlight} />
      </motion.span>
    </Tag>
  );
}
