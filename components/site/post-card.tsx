import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
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
    <Link href={`/blog/${post.slug}`} className={cn("group block", large && "grid items-center gap-8 lg:grid-cols-2 lg:gap-12")}>
      <ViewTransition name={`post-${post.slug}`} share="morph" default="none">
        <div className={cn("relative overflow-hidden rounded-xl border border-line bg-indigo", large ? "aspect-[16/10]" : "aspect-[16/10]")}>
          <PostCover post={post} className="transition-transform duration-500 ease-expo group-hover:scale-[1.02]" />
        </div>
      </ViewTransition>
      <div>
        <div className={cn("flex flex-wrap items-center gap-x-2 text-sm text-muted", large ? "" : "mt-5")}>
          <span className="font-medium text-cyan">{post.category}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h3 className={cn("mt-2 font-display font-semibold leading-snug tracking-[-0.015em] transition-colors group-hover:text-cyan", large ? "text-2xl md:text-[2rem] md:leading-tight" : "text-lg md:text-xl")}>
          {post.title}
        </h3>
        <p className={cn("mt-2 leading-relaxed text-muted", large ? "line-clamp-3 text-lg" : "line-clamp-2")}>{post.excerpt}</p>
      </div>
    </Link>
  );
}
