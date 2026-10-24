import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Triad } from "@/components/home/triad";
import { ServicesGrid } from "@/components/home/services-grid";
import { WorkRail } from "@/components/home/work-rail";
import { Stats } from "@/components/home/stats";
import { Process } from "@/components/home/process";
import { ImageBand } from "@/components/home/image-band";
import { Marquee } from "@/components/motion/marquee";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Reveal } from "@/components/motion/reveal";
import { PageTransition } from "@/components/motion/page-transition";
import { ProjectCard } from "@/components/site/project-card";
import { PostCard } from "@/components/site/post-card";
import { CtaSection } from "@/components/site/cta-section";
import { ButtonLink, SectionLabel } from "@/components/site/ui";
import { getPosts, getProjects, getServices, getSettings, getTestimonials } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Circle of Three Technologies | Nigerian Technology & Software Company",
    description:
      "Circle of Three Technologies (Co3) is a Nigerian technology company and software development studio. We build custom software, web platforms, mobile apps and AI solutions for businesses in Nigeria, Africa and worldwide.",
    path: "/",
  }),
  title: { absolute: "Circle of Three Technologies | Nigerian Technology & Software Company" },
};

export default async function HomePage() {
  const [services, projects, posts, settings, testimonials] = await Promise.all([getServices(), getProjects(), getPosts(), getSettings(), getTestimonials()]);
  const featured = projects.filter((p) => p.featured).slice(0, 6);
  const showcase = featured.length ? featured : projects.slice(0, 6);

  return (
    <PageTransition>
      <Hero />

      <section aria-label="Clients and industries" className="border-y border-line py-8">
        <Marquee duration={45}>
          {projects.map((p) => (
            <span key={p.slug} className="flex items-center gap-10 pr-10 font-display text-2xl font-semibold tracking-tight text-muted/80 md:text-3xl">
              {p.client}
              <span className="h-1.5 w-1.5 rotate-45 bg-cyan" aria-hidden />
            </span>
          ))}
        </Marquee>
      </section>

      <Triad />
      <ServicesGrid services={services} />

      <WorkRail
        header={
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel index="03">Selected work</SectionLabel>
              <SplitReveal text="Products we've shipped, live in the world." highlight={["shipped,"]} className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl" />
            </div>
            <ButtonLink href="/portfolio" variant="ghost">View all projects</ButtonLink>
          </div>
        }
      >
        {showcase.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} className="w-full lg:w-[min(46vw,640px)] lg:shrink-0" />
        ))}
      </WorkRail>

      <Stats stats={settings.stats} />
      <ImageBand />
      <Process />

      {testimonials.length > 0 && (
        <section className="container-x py-24" aria-labelledby="testimonials-heading">
          <SectionLabel>Client voices</SectionLabel>
          <h2 id="testimonials-heading" className="sr-only">Testimonials</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.08}>
                <figure className="glass hud relative h-full rounded-2xl p-8">
                  <blockquote className="font-display text-xl leading-relaxed md:text-2xl">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-6 text-sm text-muted">
                    <span className="font-semibold text-fg">{t.author}</span> · {t.role}, {t.company}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="container-x py-24" aria-labelledby="insights-heading">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel index="05">Insights</SectionLabel>
              <h2 id="insights-heading" className="mt-6 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                Notes from the <span className="text-highlight">engine room.</span>
              </h2>
            </div>
            <ButtonLink href="/blog" variant="ghost">Read the blog</ButtonLink>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {posts.slice(0, 3).map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.1}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CtaSection />
    </PageTransition>
  );
}
