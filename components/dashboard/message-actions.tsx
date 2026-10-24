"use client";

import { MailOpen, Mail } from "lucide-react";
import { useTransition } from "react";
import { setMessageRead } from "@/lib/actions/content";

export function ToggleRead({ id, read }: { id: string; read: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button type="button" disabled={pending} onClick={() => start(() => setMessageRead(id, !read))} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted hover:border-cyan hover:text-cyan">
      {read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
      {read ? "Mark unread" : "Mark read"}
    </button>
  );
}
