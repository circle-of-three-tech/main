"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { useInView, useReducedMotion } from "motion/react";

const CHARS = "!<>-_\\/[]{}=+*^?#0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Start when scrolled into view (default) or on mount. */
  trigger?: "view" | "mount" | "hover";
  speed?: number;
  delay?: number;
};

/** Decrypts text character by character. The real text is always in the DOM for crawlers and screen readers. */
export function GlyphScramble({ text, as: Tag = "span", className, trigger = "view", speed = 28, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const running = useRef(false);

  const run = () => {
    if (running.current || reduce) return;
    running.current = true;
    let iteration = 0;
    const id = window.setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((ch, i) => (ch === " " ? " " : i < iteration ? text[i] : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join(""),
      );
      if (iteration >= text.length) {
        window.clearInterval(id);
        setDisplay(text);
        running.current = false;
      }
      iteration += 1 / 2.5;
    }, speed);
    return () => window.clearInterval(id);
  };

  useEffect(() => {
    if (trigger === "hover") return;
    if (trigger === "view" && !inView) return;
    const t = window.setTimeout(run, delay);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, trigger]);

  return (
    <Tag ref={ref} className={className} aria-label={text} onMouseEnter={trigger === "hover" ? run : undefined}>
      <span aria-hidden>{display}</span>
    </Tag>
  );
}
