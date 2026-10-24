import { notFound } from "next/navigation";
import { ConfirmAction } from "@/components/dashboard/confirm-action";
import { JobForm } from "@/components/dashboard/forms/job-form";
import { PageHeader } from "@/components/dashboard/ui";
import { deleteJob } from "@/lib/actions/content";
import { db } from "@/lib/db";

export default async function EditJobPage({ params }: PageProps<"/dashboard/jobs/[id]">) {
  const { id } = await params;
  const job = await db.job.findUnique({ where: { id } });
  if (!job) notFound();
  return (
    <>
      <PageHeader title={job.title} back={{ href: "/dashboard/jobs", label: "Careers" }} />
      <div className="mb-6">
        <ConfirmAction action={deleteJob.bind(null, job.id)} label="Delete role" />
      </div>
      <JobForm job={job} />
    </>
  );
}
