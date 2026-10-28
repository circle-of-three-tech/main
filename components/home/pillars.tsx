"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Layers, Rocket, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/ui";
import { photo, type PHOTOS } from "@/lib/photos";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    Icon: Layers,
    key: "Build",
    img: "codeDesk" as keyof typeof PHOTOS,
    title: "Build products that last",
    body: "Custom software, web platforms and mobile apps engineered with production-grade architecture, automated testing and security from the first commit.",
    points: ["Custom software", "Web & mobile apps", "APIs & integrations"],
  },
  {
    Icon: Rocket,
    key: "Scale",
    img: "datacenter" as keyof typeof PHOTOS,
    title: "Scale with confidence",
    body: "Cloud infrastructure, DevOps and performance engineering that keep your product fast and available as usage grows.",
    points: ["Cloud & DevOps", "Performance", "Observability"],
  },
  {
    Icon: Sparkles,
    key: "Transform",
    img: "collab" as keyof typeof PHOTOS,
    title: "Transform how work gets done",
    body: "Applied AI, automation and product design that turn manual processes into systems your team actually enjoys using.",
    points: ["AI & automation", "Product design", "Digital transformation"],
  },
];

/**
 * Two-column feature block: a soft panel holding the active pillar's photo and a floating card of its capabilities,
 * beside a vertical list of the three pillars with a sunset indicator on the active one. Hover, focus or click switches.
 * All three pillars' copy and points are in the HTML.
 */
export function Pillars() {
  const [active, setActive] = useState(0);
  return (
    <section id="approach" className="section-y" aria-labelledby="pillars-heading">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative grid aspect-[4/5] max-h-[700px] w-full overflow-hidden rounded-[32px] bg-linear-to-br from-[#f4f3ef] to-[#e9e8e4] p-5 shadow-[0_1px_2px_var(--shadow)] sm:aspect-square md:rounded-[40px] md:p-8 lg:aspect-[5/6]">
            {PILLARS.map((p, i) => (
              <div key={p.key} aria-hidden={i !== active} className={cn("absolute inset-5 overflow-hidden rounded-[22px] transition-opacity duration-700 md:inset-8 md:rounded-[28px]", i === active ? "opacity-100" : "opacity-0")}>
                <Image src={photo(p.img).src} alt={photo(p.img).alt} fill placeholder="blur" sizes="(min-width: 1024px) 45vw, 100vw" className={cn("object-cover transition-transform duration-[1400ms] ease-out", i === active ? "scale-100" : "scale-105")} />
              </div>
            ))}
            {/* Floating capability card */}
            <div className="relative grid self-end">
              {PILLARS.map((p, i) => (
                <div
                  key={p.key}
                  aria-hidden={i !== active}
                  className={cn(
                    "glass [grid-area:1/1] mx-auto w-full max-w-sm rounded-[24px] p-5 transition-[opacity,transform] duration-500 ease-out md:mb-2",
                    i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
                  )}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-bold">{p.key}</span>
                    <span className="bg-sunset flex h-8 w-8 items-center justify-center rounded-full text-white shadow-[0_6px_16px_-4px_var(--glow)]">
                      <p.Icon className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-3 rounded-xl px-2 py-2 text-[0.95rem] font-medium">
                        <Check className="h-4 w-4 text-violet" aria-hidden />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading
            id="pillars-heading"
            label="Why Co3"
            title={
              <>
                Three disciplines. <span className="text-highlight">One accountable team.</span>
              </>
            }
            lead="Design, engineering and intelligence work best together. We bring all three under one roof, so nothing gets lost between handovers."
          />
          <ul className="mt-12 space-y-9 border-l-[3px] border-line pl-8">
            {PILLARS.map((p, i) => {
              const on = i === active;
              return (
                <li key={p.key} className={cn("relative transition-opacity duration-300", on ? "opacity-100" : "opacity-50 hover:opacity-100")} onMouseEnter={() => setActive(i)}>
                  <span aria-hidden className={cn("bg-sunset absolute -left-[35px] top-0 h-full w-[3px] origin-top rounded-full transition-transform duration-500 ease-out", on ? "scale-y-100" : "scale-y-0")} />
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-violet">{p.key}</p>
                  <h3 className="mt-1.5 font-display text-xl font-bold tracking-[-0.02em] md:text-2xl">
                    <button type="button" aria-pressed={on} onClick={() => setActive(i)} onFocus={() => setActive(i)} className="cursor-pointer text-left">
                      {p.title}
                    </button>
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
