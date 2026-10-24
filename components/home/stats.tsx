import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import type { Stat } from "@/lib/queries";

export function Stats({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;
  return (
    <section className="container-x py-20" aria-label="Co3 in numbers">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="bg-ink p-8 md:p-10">
            <dt className="hud-label text-muted">{s.label}</dt>
            <dd className="mt-4 font-display text-5xl font-bold tracking-tight md:text-6xl">
              <Counter value={s.value} suffix={s.suffix} />
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
