import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Bordered card surface that lifts its border on hover. */
export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "beam-card group relative overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,box-shadow,transform] duration-300 hover:border-line-strong hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-14px_var(--glow)]",
        className,
      )}
    >
      <div className="relative h-full">{children}</div>
    </div>
  );
}
