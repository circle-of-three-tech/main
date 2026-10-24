import { EntityForm, TextAreaField, TextField } from "@/components/dashboard/form";
import { PairList } from "@/components/dashboard/pair-list";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { saveSettings } from "@/lib/actions/content";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function SettingsPage() {
  await requireAdmin();
  const s = await db.siteSettings.findUnique({ where: { id: "site" } });
  return (
    <>
      <PageHeader title="Site settings" description="Company details used across the site, footer and structured data (Google Business signals)." />
      <EntityForm action={saveSettings} submitLabel="Save settings">
        <Panel title="Brand">
          <div className="space-y-5">
            <TextField label="Tagline" name="tagline" defaultValue={s?.tagline} required />
            <TextAreaField label="Company description" name="description" defaultValue={s?.description} />
          </div>
        </Panel>
        <Panel title="Contact & location" description="Keep these identical to your Google Business Profile (NAP consistency).">
          <div className="grid gap-5 md:grid-cols-2">
            <TextField label="Email" name="email" type="email" defaultValue={s?.email} required />
            <TextField label="Phone" name="phone" defaultValue={s?.phone} required />
            <TextField label="Street address" name="address" defaultValue={s?.address} required className="md:col-span-2" />
            <TextField label="City" name="city" defaultValue={s?.city} required />
            <TextField label="Country" name="country" defaultValue={s?.country ?? "Nigeria"} required />
          </div>
        </Panel>
        <Panel title="Social profiles" description="Linked from the footer and listed as sameAs in Organization schema.">
          <div className="grid gap-5 md:grid-cols-2">
            <TextField label="LinkedIn" name="linkedin" defaultValue={s?.linkedin ?? ""} placeholder="https://linkedin.com/company/…" />
            <TextField label="X / Twitter" name="twitter" defaultValue={s?.twitter ?? ""} placeholder="https://x.com/…" />
            <TextField label="GitHub" name="github" defaultValue={s?.github ?? ""} placeholder="https://github.com/…" />
            <TextField label="Instagram" name="instagram" defaultValue={s?.instagram ?? ""} placeholder="https://instagram.com/…" />
          </div>
        </Panel>
        <Panel title="Headline stats" description="Animated counters on the home and about pages.">
          <PairList
            name="stats"
            label="Stats"
            defaultValue={(s?.stats as { label: string; value: number; suffix: string }[]) ?? []}
            fields={[{ key: "label", placeholder: "Label" }, { key: "value", placeholder: "Value", width: "w-28", type: "number" }, { key: "suffix", placeholder: "Suffix", width: "w-20" }]}
          />
        </Panel>
      </EntityForm>
    </>
  );
}
