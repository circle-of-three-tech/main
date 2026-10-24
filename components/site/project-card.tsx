import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/motion/tilt-card";
import { cn } from "@/lib/utils";
import { fallbackPhoto } from "@/lib/photos";

export type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  coverImage: string | null;
  url: string | null;
  year: number;
  accent: string;
};

export function BrowserFrame({ project, priority, sizes = "(min-width: 1024px) 50vw, 100vw" }: { project: ProjectCardData; priority?: boolean; sizes?: string }) {
  const host = project.url ? new URL(project.url).host : `${project.slug}.app`;
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-indigo shadow-[0_30px_80px_-30px_var(--shadow)]">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate rounded-md bg-ink/60 px-3 py-1 font-mono text-[0.65rem] text-muted">{host}</span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.coverImage ? (
          <Image src={project.coverImage} alt={`${project.title}: ${project.summary}`} fill sizes={sizes} priority={priority} className="object-cover object-top transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.04]" />
        ) : (
          <>
            <Image src={fallbackPhoto(project.slug).src} alt="" fill sizes={sizes} placeholder="blur" className="object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.04]" />
            <div className="scrim absolute inset-0 flex items-center justify-center">
              <span className="font-display text-4xl font-bold tracking-tight text-fg">{project.title}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ProjectCard({ project, index, className, priority }: { project: ProjectCardData; index?: number; className?: string; priority?: boolean }) {
  return (
    <TiltCard className={cn("rounded-2xl", className)} max={6}>
      <Link href={`/portfolio/${project.slug}`} className="group block rounded-2xl border border-line bg-indigo/40 p-3 transition-colors duration-500 hover:border-cyan/40" data-cursor="View">
        <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
          <div>
            <BrowserFrame project={project} priority={priority} />
          </div>
        </ViewTransition>
        <div className="flex items-start justify-between gap-4 px-2 pb-2 pt-5">
          <div>
            <p className="accent-text font-mono text-[0.7rem] uppercase tracking-[0.2em]" style={{ "--accent": project.accent } as React.CSSProperties}>
              {index !== undefined && <span className="mr-2 text-muted">{String(index + 1).padStart(2, "0")}</span>}
              {project.category} · {project.year}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{project.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{project.summary}</p>
          </div>
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-cyan group-hover:bg-cyan group-hover:text-ink">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
