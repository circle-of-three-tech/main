import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import type { Stat } from "@/lib/queries";

export function Stats({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;
  return (
    <section className="container-x py-16 md:py-24" aria-label="Co3 in numbers">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-12 rounded-[28px] bg-indigo px-6 py-12 md:rounded-[40px] md:px-14 md:py-16 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="flex flex-col-reverse">
            <dt className="mt-3 flex items-center gap-2 text-sm font-medium text-muted">
              <span aria-hidden className="bg-sunset h-1.5 w-1.5 shrink-0 rounded-full" />
              {s.label}
            </dt>
            <dd className="font-display text-5xl font-bold tracking-[-0.05em] md:text-6xl">
              <Counter value={s.value} suffix={s.suffix} />
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
