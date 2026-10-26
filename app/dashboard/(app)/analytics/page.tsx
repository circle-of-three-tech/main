import type { Metadata } from "next";
import Link from "next/link";
import { BreakdownList, compact, countryLabel, Delta, formatDuration, StatTile } from "@/components/analytics/breakdown";
import { TrafficChart } from "@/components/analytics/traffic-chart";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { getAnalytics, parseRange, RANGES } from "@/lib/analytics";
import { requireUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage({ searchParams }: PageProps<"/dashboard/analytics">) {
  await requireUser();
  const range = parseRange((await searchParams).range);
  const a = await getAnalytics(range);
  const { current: c, previous: p } = a;
  const hasData = c.pageviews > 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Traffic on the public site. Cookie-free; your own visits while signed in aren't counted." />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="inline-flex rounded-full border border-line bg-indigo/40 p-1" aria-label="Date range">
          {Object.entries(RANGES).map(([key, r]) => (
            <Link
              key={key}
              href={`/dashboard/analytics?range=${key}`}
              aria-current={key === range ? "page" : undefined}
              className={cn("rounded-full px-4 py-1.5 text-sm transition", key === range ? "bg-cyan font-semibold text-accent-ink" : "text-muted hover:text-fg")}
            >
              {r.label}
            </Link>
          ))}
        </nav>
        <p className="flex items-center gap-2 text-sm text-muted">
          <span className="relative flex h-2.5 w-2.5">
            {a.live > 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />}
            <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", a.live > 0 ? "bg-ok" : "bg-line-strong")} />
          </span>
          <strong className="font-semibold text-fg">{a.live}</strong> on the site now
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Visitors" value={compact(c.visitors)}>
          <Delta now={c.visitors} before={p.visitors} />
        </StatTile>
        <StatTile label="Page views" value={compact(c.pageviews)}>
          <Delta now={c.pageviews} before={p.pageviews} />
        </StatTile>
        <StatTile label="Bounce rate" value={c.sessions ? `${Math.round(c.bounceRate * 100)}%` : "–"}>
          {c.sessions > 0 && p.sessions > 0 && <Delta now={c.bounceRate} before={p.bounceRate} invert percentPoints />}
        </StatTile>
        <StatTile label="Time on page" value={c.avgDuration ? formatDuration(c.avgDuration) : "–"}>
          {c.avgDuration > 0 && <Delta now={c.avgDuration} before={p.avgDuration} />}
        </StatTile>
      </div>

      <Panel title="Traffic" description={`Last ${RANGES[range].label}, compared with the ${RANGES[range].label} before. Times are Lagos time.`}>
        {hasData ? (
          <>
            <TrafficChart points={a.points} bucket={a.bucket} />
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer text-muted hover:text-fg">Show as table</summary>
              <div className="mt-3 max-h-72 overflow-auto rounded-xl border border-line">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-indigo font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                    <tr>
                      <th className="px-3 py-2 font-medium">{a.bucket === "hour" ? "Hour" : "Date"}</th>
                      <th className="px-3 py-2 text-right font-medium">Visitors</th>
                      <th className="px-3 py-2 text-right font-medium">Page views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line tabular-nums">
                    {[...a.points].reverse().map((pt) => (
                      <tr key={pt.key}>
                        <td className="px-3 py-1.5">{pt.key.replace("T", " ") + (a.bucket === "hour" ? ":00" : "")}</td>
                        <td className="px-3 py-1.5 text-right">{pt.visitors}</td>
                        <td className="px-3 py-1.5 text-right">{pt.pageviews}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </>
        ) : (
          <p className="py-12 text-center text-sm text-muted">No visits recorded in this period yet. Views appear here within seconds of someone opening the site.</p>
        )}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Top pages">
          <BreakdownList
            rows={a.pages}
            empty="No page views yet."
            render={(r) => (
              <Link href={r.label} target="_blank" className="hover:text-cyan">
                {r.label}
              </Link>
            )}
          />
        </Panel>
        <Panel title="Referrers" description="Sites that sent visitors here. Direct visits and links from your own pages aren't listed.">
          <BreakdownList rows={a.referrers} empty="No referred visits yet." />
        </Panel>
        <Panel title="Countries">
          <BreakdownList rows={a.countries} empty="No location data yet. It's filled in on the live site." render={(r) => countryLabel(r.label)} />
        </Panel>
        <Panel title="Campaigns" description="From utm_source on links you share, e.g. ?utm_source=linkedin.">
          <BreakdownList rows={a.sources} empty="No tagged links used yet." />
        </Panel>
        <Panel title="Devices &amp; systems">
          <BreakdownList rows={a.devices} empty="No data yet." render={(r) => r.label[0].toUpperCase() + r.label.slice(1)} />
          {a.systems.length > 0 && (
            <div className="mt-5 border-t border-line pt-5">
              <BreakdownList rows={a.systems.slice(0, 6)} empty="" />
            </div>
          )}
        </Panel>
        <Panel title="Browsers">
          <BreakdownList rows={a.browsers} empty="No data yet." />
        </Panel>
      </div>
    </div>
  );
}
