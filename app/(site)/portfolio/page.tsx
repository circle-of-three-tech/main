import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { ProjectCard } from "@/components/site/project-card";
import { CtaSection } from "@/components/site/cta-section";
import { PageHero } from "@/components/site/ui";
import { JsonLd } from "@/components/seo/json-ld";
import { getProjects } from "@/lib/queries";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio: Software, Web & AI Projects",
  description:
    "Explore live products built by Circle of Three Technologies: healthcare, EdTech, AI assessment, marketplaces, commerce and corporate platforms for clients in Nigeria and worldwide.",
  path: "/portfolio",
  keywords: ["software portfolio Nigeria", "web development portfolio", "Nigerian tech company projects"],
});

export default async function PortfolioPage() {
  const projects = await getProjects();
  return (
    <PageTransition>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Portfolio", path: "/portfolio" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/portfolio/${p.slug}`), name: p.title })),
          },
        ]}
      />
      <PageHero
        label={`Portfolio · ${projects.length} live products`}
        title="Work that ships, scales and sticks."
        highlight={["ships,", "scales", "sticks."]}
        intro="A selection of platforms, products and experiences we've designed and engineered for organisations across healthcare, education, commerce and consulting."
      />
      <section className="container-x pb-16">
        <PortfolioGrid items={projects.map((p, i) => ({ slug: p.slug, category: p.category, node: <ProjectCard project={p} index={i} priority={i < 2} /> }))} />
      </section>
      <CtaSection title="Your product could be next." />
    </PageTransition>
  );
}
