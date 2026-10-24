import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Check, ChevronDown } from "lucide-react";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { GlowCard } from "@/components/motion/glow-card";
import { CtaSection } from "@/components/site/cta-section";
import { PageHero, SectionLabel } from "@/components/site/ui";
import { ProjectCard } from "@/components/site/project-card";
import { ServiceIcon } from "@/components/site/service-icon";
import { JsonLd } from "@/components/seo/json-ld";
import { getProjects, getService, getServices, getSlugs } from "@/lib/queries";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { sanitize } from "@/lib/sanitize";

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
      <PageHero label={`Service · ${service.title}`} title={service.tagline} intro={service.summary}>
        <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan/40 bg-cyan/10 text-cyan shadow-[0_0_40px_-6px_var(--glow)]">
          <ServiceIcon name={service.icon} className="h-7 w-7" />
        </div>
      </PageHero>

      <section className="container-x grid gap-16 py-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel>Overview</SectionLabel>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight md:text-4xl">{service.title} by Circle of Three Technologies</h2>
          <div className="prose-co3 mt-8" dangerouslySetInnerHTML={{ __html: sanitize(service.content) }} />
        </div>
        <aside className="lg:col-span-5">
          <div className="glass hud relative rounded-2xl p-8 lg:sticky lg:top-32">
            <p className="hud-label">What you get</p>
            <ul className="mt-6 space-y-4">
              {service.deliverables.map((d, i) => (
                <Reveal key={d} delay={i * 0.05} y={12} blur={false}>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-fg/90">{d}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {service.faqs.length > 0 && (
        <section className="container-x py-16" aria-labelledby="faq-heading">
          <SectionLabel>FAQ</SectionLabel>
          <h2 id="faq-heading" className="mt-6 font-display text-3xl font-bold tracking-tight md:text-5xl">Frequently asked questions</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {service.faqs.map((f) => (
              <details key={f.q} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-semibold">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-cyan transition-transform duration-500 group-open:rotate-180" />
                </summary>
                <p className="mt-4 max-w-3xl leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-x py-16">
          <SectionLabel>Related work</SectionLabel>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {related.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      <section className="container-x py-16" aria-label="Other services">
        <SectionLabel>Explore more</SectionLabel>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {others.map((s) => (
            <li key={s.slug}>
              <GlowCard className="h-full">
                <Link href={`/services/${s.slug}`} className="flex h-full flex-col gap-4 p-5">
                  <ServiceIcon name={s.icon} className="h-5 w-5 text-cyan" />
                  <span className="font-display font-semibold">{s.title}</span>
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
