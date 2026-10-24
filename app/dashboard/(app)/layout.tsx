import { Sidebar } from "@/components/dashboard/sidebar";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const user = await requireUser();
  const unread = await db.message.count({ where: { read: false } });
  return (
    <>
      <Sidebar user={user} unread={unread} />
      <main className="px-4 py-8 md:px-8 lg:ml-64 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </>
  );
}
