import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Glass surface with HUD corners whose border lights up on hover. */
export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("group glass hud relative overflow-hidden rounded-2xl transition-[border-color,box-shadow] duration-500 hover:border-cyan/50 hover:shadow-[0_0_0_1px_var(--glow)]", className)}>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
