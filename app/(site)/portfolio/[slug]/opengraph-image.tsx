import { renderOg, ogSize } from "@/lib/og";
import { getProject, getSlugs } from "@/lib/queries";

export const alt = "Circle of Three Technologies case study";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  return getSlugs("projects");
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProject(slug);
  return renderOg({ eyebrow: p ? `Case study · ${p.category}` : "Case study", title: p ? `${p.title}: ${p.summary}` : "Our work" });
}
