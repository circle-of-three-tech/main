import { cn } from "@/lib/utils";

/** Deterministic PRNG so server and client render identical circuits. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Trace = { d: string; end: [number, number]; start: [number, number]; len: number };

function buildTraces(seed: number, count: number, w: number, h: number): Trace[] {
  const rand = mulberry32(seed);
  const step = 24;
  const traces: Trace[] = [];
  for (let i = 0; i < count; i++) {
    let x = Math.round((rand() * w) / step) * step;
    let y = Math.round((rand() * h) / step) * step;
    const start: [number, number] = [x, y];
    let d = `M${x} ${y}`;
    let len = 0;
    let dir = rand() > 0.5 ? 1 : -1;
    const segments = 3 + Math.floor(rand() * 4);
    for (let s = 0; s < segments; s++) {
      const n = (2 + Math.floor(rand() * 7)) * step;
      if (s % 2 === 0) {
        x += n * dir;
        len += n;
      } else {
        const dy = (rand() > 0.5 ? 1 : -1) * n * 0.6;
        x += Math.abs(dy) * dir;
        y += dy;
        len += Math.abs(dy) * 1.414;
      }
      d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
      if (rand() > 0.8) dir *= -1;
    }
    traces.push({ d, start, end: [x, y], len: Math.round(len) });
  }
  return traces;
}

/** Animated circuit-board field echoing the Co3 logo artwork. Pure SVG + CSS, no JS. */
export function CircuitField({ className, seed = 3, count = 46, pulses = true }: { className?: string; seed?: number; count?: number; pulses?: boolean }) {
  const W = 1440;
  const H = 900;
  const traces = buildTraces(seed, count, W, H);
  return (
    <svg aria-hidden viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}>
      <defs>
        <linearGradient id="pulse" x1="0" x2="1">
          <stop offset="0" stopColor="var(--cyan)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--cyan)" />
        </linearGradient>
        <radialGradient id="fade" cx="50%" cy="45%" r="65%">
          <stop offset="0" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="circuit-mask">
          <rect width={W} height={H} fill="url(#fade)" />
        </mask>
      </defs>
      <g mask="url(#circuit-mask)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {traces.map((t, i) => (
          <g key={i}>
            <path d={t.d} stroke="var(--trace)" strokeWidth="1.2" opacity="0.75" />
            <circle cx={t.start[0]} cy={t.start[1]} r="2.6" fill="var(--ink)" stroke="var(--trace)" strokeWidth="1.2" />
            <circle cx={t.end[0]} cy={t.end[1]} r="3" fill="var(--trace)" />
            {pulses && i % 3 === 0 && (
              <path
                d={t.d}
                stroke="var(--cyan)"
                strokeWidth="1.6"
                strokeDasharray={`60 ${t.len + 60}`}
                className="circuit-pulse"
                style={{
                  ["--len" as string]: `${t.len + 120}`,
                  animationDelay: `${(i * 0.37) % 6}s`,
                  animationDuration: `${3 + (i % 5)}s`,
                  filter: "drop-shadow(0 0 4px var(--cyan))",
                }}
              />
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}
