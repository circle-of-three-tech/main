import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Row } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function formatDuration(seconds: number) {
  if (!seconds) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}

export function compact(n: number) {
  return new Intl.NumberFormat("en", { notation: n >= 10_000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(n);
}

/** Change vs the previous period. `invert` flips the colours for metrics where lower is better (bounce rate). */
export function Delta({ now, before, invert, percentPoints }: { now: number; before: number; invert?: boolean; percentPoints?: boolean }) {
  if (!before && !now) return <span className="text-xs text-muted">No change</span>;
  if (!before) return <span className="text-xs text-muted">New this period</span>;
  const diff = percentPoints ? (now - before) * 100 : ((now - before) / before) * 100;
  const rounded = Math.round(diff);
  if (rounded === 0) return <span className="text-xs text-muted">No change</span>;
  const up = rounded > 0;
  const good = invert ? !up : up;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", good ? "text-ok" : "text-danger")}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {Math.abs(rounded)}
      {percentPoints ? " pts" : "%"}
      <span className="sr-only">{up ? "increase" : "decrease"}</span>
    </span>
  );
}

export function StatTile({ label, value, children }: { label: string; value: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-indigo/40 p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</p>
      <div className="mt-1 h-4">{children}</div>
    </div>
  );
}

/** Ranked list where each row's tint shows its share of the top row. */
export function BreakdownList({ rows, empty, render }: { rows: Row[]; empty: string; render?: (row: Row) => ReactNode }) {
  if (!rows.length) return <p className="py-6 text-center text-sm text-muted">{empty}</p>;
  const max = rows[0].visitors || 1;
  return (
    <div>
      <div className="mb-2 flex justify-between font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
        <span />
        <span className="flex gap-6">
          <span className="w-14 text-right">Visitors</span>
          <span className="w-14 text-right">Views</span>
        </span>
      </div>
      <ul className="space-y-1">
        {rows.map((row) => (
          <li key={row.label} className="relative flex items-center justify-between gap-3 overflow-hidden rounded-lg px-3 py-2 text-sm">
            <span className="absolute inset-y-0 left-0 rounded-lg bg-cyan-soft" style={{ width: `${(row.visitors / max) * 100}%` }} aria-hidden />
            <span className="relative min-w-0 truncate">{render ? render(row) : row.label}</span>
            <span className="relative flex shrink-0 gap-6 tabular-nums">
              <span className="w-14 text-right font-medium">{compact(row.visitors)}</span>
              <span className="w-14 text-right text-muted">{compact(row.views)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function countryLabel(code: string) {
  const flag = code.replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  let name = code;
  try {
    name = regionNames.of(code) ?? code;
  } catch {}
  return `${flag} ${name}`;
}
