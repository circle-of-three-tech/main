import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ConfirmAction } from "@/components/dashboard/confirm-action";
import { ProjectForm } from "@/components/dashboard/forms/project-form";
import { PageHeader } from "@/components/dashboard/ui";
import { deleteProject } from "@/lib/actions/content";
import { db } from "@/lib/db";

export default async function EditProjectPage({ params }: PageProps<"/dashboard/projects/[id]">) {
  const { id } = await params;
  const [project, services] = await Promise.all([db.project.findUnique({ where: { id } }), db.service.findMany({ select: { title: true }, orderBy: { order: "asc" } })]);
  if (!project) notFound();
  return (
    <>
      <PageHeader title={project.title} back={{ href: "/dashboard/projects", label: "Portfolio" }} />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {project.published && (
          <Link href={`/portfolio/${project.slug}`} target="_blank" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted hover:border-cyan hover:text-cyan">
            <ExternalLink className="h-3.5 w-3.5" /> View live
          </Link>
        )}
        <ConfirmAction action={deleteProject.bind(null, project.id)} label="Delete project" />
      </div>
      <ProjectForm project={project} serviceTitles={services.map((s) => s.title)} />
    </>
  );
}
