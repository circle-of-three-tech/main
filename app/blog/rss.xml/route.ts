import { getPosts } from "@/lib/queries";
import { absoluteUrl, site } from "@/lib/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const posts = await getPosts();
  const items = posts
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${absoluteUrl(`/blog/${p.slug}`)}</link><guid isPermaLink="true">${absoluteUrl(`/blog/${p.slug}`)}</guid><description>${esc(p.excerpt)}</description><category>${esc(p.category)}</category>${p.publishedAt ? `<pubDate>${p.publishedAt.toUTCString()}</pubDate>` : ""}</item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(site.name)} Insights</title><link>${absoluteUrl("/blog")}</link><description>${esc(site.description)}</description><language>en-ng</language><atom:link href="${absoluteUrl("/blog/rss.xml")}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
