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
import { Quote } from "lucide-react";
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

      <section className="border-t border-line pb-4 pt-20 md:pt-28" aria-labelledby="work-heading">
        <div className="container-x">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
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
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
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
        <section className="section-y border-t border-line bg-indigo" aria-labelledby="testimonials-heading">
          <div className="container-x">
            <SectionHeading id="testimonials-heading" label="Client feedback" title="What our clients say" />
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 0.06} className="h-full">
                  <figure className="beam-card flex h-full flex-col rounded-xl border border-line bg-surface p-8">
                    <Quote className="h-6 w-6 text-cyan" aria-hidden />
                    <blockquote className="mt-5 flex-1 text-lg leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption className="mt-6 border-t border-line pt-5 text-sm">
                      <span className="block font-semibold">{t.author}</span>
                      <span className="text-muted">
                        {t.role}, {t.company}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="section-y border-t border-line" aria-labelledby="insights-heading">
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
