import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge, EmptyState, PageHeader, Table } from "@/components/dashboard/ui";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function PostsPage() {
  const posts = await db.post.findMany({ orderBy: { updatedAt: "desc" }, include: { author: { select: { name: true } } } });
  return (
    <>
      <PageHeader title="Blog posts" description="Write and publish insights. Published posts go live instantly." action={{ href: "/dashboard/posts/new", label: "New post" }} />
      {posts.length === 0 ? (
        <EmptyState title="No posts yet" body="Your first article is the start of your SEO engine." action={{ href: "/dashboard/posts/new", label: "Write a post" }} />
      ) : (
        <Table head={["Title", "Status", "Category", "Author", "Updated", ""]}>
          {posts.map((p) => (
            <tr key={p.id} className="hover:bg-indigo/40">
              <td className="px-4 py-3">
                <Link href={`/dashboard/posts/${p.id}`} className="font-medium hover:text-cyan">{p.title}</Link>
                {p.featured && <span className="ml-2"><Badge tone="violet">Featured</Badge></span>}
              </td>
              <td className="px-4 py-3">{p.status === "PUBLISHED" ? <Badge tone="green">Live</Badge> : <Badge tone="amber">Draft</Badge>}</td>
              <td className="px-4 py-3 text-muted">{p.category}</td>
              <td className="px-4 py-3 text-muted">{p.author?.name ?? "—"}</td>
              <td className="px-4 py-3 text-muted">{formatDate(p.updatedAt)}</td>
              <td className="px-4 py-3 text-right">
                {p.status === "PUBLISHED" && (
                  <Link href={`/blog/${p.slug}`} target="_blank" className="inline-flex text-muted hover:text-cyan" aria-label="View live">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
