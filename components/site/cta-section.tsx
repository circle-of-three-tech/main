import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ParallaxImage } from "@/components/motion/parallax";
import { photo, type Photo } from "@/lib/photos";
import { buttonClass } from "@/components/site/ui";

/** Closing call to action on a parallax photo with a flat azure-navy overlay. */
export function CtaSection({
  title = "Have a project in mind? Let's talk.",
  body = "Tell us what you're building. A senior member of our team will reply within one business day with clear next steps.",
  image = photo("collab"),
}: {
  title?: string;
  body?: string;
  image?: Photo;
}) {
  return (
    <section className="container-x py-20 md:py-24" aria-label="Start a project">
      <Reveal>
        <div className="relative isolate flex flex-col gap-10 overflow-hidden rounded-2xl bg-band px-7 py-12 text-band-fg md:px-14 md:py-20 lg:flex-row lg:items-end lg:justify-between">
          <ParallaxImage src={image.src} alt="" speed={0.18} sizes="(min-width: 1280px) 1240px, 100vw" className="-z-10" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-band/80" />
          <div aria-hidden className="on-photo tech-grid absolute inset-0 -z-10" />
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-[-0.025em] md:text-[2.6rem]">{title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-band-muted">{body}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/contact"
              className={buttonClass("accent")}
            >
              Start a project <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center rounded-lg border border-band-fg/25 px-5 py-3 text-sm font-semibold text-band-fg transition-colors hover:border-band-fg/60"
            >
              See our work
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
