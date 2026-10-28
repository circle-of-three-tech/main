import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/motion/page-transition";
import { RiseText } from "@/components/motion/rise-text";
import { Reveal } from "@/components/motion/reveal";
import { ArticleToc } from "@/components/blog/article-toc";
import { ShareLinks } from "@/components/blog/share-links";
import { PostCard } from "@/components/site/post-card";
import { ParallaxImage } from "@/components/motion/parallax";
import { fallbackPhoto } from "@/lib/photos";
import { CtaSection } from "@/components/site/cta-section";
import { SectionHeading } from "@/components/site/ui";
import { JsonLd } from "@/components/seo/json-ld";
import { getPost, getRelatedPosts, getSlugs } from "@/lib/queries";
import { absoluteUrl } from "@/lib/site";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { sanitize, withHeadingIds } from "@/lib/sanitize";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return getSlugs("posts");
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  return pageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    keywords: post.tags,
  });
}

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <PageTransition>
      <Suspense fallback={<div className="min-h-screen" />}>
        <PostContent params={params} />
      </Suspense>
    </PageTransition>
  );
}

async function PostContent({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post.slug, post.category);
  const { html, headings } = withHeadingIds(sanitize(post.content));
  const url = absoluteUrl(`/blog/${post.slug}`);

  return (
    <article>
      <JsonLd data={[articleJsonLd(post), breadcrumbJsonLd([{ name: "Insights", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])]} />
      <header className="container-x max-w-4xl pb-12 pt-36 md:pt-48">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg">
          <ArrowLeft className="h-4 w-4" /> All insights
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-x-2 text-sm text-muted">
          <span className="font-semibold uppercase tracking-[0.1em] text-violet">{post.category}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <RiseText text={post.title} className="mt-4 font-display text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.03] tracking-[-0.045em]" />
        <Reveal delay={0.08}>
          <p className="mt-5 text-xl leading-relaxed text-muted">{post.excerpt}</p>
        </Reveal>
        <Reveal delay={0.12} className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
          <p className="text-sm text-muted">
            By <span className="text-fg">{post.author?.name ?? "Co3 Team"}</span>
          </p>
          <ShareLinks url={url} title={post.title} />
        </Reveal>
      </header>

      <div className="container-x">
        <ViewTransition name={`post-${post.slug}`} share="morph" default="none">
          <div className="relative aspect-[21/9] overflow-hidden rounded-[28px] bg-indigo shadow-[0_40px_80px_-40px_rgb(27_27_27/0.35)] md:rounded-[40px]">
            <ParallaxImage src={post.coverImage ?? fallbackPhoto(post.slug).src} alt={post.title} sizes="(min-width: 1280px) 1240px, 100vw" priority />
          </div>
        </ViewTransition>
      </div>

      <div className="container-x grid gap-16 py-16 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-32">
            <ArticleToc headings={headings} />
          </div>
        </aside>
        <div className="lg:col-span-8 lg:col-start-4 xl:col-span-7 xl:col-start-4">
          <div className="prose-co3" dangerouslySetInnerHTML={{ __html: html }} />
          {post.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8" aria-label="Tags">
              {post.tags.map((t) => (
                <li key={t}>
                  <Link href={`/blog?q=${encodeURIComponent(t)}`} className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg">
                    #{t}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-x section-y" aria-labelledby="related-heading">
          <SectionHeading id="related-heading" label="Keep reading" title="Related insights" />
          <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
      <CtaSection />
    </article>
  );
}
