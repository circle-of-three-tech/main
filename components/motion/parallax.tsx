"use client";

import Image, { type StaticImageData } from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Cover image that drifts slower than the page as it scrolls through the viewport.
 * Fills its positioned parent; `speed` is the share of the frame height the image travels.
 * The <img> is server-rendered with real alt text, so it stays crawlable; only the transform is client-side.
 */
export function ParallaxImage({
  src,
  alt,
  speed = 0.12,
  sizes = "100vw",
  priority,
  className,
  imageClassName,
}: {
  src: StaticImageData | string;
  alt: string;
  speed?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The layer is (1 + 2·speed) times the frame's height; percentages in `y` are relative to the layer,
  // so the travel is scaled to never reveal an edge.
  const travel = (speed / (1 + 2 * speed)) * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`${-travel}%`, `${travel}%`]);

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div className="absolute inset-x-0 will-change-transform" style={{ top: `${-speed * 100}%`, bottom: `${-speed * 100}%`, y: reduce ? 0 : y }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={typeof src === "string" ? "empty" : "blur"}
          className={cn("object-cover", imageClassName)}
        />
      </motion.div>
    </div>
  );
}

/** Moves its children vertically at a different rate to the scroll, for layered depth. */
export function Parallax({ children, offset = 40, className }: { children: ReactNode; offset?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div ref={ref} className={className} style={{ y: reduce ? 0 : y }}>
      {children}
    </motion.div>
  );
}
