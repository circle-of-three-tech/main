"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { SectionLabel } from "@/components/site/ui";
import { SplitReveal } from "@/components/motion/split-reveal";

const STEPS = [
  { title: "Discover", body: "A focused sprint to map goals, users, data and constraints. You leave with a clear scope, architecture and estimate." },
  { title: "Design", body: "Rapid prototypes tested with real users, then a design system engineers can build from without guesswork." },
  { title: "Build", body: "Two-week iterations with live demos, automated tests and continuous deployment. You see progress, not promises." },
  { title: "Launch", body: "Performance, security and SEO hardening, analytics and a calm, rehearsed go-live." },
  { title: "Evolve", body: "Monitoring, support and a roadmap. We stay accountable for the software we ship." },
];

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section className="container-x grid gap-16 py-24 md:py-32 lg:grid-cols-12" aria-labelledby="process-heading">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-32">
          <SectionLabel index="04">How we work</SectionLabel>
          <SplitReveal text="A process built for momentum." highlight={["momentum."]} className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl" />
          <h2 id="process-heading" className="sr-only">Our software development process</h2>
          <p className="mt-6 max-w-md text-lg text-muted">No black boxes. Every engagement follows a transparent rhythm that keeps you in control and ships value early.</p>
        </div>
      </div>
      <ol ref={ref} className="relative space-y-14 pl-12 lg:col-span-7">
        <span className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px bg-line" aria-hidden />
        <motion.span className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-cyan" style={{ scaleY }} aria-hidden />
        {STEPS.map((s, i) => (
          <motion.li
            key={s.title}
            className="relative"
            initial={{ opacity: 0.25 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-45% 0px -45% 0px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="absolute -left-12 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-cyan/60 bg-ink" aria-hidden>
              <span className="h-2 w-2 rotate-45 bg-cyan" />
            </span>
            <p className="font-mono text-xs text-cyan">STEP 0{i + 1}</p>
            <h3 className="mt-2 font-display text-3xl font-semibold">{s.title}</h3>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted">{s.body}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
