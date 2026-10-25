import { Check, Layers, Rocket, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/ui";

const PILLARS = [
  {
    Icon: Layers,
    key: "Build",
    title: "Build products that last",
    body: "Custom software, web platforms and mobile apps engineered with production-grade architecture, automated testing and security from the first commit.",
    points: ["Custom software", "Web & mobile apps", "APIs & integrations"],
  },
  {
    Icon: Rocket,
    key: "Scale",
    title: "Scale with confidence",
    body: "Cloud infrastructure, DevOps and performance engineering that keep your product fast and available as usage grows.",
    points: ["Cloud & DevOps", "Performance", "Observability"],
  },
  {
    Icon: Sparkles,
    key: "Transform",
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
          {PILLARS.map(({ Icon, key, title, body, points }, i) => (
            <li key={key}>
              <Reveal delay={i * 0.06} className="h-full">
                <article className="flex h-full flex-col rounded-xl border border-line bg-surface p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo text-cyan">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="mt-6 text-sm font-semibold text-cyan">{key}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold tracking-[-0.015em]">{title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{body}</p>
                  <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
                    {points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2.5">
                        <Check className="h-4 w-4 text-ok" aria-hidden />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
