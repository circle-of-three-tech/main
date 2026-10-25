import Image from "next/image";
import { BrainCircuit, Code2, PenTool } from "lucide-react";
import { photo } from "@/lib/photos";
import { RiseIn } from "@/components/motion/rise-text";
import { ButtonLink } from "@/components/site/ui";

const DISCIPLINES = [
  { Icon: PenTool, label: "Product design" },
  { Icon: Code2, label: "Software engineering" },
  { Icon: BrainCircuit, label: "Data & AI" },
];

export function Hero() {
  const img = photo("team");
  return (
    <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <RiseIn>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
              Software &amp; technology partner · Lagos, Nigeria
            </p>
          </RiseIn>
          <h1 className="rise-in mt-6 font-display text-[clamp(2.4rem,5vw,3.85rem)] font-semibold leading-[1.04] tracking-[-0.035em]" style={{ animationDelay: "0.04s" }}>
            Nigerian software,
            <span className="block text-highlight">engineered for the world.</span>
          </h1>
          <RiseIn delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
              Circle of Three Technologies designs and builds custom software, web platforms, mobile apps and AI systems for organisations in Nigeria, across
              Africa and beyond.
            </p>
          </RiseIn>
          <RiseIn delay={0.16} className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact">Start a project</ButtonLink>
            <ButtonLink href="/portfolio" variant="ghost">
              View our work
            </ButtonLink>
          </RiseIn>
        </div>

        <RiseIn delay={0.12} className="relative lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-indigo sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image src={img.src} alt={img.alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" placeholder="blur" className="object-cover" />
          </div>
          <div className="glass absolute -bottom-6 left-4 right-4 rounded-xl p-5 sm:left-auto sm:right-6 sm:w-72 lg:-left-10 lg:right-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">One team, three disciplines</p>
            <ul className="mt-3 space-y-2.5">
              {DISCIPLINES.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm font-medium">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo text-cyan">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </RiseIn>
      </div>
    </section>
  );
}
