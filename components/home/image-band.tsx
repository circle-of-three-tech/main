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
    <section className="section-y" aria-labelledby="base-heading">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
        <Reveal className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_40px_80px_-40px_rgb(27_27_27/0.35)] md:rounded-[40px]">
            <ParallaxImage src={city.src} alt={city.alt} speed={0.15} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <Parallax offset={30} className="absolute -bottom-6 right-4 sm:right-8">
            <div className="glass flex items-center gap-3 rounded-[20px] px-4 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-fg text-ink">
                <Clock className="h-4 w-4" aria-hidden />
              </span>
              <span className="pr-2 text-sm leading-tight">
                <span className="block font-bold">West Africa Time</span>
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
          <ul className="mt-9 space-y-4">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fg text-ink">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="text-[1.05rem]">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
