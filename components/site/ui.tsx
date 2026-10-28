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
      <h2 id={id} className="mt-4 font-display text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.04em]">
        {title}
      </h2>
      {lead && <p className="mt-5 text-lg leading-relaxed text-muted">{lead}</p>}
    </Reveal>
  );
}

type ButtonVariant = "primary" | "accent" | "ghost" | "light";
type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant; cursor?: string; arrow?: boolean };

export const buttonClass = (variant: ButtonVariant = "primary") =>
  cn(
    "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-[background-color,border-color,box-shadow,transform,color] duration-300 ease-out hover:-translate-y-px active:translate-y-0",
    variant === "primary" && "btn-shine bg-cyan text-accent-ink shadow-[0_8px_24px_-12px_var(--shadow)] hover:bg-cyan-strong",
    // Main calls to action: charcoal pill that picks up a sunset-tinted glow on hover.
    variant === "accent" && "btn-shine bg-fg text-ink shadow-[0_10px_30px_-14px_rgb(27_27_27/0.5)] hover:shadow-[0_14px_36px_-10px_var(--glow)]",
    variant === "ghost" && "border border-line-strong bg-surface/60 text-fg backdrop-blur-md hover:border-fg hover:bg-fg hover:text-ink",
    // For dark surfaces (header pill, footer).
    variant === "light" && "bg-ink text-[#151515] hover:bg-white",
  );

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ButtonLink({ variant = "primary", className, children, cursor, arrow = variant !== "ghost", ...props }: ButtonLinkProps) {
  return (
    <Link {...props} className={cn(buttonClass(variant), className)}>
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />}
    </Link>
  );
}

/** Shared hero for inner pages: centred eyebrow, single H1 and intro, then `image` in a wide rounded parallax frame. */
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
    <section className={cn("relative pt-36 md:pt-48", image ? "pb-6" : "pb-16 md:pb-24")}>
      <div className="container-x flex flex-col items-center text-center">
        <p className="hud-label hero-fade">{label}</p>
        <RiseText text={title} highlight={highlight} className="hero-fade mt-6 max-w-5xl font-display text-[clamp(2.5rem,6.4vw,5.25rem)] font-bold leading-[1.02] tracking-[-0.05em]" delay={0.12} />
        {intro && (
          <p className="hero-fade mt-7 max-w-2xl text-lg leading-relaxed text-muted md:text-xl" style={{ animationDelay: "0.3s" }}>
            {intro}
          </p>
        )}
        {children && (
          <div className="hero-fade flex justify-center" style={{ animationDelay: "0.45s" }}>
            {children}
          </div>
        )}
      </div>
      {image && (
        <div className="container-x hero-fade mt-14 md:mt-20" style={{ animationDelay: "0.2s" }}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-indigo shadow-[0_40px_80px_-40px_rgb(27_27_27/0.35)] sm:aspect-[16/8] md:rounded-[40px] lg:aspect-[21/9]">
            <ParallaxImage src={image.src} alt={image.alt} priority speed={0.14} sizes="(min-width: 1320px) 1240px, 100vw" />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </div>
        </div>
      )}
    </section>
  );
}
