import Link from "next/link";
import { ConfirmAction } from "@/components/dashboard/confirm-action";
import { EntityForm, TextAreaField, TextField, Toggle } from "@/components/dashboard/form";
import { Badge, PageHeader, Panel } from "@/components/dashboard/ui";
import { deleteTestimonial, saveTestimonial } from "@/lib/actions/content";
import { db } from "@/lib/db";

export default async function TestimonialsAdminPage({ searchParams }: PageProps<"/dashboard/testimonials">) {
  const { edit } = await searchParams;
  const items = await db.testimonial.findMany({ orderBy: { order: "asc" } });
  const current = typeof edit === "string" ? items.find((t) => t.id === edit) : undefined;
  return (
    <>
      <PageHeader title="Testimonials" description="Real client quotes build trust and conversions. Shown on the home page." />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-3">
          {items.length === 0 && <p className="text-sm text-muted">No testimonials yet. Ask a happy client for two sentences.</p>}
          {items.map((t) => (
            <figure key={t.id} className="rounded-2xl border border-line bg-indigo/40 p-5">
              <blockquote className="text-fg/90">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
                <span>{t.author} · {t.role}, {t.company} {!t.published && <Badge tone="amber">Hidden</Badge>}</span>
                <span className="flex items-center gap-3">
                  <Link href={`/dashboard/testimonials?edit=${t.id}`} className="text-cyan">Edit</Link>
                  <ConfirmAction action={deleteTestimonial.bind(null, t.id)} label="" confirmLabel="Confirm" className="px-2.5" />
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <Panel title={current ? "Edit testimonial" : "Add testimonial"} actions={current && <Link href="/dashboard/testimonials" className="text-sm text-muted">Cancel</Link>}>
          <EntityForm key={current?.id ?? "new"} action={saveTestimonial} submitLabel={current ? "Save" : "Add testimonial"} inline>
            {current && <input type="hidden" name="id" value={current.id} />}
            <TextAreaField label="Quote" name="quote" defaultValue={current?.quote} required rows={4} />
            <TextField label="Author" name="author" defaultValue={current?.author} required />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Role" name="role" defaultValue={current?.role} required />
              <TextField label="Company" name="company" defaultValue={current?.company} required />
            </div>
            <TextField label="Order" name="order" type="number" defaultValue={current?.order ?? items.length} />
            <Toggle name="published" label="Published" defaultChecked={current?.published ?? true} />
          </EntityForm>
        </Panel>
      </div>
    </>
  );
}
