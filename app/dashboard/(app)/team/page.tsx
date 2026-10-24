import Image from "next/image";
import Link from "next/link";
import { ConfirmAction } from "@/components/dashboard/confirm-action";
import { EntityForm, TextAreaField, TextField } from "@/components/dashboard/form";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { deleteTeamMember, saveTeamMember } from "@/lib/actions/content";
import { db } from "@/lib/db";

export default async function TeamAdminPage({ searchParams }: PageProps<"/dashboard/team">) {
  const { edit } = await searchParams;
  const team = await db.teamMember.findMany({ orderBy: { order: "asc" } });
  const current = typeof edit === "string" ? team.find((m) => m.id === edit) : undefined;
  return (
    <>
      <PageHeader title="Team" description="Shown on the About page once at least one member is added." />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid content-start gap-3 sm:grid-cols-2">
          {team.length === 0 && <p className="text-sm text-muted">No team members yet. Add your first with the form.</p>}
          {team.map((m) => (
            <div key={m.id} className="flex items-center gap-4 rounded-2xl border border-line bg-indigo/40 p-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-ink">
                {m.photo && <Image src={m.photo} alt="" fill sizes="56px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{m.name}</p>
                <p className="truncate text-sm text-muted">{m.role}</p>
                <div className="mt-2 flex gap-2">
                  <Link href={`/dashboard/team?edit=${m.id}`} className="text-xs text-cyan">Edit</Link>
                </div>
              </div>
              <ConfirmAction action={deleteTeamMember.bind(null, m.id)} label="" confirmLabel="Confirm" className="px-2.5" />
            </div>
          ))}
        </div>
        <Panel title={current ? `Edit ${current.name}` : "Add team member"} actions={current && <Link href="/dashboard/team" className="text-sm text-muted">Cancel</Link>}>
          <EntityForm key={current?.id ?? "new"} action={saveTeamMember} submitLabel={current ? "Save member" : "Add member"} inline>
            {current && <input type="hidden" name="id" value={current.id} />}
            <TextField label="Name" name="name" defaultValue={current?.name} required />
            <TextField label="Role" name="role" defaultValue={current?.role} required />
            <TextAreaField label="Short bio" name="bio" defaultValue={current?.bio ?? ""} />
            <ImageUpload name="photo" label="Photo" defaultValue={current?.photo} />
            <TextField label="LinkedIn URL" name="linkedin" defaultValue={current?.linkedin ?? ""} />
            <TextField label="X / Twitter URL" name="twitter" defaultValue={current?.twitter ?? ""} />
            <TextField label="Order" name="order" type="number" defaultValue={current?.order ?? team.length} />
          </EntityForm>
        </Panel>
      </div>
    </>
  );
}
