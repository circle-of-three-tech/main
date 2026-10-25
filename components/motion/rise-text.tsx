import { Fragment, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const clean = (w: string) => w.replace(/[.,!?:;]/g, "");

/** Renders text with the listed words in the quieter second tone (`text-highlight`). */
export function HighlightText({ text, highlight = [] }: { text: string; highlight?: string[] }) {
  if (!highlight.length) return <>{text}</>;
  const marks = new Set(highlight.map(clean));
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {marks.has(clean(word)) ? <span className="text-highlight">{word}</span> : word}
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </>
  );
}

/** Above-the-fold heading with a CSS fade-up that starts on first paint (fast LCP). */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function RiseText({ text, as: Tag = "h1", className, highlight = [], delay = 0, stagger }: { text: string; as?: ElementType; className?: string; highlight?: string[]; delay?: number; stagger?: number }) {
  return (
    <Tag className={cn(!/\bhero-fade\b/.test(className ?? "") && "rise-in", "[text-wrap:balance]", className)} style={{ animationDelay: `${delay}s` }}>
      <HighlightText text={text} highlight={highlight} />
    </Tag>
  );
}

/** CSS fade-up for above-the-fold blocks. */
export function RiseIn({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div className={cn("rise-in", className)} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
