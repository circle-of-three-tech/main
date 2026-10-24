import Link from "next/link";
import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Panel({ title, description, children, className, actions }: { title?: string; description?: string; children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-indigo/40 p-5 md:p-6", className)}>
      {(title || actions) && (
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="font-display text-lg font-semibold">{title}</h2>}
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, description, action, back }: { title: string; description?: string; action?: { href: string; label: string }; back?: { href: string; label: string } }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        {back && (
          <Link href={back.href} className="mb-3 inline-block font-mono text-xs uppercase tracking-[0.18em] text-muted hover:text-cyan">
            ← {back.label}
          </Link>
        )}
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-muted">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="inline-flex items-center gap-2 self-start rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-ink transition hover:brightness-110 md:self-auto">
          <Plus className="h-4 w-4" /> {action.label}
        </Link>
      )}
    </div>
  );
}

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "cyan" | "violet" | "green" | "amber" }) {
  const tones = {
    muted: "border-line text-muted",
    cyan: "border-cyan/40 bg-cyan/10 text-cyan",
    violet: "border-violet/40 bg-violet/15 text-violet-soft",
    green: "border-ok/40 bg-ok/10 text-ok",
    amber: "border-warn/40 bg-warn/10 text-warn",
  };
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider", tones[tone])}>{children}</span>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: { href: string; label: string } }) {
  return (
    <div className="rounded-2xl border border-dashed border-line p-12 text-center">
      <p className="font-display text-xl font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{body}</p>
      {action && (
        <Link href={action.href} className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-ink">
          <Plus className="h-4 w-4" /> {action.label}
        </Link>
      )}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-line bg-indigo/60 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}
