import { renderOg, ogSize } from "@/lib/og";
import { getPost, getSlugs } from "@/lib/queries";

export const alt = "Circle of Three Technologies insight";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  return getSlugs("posts");
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return renderOg({ eyebrow: post ? `Insights · ${post.category}` : "Insights", title: post?.title ?? "Insights from Co3" });
}
