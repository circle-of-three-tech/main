import { ProjectForm } from "@/components/dashboard/forms/project-form";
import { PageHeader } from "@/components/dashboard/ui";
import { db } from "@/lib/db";

export default async function NewProjectPage() {
  const services = await db.service.findMany({ select: { title: true }, orderBy: { order: "asc" } });
  return (
    <>
      <PageHeader title="New project" back={{ href: "/dashboard/projects", label: "Portfolio" }} />
      <ProjectForm serviceTitles={services.map((s) => s.title)} />
    </>
  );
}
