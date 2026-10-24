"use server";

import bcrypt from "bcryptjs";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin, requireUser } from "@/lib/auth";
import { TAGS } from "@/lib/queries";
import { readingTime, slugify } from "@/lib/utils";

export type ActionState = { ok?: boolean; message?: string; error?: string; fieldErrors?: Record<string, string> };

/* ---------------- helpers ---------------- */

const jsonArray = <T extends z.ZodType>(item: T) =>
  z.preprocess((v) => {
    if (typeof v !== "string" || !v) return [];
    try {
      return JSON.parse(v);
    } catch {
      return [];
    }
  }, z.array(item));

const strings = jsonArray(z.string().trim().min(1));
const optional = z.preprocess((v) => (v === "" || v == null ? null : v), z.string().trim().nullable());
const bool = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());
const int = (fallback = 0) => z.preprocess((v) => (v === "" || v == null ? fallback : Number(v)), z.number().int());
const optInt = z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().nullable());
const slugField = z.preprocess((v) => slugify(String(v ?? "")), z.string());

function fail(error: z.ZodError): ActionState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
  return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
}

function input(formData: FormData) {
  return Object.fromEntries(formData) as Record<string, unknown>;
}

async function uniqueSlugError(model: "post" | "project" | "service" | "job", slug: string, id?: string) {
  const where = { slug };
  const existing =
    model === "post"
      ? await db.post.findUnique({ where })
      : model === "project"
        ? await db.project.findUnique({ where })
        : model === "service"
          ? await db.service.findUnique({ where })
          : await db.job.findUnique({ where });
  return existing && existing.id !== id ? { ok: false, error: "That URL slug is already in use.", fieldErrors: { slug: "Slug already in use" } } : null;
}

/* ---------------- posts ---------------- */

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "Title is required").max(200),
  slug: slugField,
  excerpt: z.string().trim().min(10, "Write a short excerpt").max(400),
  content: z.string().min(1, "Content is required"),
  coverImage: optional,
  category: z.string().trim().min(1).max(60),
  tags: strings,
  status: z.enum(["DRAFT", "PUBLISHED"]),
  featured: bool,
  seoTitle: optional,
  seoDescription: optional,
});

export async function savePost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = postSchema.safeParse(input(formData));
  if (!parsed.success) return fail(parsed.error);
  const { id, ...data } = parsed.data;
  const slug = data.slug || slugify(data.title);
  const dupe = await uniqueSlugError("post", slug, id);
  if (dupe) return dupe;

  const existing = id ? await db.post.findUnique({ where: { id } }) : null;
  const publishedAt = data.status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : existing?.publishedAt ?? null;
  const values = { ...data, slug, publishedAt, readingTime: readingTime(data.content) };

  const post = id ? await db.post.update({ where: { id }, data: values }) : await db.post.create({ data: { ...values, authorId: user.id } });
  updateTag(TAGS.posts);
  if (!id) redirect(`/dashboard/posts/${post.id}?created=1`);
  return { ok: true, message: data.status === "PUBLISHED" ? "Published. Live on the site now." : "Draft saved." };
}

export async function deletePost(id: string) {
  await requireUser();
  await db.post.delete({ where: { id } });
  updateTag(TAGS.posts);
  redirect("/dashboard/posts");
}

/* ---------------- projects ---------------- */

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Title is required").max(160),
  slug: slugField,
  client: z.string().trim().min(1, "Client is required").max(160),
  url: optional.pipe(z.url("Enter a full URL including https://").nullable()),
  summary: z.string().trim().min(10, "Write a short summary").max(400),
  content: z.string().min(1, "Content is required"),
  coverImage: optional,
  gallery: strings,
  category: z.string().trim().min(1).max(60),
  services: strings,
  techStack: strings,
  year: int(new Date().getFullYear()),
  order: int(0),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #3DF2FF"),
  featured: bool,
  published: bool,
  metrics: jsonArray(z.object({ label: z.string().trim().min(1), value: z.string().trim().min(1) })),
  seoTitle: optional,
  seoDescription: optional,
});

