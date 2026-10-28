import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink, SectionHeading } from "@/components/site/ui";
import { ServiceIcon } from "@/components/site/service-icon";
import { servicePhoto } from "@/lib/photos";

type Service = { slug: string; title: string; tagline: string; icon: string; summary: string };

/** Edge-to-edge photo cards, one per service: frosted icon chip on top, title and tagline on a dark fade at the bottom. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ServicesGrid({ services, index, heading = true }: { services: Service[]; index?: string; heading?: boolean }) {
  return (
    <section className={heading ? "section-y" : "pt-14 md:pt-20"} aria-labelledby="services-heading">
      <div className="container-x">
        {heading ? (
          <div className="mb-14 flex flex-col items-center gap-8 text-center">
            <SectionHeading
              id="services-heading"
              label="What we do"
              align="center"
              title="End-to-end software development, from first sketch to scale."
              lead="Strategy, design, engineering and operations delivered by one senior team."
              className="max-w-3xl"
            />
            <ButtonLink href="/services" variant="ghost" arrow>
              All services
            </ButtonLink>
          </div>
        ) : (
          <h2 id="services-heading" className="sr-only">
            Our services
          </h2>
        )}
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const p = servicePhoto(s.slug);
            return (
              <li key={s.slug}>
                <Reveal delay={(i % 3) * 0.06} className="h-full">
                  <Link
                    href={`/services/${s.slug}`}
                    className="on-photo group relative isolate flex h-[360px] flex-col justify-between overflow-hidden rounded-[28px] bg-band p-6 text-fg shadow-[0_1px_2px_var(--shadow)] md:h-[420px] md:rounded-[32px] md:p-7"
                  >
                    <Image src={p.src} alt="" fill placeholder="blur" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                    <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/30 to-black/5 transition-colors duration-500 group-hover:from-black/85" />
                    <div className="flex items-start justify-between">
                      <span className="glass-dark flex h-11 w-11 items-center justify-center rounded-full">
                        <ServiceIcon name={s.icon} className="h-5 w-5" />
                      </span>
                      <span className="glass-dark flex h-10 w-10 translate-y-1 items-center justify-center rounded-full opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold tracking-[-0.025em]">{s.title}</h3>
                      <p className="mt-2 leading-relaxed text-muted">{s.tagline}</p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
