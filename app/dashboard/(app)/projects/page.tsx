import { ProjectList } from "@/components/dashboard/project-list";
import { EmptyState, PageHeader } from "@/components/dashboard/ui";
import { db } from "@/lib/db";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: [{ order: "asc" }, { year: "desc" }],
    select: { id: true, title: true, client: true, category: true, coverImage: true, featured: true, published: true, year: true },
  });
  return (
    <>
      <PageHeader title="Portfolio" description="Drag to set the order projects appear on the site." action={{ href: "/dashboard/projects/new", label: "New project" }} />
      {projects.length ? <ProjectList projects={projects} /> : <EmptyState title="No projects" body="Showcase your first project." action={{ href: "/dashboard/projects/new", label: "Add project" }} />}
    </>
  );
}
