import Link from "next/link";
import { Reply } from "lucide-react";
import { ConfirmAction } from "@/components/dashboard/confirm-action";
import { ToggleRead } from "@/components/dashboard/message-actions";
import { Badge, EmptyState, PageHeader } from "@/components/dashboard/ui";
import { deleteMessage } from "@/lib/actions/content";
import { db } from "@/lib/db";
import { cn, formatDate, truncate } from "@/lib/utils";

export default async function MessagesPage({ searchParams }: PageProps<"/dashboard/messages">) {
  const { id } = await searchParams;
  const messages = await db.message.findMany({ orderBy: { createdAt: "desc" } });
  const current = messages.find((m) => m.id === id) ?? messages[0];

  if (!messages.length) {
    return (
      <>
        <PageHeader title="Inbox" />
        <EmptyState title="Inbox zero" body="Enquiries submitted through the contact page will appear here." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Inbox" description={`${messages.filter((m) => !m.read).length} unread of ${messages.length}`} />
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <ul className="max-h-[70vh] space-y-1 overflow-y-auto rounded-2xl border border-line bg-indigo/30 p-2">
          {messages.map((m) => (
            <li key={m.id}>
              <Link href={`/dashboard/messages?id=${m.id}`} className={cn("block rounded-xl p-3 transition", current?.id === m.id ? "bg-cyan/10" : "hover:bg-indigo/60")}>
                <span className="flex items-center justify-between gap-2">
                  <span className={cn("truncate", !m.read && "font-semibold text-fg")}>{m.name}</span>
                  <span className="shrink-0 text-xs text-muted">{formatDate(m.createdAt)}</span>
                </span>
                <span className="mt-1 block truncate text-sm text-muted">{truncate(m.body, 80)}</span>
                {!m.read && <span className="mt-2 inline-block"><Badge tone="cyan">New</Badge></span>}
              </Link>
            </li>
          ))}
        </ul>
        {current && (
          <article className="rounded-2xl border border-line bg-indigo/40 p-6 md:p-8">
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
              <div>
                <h2 className="font-display text-2xl font-semibold">{current.name}</h2>
                <a href={`mailto:${current.email}`} className="text-cyan">{current.email}</a>
                <p className="mt-1 text-sm text-muted">{current.createdAt.toLocaleString("en-NG")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {current.company && <Badge>{current.company}</Badge>}
                {current.service && <Badge tone="cyan">{current.service}</Badge>}
                {current.budget && <Badge tone="violet">{current.budget}</Badge>}
              </div>
            </header>
            <p className="whitespace-pre-wrap py-6 leading-relaxed text-fg/90">{current.body}</p>
            <footer className="flex flex-wrap gap-3 border-t border-line pt-6">
              <a href={`mailto:${current.email}?subject=${encodeURIComponent("Re: your enquiry to Circle of Three Technologies")}`} className="inline-flex items-center gap-2 rounded-full bg-cyan px-4 py-2 text-xs font-semibold text-ink">
                <Reply className="h-3.5 w-3.5" /> Reply by email
              </a>
              <ToggleRead id={current.id} read={current.read} />
              <ConfirmAction action={deleteMessage.bind(null, current.id)} />
            </footer>
          </article>
        )}
      </div>
    </>
  );
}
