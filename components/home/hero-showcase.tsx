"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type HeroSlide = { slug: string; title: string; tagline: string; image: StaticImageData; alt: string };

const INTERVAL = 6000;

/**
 * Wide rounded media frame under the home headline. Each service's photo cross-fades inside it (slow Ken Burns, gentle
 * parallax) and a frosted service rail along the bottom shows the active service, its link and progress.
 * Every slide's image, title, tagline and link is in the HTML; the client only toggles visibility and runs transforms.
 */
export function HeroShowcase({ slides }: { slides: HeroSlide[] }) {
  const ref = useRef<HTMLDivElement>(null);
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

  // Parallax: the photo layer extends 12% above the frame and only moves down, so no edge is ever exposed.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  if (!count) return null;
  const current = slides[index];

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our services"
      className="on-photo relative isolate h-[min(78vh,760px)] min-h-[520px] overflow-hidden rounded-[28px] bg-band text-fg shadow-[0_50px_100px_-40px_rgb(27_27_27/0.45)] md:rounded-[40px]"
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
      <motion.div className="absolute inset-x-0 -top-[12%] bottom-0 -z-20 will-change-transform" style={{ y: reduce ? 0 : photoY }}>
        {slides.map((s, i) => {
          const on = i === index;
          return (
            <div key={s.slug} className={cn("absolute inset-0 transition-opacity duration-[1400ms] ease-in-out", on ? "opacity-100" : "opacity-0")}>
              <div key={on ? `on-${index}` : "off"} className={cn("absolute inset-0", on && !reduce && "ken-burns-slow")}>
                <Image src={s.image} alt={s.alt} fill priority={i === 0} sizes="(min-width: 1320px) 1240px, 100vw" placeholder="blur" className="object-cover" />
              </div>
            </div>
          );
        })}
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-black/70 via-black/15 to-black/10" />

      {/* Floating glass chip with the active slide number */}
      <div aria-hidden className="glass-dark absolute left-4 top-4 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full px-4 py-2 md:left-6 md:top-6">
        <span className="bg-sunset h-2 w-2 rounded-full shadow-[0_0_10px_rgb(255_75_43/0.8)]" />
        <span className="truncate text-[0.68rem] font-bold uppercase tracking-[0.14em]">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")} · {current.title}
        </span>
      </div>

      {/* Service rail */}
      <div className="glass-dark absolute inset-x-3 bottom-3 rounded-[22px] p-5 md:inset-x-5 md:bottom-5 md:rounded-[28px] md:p-6">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-center lg:gap-10">
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
                  <h3 className="font-display text-xl font-bold tracking-[-0.02em]">{s.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{s.tagline}</p>
                  <Link href={`/services/${s.slug}`} className="group mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-fg">
                    Explore {s.title}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 lg:col-span-8">
            <div role="tablist" aria-label="Choose a service" className="grid flex-1 gap-2 lg:gap-3" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
              {slides.map((s, i) => {
                const on = i === index;
                return (
                  <button key={s.slug} type="button" role="tab" aria-selected={on} aria-label={`Show ${s.title}`} onClick={() => go(i)} className="group cursor-pointer py-1 text-left">
                    <span className="block h-[3px] overflow-hidden rounded-full bg-white/20">
                      {i < index && <span className="block h-full w-full bg-white" />}
                      {on && (
                        <span
                          key={`${index}-${active}`}
                          className={cn("bg-sunset block h-full w-full", active ? "slide-progress" : "")}
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
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/15 text-fg transition-colors hover:bg-white/25"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
