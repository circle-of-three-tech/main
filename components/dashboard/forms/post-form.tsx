import { EntityForm, SelectField, TextAreaField, TextField, Toggle } from "@/components/dashboard/form";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { RichEditor } from "@/components/dashboard/rich-editor";
import { SeoPanel } from "@/components/dashboard/seo-panel";
import { TagInput } from "@/components/dashboard/tag-input";
import { Panel } from "@/components/dashboard/ui";
import { savePost } from "@/lib/actions/content";
import type { Post } from "@/lib/generated/prisma/client";

const CATEGORIES = ["Engineering", "AI", "Strategy", "Design", "Company", "Case Study"];

export function PostForm({ post }: { post?: Post }) {
  return (
    <EntityForm
      action={savePost}
      submitLabel={post ? "Save post" : "Create post"}
      aside={
        <>
          <Panel title="Publishing">
            <div className="space-y-5">
              <SelectField label="Status" name="status" defaultValue={post?.status ?? "DRAFT"} options={[{ value: "DRAFT", label: "Draft (hidden)" }, { value: "PUBLISHED", label: "Published (live)" }]} />
              <SelectField label="Category" name="category" defaultValue={post?.category ?? "Engineering"} options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
              <Toggle name="featured" label="Featured" hint="Pin to the top of the blog" defaultChecked={post?.featured} />
            </div>
          </Panel>
          <Panel title="Cover image">
            <ImageUpload name="coverImage" label="Cover (1600×900 recommended)" defaultValue={post?.coverImage} />
          </Panel>
          <Panel title="Search appearance">
            <SeoPanel path={`/blog/${post?.slug ?? "your-post"}`} fallbackTitle={post?.title ?? "Post title"} fallbackDescription={post?.excerpt ?? "Your excerpt appears here."} defaultTitle={post?.seoTitle} defaultDescription={post?.seoDescription} />
          </Panel>
        </>
      }
    >
      {post && <input type="hidden" name="id" value={post.id} />}
      <Panel>
        <div className="space-y-5">
          <TextField label="Title" name="title" defaultValue={post?.title} required placeholder="e.g. How to choose a software company in Nigeria" />
          <TextField label="URL slug" name="slug" defaultValue={post?.slug} placeholder="auto-generated from title" hint="Short, lowercase, hyphenated. Changing it later breaks existing links." />
          <TextAreaField label="Excerpt" name="excerpt" defaultValue={post?.excerpt} required hint="1–2 sentences. Shown on cards and used as the meta description by default." />
          <TagInput name="tags" label="Tags / keywords" defaultValue={post?.tags} suggestions={["software development", "Nigeria", "AI", "web development", "startups", "SEO"]} />
        </div>
      </Panel>
      <RichEditor name="content" label="Content" defaultValue={post?.content} />
    </EntityForm>
  );
}
