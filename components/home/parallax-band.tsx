import { ParallaxImage } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/site/ui";
import type { Photo } from "@/lib/photos";

/** Full-bleed photo band with scroll parallax and a short statement on a flat azure-navy overlay. */
export function ParallaxBand({
  image,
  eyebrow,
  title,
  body,
  cta,
}: {
  image: Photo;
  eyebrow: string;
  title: string;
  body: string;
  cta?: { href: string; label: string };
}) {
  return (
    <section className="relative isolate overflow-hidden py-28 md:py-40" aria-label={eyebrow}>
      <ParallaxImage src={image.src} alt={image.alt} speed={0.22} sizes="100vw" />
      <div aria-hidden className="absolute inset-0 bg-band/75" />
      <div className="container-x relative">
        <Reveal className="max-w-2xl text-band-fg">
          <p className="hud-label !text-band-fg/80">{eyebrow}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.12] tracking-[-0.025em] md:text-5xl">{title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-band-muted">{body}</p>
          {cta && (
            <ButtonLink href={cta.href} className="mt-8">
              {cta.label}
            </ButtonLink>
          )}
        </Reveal>
      </div>
    </section>
  );
}
