import { EntityForm, TextField } from "@/components/dashboard/form";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { changePassword } from "@/lib/actions/content";
import { requireUser } from "@/lib/auth";

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <PageHeader title="Your account" description={`${user.name} · ${user.email} · ${user.role}`} />
      <Panel title="Change password" className="max-w-xl">
        <EntityForm action={changePassword} submitLabel="Update password" inline>
          <TextField label="Current password" name="current" type="password" autoComplete="current-password" required />
          <TextField label="New password" name="next" type="password" autoComplete="new-password" required hint="At least 10 characters" />
        </EntityForm>
      </Panel>
    </>
  );
}
