import { JobForm } from "@/components/dashboard/forms/job-form";
import { PageHeader } from "@/components/dashboard/ui";

export default function NewJobPage() {
  return (
    <>
      <PageHeader title="New role" back={{ href: "/dashboard/jobs", label: "Careers" }} />
      <JobForm />
    </>
  );
}
