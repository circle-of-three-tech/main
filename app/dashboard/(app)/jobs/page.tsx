import Link from "next/link";
import { Badge, EmptyState, PageHeader, Table } from "@/components/dashboard/ui";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function JobsAdminPage() {
  const jobs = await db.job.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageHeader title="Careers" description="Open roles appear on /careers and in Google Jobs." action={{ href: "/dashboard/jobs/new", label: "New role" }} />
      {jobs.length === 0 ? (
        <EmptyState title="No roles" body="Post your first opening." action={{ href: "/dashboard/jobs/new", label: "New role" }} />
      ) : (
        <Table head={["Role", "Department", "Location", "Posted", "Status"]}>
          {jobs.map((j) => (
            <tr key={j.id} className="hover:bg-indigo/40">
              <td className="px-4 py-3"><Link href={`/dashboard/jobs/${j.id}`} className="font-medium hover:text-cyan">{j.title}</Link></td>
              <td className="px-4 py-3 text-muted">{j.department}</td>
              <td className="px-4 py-3 text-muted">{j.location}</td>
              <td className="px-4 py-3 text-muted">{formatDate(j.createdAt)}</td>
              <td className="px-4 py-3">{j.open ? <Badge tone="green">Open</Badge> : <Badge>Closed</Badge>}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
