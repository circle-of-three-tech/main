import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiseText } from "@/components/motion/rise-text";
import type { Photo } from "@/lib/photos";
import { ParallaxImage } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";

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
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {label && <SectionLabel>{label}</SectionLabel>}
      <h2 id={id} className="mt-3 font-display text-3xl font-semibold leading-[1.15] tracking-[-0.025em] md:text-[2.6rem]">
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-muted">{lead}</p>}
    </Reveal>
  );
}

type ButtonVariant = "primary" | "accent" | "ghost";
type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant; cursor?: string; arrow?: boolean };

export const buttonClass = (variant: ButtonVariant = "primary") =>
  cn(
    "group inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-[background-color,border-color,box-shadow,transform,color] duration-200 ease-out hover:-translate-y-px active:translate-y-0",
    variant === "primary" && "btn-shine bg-cyan text-accent-ink shadow-[0_1px_2px_var(--shadow)] hover:bg-cyan-strong hover:shadow-[0_8px_24px_-8px_var(--glow)]",
    // Coral accent with dark text (6.8:1 contrast); used for the main calls to action.
    variant === "accent" && "btn-shine bg-spark text-spark-ink shadow-[0_1px_2px_var(--shadow)] hover:bg-[#ff8566] hover:shadow-[0_10px_28px_-8px_rgb(255_107_74/0.6)]",
    variant === "ghost" && "border border-line-strong bg-surface text-fg hover:border-cyan/50 hover:text-cyan",
  );

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ButtonLink({ variant = "primary", className, children, cursor, arrow = variant !== "ghost", ...props }: ButtonLinkProps) {
  return (
    <Link {...props} className={cn(buttonClass(variant), className)}>
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />}
    </Link>
  );
}

/** Shared hero for inner pages. `title` is the page's single H1; `image` shows in a parallax frame beside it. */
export function PageHero({
  label,
  title,
  intro,
  highlight,
  image,
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
    <section className="relative overflow-hidden border-b border-line bg-indigo pb-16 pt-32 md:pb-20 md:pt-40">
      <div aria-hidden className="tech-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_20%_30%,#000_20%,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-soft blur-3xl" />
      <div className={cn("container-x relative", image && "grid items-center gap-12 lg:grid-cols-12")}>
        <div className={cn(image && "lg:col-span-7")}>
          <p className="hud-label hero-fade">{label}</p>
          <RiseText text={title} highlight={highlight} className="hero-fade mt-4 max-w-4xl font-display text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.06] tracking-[-0.03em]" delay={0.12} />
          {intro && (
            <p className="hero-fade mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl" style={{ animationDelay: "0.3s" }}>
              {intro}
            </p>
          )}
          {children && (
            <div className="hero-fade" style={{ animationDelay: "0.45s" }}>
              {children}
            </div>
          )}
        </div>
        {image && (
          <div className="hero-fade relative lg:col-span-5" style={{ animationDelay: "0.2s" }}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line shadow-[0_30px_60px_-30px_var(--shadow)] lg:aspect-[4/5]">
              <ParallaxImage src={image.src} alt={image.alt} priority speed={0.14} sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
