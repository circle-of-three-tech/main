import { createHash } from "node:crypto";
import { after, type NextRequest } from "next/server";
import { z } from "zod";
import { SESSION_COOKIE } from "@/lib/auth";
import { db } from "@/lib/db";
import { isBot, parseUserAgent } from "@/lib/user-agent";

const RETENTION_DAYS = 400;

const viewSchema = z.object({
  type: z.literal("view"),
  path: z.string().startsWith("/").max(300),
  referrer: z.string().max(500).optional(),
  source: z.string().max(100).optional(),
  sessionId: z.string().min(8).max(64),
});
const leaveSchema = z.object({
  type: z.literal("leave"),
  id: z.string().min(1).max(40),
  duration: z.number().int().min(0).max(60 * 60 * 4),
});
const schema = z.discriminatedUnion("type", [viewSchema, leaveSchema]);

/** Records a page view (returns its id) or the time spent on it. Always answers 204/200 so trackers never surface errors. */
export async function POST(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  // Skip bots, people who opted out, and signed-in team members browsing their own site.
  if (isBot(ua) || request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1" || request.cookies.has(SESSION_COOKIE)) {
    return new Response(null, { status: 204 });
  }

  let body: unknown;
  try {
    // sendBeacon posts text/plain, so parse the raw text rather than relying on the content type.
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 204 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response(null, { status: 204 });

  const visitorId = visitorHash(request, ua);
  const data = parsed.data;

  if (data.type === "leave") {
    // Scoped to the same visitor so nobody can rewrite other people's rows.
    await db.pageView.updateMany({ where: { id: data.id, visitorId }, data: { duration: data.duration } });
    return new Response(null, { status: 204 });
  }

  const { device, browser, os } = parseUserAgent(ua);
  const view = await db.pageView.create({
    data: {
      path: normalisePath(data.path),
      referrer: referrerHost(data.referrer, request.nextUrl.hostname),
      source: data.source?.trim().toLowerCase() || null,
      visitorId,
      sessionId: data.sessionId,
      country: countryCode(request.headers.get("x-vercel-ip-country")),
      device,
      browser,
      os,
    },
    select: { id: true },
  });

  // Occasionally prune old rows so the table stays small without a cron job.
  if (Math.random() < 0.01) {
    after(() => db.pageView.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - RETENTION_DAYS * 86_400_000) } } }));
  }

  return Response.json({ id: view.id });
}

function visitorHash(request: NextRequest, ua: string) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.ANALYTICS_SALT || process.env.AUTH_SECRET || "co3";
  return createHash("sha256").update(`${salt}|${day}|${ip}|${ua}`).digest("hex").slice(0, 32);
}

function normalisePath(path: string) {
  const clean = path.split(/[?#]/)[0].replace(/\/{2,}/g, "/");
  return clean.length > 1 ? clean.replace(/\/$/, "") : "/";
}

function referrerHost(referrer: string | undefined, ownHost: string) {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
    if (!host || host === ownHost.replace(/^www\./, "")) return null;
    // Collapse the many Google/Bing country domains and app link wrappers.
    if (/(^|\.)google\./.test(host)) return "google.com";
    if (/(^|\.)bing\.com$/.test(host)) return "bing.com";
    if (host === "t.co") return "x.com";
    if (host === "l.facebook.com" || host === "m.facebook.com") return "facebook.com";
    if (host === "lnkd.in" || host.endsWith(".linkedin.com")) return "linkedin.com";
    if (host === "l.instagram.com") return "instagram.com";
    return host;
  } catch {
    return null;
  }
}

function countryCode(value: string | null) {
  return value && /^[A-Z]{2}$/i.test(value) ? value.toUpperCase() : null;
}
