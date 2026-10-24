import { Co3Mark } from "@/components/brand/co3-mark";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Reveal } from "@/components/motion/reveal";
import { BorderTrace } from "@/components/motion/border-trace";
import { ButtonLink } from "./ui";
import { CircuitField } from "./circuit-field";

export function CtaSection({ title = "Have an idea? Let's make it inevitable.", body = "Tell us what you're building. We'll reply within one business day with next steps, not a sales script." }: { title?: string; body?: string }) {
  return (
    <section className="container-x py-24" aria-label="Start a project">
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-indigo/40 px-6 py-20 text-center md:px-16 md:py-28">
        <BorderTrace radius={32} />
        <CircuitField seed={11} count={34} className="opacity-70" />
        <div aria-hidden className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 text-fg/[0.06]">
          <Co3Mark label={false} className="h-full w-full animate-spin-slow [animation-duration:90s]" />
        </div>
        <div className="relative">
          <SplitReveal text={title} highlight={["inevitable."]} className="mx-auto max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-7xl" />
          <Reveal delay={0.3}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted">{body}</p>
          </Reveal>
          <Reveal delay={0.45} className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/contact" cursor="Go">Start a project</ButtonLink>
            <ButtonLink href="/portfolio" variant="ghost">Explore our work</ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
