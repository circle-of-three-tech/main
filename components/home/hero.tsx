import Link from "next/link";
import { ButtonLink } from "@/components/site/ui";
import { servicePhoto } from "@/lib/photos";
import { HeroCarousel, type HeroSlide } from "./hero-carousel";

type Service = { slug: string; title: string; tagline: string; icon: string };

/** Delay helper for the staggered opacity fade on hero copy. */
const fade = (s: number) => ({ animationDelay: `${s}s` });

export function Hero({ services }: { services: Service[] }) {
  const slides: HeroSlide[] = services.map((s) => {
    const p = servicePhoto(s.slug);
    return { slug: s.slug, title: s.title, tagline: s.tagline, icon: s.icon, image: p.src, alt: `${s.title}: ${p.alt}` };
  });

  return (
    <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40" aria-labelledby="hero-heading">
      {/* Soft azure wash behind the hero (flat shapes, no gradients) */}
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-cyan-soft opacity-70 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 rounded-full bg-spark/10 blur-3xl" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <h1 id="hero-heading" className="font-display text-[clamp(2.4rem,5vw,3.85rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
            <span className="hero-fade block" style={fade(0.05)}>
              Nigerian software,
            </span>
            <span className="hero-fade block text-cyan" style={fade(0.35)}>
              engineered for the world.
            </span>
          </h1>
          <p className="hero-fade mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl" style={fade(0.65)}>
            Circle of Three Technologies designs and builds custom software, web platforms, mobile apps and AI systems for organisations in Nigeria, across
            Africa and beyond.
          </p>
          <div className="hero-fade mt-9 flex flex-wrap items-center gap-3" style={fade(0.9)}>
            <ButtonLink href="/contact">Start a project</ButtonLink>
            <ButtonLink href="/portfolio" variant="ghost">
              View our work
            </ButtonLink>
          </div>
          <nav aria-label="Services" className="hero-fade mt-10 hidden border-t border-line pt-6 lg:block" style={fade(1.15)}>
            <p className="text-sm text-muted">What we do</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="inline-block rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium transition-[border-color,color,transform] duration-200 hover:-translate-y-px hover:border-cyan/50 hover:text-cyan"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="hero-fade lg:col-span-6" style={fade(0.1)}>
          <HeroCarousel slides={slides} />
        </div>
      </div>
    </section>
  );
}
