"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { CUBES } from "@/lib/mark";
import { SectionLabel } from "@/components/site/ui";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    key: "Build",
    title: "We build what others prototype.",
    body: "Custom software, web platforms and mobile apps engineered with production-grade architecture, automated testing and security from the first commit.",
    points: ["Custom software", "Web & mobile apps", "APIs & integrations"],
  },
  {
    key: "Scale",
    title: "We scale what others struggle to run.",
    body: "Cloud infrastructure, DevOps and performance engineering that keep your product fast and available as users grow from hundreds to millions.",
    points: ["Cloud & DevOps", "Performance", "Observability"],
  },
  {
    key: "Transform",
    title: "We transform how work gets done.",
    body: "Applied AI, automation and product design that turn manual processes into intelligent systems your team actually enjoys using.",
    points: ["AI & automation", "Product design", "Digital transformation"],
  },
];

/** Pinned scroll story: the three cubes of the mark light up one by one as the visitor scrolls. */
export function Triad() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(2, Math.floor(v * 3))));
  const ring = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 240]);

  return (
    <section id="triad" ref={ref} className="relative" style={{ height: reduce ? "auto" : "320vh" }} aria-labelledby="triad-heading">
      <div className={cn("top-0 flex min-h-[100svh] items-center overflow-hidden py-24", !reduce && "sticky h-[100svh]")}>
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto aspect-square w-full max-w-[460px]">
            <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
              <circle cx="50" cy="50" r="46" fill="none" stroke="var(--line)" strokeWidth="0.6" />
              <motion.circle cx="50" cy="50" r="46" fill="none" stroke="url(#triad-grad)" strokeWidth="1.2" strokeLinecap="round" style={{ pathLength: ring, rotate: -90, originX: "50px", originY: "50px" }} />
              <defs>
                <linearGradient id="triad-grad">
                  <stop offset="0" stopColor="var(--cyan)" />
                  <stop offset="1" stopColor="var(--violet)" />
                </linearGradient>
              </defs>
              <motion.g style={{ rotate, originX: "50px", originY: "50px" }}>
                {Array.from({ length: 36 }).map((_, i) => (
                  <line key={i} x1="50" y1="1" x2="50" y2={i % 3 === 0 ? 4 : 2.5} stroke="var(--muted)" strokeWidth="0.3" transform={`rotate(${i * 10} 50 50)`} />
                ))}
              </motion.g>
              {CUBES.map((c, i) => (
                <motion.g
                  key={i}
                  animate={{ opacity: active === i ? 1 : 0.25, scale: active === i ? 1.08 : 0.94 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  filter={active === i ? "drop-shadow(0 0 3px var(--cyan))" : undefined}
                >
                  <polygon points={c.top} fill="none" stroke={active === i ? "var(--cyan)" : "var(--fg)"} strokeWidth="0.9" strokeLinejoin="round" />
                  <polygon points={c.left} fill="none" stroke={active === i ? "var(--cyan)" : "var(--fg)"} strokeWidth="0.9" strokeLinejoin="round" />
                  <polygon points={c.right} fill={active === i ? "var(--cyan)" : "var(--fg)"} stroke={active === i ? "var(--cyan)" : "var(--fg)"} strokeWidth="0.9" strokeLinejoin="round" />
                </motion.g>
              ))}
            </svg>
            <div className="absolute inset-x-0 -bottom-4 flex justify-center gap-6">
              {PILLARS.map((p, i) => (
                <span key={p.key} className={cn("hud-label transition-colors duration-500", active === i ? "text-cyan" : "text-muted/50")}>
                  {p.key}
                </span>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel index="01">The circle of three</SectionLabel>
            <h2 id="triad-heading" className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Three disciplines. <span className="text-gradient">One accountable team.</span>
            </h2>
            <div className="relative mt-10 min-h-[300px]">
              {PILLARS.map((p, i) => (
                <motion.article
                  key={p.key}
                  className={cn(reduce ? "relative mb-10" : "absolute inset-0")}
                  initial={false}
                  animate={reduce ? undefined : { opacity: active === i ? 1 : 0, y: active === i ? 0 : active > i ? -40 : 40, filter: active === i ? "blur(0px)" : "blur(8px)" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden={!reduce && active !== i}
                >
                  <p className="font-mono text-sm text-cyan">0{i + 1} / 03 · {p.key}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold md:text-3xl">{p.title}</h3>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">{p.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-fg/80">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
