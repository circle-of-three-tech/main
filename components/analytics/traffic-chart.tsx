"use client";

import { useState } from "react";
import type { Point } from "@/lib/analytics";

// Validated pair (light surface): passes lightness, chroma, CVD and 3:1 contrast checks.
const VIEWS = "#0f9e8f";
const VISITORS = "#d9512f";

const W = 720;
const H = 240;
const PAD = { top: 12, right: 8, bottom: 26, left: 36 };

function niceMax(n: number) {
  if (n <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(n));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s * 4 >= n) ?? pow * 10;
  return step * 4;
}

function labelFor(key: string, bucket: "hour" | "day", long = false) {
  if (bucket === "hour") {
    const hour = Number(key.slice(11, 13));
    const h = `${hour % 12 || 12}${hour < 12 ? "am" : "pm"}`;
    if (!long) return h;
    const [y, m, d] = key.slice(0, 10).split("-").map(Number);
    return `${new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", timeZone: "UTC" }).format(Date.UTC(y, m - 1, d))}, ${h}`;
  }
  const [y, m, d] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", ...(long ? { weekday: "short" } : {}), timeZone: "UTC" }).format(Date.UTC(y, m - 1, d));
}

export function TrafficChart({ points, bucket }: { points: Point[]; bucket: "hour" | "day" }) {
  const [active, setActive] = useState<number | null>(null);
  const max = niceMax(Math.max(1, ...points.map((p) => p.pageviews)));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / Math.max(points.length, 1);
  const barW = Math.max(2, Math.min(28, slot - 2));
  const x = (i: number) => PAD.left + slot * i + slot / 2;
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const labelEvery = Math.ceil(points.length / 8);
  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.visitors).toFixed(1)}`).join(" ");
  const current = active === null ? null : points[active];

  const pick = (clientX: number, rect: DOMRect) => {
    const svgX = ((clientX - rect.left) / rect.width) * W;
    const i = Math.floor((svgX - PAD.left) / slot);
    setActive(i >= 0 && i < points.length ? i : null);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: VIEWS }} /> Page views
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full" style={{ background: VISITORS }} /> Visitors
        </span>
      </div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-pan-y select-none outline-none"
          role="img"
          aria-label="Page views and visitors over time"
          tabIndex={0}
          onPointerMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
          onPointerDown={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
          onPointerLeave={() => setActive(null)}
          onBlur={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") setActive((a) => Math.min(points.length - 1, (a ?? -1) + 1));
            if (e.key === "ArrowLeft") setActive((a) => Math.max(0, (a ?? points.length) - 1));
          }}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--line)" />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted font-mono text-[10px]">
                {t.toLocaleString()}
              </text>
            </g>
          ))}
          {active !== null && <rect x={x(active) - slot / 2} y={PAD.top} width={slot} height={innerH} fill="var(--cyan-soft)" opacity={0.6} />}
          {points.map((p, i) => {
            const top = y(p.pageviews);
            const h = PAD.top + innerH - top;
            const r = Math.min(4, barW / 2, h);
            return h > 0 ? (
              <path
                key={p.key}
                d={`M${x(i) - barW / 2},${PAD.top + innerH} V${top + r} q0,-${r} ${r},-${r} H${x(i) + barW / 2 - r} q${r},0 ${r},${r} V${PAD.top + innerH} Z`}
                fill={VIEWS}
                opacity={active === null || active === i ? 1 : 0.55}
              />
            ) : null;
          })}
          <path d={line} fill="none" stroke={VISITORS} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {current && <circle cx={x(active!)} cy={y(current.visitors)} r={4.5} fill={VISITORS} stroke="var(--surface)" strokeWidth={2} />}
          {points.map((p, i) =>
            i % labelEvery === 0 ? (
              <text key={p.key} x={x(i)} y={H - 6} textAnchor="middle" className="fill-muted font-mono text-[10px]">
                {labelFor(p.key, bucket)}
              </text>
            ) : null,
          )}
        </svg>
        {current && (
          <div
            className="pointer-events-none absolute top-0 z-10 min-w-36 -translate-x-1/2 rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-lg"
            style={{ left: `${Math.min(85, Math.max(15, (x(active!) / W) * 100))}%` }}
          >
            <p className="mb-1 text-muted">{labelFor(current.key, bucket, true)}</p>
            <p className="flex items-center gap-2">
              <span className="h-0.5 w-3 rounded-full" style={{ background: VIEWS }} />
              <strong className="font-semibold text-fg">{current.pageviews.toLocaleString()}</strong>
              <span className="text-muted">page views</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="h-0.5 w-3 rounded-full" style={{ background: VISITORS }} />
              <strong className="font-semibold text-fg">{current.visitors.toLocaleString()}</strong>
              <span className="text-muted">visitors</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
