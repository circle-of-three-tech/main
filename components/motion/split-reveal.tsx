"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  /** Words to highlight with the gradient. */
  highlight?: string[];
};

/** Masked stagger reveal: every word slides up from behind its own clipping mask. */
export function SplitReveal({ text, as: Tag = "h2", className, wordClassName, delay = 0, stagger = 0.06, highlight = [] }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <Tag className={cn("[text-wrap:balance]", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className={cn("inline-block will-change-transform", highlight.some((h) => h.replace(/[.,!?]/g, "") === word.replace(/[.,!?]/g, "")) && "text-gradient", wordClassName)}
              initial={reduce ? false : { y: "110%", rotate: 4, opacity: 0 }}
              whileInView={{ y: "0%", rotate: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay + i * stagger }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </Tag>
  );
}
