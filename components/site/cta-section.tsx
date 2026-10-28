import { Reveal } from "@/components/motion/reveal";
import { Co3Mark } from "@/components/brand/co3-mark";
import { ButtonLink } from "@/components/site/ui";

/** Closing call to action: the mark in a ring above a large centred headline and two pill buttons. */
export function CtaSection({
  title = "Have a project in mind? Let's talk.",
  body = "Tell us what you're building. A senior member of our team will reply within one business day with clear next steps.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="section-y relative overflow-hidden" aria-label="Start a project">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_75_43/0.1),transparent)]" />
      <Reveal className="container-x flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line-strong bg-surface text-fg">
          <Co3Mark label={false} className="h-9 w-9" />
        </span>
        <h2 className="mt-10 max-w-4xl font-display text-[clamp(2.5rem,6.4vw,5rem)] font-bold leading-[1.02] tracking-[-0.05em]">{title}</h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/contact" variant="accent">
            Start a project
          </ButtonLink>
          <ButtonLink href="/portfolio" variant="ghost">
            See our work
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
