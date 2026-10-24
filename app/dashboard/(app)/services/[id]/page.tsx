import { notFound } from "next/navigation";
import { ConfirmAction } from "@/components/dashboard/confirm-action";
import { ServiceForm } from "@/components/dashboard/forms/service-form";
import { PageHeader } from "@/components/dashboard/ui";
import { deleteService } from "@/lib/actions/content";
import { db } from "@/lib/db";

export default async function EditServicePage({ params }: PageProps<"/dashboard/services/[id]">) {
  const { id } = await params;
  const service = await db.service.findUnique({ where: { id } });
  if (!service) notFound();
  return (
    <>
      <PageHeader title={service.title} back={{ href: "/dashboard/services", label: "Services" }} />
      <div className="mb-6">
        <ConfirmAction action={deleteService.bind(null, service.id)} label="Delete service" />
      </div>
      <ServiceForm service={service} />
    </>
  );
}
