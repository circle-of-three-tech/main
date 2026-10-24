import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "./db";

/**
 * Public, cached reads. Every function is tagged so dashboard mutations can
 * invalidate exactly what changed via `updateTag` (see lib/actions/revalidate.ts).
 */

export type Metric = { label: string; value: string };
export type Faq = { q: string; a: string };
export type Stat = { label: string; value: number; suffix: string };

export const TAGS = {
  posts: "posts",
  projects: "projects",
  services: "services",
  jobs: "jobs",
  team: "team",
  testimonials: "testimonials",
  settings: "settings",
} as const;

const fallbackSettings = {
  id: "site",
  tagline: "We engineer software that moves Africa forward.",
  description: "",
  email: "circleofthreetechnologies@gmail.com",
  phone: "+234 000 000 0000",
  address: "Lagos",
  city: "Lagos",
  country: "Nigeria",
  twitter: null,
  linkedin: null,
  github: null,
  instagram: null,
  stats: [] as Stat[],
  updatedAt: new Date(0),
};

export async function getSettings() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.settings);
  const row = await db.siteSettings.findUnique({ where: { id: "site" } });
  if (!row) return fallbackSettings;
  return { ...row, stats: (row.stats ?? []) as Stat[] };
}

export async function getServices() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.services);
  const rows = await db.service.findMany({ where: { published: true }, orderBy: { order: "asc" } });
  return rows.map((s) => ({ ...s, faqs: s.faqs as Faq[] }));
}

export async function getService(slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.services);
  const s = await db.service.findFirst({ where: { slug, published: true } });
  return s ? { ...s, faqs: s.faqs as Faq[] } : null;
}

export async function getProjects() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.projects);
  const rows = await db.project.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { year: "desc" }],
  });
  return rows.map((p) => ({ ...p, metrics: p.metrics as Metric[] }));
}

export async function getProject(slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.projects);
  const p = await db.project.findFirst({ where: { slug, published: true } });
  return p ? { ...p, metrics: p.metrics as Metric[] } : null;
}

const postListSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImage: true,
  category: true,
  tags: true,
  featured: true,
  readingTime: true,
  publishedAt: true,
  updatedAt: true,
  author: { select: { name: true } },
} as const;

export async function getPosts() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.posts);
  return db.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: postListSelect,
  });
}

export async function getPost(slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.posts);
  return db.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { author: { select: { name: true, avatar: true } } },
  });
}

export async function getRelatedPosts(slug: string, category: string, limit = 3) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.posts);
  const sameCategory = await db.post.findMany({
    where: { status: "PUBLISHED", slug: { not: slug }, category },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: postListSelect,
  });
  if (sameCategory.length >= limit) return sameCategory;
  const rest = await db.post.findMany({
    where: { status: "PUBLISHED", slug: { notIn: [slug, ...sameCategory.map((p) => p.slug)] } },
    orderBy: { publishedAt: "desc" },
    take: limit - sameCategory.length,
    select: postListSelect,
  });
  return [...sameCategory, ...rest];
}

export async function getJobs() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.jobs);
  return db.job.findMany({ where: { open: true }, orderBy: { createdAt: "desc" } });
}

export async function getJob(slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.jobs);
  return db.job.findFirst({ where: { slug, open: true } });
}

export async function getTeam() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.team);
  return db.teamMember.findMany({ orderBy: { order: "asc" } });
}

export async function getTestimonials() {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.testimonials);
  return db.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } });
}

/** Slugs for generateStaticParams. Cache Components requires at least one entry. */
export async function getSlugs(kind: "posts" | "projects" | "services" | "jobs") {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS[kind]);
  const rows =
    kind === "posts"
      ? await db.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } })
      : kind === "projects"
        ? await db.project.findMany({ where: { published: true }, select: { slug: true } })
        : kind === "services"
          ? await db.service.findMany({ where: { published: true }, select: { slug: true } })
          : await db.job.findMany({ where: { open: true }, select: { slug: true } });
  return rows.length ? rows.map((r) => ({ slug: r.slug })) : [{ slug: "__placeholder__" }];
}
