import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Check, ChevronDown } from "lucide-react";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { GlowCard } from "@/components/motion/glow-card";
import { CtaSection } from "@/components/site/cta-section";
import { ButtonLink, PageHero, SectionHeading, SectionLabel } from "@/components/site/ui";
import { ProjectCard } from "@/components/site/project-card";
import { ServiceIcon } from "@/components/site/service-icon";
import { JsonLd } from "@/components/seo/json-ld";
import { getProjects, getService, getServices, getSlugs } from "@/lib/queries";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { sanitize } from "@/lib/sanitize";
import { servicePhoto } from "@/lib/photos";

export async function generateStaticParams() {
  return getSlugs("services");
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return { title: "Service not found", robots: { index: false } };
  return pageMetadata({
    title: s.seoTitle || `${s.title} Company in Nigeria`,
    description: s.seoDescription || s.summary,
    path: `/services/${s.slug}`,
    keywords: [s.title, `${s.title} Nigeria`, `${s.title} company`, `${s.title} Lagos`],
  });
}

export default function ServicePage({ params }: PageProps<"/services/[slug]">) {
  return (
    <PageTransition>
      <Suspense fallback={<div className="min-h-screen" />}>
        <ServiceContent params={params} />
      </Suspense>
    </PageTransition>
  );
}

async function ServiceContent({ params }: { params: PageProps<"/services/[slug]">["params"] }) {
  const { slug } = await params;
  const [service, all, projects] = await Promise.all([getService(slug), getServices(), getProjects()]);
  if (!service) notFound();
  const related = projects.filter((p) => p.services.includes(service.title)).slice(0, 2);
  const others = all.filter((s) => s.slug !== service.slug);

  return (
    <>
      <JsonLd data={[...serviceJsonLd(service, service.faqs), breadcrumbJsonLd([{ name: "Services", path: "/services" }, { name: service.title, path: `/services/${service.slug}` }])]} />
      <PageHero label={`Service · ${service.title}`} title={service.tagline} image={servicePhoto(service.slug)} intro={service.summary}>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/contact" variant="accent">Discuss your project</ButtonLink>
          <ButtonLink href="/portfolio" variant="ghost">
            See related work
          </ButtonLink>
        </div>
      </PageHero>

      <section className="container-x section-y grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionLabel>Overview</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.025em] md:text-[2.4rem] md:leading-tight">{service.title} by Circle of Three Technologies</h2>
          <div className="prose-co3 mt-6" dangerouslySetInnerHTML={{ __html: sanitize(service.content) }} />
        </div>
        <aside className="lg:col-span-5">
          <div className="rounded-xl border border-line bg-indigo p-7 lg:sticky lg:top-28">
            <p className="font-display text-lg font-semibold">What you get</p>
            <ul className="mt-5 space-y-3.5">
              {service.deliverables.map((d, i) => (
                <Reveal key={d} delay={i * 0.05} y={12} blur={false}>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan text-accent-ink">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{d}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {service.faqs.length > 0 && (
        <section className="container-x section-y border-t border-line" aria-labelledby="faq-heading">
          <div className="grid gap-10 lg:grid-cols-12">
          <SectionHeading id="faq-heading" label="FAQ" title="Frequently asked questions" className="lg:col-span-4" />
          <div className="divide-y divide-line border-y border-line lg:col-span-8">
            {service.faqs.map((f) => (
              <details key={f.q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-x section-y border-t border-line" aria-labelledby="related-heading">
          <SectionHeading id="related-heading" label="Related work" title={`${service.title} projects`} />
          <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2">
            {related.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      <section className="container-x section-y border-t border-line" aria-labelledby="more-heading">
        <SectionHeading id="more-heading" label="Explore more" title="Other services" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {others.map((s) => (
            <li key={s.slug}>
              <GlowCard className="h-full">
                <Link href={`/services/${s.slug}`} className="flex h-full flex-col gap-4 p-5">
                  <ServiceIcon name={s.icon} className="h-5 w-5 text-cyan" />
                  <span className="font-semibold">{s.title}</span>
                </Link>
              </GlowCard>
            </li>
          ))}
        </ul>
      </section>

      <CtaSection />
    </>
  );
}
