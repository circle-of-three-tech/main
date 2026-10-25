import { Counter } from "@/components/motion/counter";
import type { Stat } from "@/lib/queries";

export function Stats({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;
  return (
    <section className="container-x py-16 md:py-20" aria-label="Co3 in numbers">
      <dl className="grid grid-cols-2 gap-y-10 border-y border-line py-10 lg:grid-cols-4 lg:divide-x lg:divide-line">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse px-1 lg:px-8 lg:first:pl-0">
            <dt className="mt-2 text-sm text-muted">{s.label}</dt>
            <dd className="font-display text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
