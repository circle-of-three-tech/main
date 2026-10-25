import { Check, Layers, Rocket, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/ui";
import { ParallaxImage } from "@/components/motion/parallax";
import { photo, type PHOTOS } from "@/lib/photos";

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

export function Pillars() {
  return (
    <section id="approach" className="section-y border-y border-line bg-indigo" aria-labelledby="pillars-heading">
      <div className="container-x">
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
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {PILLARS.map(({ Icon, key, img, title, body, points }, i) => (
            <li key={key}>
              <Reveal delay={i * 0.1} className="h-full">
                <article className="beam-card group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-cyan/30 hover:shadow-[0_22px_44px_-22px_var(--glow)]">
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
                    <ParallaxImage src={photo(img).src} alt={photo(img).alt} speed={0.1} sizes="(min-width: 768px) 33vw, 100vw" imageClassName="transition-transform duration-700 ease-out group-hover:scale-105" />
                    <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-cyan shadow-[0_4px_12px_-4px_var(--shadow)] transition-colors duration-300 group-hover:bg-cyan group-hover:text-accent-ink">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                  <p className="text-sm font-semibold text-violet">{key}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold tracking-[-0.015em]">{title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{body}</p>
                  <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
                    {points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2.5">
                        <Check className="h-4 w-4 text-cyan" aria-hidden />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
