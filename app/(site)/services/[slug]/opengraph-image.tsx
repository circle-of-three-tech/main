import { renderOg, ogSize } from "@/lib/og";
import { getService, getSlugs } from "@/lib/queries";

export const alt = "Circle of Three Technologies service";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  return getSlugs("services");
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getService(slug);
  return renderOg({ eyebrow: s ? `Services · ${s.title}` : "Services", title: s?.tagline ?? "Software development services" });
}
