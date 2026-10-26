import Link from "next/link";
import { Activity, ArrowUpRight, FileText, FolderKanban, Inbox, PenLine, ShieldAlert } from "lucide-react";
import { compact, Delta } from "@/components/analytics/breakdown";
import { Badge, Panel } from "@/components/dashboard/ui";
import { getAnalyticsSummary } from "@/lib/analytics";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate, truncate } from "@/lib/utils";

export default async function Overview({ searchParams }: PageProps<"/dashboard">) {
  const user = await requireUser();
  const { denied } = await searchParams;
  const [published, drafts, projects, unread, messages, recentDrafts, traffic] = await Promise.all([
    db.post.count({ where: { status: "PUBLISHED" } }),
    db.post.count({ where: { status: "DRAFT" } }),
    db.project.count({ where: { published: true } }),
    db.message.count({ where: { read: false } }),
    db.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.post.findMany({ where: { status: "DRAFT" }, orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, title: true, updatedAt: true } }),
    getAnalyticsSummary(),
  ]);
  const stats = [
    { label: "Published posts", value: published, href: "/dashboard/posts", Icon: FileText },
    { label: "Drafts", value: drafts, href: "/dashboard/posts", Icon: PenLine },
    { label: "Live projects", value: projects, href: "/dashboard/projects", Icon: FolderKanban },
    { label: "Unread messages", value: unread, href: "/dashboard/messages", Icon: Inbox },
  ];

  return (
    <div className="space-y-8">
      {denied && (
        <p className="flex items-center gap-2 rounded-xl border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-warn">
          <ShieldAlert className="h-4 w-4" /> That area is only available to admins.
        </p>
      )}
      <div>
        <p className="hud-label">Welcome back</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Hello, {user.name.split(" ")[0]}.</h1>
        <p className="mt-1 text-muted">Here&apos;s what&apos;s happening across your site.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, href, Icon }) => (
          <Link key={label} href={href} className="group relative overflow-hidden rounded-2xl border border-line bg-indigo/40 p-5 transition hover:border-cyan/40">
            <Icon className="h-5 w-5 text-cyan" />
            <p className="mt-6 font-display text-4xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-muted">{label}</p>
            <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-muted transition group-hover:rotate-45 group-hover:text-cyan" />
          </Link>
        ))}
      </div>

      <Link href="/dashboard/analytics" className="group flex flex-col gap-4 rounded-2xl border border-line bg-indigo/40 p-5 transition hover:border-cyan/40 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-cyan" />
          <span>
            <span className="block font-display font-semibold">Site traffic, last 7 days</span>
            <span className="block text-sm text-muted">
              <strong className="font-semibold text-fg">{traffic.live}</strong> on the site now
            </span>
          </span>
        </span>
        <span className="flex items-center gap-8">
          {[
            { label: "Visitors", now: traffic.current.visitors, before: traffic.previous.visitors },
            { label: "Page views", now: traffic.current.pageviews, before: traffic.previous.pageviews },
          ].map((m) => (
            <span key={m.label}>
              <span className="block text-xs text-muted">{m.label}</span>
              <span className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold tabular-nums">{compact(m.now)}</span>
                <Delta now={m.now} before={m.before} />
              </span>
            </span>
          ))}
          <ArrowUpRight className="hidden h-4 w-4 text-muted transition group-hover:rotate-45 group-hover:text-cyan sm:block" />
        </span>
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Latest messages" actions={<Link href="/dashboard/messages" className="text-sm text-cyan">Open inbox</Link>}>
          {messages.length === 0 ? (
            <p className="text-sm text-muted">No messages yet. Enquiries from the contact page land here.</p>
          ) : (
            <ul className="divide-y divide-line">
              {messages.map((m) => (
                <li key={m.id}>
                  <Link href={`/dashboard/messages?id=${m.id}`} className="flex items-start gap-3 py-3">
                    <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-line" : "bg-cyan"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">{m.name}</span>
                        <span className="shrink-0 text-xs text-muted">{formatDate(m.createdAt)}</span>
                      </span>
                      <span className="block truncate text-sm text-muted">{truncate(m.body, 90)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Drafts in progress" actions={<Link href="/dashboard/posts/new" className="text-sm text-cyan">New post</Link>}>
          {recentDrafts.length === 0 ? (
            <p className="text-sm text-muted">No drafts. Publishing regularly is the strongest SEO signal you control.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentDrafts.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <Link href={`/dashboard/posts/${p.id}`} className="truncate font-medium hover:text-cyan">{p.title}</Link>
                  <Badge tone="amber">Draft</Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="SEO checklist" description="Actions that move rankings for “technology company”, “Nigerian tech”, “software company Nigeria”.">
        <ul className="grid gap-3 text-sm md:grid-cols-2">
          {[
            "Publish 2–4 helpful articles per month targeting real search questions",
            "Verify the domain in Google Search Console and Bing Webmaster Tools and submit /sitemap.xml",
            "Create and verify a Google Business Profile with the same name, address and phone as Site settings",
            "Earn links: client sites can credit “Built by Circle of Three Technologies”",
            "Add real metrics and testimonials to case studies",
            "List Co3 on Clutch, GoodFirms, LinkedIn and Nigerian tech directories",
          ].map((t) => (
            <li key={t} className="flex gap-2 text-muted">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-cyan" /> {t}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
