import Link from "next/link";
import { Badge, PageHeader, Table } from "@/components/dashboard/ui";
import { ServiceIcon } from "@/components/site/service-icon";
import { db } from "@/lib/db";

export default async function ServicesAdminPage() {
  const services = await db.service.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <PageHeader title="Services" description="Each service has its own SEO landing page." action={{ href: "/dashboard/services/new", label: "New service" }} />
      <Table head={["Service", "Slug", "Order", "Status"]}>
        {services.map((s) => (
          <tr key={s.id} className="hover:bg-indigo/40">
            <td className="px-4 py-3">
              <Link href={`/dashboard/services/${s.id}`} className="flex items-center gap-3 font-medium hover:text-cyan">
                <ServiceIcon name={s.icon} className="h-4 w-4 text-cyan" /> {s.title}
              </Link>
            </td>
            <td className="px-4 py-3 font-mono text-xs text-muted">/services/{s.slug}</td>
            <td className="px-4 py-3 text-muted">{s.order}</td>
            <td className="px-4 py-3">{s.published ? <Badge tone="green">Live</Badge> : <Badge tone="amber">Hidden</Badge>}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
