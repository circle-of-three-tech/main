import { ButtonLink } from "@/components/site/ui";
import { heroArt } from "@/lib/photos";
import { HeroShowcase, type HeroSlide } from "./hero-showcase";

type Service = { slug: string; title: string; tagline: string; icon: string };

/** Delay helper for the staggered opacity fade on hero copy. */
const fade = (s: number) => ({ animationDelay: `${s}s` });

export function Hero({ services }: { services: Service[] }) {
  const slides: HeroSlide[] = services.map((s) => {
    const p = heroArt(s.slug);
    return { slug: s.slug, title: s.title, tagline: s.tagline, image: p.src, alt: `${s.title}: ${p.alt}` };
  });

  return (
    <section aria-labelledby="hero-heading" className="relative pt-36 md:pt-48">
      <div className="container-x flex flex-col items-center text-center">
        <p className="hud-label hero-fade">Software company · Lagos, Nigeria</p>
        <h1 id="hero-heading" className="mt-6 max-w-5xl font-display text-[clamp(2.75rem,7.6vw,6.25rem)] font-bold leading-[0.98] tracking-[-0.055em]">
          <span className="hero-fade block" style={fade(0.1)}>
            Nigerian software,
          </span>
          <span className="hero-fade text-highlight block" style={fade(0.35)}>
            engineered for the world.
          </span>
        </h1>
        <p className="hero-fade mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl" style={fade(0.6)}>
          Circle of Three Technologies designs and builds custom software, web platforms, mobile apps and AI systems for organisations in Nigeria, across Africa
          and beyond.
        </p>
        <div className="hero-fade mt-10 flex flex-wrap items-center justify-center gap-3" style={fade(0.8)}>
          <ButtonLink href="/contact" variant="accent">
            Start a project
          </ButtonLink>
          <ButtonLink href="/portfolio" variant="ghost">
            View our work
          </ButtonLink>
        </div>
      </div>
      <div className="container-x hero-fade mt-16 md:mt-24" style={fade(0.5)}>
        <HeroShowcase slides={slides} />
      </div>
    </section>
  );
}
