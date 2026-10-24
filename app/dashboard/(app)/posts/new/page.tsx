import { PostForm } from "@/components/dashboard/forms/post-form";
import { PageHeader } from "@/components/dashboard/ui";

export default function NewPostPage() {
  return (
    <>
      <PageHeader title="New post" back={{ href: "/dashboard/posts", label: "Posts" }} />
      <PostForm />
    </>
  );
}
