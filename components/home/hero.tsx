import { ButtonLink } from "@/components/site/ui";
import { servicePhoto } from "@/lib/photos";
import { HeroShowcase, type HeroSlide } from "./hero-showcase";

type Service = { slug: string; title: string; tagline: string; icon: string };

/** Delay helper for the staggered opacity fade on hero copy. */
const fade = (s: number) => ({ animationDelay: `${s}s` });

export function Hero({ services }: { services: Service[] }) {
  const slides: HeroSlide[] = services.map((s) => {
    const p = servicePhoto(s.slug);
    return { slug: s.slug, title: s.title, tagline: s.tagline, image: p.src, alt: `${s.title}: ${p.alt}` };
  });

  return (
    <HeroShowcase slides={slides} labelledBy="hero-heading">
      <div className="max-w-3xl">
        <p className="hud-label hero-fade !text-sky-light">Software company · Lagos, Nigeria</p>
        <h1 id="hero-heading" className="mt-5 font-display text-[clamp(2.6rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
          <span className="hero-fade block" style={fade(0.1)}>
            Nigerian software,
          </span>
          <span className="hero-fade block text-cyan" style={fade(0.4)}>
            engineered for the world.
          </span>
        </h1>
        <p className="hero-fade mt-7 max-w-xl text-lg leading-relaxed text-muted md:text-xl" style={fade(0.7)}>
          Circle of Three Technologies designs and builds custom software, web platforms, mobile apps and AI systems for organisations in Nigeria, across
          Africa and beyond.
        </p>
        <div className="hero-fade mt-10 flex flex-wrap items-center gap-3" style={fade(0.95)}>
          <ButtonLink href="/contact" variant="accent">
            Start a project
          </ButtonLink>
          <ButtonLink href="/portfolio" variant="ghost">
            View our work
          </ButtonLink>
        </div>
      </div>
    </HeroShowcase>
  );
}
