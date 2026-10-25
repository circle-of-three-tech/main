import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink, SectionHeading } from "@/components/site/ui";
import { ServiceIcon } from "@/components/site/service-icon";

type Service = { slug: string; title: string; tagline: string; icon: string; summary: string };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ServicesGrid({ services, index, heading = true }: { services: Service[]; index?: string; heading?: boolean }) {
  return (
    <section className={heading ? "section-y" : "pt-14 md:pt-16"} aria-labelledby="services-heading">
      <div className="container-x">
        {heading ? (
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              id="services-heading"
              label="What we do"
              title="End-to-end software development, from first sketch to scale."
              lead="Strategy, design, engineering and operations delivered by one senior team."
            />
            <ButtonLink href="/services" variant="ghost" arrow className="shrink-0 self-start md:self-auto">
              All services
            </ButtonLink>
          </div>
        ) : (
          <h2 id="services-heading" className="sr-only">
            Our services
          </h2>
        )}
        <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.slug} className="bg-surface">
              <Reveal delay={(i % 3) * 0.05} className="h-full">
                <Link href={`/services/${s.slug}`} className="beam-card group relative flex h-full flex-col p-7 transition-colors duration-300 hover:bg-indigo md:p-8">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-cyan transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-soft text-cyan transition-[background-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:bg-cyan group-hover:text-accent-ink group-hover:shadow-[0_0_18px_var(--glow)]">
                    <ServiceIcon name={s.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 font-display text-lg font-semibold tracking-[-0.01em]">{s.title}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-muted">{s.tagline}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
