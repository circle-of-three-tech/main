"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type HeroSlide = { slug: string; title: string; tagline: string; image: StaticImageData; alt: string };

const INTERVAL = 6000;

/**
 * Full-screen home hero. Each service's photo fills the whole hero as a cross-fading background inside a parallax layer,
 * under a flat dark overlay; the copy (passed in as server-rendered `children`) sits on top and a service rail
 * along the bottom shows progress and lets visitors pick a service.
 * Every slide's image, title, tagline and link is in the HTML; the client only toggles visibility and runs transforms.
 */
export function HeroShowcase({ slides, labelledBy, children }: { slides: HeroSlide[]; labelledBy: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const count = slides.length;
  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const active = playing && !held && !reduce && count > 1;

  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => !document.hidden && go(index + 1), INTERVAL);
    return () => window.clearTimeout(id);
  }, [active, index, go]);

  // Parallax: the photo layer extends 16% above the hero and only moves down, so no edge is ever exposed.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  if (!count) return null;

  return (
    <section ref={ref} aria-labelledby={labelledBy} className="on-photo relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-band text-fg">
      <motion.div className="absolute inset-x-0 -top-[16%] bottom-0 -z-30 will-change-transform" style={{ y: reduce ? 0 : photoY }}>
        {slides.map((s, i) => {
          const on = i === index;
          return (
            <div key={s.slug} className={cn("absolute inset-0 transition-opacity duration-[1400ms] ease-in-out", on ? "opacity-100" : "opacity-0")}>
              <div key={on ? `on-${index}` : "off"} className={cn("absolute inset-0", on && !reduce && "ken-burns-slow")}>
                <Image src={s.image} alt={s.alt} fill priority={i === 0} sizes="100vw" placeholder="blur" className="object-cover" />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Flat dark overlay for legible copy on any photo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-[#020c0e]/70" />
      {/* Futuristic layer: drifting tech grid */}
      <div aria-hidden className="tech-grid pointer-events-none absolute inset-0 -z-10" />

      <motion.div className="container-x flex flex-1 items-center pb-12 pt-32 md:pt-36" style={{ y: reduce ? 0 : copyY, opacity: reduce ? 1 : fade }}>
        <div className="w-full [text-shadow:0_1px_24px_rgb(2_26_60/0.4)]">{children}</div>
      </motion.div>

      {/* Service rail */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Our services"
        className="relative border-t border-line bg-black/35 backdrop-blur-md"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocusCapture={() => setHeld(true)}
        onBlurCapture={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHeld(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
      >
        <h2 className="sr-only">Our services</h2>
        <div className="container-x grid gap-6 py-6 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* Active service caption; every slide's text is in the HTML, stacked in one grid cell */}
          <div className="grid lg:col-span-4">
            {slides.map((s, i) => {
              const on = i === index;
              return (
                <div
                  key={s.slug}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}: ${s.title}`}
                  aria-hidden={!on}
                  inert={!on}
                  className={cn("[grid-area:1/1] transition-[opacity,transform] duration-700 ease-out", on ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-2 opacity-0")}
                >
                  <h3 className="font-display text-lg font-semibold tracking-[-0.01em]">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.tagline}</p>
                  <Link href={`/services/${s.slug}`} className="group mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan">
                    Explore {s.title}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 lg:col-span-8">
            <div role="tablist" aria-label="Choose a service" className="grid flex-1 grid-cols-6 gap-2 lg:gap-3">
              {slides.map((s, i) => {
                const on = i === index;
                return (
                  <button
                    key={s.slug}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-label={`Show ${s.title}`}
                    onClick={() => go(i)}
                    className="group cursor-pointer text-left"
                  >
                    <span className="block h-[3px] overflow-hidden rounded-full bg-line-strong">
                      {i < index && <span className="block h-full w-full bg-cyan shadow-[0_0_10px_var(--cyan)]" />}
                      {on && (
                        <span
                          key={`${index}-${active}`}
                          className={cn("block h-full w-full bg-cyan shadow-[0_0_10px_var(--cyan)]", active ? "slide-progress" : "")}
                          style={{ ["--slide-ms" as string]: `${INTERVAL}ms` }}
                        />
                      )}
                    </span>
                    <span className={cn("mt-3 hidden text-xs font-medium leading-snug transition-colors lg:block", on ? "text-fg" : "text-muted group-hover:text-fg")}>
                      <span className="block text-[0.7rem] tabular-nums opacity-70">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-cyan/60 hover:text-cyan"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
