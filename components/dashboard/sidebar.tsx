"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Briefcase, ExternalLink, FileText, FolderKanban, Inbox, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Settings, Shapes, Users, UsersRound, X } from "lucide-react";
import { useState } from "react";
import { useOnChange } from "@/lib/hooks";
import { Co3Mark } from "@/components/brand/co3-mark";
import { logout } from "@/lib/actions/auth";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", Icon: LayoutDashboard, exact: true },
  { href: "/dashboard/posts", label: "Blog posts", Icon: FileText },
  { href: "/dashboard/projects", label: "Portfolio", Icon: FolderKanban },
  { href: "/dashboard/services", label: "Services", Icon: Shapes },
  { href: "/dashboard/jobs", label: "Careers", Icon: Briefcase },
  { href: "/dashboard/team", label: "Team", Icon: UsersRound },
  { href: "/dashboard/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
  { href: "/dashboard/messages", label: "Inbox", Icon: Inbox, badge: "unread" as const },
];
const ADMIN_NAV = [
  { href: "/dashboard/settings", label: "Site settings", Icon: Settings },
  { href: "/dashboard/users", label: "Users", Icon: Users },
];

export function Sidebar({ user, unread }: { user: { name: string; email: string; role: "ADMIN" | "EDITOR" }; unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useOnChange(pathname, () => setOpen(false));
  const items = user.role === "ADMIN" ? [...NAV, ...ADMIN_NAV] : NAV;
  const active = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-ink/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Co3Mark label={false} className="h-8 w-8 text-fg" />
          <span className="font-display font-semibold">Co3 Studio</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle className="h-10 w-10" />
          <button type="button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" className="rounded-lg border border-line p-2">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-500 lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <Link href="/dashboard" className="flex items-center gap-3 px-6 py-6">
          <Co3Mark label={false} className="h-10 w-10 text-fg" />
          <span>
            <span className="block font-display font-semibold leading-none">Co3 Studio</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted">Content dashboard</span>
          </span>
        </Link>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3" aria-label="Dashboard">
          {items.map(({ href, label, Icon, ...rest }) => {
            const isActive = active(href, "exact" in rest ? Boolean(rest.exact) : false);
            return (
              <Link key={href} href={href} className={cn("relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", isActive ? "text-fg" : "text-muted hover:text-fg")}>
                {isActive && <motion.span layoutId="dash-active" className="absolute inset-0 rounded-xl border border-cyan/25 bg-cyan/10" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <Icon className={cn("relative h-4 w-4", isActive && "text-cyan")} />
                <span className="relative flex-1">{label}</span>
                {"badge" in rest && unread > 0 && <span className="relative rounded-full bg-cyan px-2 py-0.5 font-mono text-[0.6rem] font-bold text-ink">{unread}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-line p-4">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:text-fg">
              <ExternalLink className="h-4 w-4" /> View live site
            </Link>
            <ThemeToggle className="hidden h-9 w-9 lg:flex" />
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-indigo/60 p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan font-display text-sm font-bold text-ink">{user.name.slice(0, 1)}</span>
            <Link href="/dashboard/account" className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{user.name}</span>
              <span className="block font-mono text-[0.6rem] uppercase tracking-wider text-cyan">{user.role}</span>
            </Link>
            <form action={logout}>
              <button type="submit" aria-label="Sign out" className="rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>
      {open && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-40 bg-ink/60 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
