"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Surface with a radial glow that follows the cursor (CSS variables, no re-renders). */
export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn("group glass hud relative overflow-hidden rounded-2xl transition-colors duration-500 hover:border-cyan/40", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgb(61 242 255 / 0.14), transparent 45%)" }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
