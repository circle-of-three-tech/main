import { Check, Clock } from "lucide-react";
import { Parallax, ParallaxImage } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/ui";
import { photo } from "@/lib/photos";

const POINTS = [
  "Senior engineers and designers based in Nigeria",
  "Lagos time (WAT) overlaps the full European working day",
  "Built for African realities: networks, payments, devices and regulation",
];

export function ImageBand() {
  const city = photo("lagos");
  return (
    <section className="section-y border-y border-line bg-indigo" aria-labelledby="base-heading">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
            <ParallaxImage src={city.src} alt={city.alt} speed={0.15} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <Parallax offset={30} className="absolute -bottom-6 right-4 sm:right-8">
            <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-[0_16px_32px_-16px_var(--shadow)]">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-soft text-cyan">
                <Clock className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold">West Africa Time</span>
                <span className="text-muted">UTC+1, aligned with Europe</span>
              </span>
            </div>
          </Parallax>
        </Reveal>
        <div>
          <SectionHeading
            id="base-heading"
            label="Our base"
            title={
              <>
                Built in Lagos. <span className="text-highlight">Delivered worldwide.</span>
              </>
            }
            lead="We work close to the markets we build for, and to the same standards as engineering teams anywhere in the world."
          />
          <ul className="mt-8 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-soft text-cyan">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
