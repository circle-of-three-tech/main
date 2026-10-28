import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/ui";

const STEPS = [
  { title: "Discover", body: "A focused sprint to map goals, users, data and constraints. You leave with a clear scope, architecture and estimate." },
  { title: "Design", body: "Prototypes tested with real users, then a design system engineers can build from without guesswork." },
  { title: "Build", body: "Two-week iterations with live demos, automated tests and continuous deployment." },
  { title: "Launch", body: "Performance, security and SEO hardening, analytics and a rehearsed go-live." },
  { title: "Evolve", body: "Monitoring, support and a roadmap. We stay accountable for what we ship." },
];

/** Heading on the left (sticky on desktop); the steps run down a vertical rail whose sunset segment follows the hovered step. */
export function Process() {
  return (
    <section className="section-y" aria-labelledby="process-heading">
      <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
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
        </div>
        <ol className="space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.06} className="group relative flex gap-5 rounded-[24px] bg-indigo p-6 transition-[background-color,box-shadow] duration-300 hover:bg-surface hover:shadow-[0_24px_48px_-24px_rgb(27_27_27/0.25)] md:p-7">
                <span aria-hidden className="bg-sunset absolute inset-y-6 left-0 w-[3px] origin-top scale-y-0 rounded-full transition-transform duration-500 ease-out group-hover:scale-y-100" />
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fg text-sm font-bold tabular-nums text-ink">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-[-0.02em]">{s.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
