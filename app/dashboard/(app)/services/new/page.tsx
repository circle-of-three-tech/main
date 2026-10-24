import { ServiceForm } from "@/components/dashboard/forms/service-form";
import { PageHeader } from "@/components/dashboard/ui";

export default function NewServicePage() {
  return (
    <>
      <PageHeader title="New service" back={{ href: "/dashboard/services", label: "Services" }} />
      <ServiceForm />
    </>
  );
}
