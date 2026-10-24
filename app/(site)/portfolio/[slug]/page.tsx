import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageTransition } from "@/components/motion/page-transition";
import { RiseText } from "@/components/motion/rise-text";
import { Reveal } from "@/components/motion/reveal";
import { BrowserFrame } from "@/components/site/project-card";
import { CtaSection } from "@/components/site/cta-section";
import { ButtonLink, SectionLabel } from "@/components/site/ui";
import { Parallax, ParallaxImage } from "@/components/motion/parallax";
import { fallbackPhoto } from "@/lib/photos";
import { JsonLd } from "@/components/seo/json-ld";
import { getProject, getProjects, getSlugs } from "@/lib/queries";
import { breadcrumbJsonLd, pageMetadata, projectJsonLd } from "@/lib/seo";
import { sanitize } from "@/lib/sanitize";

export async function generateStaticParams() {
  return getSlugs("projects");
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return { title: "Project not found", robots: { index: false } };
  return pageMetadata({
    title: p.seoTitle || `${p.title}: ${p.category} Case Study`,
    description: p.seoDescription || p.summary,
    path: `/portfolio/${p.slug}`,
    image: p.coverImage,
    keywords: [p.title, p.category, ...p.techStack],
  });
}

export default function ProjectPage({ params }: PageProps<"/portfolio/[slug]">) {
  return (
    <PageTransition>
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProjectContent params={params} />
      </Suspense>
    </PageTransition>
  );
}

async function ProjectContent({ params }: { params: PageProps<"/portfolio/[slug]">["params"] }) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();
  const idx = all.findIndex((p) => p.slug === project.slug);
  const next = all[(idx + 1) % all.length];
  const facts = [
    { k: "Client", v: project.client },
    { k: "Industry", v: project.category },
    { k: "Year", v: String(project.year) },
    { k: "Services", v: project.services.join(", ") || "Product engineering" },
  ];

  return (
    <article>
      <JsonLd data={[projectJsonLd(project), breadcrumbJsonLd([{ name: "Portfolio", path: "/portfolio" }, { name: project.title, path: `/portfolio/${project.slug}` }])]} />
      <header className="relative overflow-hidden pb-40 pt-36 md:pb-56 md:pt-44">
        <ParallaxImage src={fallbackPhoto(project.slug).src} alt="" priority speed={0.2} />
        <div className="scrim absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <Link href="/portfolio" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-cyan">
            <ArrowLeft className="h-4 w-4" /> All work
          </Link>
          <p className="hud-label accent-text mt-10" style={{ "--accent": project.accent } as React.CSSProperties}>
            {project.category} · {project.year}
          </p>
          <RiseText text={project.title} className="mt-4 font-display text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.95] tracking-tight" />
          <Reveal delay={0.25}>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-muted">{project.summary}</p>
          </Reveal>
          {project.url && (
            <Reveal delay={0.4} className="mt-8">
              <ButtonLink href={project.url} target="_blank" rel="noopener" cursor="Visit">
                Visit live site
              </ButtonLink>
            </Reveal>
          )}
        </div>
      </header>

      <Parallax offset={40} className="container-x relative -mt-28 md:-mt-44">
        <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
          <div>
            <BrowserFrame project={project} priority sizes="(min-width: 1280px) 1216px, 100vw" />
          </div>
        </ViewTransition>
      </Parallax>

      <section className="container-x grid gap-16 py-20 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <dl className="glass hud relative divide-y divide-line rounded-2xl lg:sticky lg:top-32">
            {facts.map((f) => (
              <div key={f.k} className="p-6">
                <dt className="hud-label text-muted">{f.k}</dt>
                <dd className="mt-2 font-display text-lg">{f.v}</dd>
              </div>
            ))}
            {project.techStack.length > 0 && (
              <div className="p-6">
                <dt className="hud-label text-muted">Stack</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg/80">{t}</span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </aside>
        <div className="lg:col-span-8">
          <SectionLabel>Case study</SectionLabel>
          <div className="prose-co3 mt-8" dangerouslySetInnerHTML={{ __html: sanitize(project.content) }} />
          {project.metrics.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {project.metrics.map((m) => (
                <div key={m.label} className="bg-ink p-6">
                  <dt className="hud-label text-muted">{m.label}</dt>
                  <dd className="mt-2 font-display text-4xl font-bold text-highlight">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {project.gallery.length > 0 && (
            <div className="mt-12 grid gap-6">
              {project.gallery.map((src, i) => (
                <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line">
                  <Image src={src} alt={`${project.title} screen ${i + 1}`} fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {next && next.slug !== project.slug && (
        <section className="container-x py-16" aria-label="Next project">
          <Link href={`/portfolio/${next.slug}`} className="group flex flex-col items-start justify-between gap-6 border-y border-line py-12 md:flex-row md:items-center" data-cursor="Next">
            <div>
              <p className="hud-label text-muted">Next project</p>
              <p className="mt-3 font-display text-5xl font-bold tracking-tight transition-colors group-hover:text-cyan md:text-7xl">{next.title}</p>
            </div>
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-line transition-all duration-700 group-hover:rotate-45 group-hover:border-cyan group-hover:bg-cyan group-hover:text-ink">
              <ArrowUpRight className="h-8 w-8" />
            </span>
          </Link>
        </section>
      )}
      <CtaSection />
    </article>
  );
}
