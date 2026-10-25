import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Bordered card surface that lifts its border on hover. */
export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-[0_8px_24px_-12px_var(--shadow)]",
        className,
      )}
    >
      <div className="relative h-full">{children}</div>
    </div>
  );
}
