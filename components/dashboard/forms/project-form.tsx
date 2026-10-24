import { EntityForm, TextAreaField, TextField, Toggle } from "@/components/dashboard/form";
import { GalleryUpload, ImageUpload } from "@/components/dashboard/image-upload";
import { PairList } from "@/components/dashboard/pair-list";
import { RichEditor } from "@/components/dashboard/rich-editor";
import { SeoPanel } from "@/components/dashboard/seo-panel";
import { TagInput } from "@/components/dashboard/tag-input";
import { Panel } from "@/components/dashboard/ui";
import { saveProject } from "@/lib/actions/content";
import type { Project } from "@/lib/generated/prisma/client";

export function ProjectForm({ project, serviceTitles }: { project?: Project; serviceTitles: string[] }) {
  return (
    <EntityForm
      action={saveProject}
      submitLabel={project ? "Save project" : "Create project"}
      aside={
        <>
          <Panel title="Visibility">
            <div className="space-y-4">
              <Toggle name="published" label="Published" hint="Show on the portfolio page" defaultChecked={project?.published ?? true} />
              <Toggle name="featured" label="Featured" hint="Show in the home page work rail" defaultChecked={project?.featured} />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="Year" name="year" type="number" defaultValue={project?.year ?? new Date().getFullYear()} />
                <TextField label="Accent" name="accent" type="color" defaultValue={project?.accent ?? "#3DF2FF"} className="[&_input]:h-11 [&_input]:p-1" />
              </div>
            </div>
          </Panel>
          <Panel title="Cover screenshot">
            <ImageUpload name="coverImage" label="Homepage screenshot (1440×900)" defaultValue={project?.coverImage} />
          </Panel>
          <Panel title="Search appearance">
            <SeoPanel path={`/portfolio/${project?.slug ?? "project"}`} fallbackTitle={project ? `${project.title}: ${project.category} Case Study` : "Project case study"} fallbackDescription={project?.summary ?? "Project summary"} defaultTitle={project?.seoTitle} defaultDescription={project?.seoDescription} />
          </Panel>
        </>
      }
    >
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="order" value={project?.order ?? 999} />
      <Panel>
        <div className="grid gap-5 md:grid-cols-2">
          <TextField label="Project name" name="title" defaultValue={project?.title} required />
          <TextField label="Client" name="client" defaultValue={project?.client} required />
          <TextField label="Live URL" name="url" type="url" defaultValue={project?.url ?? ""} placeholder="https://" />
          <TextField label="Industry / category" name="category" defaultValue={project?.category ?? "Web Platform"} hint="Used for portfolio filters" />
          <TextField label="URL slug" name="slug" defaultValue={project?.slug} placeholder="auto from name" className="md:col-span-2" />
          <TextAreaField label="Summary" name="summary" defaultValue={project?.summary} required className="md:col-span-2" />
        </div>
      </Panel>
      <Panel>
        <div className="grid gap-5 md:grid-cols-2">
          <TagInput name="services" label="Services delivered" defaultValue={project?.services} suggestions={serviceTitles} />
          <TagInput name="techStack" label="Tech stack" defaultValue={project?.techStack} suggestions={["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Python", "Flutter", "React Native", "AWS", "Vercel"]} />
        </div>
      </Panel>
      <RichEditor name="content" label="Case study" defaultValue={project?.content} placeholder="The challenge, what we built, the results…" />
      <Panel title="Results" description="Headline metrics shown on the case study (e.g. “Load time” → “0.9s”).">
        <PairList name="metrics" label="Metrics" defaultValue={(project?.metrics as { label: string; value: string }[]) ?? []} fields={[{ key: "label", placeholder: "Metric" }, { key: "value", placeholder: "Value", width: "w-36" }]} />
      </Panel>
      <Panel title="Gallery">
        <GalleryUpload name="gallery" label="Additional screens" defaultValue={project?.gallery} />
      </Panel>
    </EntityForm>
  );
}
