"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

/** Two-step destructive button (no browser dialogs): first click arms, second click runs. */
export function ConfirmAction({ action, label = "Delete", confirmLabel = "Click again to confirm", className }: { action: () => Promise<void>; label?: string; confirmLabel?: string; className?: string }) {
  const [armed, setArmed] = useState(false);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onBlur={() => setArmed(false)}
      onClick={() => (armed ? start(() => action()) : setArmed(true))}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition",
        armed ? "border-danger bg-danger text-ink" : "border-line text-muted hover:border-danger hover:text-danger",
        className,
      )}
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      {armed ? confirmLabel : label}
    </button>
  );
}
