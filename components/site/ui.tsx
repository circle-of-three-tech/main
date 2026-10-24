import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiseIn, RiseText } from "@/components/motion/rise-text";
import { Magnetic } from "@/components/motion/magnetic";
import { CircuitField } from "./circuit-field";

export function SectionLabel({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn("hud-label flex items-center gap-3", className)}>
      {index && <span className="text-muted">{index}</span>}
      <span className="h-px w-8 bg-cyan/60" />
      {children}
    </p>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: "primary" | "ghost"; cursor?: string };

export function ButtonLink({ variant = "primary", className, children, cursor, ...props }: ButtonLinkProps) {
  return (
    <Magnetic>
      <Link
        {...props}
        data-cursor={cursor}
        className={cn(
          "group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-sm font-semibold transition-colors",
          variant === "primary" ? "bg-fg text-ink" : "border border-line text-fg hover:border-cyan/60",
          className,
        )}
      >
        {variant === "primary" && (
          <span aria-hidden className="absolute inset-0 -translate-x-[101%] bg-gradient-to-r from-cyan to-violet transition-transform duration-700 ease-expo group-hover:translate-x-0" />
        )}
        <span className="relative">{children}</span>
        <span className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-ink/10">
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-5 group-hover:-translate-y-5" />
          <ArrowUpRight className="absolute h-4 w-4 -translate-x-5 translate-y-5 transition-transform duration-500 ease-expo group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      </Link>
    </Magnetic>
  );
}

/** Shared hero for inner pages. `title` is the page's single H1. */
export function PageHero({ label, title, intro, highlight, children }: { label: string; title: string; intro?: string; highlight?: string[]; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-48">
      <CircuitField className="opacity-60" seed={title.length * 7} count={30} />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" aria-hidden />
      <div className="container-x relative">
        <SectionLabel>{label}</SectionLabel>
        <RiseText text={title} highlight={highlight} className="mt-6 max-w-5xl font-display text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.98] tracking-tight" />
        {intro && (
          <RiseIn delay={0.3}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{intro}</p>
          </RiseIn>
        )}
        {children}
      </div>
    </section>
  );
}
