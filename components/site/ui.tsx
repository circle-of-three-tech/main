import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiseIn, RiseText } from "@/components/motion/rise-text";
import type { Photo } from "@/lib/photos";

/** Small uppercase eyebrow above a heading. `index` is accepted for compatibility but no longer shown. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SectionLabel({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return <p className={cn("hud-label", className)}>{children}</p>;
}

/** Standard section heading block: eyebrow, title and optional lead paragraph. */
export function SectionHeading({
  label,
  title,
  lead,
  id,
  align = "left",
  className,
}: {
  label?: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {label && <SectionLabel>{label}</SectionLabel>}
      <h2 id={id} className="mt-3 font-display text-3xl font-semibold leading-[1.15] tracking-[-0.025em] md:text-[2.6rem]">
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: "primary" | "ghost"; cursor?: string; arrow?: boolean };

export const buttonClass = (variant: "primary" | "ghost" = "primary") =>
  cn(
    "group inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors duration-200",
    variant === "primary"
      ? "bg-cyan text-accent-ink hover:bg-[color-mix(in_srgb,var(--cyan)_88%,var(--fg))]"
      : "border border-line-strong bg-surface text-fg hover:border-fg/40",
  );

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ButtonLink({ variant = "primary", className, children, cursor, arrow = variant === "primary", ...props }: ButtonLinkProps) {
  return (
    <Link {...props} className={cn(buttonClass(variant), className)}>
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />}
    </Link>
  );
}

/** Shared hero for inner pages. `title` is the page's single H1. `image` is accepted for compatibility. */
export function PageHero({
  label,
  title,
  intro,
  highlight,
  children,
}: {
  label: string;
  title: string;
  intro?: string;
  highlight?: string[];
  image?: Photo;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-indigo pb-16 pt-36 md:pb-20 md:pt-44">
      <div className="container-x">
        <SectionLabel>{label}</SectionLabel>
        <RiseText text={title} highlight={highlight} className="mt-4 max-w-4xl font-display text-[clamp(2.3rem,5vw,3.75rem)] font-semibold leading-[1.06] tracking-[-0.03em]" />
        {intro && (
          <RiseIn delay={0.08}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{intro}</p>
          </RiseIn>
        )}
        {children}
      </div>
    </section>
  );
}
