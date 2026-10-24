import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ConfirmAction } from "@/components/dashboard/confirm-action";
import { PostForm } from "@/components/dashboard/forms/post-form";
import { PageHeader } from "@/components/dashboard/ui";
import { deletePost } from "@/lib/actions/content";
import { db } from "@/lib/db";

export default async function EditPostPage({ params }: PageProps<"/dashboard/posts/[id]">) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <>
      <PageHeader title="Edit post" back={{ href: "/dashboard/posts", label: "Posts" }} />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {post.status === "PUBLISHED" && (
          <Link href={`/blog/${post.slug}`} target="_blank" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted hover:border-cyan hover:text-cyan">
            <ExternalLink className="h-3.5 w-3.5" /> View live
          </Link>
        )}
        <ConfirmAction action={deletePost.bind(null, post.id)} label="Delete post" />
      </div>
      <PostForm post={post} />
    </>
  );
}
