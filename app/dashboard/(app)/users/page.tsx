import { ConfirmAction } from "@/components/dashboard/confirm-action";
import { EntityForm, SelectField, TextField } from "@/components/dashboard/form";
import { PageHeader, Panel, Table } from "@/components/dashboard/ui";
import { UserRoleSelect } from "@/components/dashboard/user-role-select";
import { createUser, deleteUser } from "@/lib/actions/content";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function UsersPage() {
  const me = await requireAdmin();
  const users = await db.user.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { posts: true } } } });
  return (
    <>
      <PageHeader title="Users" description="Admins manage everything. Editors manage content but not settings or users." />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Table head={["Name", "Email", "Role", "Posts", "Joined", ""]}>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-3 font-medium">{u.name}{u.id === me.id && <span className="ml-2 text-xs text-muted">(you)</span>}</td>
              <td className="px-4 py-3 text-muted">{u.email}</td>
              <td className="px-4 py-3"><UserRoleSelect id={u.id} role={u.role} disabled={u.id === me.id} /></td>
              <td className="px-4 py-3 text-muted">{u._count.posts}</td>
              <td className="px-4 py-3 text-muted">{formatDate(u.createdAt)}</td>
              <td className="px-4 py-3 text-right">{u.id !== me.id && <ConfirmAction action={deleteUser.bind(null, u.id)} label="" confirmLabel="Remove" className="px-2.5" />}</td>
            </tr>
          ))}
        </Table>
        <Panel title="Add a user" description="Share the temporary password securely; they can change it under Account.">
          <EntityForm action={createUser} submitLabel="Create user" inline>
            <TextField label="Full name" name="name" required />
            <TextField label="Email" name="email" type="email" required />
            <SelectField label="Role" name="role" defaultValue="EDITOR" options={[{ value: "EDITOR", label: "Editor" }, { value: "ADMIN", label: "Admin" }]} />
            <TextField label="Temporary password" name="password" type="password" autoComplete="new-password" required hint="At least 10 characters" />
          </EntityForm>
        </Panel>
      </div>
    </>
  );
}
