import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Infinite CSS marquee; content is duplicated once and the copy is hidden from assistive tech. */
export function Marquee({ children, className, duration = 40, reverse }: { children: ReactNode; className?: string; duration?: number; reverse?: boolean }) {
  return (
    <div className={cn("group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]", className)}>
      <div
        className="flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
