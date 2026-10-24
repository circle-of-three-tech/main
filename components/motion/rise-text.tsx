import { Fragment, type CSSProperties, type ElementType } from "react";
import { cn } from "@/lib/utils";

/**
 * Above-the-fold masked word reveal driven purely by CSS, so it starts on first paint
 * (no hydration wait) and keeps Largest Contentful Paint fast.
 */
export function RiseText({ text, as: Tag = "h1", className, highlight = [], delay = 0, stagger = 0.06 }: { text: string; as?: ElementType; className?: string; highlight?: string[]; delay?: number; stagger?: number }) {
  const words = text.split(" ");
  return (
    <Tag className={cn("[text-wrap:balance]", className)}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <span
              className={cn("rise-word inline-block", highlight.some((h) => h.replace(/[.,!?]/g, "") === word.replace(/[.,!?]/g, "")) && "text-gradient")}
              style={{ animationDelay: `${delay + i * stagger}s` } as CSSProperties}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}

/** CSS fade-up for above-the-fold blocks. */
export function RiseIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={cn("rise-in", className)} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
