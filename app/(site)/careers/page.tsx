import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { CtaSection } from "@/components/site/cta-section";
import { PageHero, SectionLabel } from "@/components/site/ui";
import { JsonLd } from "@/components/seo/json-ld";
import { getJobs, getSettings } from "@/lib/queries";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Careers: Tech Jobs in Nigeria",
  description: "Join Circle of Three Technologies. Open software engineering, design and product roles at a fast-growing Nigerian technology company. Remote-friendly.",
  path: "/careers",
  keywords: ["tech jobs Nigeria", "software engineer jobs Lagos", "remote developer jobs Nigeria"],
});

export default async function CareersPage() {
  const [jobs, settings] = await Promise.all([getJobs(), getSettings()]);
  return (
    <PageTransition>
      <JsonLd data={breadcrumbJsonLd([{ name: "Careers", path: "/careers" }])} />
      <PageHero label="Careers" title="Build what's next for Africa, with us." highlight={["next"]} intro="We're a small, senior team that values craft, ownership and kindness. Remote-friendly, Nigeria-first." />
      <section className="container-x py-12" aria-labelledby="roles-heading">
        <SectionLabel>{jobs.length} open roles</SectionLabel>
        <h2 id="roles-heading" className="sr-only">Open roles</h2>
        {jobs.length === 0 ? (
          <p className="mt-10 text-lg text-muted">
            No open roles right now. Send your portfolio to <a className="text-cyan underline" href={`mailto:${settings.email}`}>{settings.email}</a> and we&apos;ll reach out when something fits.
          </p>
        ) : (
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {jobs.map((job, i) => (
              <li key={job.id}>
                <Reveal delay={i * 0.06} y={16}>
                  <Link href={`/careers/${job.slug}`} className="group grid items-center gap-4 py-8 md:grid-cols-12" data-cursor="Apply">
                    <span className="font-mono text-xs text-cyan md:col-span-2">{job.department}</span>
                    <span className="font-display text-2xl font-semibold transition-colors group-hover:text-cyan md:col-span-6 md:text-3xl">{job.title}</span>
                    <span className="flex items-center gap-2 text-sm text-muted md:col-span-3">
                      <MapPin className="h-4 w-4" /> {job.location} · {job.type}
                      {job.remote && " · Remote"}
                    </span>
                    <span className="hidden justify-end md:col-span-1 md:flex">
                      <ArrowUpRight className="h-6 w-6 transition-transform duration-500 group-hover:rotate-45 group-hover:text-cyan" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </section>
      <CtaSection title="Don't see your role?" body="We're always meeting exceptional engineers, designers and product people. Introduce yourself." />
    </PageTransition>
  );
}
