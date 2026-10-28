import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Soft rounded card that lifts with a diffused charcoal shadow on hover. */
export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[28px] border border-line bg-surface transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_24px_48px_-24px_rgb(27_27_27/0.25)]",
        className,
      )}
    >
      <div className="relative h-full">{children}</div>
    </div>
  );
}
