import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { ServicesGrid } from "@/components/home/services-grid";
import { Process } from "@/components/home/process";
import { ParallaxBand } from "@/components/home/parallax-band";
import { CtaSection } from "@/components/site/cta-section";
import { PageHero } from "@/components/site/ui";
import { JsonLd } from "@/components/seo/json-ld";
import { getServices } from "@/lib/queries";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { photo } from "@/lib/photos";

export const metadata: Metadata = pageMetadata({
  title: "Software Development Services in Nigeria",
  description:
    "Custom software development, web development, mobile apps, AI automation, cloud & DevOps and UI/UX design from Circle of Three Technologies, a Nigerian software company serving clients worldwide.",
  path: "/services",
  keywords: ["software development services", "software development company Nigeria", "IT services Nigeria"],
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <PageTransition>
      <JsonLd data={breadcrumbJsonLd([{ name: "Services", path: "/services" }])} />
      <PageHero
        label="Services"
        title="Software development services, end to end."
        image={photo("office")}
        intro="From strategy and design to engineering, AI and cloud operations, we're a single team accountable for the whole journey of your product."
      />
      <ServicesGrid services={services} heading={false} />
      <div className="mt-16 md:mt-24">
        <ParallaxBand
          image={photo("design")}
          eyebrow="Design-led engineering"
          title="Every build starts with the people who will use it."
          body="We prototype and test with real users before writing production code, so what we ship is easy to adopt from day one."
        />
      </div>
      <Process />
      <CtaSection title="Not sure what you need yet? Let's figure it out." body="Book a free 30-minute discovery call. We'll help you scope the right solution, even if that means not building anything." />
    </PageTransition>
  );
}
