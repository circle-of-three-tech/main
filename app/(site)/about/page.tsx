import type { Metadata } from "next";
import Image from "next/image";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { GlowCard } from "@/components/motion/glow-card";
import { Co3Mark } from "@/components/brand/co3-mark";
import { Stats } from "@/components/home/stats";
import { CtaSection } from "@/components/site/cta-section";
import { PageHero, SectionLabel } from "@/components/site/ui";
import { LinkedinIcon, XIcon } from "@/components/site/social-icons";
import { JsonLd } from "@/components/seo/json-ld";
import { getSettings, getTeam } from "@/lib/queries";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Us: A Nigerian Technology Company",
  description:
    "Circle of Three Technologies is a Nigerian technology company uniting design, engineering and intelligence to build software that moves Africa forward. Meet the team and our values.",
  path: "/about",
  keywords: ["about Circle of Three Technologies", "Nigerian technology company", "tech company Lagos"],
});

const VALUES = [
  { title: "Craft over shortcuts", body: "We sweat the details users never notice but always feel: performance, accessibility and resilience." },
  { title: "Radical ownership", body: "We treat your product like our own and stay accountable long after launch day." },
  { title: "Built for here", body: "We design for African realities such as networks, payments, devices and regulation, without compromising global standards." },
  { title: "Clarity always", body: "Plain language, transparent progress and honest estimates. No black boxes, no surprises." },
];

export default async function AboutPage() {
  const [team, settings] = await Promise.all([getTeam(), getSettings()]);
  return (
    <PageTransition>
      <JsonLd data={breadcrumbJsonLd([{ name: "About", path: "/about" }])} />
      <PageHero
        label="About Co3"
        title="Three forces. One circle. Infinite possibilities."
        highlight={["One", "circle."]}
        intro="Circle of Three Technologies is a Nigerian technology company founded on a simple belief: great software happens where design, engineering and intelligence meet."
      />

      <section className="container-x grid items-center gap-16 py-16 lg:grid-cols-2">
        <Reveal>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(61,242,255,0.18),transparent_65%)] blur-2xl" aria-hidden />
            <Co3Mark className="relative h-full w-full text-fg" />
          </div>
        </Reveal>
        <div>
          <SectionLabel>Our story</SectionLabel>
          <SplitReveal text="Why the circle of three?" className="mt-6 font-display text-4xl font-bold tracking-tight md:text-5xl" />
          <div className="prose-co3 mt-8">
            <p>
              Our mark is three cubes held inside a circle. Each cube is a discipline: <strong>design</strong> that makes software human, <strong>engineering</strong> that makes it
              reliable, and <strong>intelligence</strong> that makes it adaptive. The circle is the team that holds them together.
            </p>
            <p>
              We started in Nigeria building products for organisations in healthcare, education, commerce and consulting. Today we partner with founders, enterprises and
              non-profits across Africa and beyond to build platforms that serve real people at scale.
            </p>
          </div>
        </div>
      </section>

      <Stats stats={settings.stats} />

      <section className="container-x py-24" aria-labelledby="values-heading">
        <SectionLabel>Principles</SectionLabel>
        <h2 id="values-heading" className="mt-6 font-display text-4xl font-bold tracking-tight md:text-6xl">
          What we <span className="text-gradient">stand for.</span>
        </h2>
        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {VALUES.map((v, i) => (
            <li key={v.title}>
              <Reveal delay={i * 0.08} className="h-full">
                <GlowCard className="h-full p-8">
                  <span className="font-mono text-xs text-cyan">0{i + 1}</span>
                  <h3 className="mt-6 font-display text-2xl font-semibold">{v.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{v.body}</p>
                </GlowCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {team.length > 0 && (
        <section className="container-x py-24" aria-labelledby="team-heading">
          <SectionLabel>The team</SectionLabel>
          <h2 id="team-heading" className="mt-6 font-display text-4xl font-bold tracking-tight md:text-6xl">The people in the circle.</h2>
          <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <li key={m.id}>
                <Reveal delay={(i % 4) * 0.08}>
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-indigo">
                    {m.photo ? (
                      <Image src={m.photo} alt={m.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-6xl font-bold text-fg/20">{m.name.split(" ").map((n) => n[0]).join("")}</div>
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">{m.name}</h3>
                  <p className="text-sm text-muted">{m.role}</p>
                  {(m.linkedin || m.twitter) && (
                    <div className="mt-3 flex gap-2">
                      {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`} className="text-muted hover:text-cyan">
                          <LinkedinIcon className="h-4 w-4" />
                        </a>
                      )}
                      {m.twitter && (
                        <a href={m.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on X`} className="text-muted hover:text-cyan">
                          <XIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}
      <CtaSection title="Join the circle." body="Whether you're hiring us or want to work with us, we'd love to hear from you." />
    </PageTransition>
  );
}
