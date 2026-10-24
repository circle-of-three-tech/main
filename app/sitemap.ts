import type { MetadataRoute } from "next";
import { getJobs, getPosts, getProjects, getServices } from "@/lib/queries";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, services, jobs] = await Promise.all([getPosts(), getProjects(), getServices(), getJobs()]);
  const latest = (dates: Date[]) => (dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined);

  const statics: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1, lastModified: latest(projects.map((p) => p.updatedAt)) },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/portfolio"), changeFrequency: "weekly", priority: 0.9, lastModified: latest(projects.map((p) => p.updatedAt)) },
    { url: absoluteUrl("/blog"), changeFrequency: "daily", priority: 0.8, lastModified: latest(posts.map((p) => p.updatedAt)) },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/careers"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.7 },
  ];

  return [
    ...statics,
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: s.updatedAt, changeFrequency: "monthly" as const, priority: 0.85 })),
    ...projects.map((p) => ({ url: absoluteUrl(`/portfolio/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.7, images: p.coverImage ? [absoluteUrl(p.coverImage)] : undefined })),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.75 })),
    ...jobs.map((j) => ({ url: absoluteUrl(`/careers/${j.slug}`), lastModified: j.updatedAt, changeFrequency: "weekly" as const, priority: 0.5 })),
  ];
}