export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = projectSchema.safeParse(input(formData));
  if (!parsed.success) return fail(parsed.error);
  const { id, ...data } = parsed.data;
  const slug = data.slug || slugify(data.title);
  const dupe = await uniqueSlugError("project", slug, id);
  if (dupe) return dupe;
  const project = id ? await db.project.update({ where: { id }, data: { ...data, slug } }) : await db.project.create({ data: { ...data, slug } });
  updateTag(TAGS.projects);
  if (!id) redirect(`/dashboard/projects/${project.id}?created=1`);
  return { ok: true, message: "Project saved." };
}

export async function deleteProject(id: string) {
  await requireUser();
  await db.project.delete({ where: { id } });
  updateTag(TAGS.projects);
  redirect("/dashboard/projects");
}

/** Persists drag-to-reorder from the projects list. */
export async function reorderProjects(ids: string[]) {
  await requireUser();
  await db.$transaction(ids.map((id, order) => db.project.update({ where: { id }, data: { order } })));
  updateTag(TAGS.projects);
  refresh();
}

/* ---------------- services ---------------- */

const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2).max(120),
  slug: slugField,
  tagline: z.string().trim().min(5, "Add a tagline").max(200),
  icon: z.string().trim().min(1),
  summary: z.string().trim().min(10).max(400),
  content: z.string().min(1),
  deliverables: strings,
  faqs: jsonArray(z.object({ q: z.string().trim().min(1), a: z.string().trim().min(1) })),
  order: int(0),
  published: bool,
  seoTitle: optional,
  seoDescription: optional,
});

export async function saveService(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = serviceSchema.safeParse(input(formData));
  if (!parsed.success) return fail(parsed.error);
  const { id, ...data } = parsed.data;
  const slug = data.slug || slugify(data.title);
  const dupe = await uniqueSlugError("service", slug, id);
  if (dupe) return dupe;
  const service = id ? await db.service.update({ where: { id }, data: { ...data, slug } }) : await db.service.create({ data: { ...data, slug } });
  updateTag(TAGS.services);
  if (!id) redirect(`/dashboard/services/${service.id}?created=1`);
  return { ok: true, message: "Service saved." };
}

export async function deleteService(id: string) {
  await requireUser();
  await db.service.delete({ where: { id } });
  updateTag(TAGS.services);
  redirect("/dashboard/services");
}

/* ---------------- jobs ---------------- */

const jobSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2).max(160),
  slug: slugField,
  department: z.string().trim().min(1).max(80),
  location: z.string().trim().min(1).max(120),
  type: z.string().trim().min(1).max(40),
  remote: bool,
  summary: z.string().trim().min(10).max(400),
  description: z.string().min(1),
  applyUrl: optional,
  open: bool,
  salaryMin: optInt,
  salaryMax: optInt,
  currency: z.string().trim().length(3),
});

export async function saveJob(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = jobSchema.safeParse(input(formData));
  if (!parsed.success) return fail(parsed.error);
  const { id, ...data } = parsed.data;
  const slug = data.slug || slugify(data.title);
  const dupe = await uniqueSlugError("job", slug, id);
  if (dupe) return dupe;
  const job = id ? await db.job.update({ where: { id }, data: { ...data, slug } }) : await db.job.create({ data: { ...data, slug } });
  updateTag(TAGS.jobs);
  if (!id) redirect(`/dashboard/jobs/${job.id}?created=1`);
  return { ok: true, message: "Role saved." };
}

export async function deleteJob(id: string) {
  await requireUser();
  await db.job.delete({ where: { id } });
  updateTag(TAGS.jobs);
  redirect("/dashboard/jobs");
}

/* ---------------- team & testimonials ---------------- */

const teamSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  bio: optional,
  photo: optional,
  linkedin: optional,
  twitter: optional,
  order: int(0),
});

export async function saveTeamMember(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = teamSchema.safeParse(input(formData));
  if (!parsed.success) return fail(parsed.error);
  const { id, ...data } = parsed.data;
  if (id) await db.teamMember.update({ where: { id }, data });
  else await db.teamMember.create({ data });
  updateTag(TAGS.team);
  redirect("/dashboard/team?saved=1");
}

