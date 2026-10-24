import { EntityForm, SelectField, TextAreaField, TextField, Toggle } from "@/components/dashboard/form";
import { RichEditor } from "@/components/dashboard/rich-editor";
import { Panel } from "@/components/dashboard/ui";
import { saveJob } from "@/lib/actions/content";
import type { Job } from "@/lib/generated/prisma/client";

export function JobForm({ job }: { job?: Job }) {
  return (
    <EntityForm
      action={saveJob}
      submitLabel={job ? "Save role" : "Create role"}
      aside={
        <Panel title="Listing">
          <div className="space-y-4">
            <Toggle name="open" label="Accepting applications" hint="Closed roles are hidden from the site and Google Jobs" defaultChecked={job?.open ?? true} />
            <Toggle name="remote" label="Remote-friendly" defaultChecked={job?.remote ?? true} />
            <SelectField label="Type" name="type" defaultValue={job?.type ?? "Full-time"} options={["Full-time", "Part-time", "Contract", "Internship"].map((v) => ({ value: v, label: v }))} />
            <div className="grid grid-cols-3 gap-2">
              <TextField label="Min / month" name="salaryMin" type="number" defaultValue={job?.salaryMin ?? ""} />
              <TextField label="Max / month" name="salaryMax" type="number" defaultValue={job?.salaryMax ?? ""} />
              <TextField label="Currency" name="currency" defaultValue={job?.currency ?? "NGN"} maxLength={3} />
            </div>
          </div>
        </Panel>
      }
    >
      {job && <input type="hidden" name="id" value={job.id} />}
      <Panel>
        <div className="grid gap-5 md:grid-cols-2">
          <TextField label="Role title" name="title" defaultValue={job?.title} required className="md:col-span-2" />
          <TextField label="Department" name="department" defaultValue={job?.department ?? "Engineering"} required />
          <TextField label="Location" name="location" defaultValue={job?.location ?? "Lagos, Nigeria"} required />
          <TextField label="URL slug" name="slug" defaultValue={job?.slug} placeholder="auto from title" />
          <TextField label="External apply URL (optional)" name="applyUrl" defaultValue={job?.applyUrl ?? ""} placeholder="Defaults to email" />
          <TextAreaField label="Summary" name="summary" defaultValue={job?.summary} required className="md:col-span-2" />
        </div>
      </Panel>
      <RichEditor name="description" label="Description" defaultValue={job?.description} />
    </EntityForm>
  );
}
