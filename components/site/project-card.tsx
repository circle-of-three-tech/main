import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
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

/** Screenshot frame. `project.url` host is shown in a minimal address bar. */
export function BrowserFrame({ project, priority, sizes = "(min-width: 1024px) 50vw, 100vw" }: { project: ProjectCardData; priority?: boolean; sizes?: string }) {
  const host = project.url ? new URL(project.url).host : `${project.slug}.app`;
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-indigo">
      <div className="flex items-center gap-3 border-b border-line bg-surface px-3.5 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
        </span>
        <span className="truncate text-[0.7rem] text-muted">{host}</span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.coverImage ? (
          <Image src={project.coverImage} alt={`${project.title}: ${project.summary}`} fill sizes={sizes} priority={priority} className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        ) : (
          <>
            <Image src={fallbackPhoto(project.slug).src} alt="" fill sizes={sizes} placeholder="blur" className="object-cover" />
            <div className="scrim absolute inset-0 flex items-center justify-center">
              <span className="font-display text-3xl font-semibold tracking-tight text-fg">{project.title}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProjectCard({ project, index, className, priority }: { project: ProjectCardData; index?: number; className?: string; priority?: boolean }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className={cn("group block", className)}>
      <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
        <div className="rounded-xl transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_24px_48px_-24px_var(--shadow)]">
          <BrowserFrame project={project} priority={priority} />
        </div>
      </ViewTransition>
      <div className="flex items-start justify-between gap-4 pt-5">
        <div>
          <p className="text-sm text-muted">
            {project.category} · {project.year}
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold tracking-[-0.015em] transition-colors duration-200 group-hover:text-cyan">{project.title}</h3>
          <p className="mt-2 line-clamp-2 leading-relaxed text-muted">{project.summary}</p>
        </div>
        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden />
      </div>
    </Link>
  );
}
