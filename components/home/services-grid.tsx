import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GlowCard } from "@/components/motion/glow-card";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { SectionLabel, ButtonLink } from "@/components/site/ui";
import { ServiceIcon } from "@/components/site/service-icon";

type Service = { slug: string; title: string; tagline: string; icon: string; summary: string };

export function ServicesGrid({ services, index = "02", heading = true }: { services: Service[]; index?: string; heading?: boolean }) {
  return (
    <section className="container-x relative py-24 md:py-32" aria-labelledby="services-heading">
      {heading && (
        <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel index={index}>What we do</SectionLabel>
            <SplitReveal
              text="Full-spectrum software development, from first sketch to scale."
              highlight={["software", "scale."]}
              className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl"
            />
            <span id="services-heading" className="sr-only">Software development services</span>
          </div>
          <ButtonLink href="/services" variant="ghost">All services</ButtonLink>
        </div>
      )}
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <li key={s.slug}>
            <Reveal delay={(i % 3) * 0.08} className="h-full">
              <GlowCard className="h-full">
                <Link href={`/services/${s.slug}`} className="flex h-full flex-col p-7 md:p-8" data-cursor="Explore">
                  <div className="flex items-start justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-ink/60 text-cyan transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_-4px_var(--glow)]">
                      <ServiceIcon name={s.icon} className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-10 font-display text-2xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{s.tagline}</p>
                  <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg/70 transition-colors group-hover:text-cyan">
                    Learn more <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </Link>
              </GlowCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
