"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { ServiceIcon } from "@/components/site/service-icon";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  image: StaticImageData;
  alt: string;
};

const INTERVAL = 5500;

/**
 * Services carousel for the home hero.
 * Every slide (image, title, tagline and link) is server-rendered into the HTML, so all services stay crawlable;
 * the client only switches which slide is visible. Slides cross-fade with opacity; autoplay pauses on hover,
 * focus, hidden tabs and when the visitor prefers reduced motion.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [reduce, setReduce] = useState(false);
  const root = useRef<HTMLElement>(null);
  const count = slides.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const active = playing && !hovered && !reduce && count > 1;

  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => {
      if (!document.hidden) go(index + 1);
    }, INTERVAL);
    return () => window.clearTimeout(id);
  }, [active, index, go]);

  if (!count) return null;
  const current = slides[index];

  return (
    <section
      ref={root}
      aria-roledescription="carousel"
      aria-label="Our services"
      className="on-photo relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setHovered(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <h2 className="sr-only">Our services</h2>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-band shadow-[0_30px_70px_-30px_var(--shadow)] sm:aspect-[16/10] lg:aspect-[5/4]">
        {/* Images: stacked and cross-faded with opacity. */}
        {slides.map((s, i) => {
          const on = i === index;
          return (
            <div key={s.slug} className={cn("absolute inset-0 transition-opacity duration-1000 ease-in-out", on ? "z-10 opacity-100" : "z-0 opacity-0")}>
              <div className={cn("absolute inset-0", on && !reduce && "ken-burns")} key={on ? `on-${index}` : "off"}>
                <Image src={s.image} alt={s.alt} fill sizes="(min-width: 1024px) 42vw, 100vw" placeholder="blur" className="object-cover" />
              </div>
            </div>
          );
        })}

        {/* Captions: one static panel; every slide's text is in the HTML, stacked in the same grid cell. */}
        <div className="absolute inset-x-3 bottom-3 z-20 grid rounded-xl border border-line bg-surface p-5 shadow-[0_12px_32px_-16px_var(--shadow)] backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-6">
          {slides.map((s, i) => {
            const on = i === index;
            const step = (d: string) => cn("transition-opacity ease-out", on ? `opacity-100 duration-700 ${d}` : "opacity-0 delay-0 duration-200");
            return (
              <div
                key={s.slug}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${s.title}`}
                aria-hidden={!on}
                inert={!on}
                className={cn("[grid-area:1/1]", !on && "pointer-events-none")}
              >
                <p className={cn("flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted", step("delay-200"))}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-soft text-cyan">
                    <ServiceIcon name={s.icon} className="h-4 w-4" />
                  </span>
                  Service {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </p>
                <h3 className={cn("mt-3 font-display text-xl font-semibold tracking-[-0.015em] sm:text-2xl", step("delay-300"))}>{s.title}</h3>
                <p className={cn("mt-1.5 text-sm leading-relaxed text-muted sm:text-[0.95rem]", step("delay-[400ms]"))}>{s.tagline}</p>
                <Link href={`/services/${s.slug}`} className={cn("group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan", step("delay-500"))}>
                  Explore {s.title}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex flex-1 gap-1.5" role="tablist" aria-label="Choose a service">
            {slides.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${s.title}`}
                onClick={() => go(i)}
                className="group relative h-6 flex-1 cursor-pointer"
              >
                <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-line-strong transition-colors group-hover:bg-muted/40">
                  {i < index && <span className="absolute inset-0 bg-cyan" />}
                  {i === index && (
                    <span
                      key={`${index}-${active}`}
                      className={cn("absolute inset-0 bg-cyan", active ? "slide-progress" : "")}
                      style={{ ["--slide-ms" as string]: `${INTERVAL}ms` }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous service"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-muted backdrop-blur-md transition-colors hover:border-cyan/60 hover:text-cyan"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause carousel" : "Play carousel"}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-muted backdrop-blur-md transition-colors hover:border-cyan/60 hover:text-cyan"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next service"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-muted backdrop-blur-md transition-colors hover:border-cyan/60 hover:text-cyan"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {active ? "" : `Showing ${current.title}`}
      </p>
    </section>
  );
}
