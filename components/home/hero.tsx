import { ArrowDown } from "lucide-react";
import { CircuitField } from "@/components/site/circuit-field";
import { HeroVisual } from "@/components/three/hero-visual";
import { GlyphScramble } from "@/components/motion/glyph-scramble";
import { RiseIn, RiseText } from "@/components/motion/rise-text";
import { ButtonLink } from "@/components/site/ui";

export function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden pb-16 pt-32 lg:min-h-[100svh] lg:pb-0 lg:pt-28">
      <CircuitField className="opacity-90" />
      <div aria-hidden className="absolute left-1/2 top-1/3 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--halo),transparent_60%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink" />

      <div className="container-x relative grid items-center gap-8 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-7">
          <p className="hud-label flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            <GlyphScramble text="Circle of Three Technologies · Nigerian Tech Company" trigger="mount" delay={300} />
          </p>
          <RiseText
            text="Nigerian software, engineered for the world."
            highlight={["engineered", "world"]}
            delay={0.15}
            className="mt-8 font-display text-[clamp(2.8rem,6.6vw,6.2rem)] font-bold leading-[0.92] tracking-[-0.03em]"
          />
          <RiseIn delay={0.6}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
              We are a technology company building custom software, web platforms, mobile apps and AI systems for ambitious
              businesses in Nigeria, across Africa and beyond. Three disciplines, one circle: <span className="text-fg">design, engineering and intelligence</span>.
            </p>
          </RiseIn>
          <RiseIn delay={0.8} className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="/contact" cursor="Go">Start your project</ButtonLink>
            <ButtonLink href="/portfolio" variant="ghost" cursor="View">See our work</ButtonLink>
          </RiseIn>
        </div>
        <div className="relative h-[38vh] min-h-[280px] lg:col-span-5 lg:h-[72vh]">
          <HeroVisual />
        </div>
      </div>

      <a href="#triad" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-muted md:flex" aria-label="Scroll to learn more">
        <span className="hud-label text-muted">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[pulse-line_2s_ease-in-out_infinite] bg-cyan [transform:translateY(-100%)]" />
        </span>
        <ArrowDown className="h-3 w-3" />
      </a>
    </section>
  );
}
