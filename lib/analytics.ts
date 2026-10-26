import "server-only";
import { db } from "./db";
import { Prisma } from "./generated/prisma/client";

export const ANALYTICS_TZ = "Africa/Lagos";

/** Lagos is UTC+1 all year (no daylight saving), so bucket boundaries can use a fixed offset. */
const TZ_OFFSET_MS = 3_600_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

export const RANGES = {
  "24h": { label: "24 hours", buckets: 24, bucket: "hour" },
  "7d": { label: "7 days", buckets: 7, bucket: "day" },
  "30d": { label: "30 days", buckets: 30, bucket: "day" },
  "90d": { label: "90 days", buckets: 90, bucket: "day" },
} as const;
export type RangeKey = keyof typeof RANGES;

export function parseRange(value: unknown): RangeKey {
  return typeof value === "string" && value in RANGES ? (value as RangeKey) : "7d";
}

export type Totals = { visitors: number; pageviews: number; sessions: number; bounceRate: number; avgDuration: number };
export type Point = { key: string; pageviews: number; visitors: number };
export type Row = { label: string; views: number; visitors: number };

const DIMENSIONS = {
  path: Prisma.raw(`"path"`),
  referrer: Prisma.raw(`"referrer"`),
  source: Prisma.raw(`"source"`),
  country: Prisma.raw(`"country"`),
  device: Prisma.raw(`"device"`),
  browser: Prisma.raw(`"browser"`),
  os: Prisma.raw(`"os"`),
} as const;
type Dimension = keyof typeof DIMENSIONS;

async function totals(from: Date, to: Date): Promise<Totals> {
  const [row] = await db.$queryRaw<
    { visitors: bigint; pageviews: bigint; sessions: bigint; bounced: bigint; avg_duration: number | null }[]
  >`
    WITH s AS (
      SELECT "sessionId", COUNT(*) AS views
      FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
      GROUP BY "sessionId"
    )
    SELECT
      (SELECT COUNT(DISTINCT "visitorId") FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to}) AS visitors,
      (SELECT COALESCE(SUM(views), 0) FROM s) AS pageviews,
      (SELECT COUNT(*) FROM s) AS sessions,
      (SELECT COUNT(*) FROM s WHERE views = 1) AS bounced,
      (SELECT AVG("duration")::float FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND "duration" > 0) AS avg_duration
  `;
  const sessions = Number(row.sessions);
  return {
    visitors: Number(row.visitors),
    pageviews: Number(row.pageviews),
    sessions,
    bounceRate: sessions ? Number(row.bounced) / sessions : 0,
    avgDuration: Math.round(row.avg_duration ?? 0),
  };
}

/** Bucket keys in Lagos local time: "YYYY-MM-DD" for days, "YYYY-MM-DDTHH" for hours. */
function bucketKey(date: Date, bucket: "hour" | "day") {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: ANALYTICS_TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23" })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  const day = `${parts.year}-${parts.month}-${parts.day}`;
  return bucket === "day" ? day : `${day}T${parts.hour}`;
}

async function series(from: Date, to: Date, bucket: "hour" | "day", step: number): Promise<Point[]> {
  const unit = Prisma.raw(`'${bucket}'`);
  const format = Prisma.raw(bucket === "day" ? `'YYYY-MM-DD'` : `'YYYY-MM-DD"T"HH24'`);
  const tz = Prisma.raw(`'${ANALYTICS_TZ}'`);
  const rows = await db.$queryRaw<{ key: string; pageviews: bigint; visitors: bigint }[]>`
    SELECT to_char(date_trunc(${unit}, ("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${tz}), ${format}) AS key,
           COUNT(*) AS pageviews, COUNT(DISTINCT "visitorId") AS visitors
    FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
    GROUP BY 1
  `;
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const points: Point[] = [];
  // `from` sits on a bucket boundary, so stepping forward yields every bucket up to the current one; empty ones read 0.
  for (let t = from.getTime(); t < to.getTime(); t += step) {
    const key = bucketKey(new Date(t), bucket);
    const r = byKey.get(key);
    points.push({ key, pageviews: Number(r?.pageviews ?? 0), visitors: Number(r?.visitors ?? 0) });
  }
  return points;
}

async function breakdown(dimension: Dimension, from: Date, to: Date, limit = 8): Promise<Row[]> {
  const col = DIMENSIONS[dimension];
  const rows = await db.$queryRaw<{ label: string; views: bigint; visitors: bigint }[]>`
    SELECT ${col} AS label, COUNT(*) AS views, COUNT(DISTINCT "visitorId") AS visitors
    FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND ${col} IS NOT NULL
    GROUP BY 1 ORDER BY 3 DESC, 2 DESC, 1 LIMIT ${limit}
  `;
  return rows.map((r) => ({ label: r.label, views: Number(r.views), visitors: Number(r.visitors) }));
}

export async function liveVisitors() {
  const since = new Date(Date.now() - 5 * 60_000);
  const rows = await db.pageView.findMany({ where: { createdAt: { gte: since } }, distinct: ["visitorId"], select: { visitorId: true } });
  return rows.length;
}

/** Window covering the last N whole buckets, the current (partial) one included, plus the equal-length window before it. */
function periodFor(range: RangeKey) {
  const { buckets, bucket } = RANGES[range];
  const step = bucket === "day" ? DAY : HOUR;
  const now = Date.now();
  const currentStart = Math.floor((now + TZ_OFFSET_MS) / step) * step - TZ_OFFSET_MS;
  const from = currentStart - (buckets - 1) * step;
  const length = now - from;
  return { from: new Date(from), to: new Date(now), prevFrom: new Date(from - length), step, bucket };
}

export async function getAnalytics(range: RangeKey) {
  const { from, to, prevFrom, step, bucket } = periodFor(range);

  const [current, previous, points, pages, referrers, sources, countries, devices, browsers, systems, live] = await Promise.all([
    totals(from, to),
    totals(prevFrom, from),
    series(from, to, bucket, step),
    breakdown("path", from, to, 10),
    breakdown("referrer", from, to),
    breakdown("source", from, to),
    breakdown("country", from, to),
    breakdown("device", from, to),
    breakdown("browser", from, to),
    breakdown("os", from, to),
    liveVisitors(),
  ]);

  return { range, bucket, current, previous, points, pages, referrers, sources, countries, devices, browsers, systems, live };
}

/** Compact numbers for the overview tile. */
export async function getAnalyticsSummary() {
  const { from, to, prevFrom } = periodFor("7d");
  const [current, previous, live] = await Promise.all([totals(from, to), totals(prevFrom, from), liveVisitors()]);
  return { current, previous, live };
}
