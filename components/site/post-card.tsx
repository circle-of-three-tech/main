import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { GlyphScramble } from "@/components/motion/glyph-scramble";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { fallbackPhoto } from "@/lib/photos";

export type PostCardData = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  readingTime: number;
  publishedAt: Date | null;
};

/** Post cover image, falling back to a stable stock photo picked from the slug. */
export function PostCover({ post, className, sizes = "(min-width: 1024px) 33vw, 100vw" }: { post: Pick<PostCardData, "slug" | "title" | "coverImage" | "category">; className?: string; sizes?: string }) {
  if (post.coverImage) {
    return <Image src={post.coverImage} alt={post.title} fill sizes={sizes} className={cn("object-cover", className)} />;
  }
  const fallback = fallbackPhoto(post.slug);
  return <Image src={fallback.src} alt={fallback.alt} fill sizes={sizes} placeholder="blur" className={cn("object-cover", className)} />;
}

export function PostCard({ post, large }: { post: PostCardData; large?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block" data-cursor="Read">
      <ViewTransition name={`post-${post.slug}`} share="morph" default="none">
        <div className={cn("relative overflow-hidden rounded-2xl border border-line", large ? "aspect-[16/9]" : "aspect-[4/3]")}>
          <PostCover post={post} className="transition-transform duration-[1.2s] ease-expo group-hover:scale-105" />
        </div>
      </ViewTransition>
      <div className="mt-5 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
        <span className="text-cyan">{post.category}</span>
        <span className="h-px w-4 bg-line" />
        <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
        <span className="h-px w-4 bg-line" />
        <span>{post.readingTime} min read</span>
      </div>
      <h3 className={cn("mt-3 font-display font-semibold leading-snug tracking-tight transition-colors group-hover:text-cyan", large ? "text-3xl md:text-4xl" : "text-xl md:text-2xl")}>
        <GlyphScramble text={post.title} trigger="hover" speed={14} />
      </h3>
      <p className="mt-3 line-clamp-2 leading-relaxed text-muted">{post.excerpt}</p>
    </Link>
  );
}
