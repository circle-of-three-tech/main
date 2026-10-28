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
        <div className={cn("relative overflow-hidden rounded-[28px] bg-indigo shadow-[0_30px_60px_-34px_rgb(27_27_27/0.4)] md:rounded-[32px]", large ? "aspect-[16/10]" : "aspect-[4/3]")}>
          <PostCover post={post} className="transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
        </div>
      </ViewTransition>
      <div>
        <div className={cn("flex flex-wrap items-center gap-x-2 text-xs font-medium text-muted", large ? "" : "mt-6")}>
          <span className="font-semibold uppercase tracking-[0.1em] text-violet">{post.category}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h3 className={cn("mt-3 font-display font-bold leading-snug tracking-[-0.025em] transition-opacity group-hover:opacity-70", large ? "text-2xl md:text-[2.25rem] md:leading-tight" : "text-xl")}>
          {post.title}
        </h3>
        <p className={cn("mt-2 leading-relaxed text-muted", large ? "line-clamp-3 text-lg" : "line-clamp-2")}>{post.excerpt}</p>
      </div>
    </Link>
  );
}
