import type { Metadata } from "next";
import Image from "next/image";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { GlowCard } from "@/components/motion/glow-card";
import { ParallaxImage } from "@/components/motion/parallax";
import { Stats } from "@/components/home/stats";
import { ParallaxBand } from "@/components/home/parallax-band";
import { CtaSection } from "@/components/site/cta-section";
import { PageHero, SectionHeading, SectionLabel } from "@/components/site/ui";
import { LinkedinIcon, XIcon } from "@/components/site/social-icons";
import { JsonLd } from "@/components/seo/json-ld";
import { getSettings, getTeam } from "@/lib/queries";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { photo } from "@/lib/photos";

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
        title="Design, engineering and intelligence. One team."
        highlight={["One", "team."]}
        image={photo("workspace")}
        intro="Circle of Three Technologies is a Nigerian technology company founded on a simple belief: great software happens where design, engineering and intelligence meet."
      />

      <section className="container-x section-y grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line">
            <ParallaxImage src={photo("team").src} alt={photo("team").alt} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </Reveal>
        <div>
          <SectionLabel>Our story</SectionLabel>
          <SplitReveal text="Why the circle of three?" className="mt-3 font-display text-3xl font-semibold tracking-[-0.025em] md:text-[2.6rem]" />
          <div className="prose-co3 mt-6">
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

      <section className="container-x section-y" aria-labelledby="values-heading">
        <SectionHeading id="values-heading" label="Principles" title="What we stand for" lead="The working principles behind every engagement, from the first call to long-term support." />
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {VALUES.map((v, i) => (
            <li key={v.title}>
              <Reveal delay={i * 0.08} className="h-full">
                <GlowCard className="h-full p-7">
                  <h3 className="font-display text-xl font-semibold tracking-[-0.015em]">{v.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{v.body}</p>
                </GlowCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <ParallaxBand
        image={photo("office")}
        eyebrow="How we work"
        title="Small senior teams. Clear ownership. No handovers lost in translation."
        body="Every engagement is led by the people who design and build it, from the first workshop to long-term support."
        cta={{ href: "/careers", label: "Work with us" }}
      />

      {team.length > 0 && (
        <section className="container-x section-y border-t border-line" aria-labelledby="team-heading">
          <SectionHeading id="team-heading" label="Leadership" title="The people behind Co3" />
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <li key={m.id}>
                <Reveal delay={(i % 4) * 0.08}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line bg-indigo">
                    {m.photo ? (
                      <Image src={m.photo} alt={m.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-5xl font-semibold text-muted/50">{m.name.split(" ").map((n) => n[0]).join("")}</div>
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{m.name}</h3>
                  <p className="text-sm text-muted">{m.role}</p>
                  {(m.linkedin || m.twitter) && (
                    <div className="mt-3 flex gap-2">
                      {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`} className="text-muted hover:text-fg">
                          <LinkedinIcon className="h-4 w-4" />
                        </a>
                      )}
                      {m.twitter && (
                        <a href={m.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on X`} className="text-muted hover:text-fg">
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
      <CtaSection title="Let's build something together." body="Whether you're looking for a delivery partner or want to join the team, we'd love to hear from you." />
    </PageTransition>
  );
}
