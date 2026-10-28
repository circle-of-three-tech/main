import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Pillars } from "@/components/home/pillars";
import { ServicesGrid } from "@/components/home/services-grid";
import { Stats } from "@/components/home/stats";
import { Process } from "@/components/home/process";
import { ImageBand } from "@/components/home/image-band";
import { ParallaxBand } from "@/components/home/parallax-band";
import { photo } from "@/lib/photos";
import { Reveal } from "@/components/motion/reveal";
import { PageTransition } from "@/components/motion/page-transition";
import { ProjectCard } from "@/components/site/project-card";
import { PostCard } from "@/components/site/post-card";
import { CtaSection } from "@/components/site/cta-section";
import { ButtonLink, SectionHeading } from "@/components/site/ui";
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
  const featured = projects.filter((p) => p.featured).slice(0, 4);
  const showcase = featured.length ? featured : projects.slice(0, 4);

  return (
    <PageTransition>
      <Hero services={services} />

      <Pillars />
      <ServicesGrid services={services} />

      <ParallaxBand
        image={photo("servers")}
        eyebrow="Built to scale"
        title="Reliable infrastructure behind every product we ship."
        body="Cloud architecture, automated testing, monitoring and security practices come standard, so your platform stays fast and available as your users grow."
        cta={{ href: "/services/cloud-devops", label: "Cloud & DevOps" }}
      />

      <section className="section-y" aria-labelledby="work-heading">
        <div className="container-x">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              id="work-heading"
              label="Selected work"
              title={
                <>
                  Products we&apos;ve shipped. <span className="text-highlight">Live and in use today.</span>
                </>
              }
            />
            <ButtonLink href="/portfolio" variant="ghost" arrow className="shrink-0 self-start md:self-auto">
              View all projects
            </ButtonLink>
          </div>
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
            {showcase.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 0.06}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Stats stats={settings.stats} />
      <ImageBand />
      <Process />

      {testimonials.length > 0 && (
        <section className="section-y" aria-labelledby="testimonials-heading">
          <div className="container-x">
            <h2 id="testimonials-heading" className="hud-label flex justify-center">
              What our clients say
            </h2>
            <Reveal>
              <figure className="mx-auto mt-10 max-w-5xl text-center">
                <span aria-hidden className="block font-display text-7xl font-bold leading-none text-muted/40">&ldquo;</span>
                <blockquote className="mt-2 font-display text-[clamp(1.75rem,3.8vw,3.25rem)] font-medium leading-[1.14] tracking-[-0.035em]">
                  {testimonials[0].quote}
                </blockquote>
                <figcaption className="mt-12 flex items-center justify-center gap-4 text-left">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-fg text-sm font-bold text-ink">
                    {testimonials[0].author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                  <span className="text-sm">
                    <span className="block font-bold">{testimonials[0].author}</span>
                    <span className="text-muted">
                      {testimonials[0].role}, {testimonials[0].company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
            {testimonials.length > 1 && (
              <div className="mt-20 grid gap-5 md:grid-cols-2">
                {testimonials.slice(1).map((t, i) => (
                  <Reveal key={t.id} delay={i * 0.06} className="h-full">
                    <figure className="flex h-full flex-col rounded-[28px] bg-indigo p-8 md:rounded-[32px] md:p-10">
                      <blockquote className="flex-1 text-lg leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                      <figcaption className="mt-8 flex items-center gap-3 text-sm">
                        <span aria-hidden className="bg-sunset h-2 w-2 rounded-full" />
                        <span>
                          <span className="font-bold">{t.author}</span>
                          <span className="text-muted">
                            {" "}
                            · {t.role}, {t.company}
                          </span>
                        </span>
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="section-y" aria-labelledby="insights-heading">
          <div className="container-x">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading id="insights-heading" label="Insights" title="Latest thinking from our team" />
              <ButtonLink href="/blog" variant="ghost" arrow className="shrink-0 self-start md:self-auto">
                Read the blog
              </ButtonLink>
            </div>
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
              {posts.slice(0, 3).map((post, i) => (
                <Reveal key={post.slug} delay={i * 0.06}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </PageTransition>
  );
}
