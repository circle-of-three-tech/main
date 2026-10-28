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
import { Parallax } from "@/components/motion/parallax";
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
      <header className="rounded-b-[40px] bg-indigo pb-36 pt-36 md:rounded-b-[64px] md:pb-52 md:pt-48">
        <div className="container-x">
          <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg">
            <ArrowLeft className="h-4 w-4" /> All work
          </Link>
          <p className="hud-label mt-8">
            {project.category} · {project.year}
          </p>
          <RiseText text={project.title} className="mt-3 font-display text-[clamp(2.5rem,6.4vw,5.25rem)] font-bold leading-[1.02] tracking-[-0.05em]" />
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-3xl text-xl leading-relaxed text-muted">{project.summary}</p>
          </Reveal>
          {project.url && (
            <Reveal delay={0.12} className="mt-8">
              <ButtonLink href={project.url} target="_blank" rel="noopener" variant="accent">
                Visit live site
              </ButtonLink>
            </Reveal>
          )}
        </div>
      </header>

      <Parallax className="container-x relative -mt-24 md:-mt-40">
        <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
          <div>
            <BrowserFrame project={project} priority sizes="(min-width: 1280px) 1216px, 100vw" />
          </div>
        </ViewTransition>
      </Parallax>

      <section className="container-x grid gap-16 py-20 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <dl className="divide-y divide-line rounded-[28px] border border-line bg-surface lg:sticky lg:top-28">
            {facts.map((f) => (
              <div key={f.k} className="px-6 py-5">
                <dt className="text-sm text-muted">{f.k}</dt>
                <dd className="mt-1 font-medium">{f.v}</dd>
              </div>
            ))}
            {project.techStack.length > 0 && (
              <div className="px-6 py-5">
                <dt className="text-sm text-muted">Technology</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <span key={t} className="rounded-full bg-indigo px-3 py-1 text-xs font-medium">{t}</span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </aside>
        <div className="lg:col-span-8">
          <SectionLabel>Case study</SectionLabel>
          <div className="prose-co3 mt-5" dangerouslySetInnerHTML={{ __html: sanitize(project.content) }} />
          {project.metrics.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-line bg-line">
              {project.metrics.map((m) => (
                <div key={m.label} className="flex flex-col-reverse bg-surface p-6">
                  <dt className="mt-1 text-sm text-muted">{m.label}</dt>
                  <dd className="font-display text-4xl font-bold tracking-[-0.045em]">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {project.gallery.length > 0 && (
            <div className="mt-12 grid gap-6">
              {project.gallery.map((src, i) => (
                <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-line">
                  <Image src={src} alt={`${project.title} screen ${i + 1}`} fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {next && next.slug !== project.slug && (
        <section className="container-x pb-4 pt-8" aria-label="Next project">
          <Link href={`/portfolio/${next.slug}`} className="group flex items-center justify-between gap-6 border-y border-line py-10">
            <div>
              <p className="text-sm text-muted">Next project</p>
              <p className="mt-1 font-display text-3xl font-bold tracking-[-0.04em] transition-opacity group-hover:opacity-70 md:text-5xl">{next.title}</p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-fg group-hover:bg-fg group-hover:text-ink">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>
        </section>
      )}
      <CtaSection />
    </article>
  );
}
