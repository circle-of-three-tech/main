import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/motion/page-transition";
import { ButtonLink, PageHero } from "@/components/site/ui";
import { JsonLd } from "@/components/seo/json-ld";
import { getJob, getSettings, getSlugs } from "@/lib/queries";
import { breadcrumbJsonLd, jobJsonLd, pageMetadata } from "@/lib/seo";
import { sanitize } from "@/lib/sanitize";
import { photo } from "@/lib/photos";

export async function generateStaticParams() {
  return getSlugs("jobs");
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return { title: "Role not found", robots: { index: false } };
  return pageMetadata({ title: `${job.title}: ${job.location}`, description: job.summary, path: `/careers/${job.slug}` });
}

export default function JobPage({ params }: PageProps<"/careers/[slug]">) {
  return (
    <PageTransition>
      <Suspense fallback={<div className="min-h-screen" />}>
        <JobContent params={params} />
      </Suspense>
    </PageTransition>
  );
}

async function JobContent({ params }: { params: PageProps<"/careers/[slug]">["params"] }) {
  const { slug } = await params;
  const [job, settings] = await Promise.all([getJob(slug), getSettings()]);
  if (!job) notFound();
  const apply = job.applyUrl || `mailto:${settings.email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`;
  return (
    <>
      <JsonLd data={[jobJsonLd(job), breadcrumbJsonLd([{ name: "Careers", path: "/careers" }, { name: job.title, path: `/careers/${job.slug}` }])]} />
      <PageHero label={`${job.department} · ${job.type}${job.remote ? " · Remote" : ""}`} title={job.title} image={photo("workspace")} intro={job.summary}>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <ButtonLink href={apply}>Apply now</ButtonLink>
          <Link href="/careers" className="inline-flex items-center gap-1.5 px-3 text-sm font-medium text-muted transition-colors hover:text-fg">
            <ArrowLeft className="h-4 w-4" /> All roles
          </Link>
        </div>
      </PageHero>
      <section className="container-x section-y">
        <div className="prose-co3 max-w-3xl" dangerouslySetInnerHTML={{ __html: sanitize(job.description) }} />
        <div className="mt-12">
          <ButtonLink href={apply}>Apply for this role</ButtonLink>
        </div>
      </section>
    </>
  );
}