export async function deleteTeamMember(id: string) {
  await requireUser();
  await db.teamMember.delete({ where: { id } });
  updateTag(TAGS.team);
  redirect("/dashboard/team");
}

const testimonialSchema = z.object({
  id: z.string().optional(),
  quote: z.string().trim().min(10).max(800),
  author: z.string().trim().min(2).max(120),
  role: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(120),
  avatar: optional,
  order: int(0),
  published: bool,
});

export async function saveTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = testimonialSchema.safeParse(input(formData));
  if (!parsed.success) return fail(parsed.error);
  const { id, ...data } = parsed.data;
  if (id) await db.testimonial.update({ where: { id }, data });
  else await db.testimonial.create({ data });
  updateTag(TAGS.testimonials);
  redirect("/dashboard/testimonials?saved=1");
}

export async function deleteTestimonial(id: string) {
  await requireUser();
  await db.testimonial.delete({ where: { id } });
  updateTag(TAGS.testimonials);
  redirect("/dashboard/testimonials");
}

/* ---------------- messages ---------------- */

export async function setMessageRead(id: string, read: boolean) {
  await requireUser();
  await db.message.update({ where: { id }, data: { read } });
  refresh();
}

export async function deleteMessage(id: string) {
  await requireUser();
  await db.message.delete({ where: { id } });
  redirect("/dashboard/messages");
}

/* ---------------- settings (admin) ---------------- */

const settingsSchema = z.object({
  tagline: z.string().trim().min(5).max(200),
  description: z.string().trim().max(600),
  email: z.email(),
  phone: z.string().trim().min(5).max(40),
  address: z.string().trim().min(2).max(200),
  city: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  twitter: optional,
  linkedin: optional,
  github: optional,
  instagram: optional,
  stats: jsonArray(z.object({ label: z.string().trim().min(1), value: z.coerce.number(), suffix: z.string().default("") })),
});

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(input(formData));
  if (!parsed.success) return fail(parsed.error);
  await db.siteSettings.upsert({ where: { id: "site" }, update: parsed.data, create: { id: "site", ...parsed.data } });
  updateTag(TAGS.settings);
  return { ok: true, message: "Settings saved." };
}

/* ---------------- users (admin) ---------------- */

const userSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().transform((e) => e.toLowerCase()),
  role: z.enum(["ADMIN", "EDITOR"]),
  password: z.string().min(10, "Use at least 10 characters"),
});

export async function createUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = userSchema.safeParse(input(formData));
  if (!parsed.success) return fail(parsed.error);
  const { password, ...data } = parsed.data;
  if (await db.user.findUnique({ where: { email: data.email } })) return { ok: false, error: "A user with that email already exists.", fieldErrors: { email: "Already exists" } };
  await db.user.create({ data: { ...data, passwordHash: await bcrypt.hash(password, 12) } });
  refresh();
  return { ok: true, message: `${data.name} can now sign in.` };
}

export async function updateUserRole(id: string, role: "ADMIN" | "EDITOR") {
  const me = await requireAdmin();
  if (me.id === id) return;
  await db.user.update({ where: { id }, data: { role } });
  refresh();
}

export async function deleteUser(id: string) {
  const me = await requireAdmin();
  if (me.id === id) return;
  await db.user.delete({ where: { id } });
  redirect("/dashboard/users");
}

const passwordSchema = z.object({ current: z.string().min(1), next: z.string().min(10, "Use at least 10 characters") });

export async function changePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireUser();
  const parsed = passwordSchema.safeParse(input(formData));
  if (!parsed.success) return fail(parsed.error);
  const user = await db.user.findUniqueOrThrow({ where: { id: me.id } });
  if (!(await bcrypt.compare(parsed.data.current, user.passwordHash))) return { ok: false, error: "Current password is incorrect.", fieldErrors: { current: "Incorrect" } };
  await db.user.update({ where: { id: me.id }, data: { passwordHash: await bcrypt.hash(parsed.data.next, 12) } });
  return { ok: true, message: "Password updated." };
}
