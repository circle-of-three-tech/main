import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/ui";

const STEPS = [
  { title: "Discover", body: "A focused sprint to map goals, users, data and constraints. You leave with a clear scope, architecture and estimate." },
  { title: "Design", body: "Prototypes tested with real users, then a design system engineers can build from without guesswork." },
  { title: "Build", body: "Two-week iterations with live demos, automated tests and continuous deployment." },
  { title: "Launch", body: "Performance, security and SEO hardening, analytics and a rehearsed go-live." },
  { title: "Evolve", body: "Monitoring, support and a roadmap. We stay accountable for what we ship." },
];

export function Process() {
  return (
    <section className="section-y" aria-labelledby="process-heading">
      <div className="container-x">
        <SectionHeading
          id="process-heading"
          label="How we work"
          title={
            <>
              A transparent process. <span className="text-highlight">Value from week one.</span>
            </>
          }
          lead="Every engagement follows the same clear rhythm, so you always know what is happening, what is next and what it costs."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.title} className="group bg-surface transition-colors duration-300 hover:bg-indigo">
              <Reveal delay={i * 0.08} className="h-full p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line-strong text-sm font-semibold tabular-nums transition-colors duration-300 group-hover:border-cyan group-hover:bg-cyan group-hover:text-accent-ink">{i + 1}</span>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-[-0.01em]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
