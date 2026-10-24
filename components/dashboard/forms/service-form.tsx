import { EntityForm, SelectField, TextAreaField, TextField, Toggle } from "@/components/dashboard/form";
import { PairList } from "@/components/dashboard/pair-list";
import { RichEditor } from "@/components/dashboard/rich-editor";
import { SeoPanel } from "@/components/dashboard/seo-panel";
import { TagInput } from "@/components/dashboard/tag-input";
import { Panel } from "@/components/dashboard/ui";
import { SERVICE_ICONS } from "@/components/site/service-icon";
import { saveService } from "@/lib/actions/content";
import type { Service } from "@/lib/generated/prisma/client";

export function ServiceForm({ service }: { service?: Service }) {
  return (
    <EntityForm
      action={saveService}
      submitLabel={service ? "Save service" : "Create service"}
      aside={
        <>
          <Panel title="Display">
            <div className="space-y-4">
              <Toggle name="published" label="Published" defaultChecked={service?.published ?? true} />
              <SelectField label="Icon" name="icon" defaultValue={service?.icon ?? "Code2"} options={Object.keys(SERVICE_ICONS).map((k) => ({ value: k, label: k }))} />
              <TextField label="Order" name="order" type="number" defaultValue={service?.order ?? 0} />
            </div>
          </Panel>
          <Panel title="Search appearance">
            <SeoPanel path={`/services/${service?.slug ?? "service"}`} fallbackTitle={service ? `${service.title} Company in Nigeria` : "Service"} fallbackDescription={service?.summary ?? "Service summary"} defaultTitle={service?.seoTitle} defaultDescription={service?.seoDescription} />
          </Panel>
        </>
      }
    >
      {service && <input type="hidden" name="id" value={service.id} />}
      <Panel>
        <div className="grid gap-5 md:grid-cols-2">
          <TextField label="Service name" name="title" defaultValue={service?.title} required />
          <TextField label="URL slug" name="slug" defaultValue={service?.slug} placeholder="auto from name" hint="Keyword-rich, e.g. custom-software-development" />
          <TextField label="Tagline (page headline)" name="tagline" defaultValue={service?.tagline} required className="md:col-span-2" />
          <TextAreaField label="Summary" name="summary" defaultValue={service?.summary} required className="md:col-span-2" />
          <div className="md:col-span-2">
            <TagInput name="deliverables" label="Deliverables" defaultValue={service?.deliverables} />
          </div>
        </div>
      </Panel>
      <RichEditor name="content" label="Page content" defaultValue={service?.content} />
      <Panel title="FAQs" description="Shown on the page and as FAQ rich results in Google.">
        <PairList name="faqs" label="Questions" multiline="a" defaultValue={(service?.faqs as { q: string; a: string }[]) ?? []} fields={[{ key: "q", placeholder: "Question" }, { key: "a", placeholder: "Answer" }]} />
      </Panel>
    </EntityForm>
  );
}
