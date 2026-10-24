import Image from "next/image";
import { Parallax, ParallaxImage } from "@/components/motion/parallax";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/ui";
import { photo } from "@/lib/photos";

/** Full-bleed Lagos band with layered parallax: city backdrop, drifting team photo, copy. */
export function ImageBand() {
  const city = photo("lagos");
  const team = photo("team");
  return (
    <section className="relative overflow-hidden border-y border-line py-28 md:py-40" aria-label="Built in Lagos, Nigeria">
      <ParallaxImage src={city.src} alt={city.alt} speed={0.3} />
      <div className="scrim absolute inset-0" aria-hidden />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionLabel>Our base</SectionLabel>
          <SplitReveal
            text="Built in Lagos. Shipping to the world."
            highlight={["Lagos."]}
            className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Our engineers and designers work from Nigeria, close to the markets we build for, and to the same standards as teams anywhere in the world.
            </p>
          </Reveal>
        </div>
        <Parallax offset={90} className="relative lg:col-span-5 lg:col-start-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line shadow-[0_40px_100px_-40px_var(--shadow)]">
            <Image src={team.src} alt={team.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" placeholder="blur" className="object-cover" />
          </div>
        </Parallax>
      </div>
    </section>
  );
}
