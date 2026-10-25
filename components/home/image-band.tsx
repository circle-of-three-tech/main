import Image from "next/image";
import { Check } from "lucide-react";
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
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
            <Image src={city.src} alt={city.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" placeholder="blur" className="object-cover" />
          </div>
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
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan text-accent-ink">
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
