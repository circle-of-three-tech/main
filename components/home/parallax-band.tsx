import { ParallaxImage } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/site/ui";
import type { Photo } from "@/lib/photos";

/** Wide rounded photo card with scroll parallax and a short statement on a dark fade. */
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
    <section className="container-x py-6 md:py-10" aria-label={eyebrow}>
      <div className="on-photo relative isolate flex min-h-[520px] items-end overflow-hidden rounded-[28px] bg-band px-6 py-12 text-fg md:min-h-[640px] md:rounded-[40px] md:px-14 md:py-16">
        <ParallaxImage src={image.src} alt={image.alt} speed={0.18} sizes="(min-width: 1320px) 1240px, 100vw" className="-z-20" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-tr from-black/80 via-black/45 to-black/5" />
        <Reveal className="max-w-2xl">
          <p className="hud-label">{eyebrow}</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.6vw,3.75rem)] font-bold leading-[1.04] tracking-[-0.04em]">{title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{body}</p>
          {cta && (
            <ButtonLink href={cta.href} variant="light" className="mt-9">
              {cta.label}
            </ButtonLink>
          )}
        </Reveal>
      </div>
    </section>
  );
}
