"use client";

import Image, { type StaticImageData } from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Full-bleed hero with a parallax photo behind the copy.
 * A clear-sky gradient sits behind a skyline photo that drifts down slower than the page, a sun-glow layer drifts the other way and the copy eases off as you scroll.
 * Everything inside `children` is rendered on the server, so the headline, text and links are in the HTML from the first byte;
 * only transforms run in the browser (and are switched off for visitors who prefer reduced motion).
 */
export function HeroBackdrop({ image, alt, labelledBy, children }: { image: StaticImageData; alt: string; labelledBy: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // The photo is anchored to the bottom edge and only moves down, so the sky gradient (and the masked top edge) can never show a gap.
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);
  const sunY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.1]);

  return (
    <section ref={ref} aria-labelledby={labelledBy} className="on-photo relative isolate overflow-hidden bg-band text-fg md:min-h-[100svh]">
      {/* Clear afternoon sky: deep zenith blue easing to pale horizon haze */}
      <div aria-hidden className="absolute inset-0 -z-40 bg-[linear-gradient(180deg,#1676e0_0%,#3a9cf6_28%,#74c0fd_60%,#bde3ff_100%)]" />

      {/* The photo sits on the horizon and drifts down slower than the page; its top edge dissolves into the sky above */}
      <motion.div
        className="absolute inset-x-0 bottom-0 -z-30 h-[84%] will-change-transform [mask-image:linear-gradient(to_bottom,transparent_0%,rgb(0_0_0/0.85)_34%,#000_52%)]"
        style={{ y: reduce ? 0 : photoY, scale: reduce ? 1 : photoScale, transformOrigin: "50% 100%" }}
      >
        <Image src={image} alt={alt} fill priority sizes="100vw" placeholder="blur" className="object-cover object-[50%_72%]" />
      </motion.div>

      {/* Warm afternoon glow, drifting against the photo for depth */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 -z-20 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgb(255_196_92/0.34),rgb(255_196_92/0))]"
        style={{ y: reduce ? 0 : sunY }}
      />

      {/* Legibility scrims: deep sky blue on the copy side, a soft top band for the nav and a fade into the page below */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(98deg,rgb(3_44_104/0.62)_0%,rgb(6_80_156/0.3)_38%,rgb(20_130_225/0)_68%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-[rgb(3_30_64/0.4)] to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-44 bg-gradient-to-t from-[var(--hero-fade)] to-transparent" />

      <motion.div className="relative flex min-h-[inherit] items-center pb-20 pt-32 md:pb-24 md:pt-36" style={{ y: reduce ? 0 : copyY, opacity: reduce ? 1 : copyOpacity }}>
        <div className="w-full [text-shadow:0_1px_20px_rgb(3_36_84/0.35)]">{children}</div>
      </motion.div>
    </section>
  );
}
