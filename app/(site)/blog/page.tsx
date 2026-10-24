import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { PageHero } from "@/components/site/ui";
import { CtaSection } from "@/components/site/cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import { getPosts } from "@/lib/queries";
import { absoluteUrl, site } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Insights: Software, AI & Tech in Nigeria",
  description:
    "Articles on software development, AI, product design and technology in Nigeria and Africa from the engineers at Circle of Three Technologies.",
  path: "/blog",
  keywords: ["tech blog Nigeria", "software development blog", "AI in Africa"],
});

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <PageTransition>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Insights", path: "/blog" }]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${site.name} Insights`,
            url: absoluteUrl("/blog"),
            blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absoluteUrl(`/blog/${p.slug}`), datePublished: p.publishedAt?.toISOString() })),
          },
        ]}
      />
      <PageHero label="Insights" title="Notes from the engine room." highlight={["engine", "room."]} intro="Practical writing on software engineering, AI, product design and building technology for African markets." />
      <section className="container-x pb-16">
        <BlogExplorer posts={posts.map((p) => ({ ...p, author: undefined }))} />
      </section>
      <CtaSection title="Want ideas like these applied to your product?" />
    </PageTransition>
  );
}
