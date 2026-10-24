"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Converts vertical scroll into a horizontal pan across featured work (desktop). Falls back to a grid. */
export function WorkRail({ children, header }: { children: ReactNode; header: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const measure = () => {
      const isDesktop = window.innerWidth >= 1024;
      setDesktop(isDesktop);
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth + 64));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const pinned = desktop && !reduce;

  return (
    <section ref={section} className="relative" style={{ height: pinned ? `calc(100vh + ${distance}px)` : "auto" }} aria-label="Featured work">
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "py-24"}>
        <div className="container-x mb-12">{header}</div>
        <motion.div ref={track} style={pinned ? { x } : undefined} className={pinned ? "flex w-max gap-8 pl-[max(1.25rem,calc((100vw-1280px)/2+2rem))] pr-16" : "container-x grid gap-6 md:grid-cols-2"}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
