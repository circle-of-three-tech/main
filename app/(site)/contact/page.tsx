import { whatsappUrl } from "@/lib/utils";
import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHero } from "@/components/site/ui";
import { JsonLd } from "@/components/seo/json-ld";
import { getServices, getSettings } from "@/lib/queries";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { photo } from "@/lib/photos";

export const metadata: Metadata = pageMetadata({
  title: "Contact: Start Your Software Project",
  description: "Talk to Circle of Three Technologies about custom software, web, mobile or AI projects. We reply within one business day.",
  path: "/contact",
  keywords: ["hire software developers Nigeria", "contact software company Lagos"],
});

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const channels = [
    { Icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { Icon: Phone, label: "WhatsApp only", value: settings.phone, href: whatsappUrl(settings.phone) },
    { Icon: MapPin, label: "Studio", value: `${settings.address}, ${settings.country}` },
    { Icon: Clock, label: "Hours", value: "Mon–Fri · 9:00–18:00 WAT" },
  ];
  return (
    <PageTransition>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
      <PageHero label="Contact" title="Let's talk about your project." image={photo("lagos")} intro="Tell us about your idea, challenge or product. A senior member of our team will reply within one business day." />
      <section className="container-x section-y grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm services={services.map((s) => s.title)} />
        </div>
        <aside className="space-y-3 lg:col-span-4 lg:col-start-9 xl:col-span-5 xl:col-start-8">
          {channels.map(({ Icon, label, value, href }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <div className="flex items-start gap-4 rounded-xl border border-line bg-surface p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo text-cyan">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-muted">{label}</p>
                  {href ? (
                    <a href={href} className="mt-0.5 block font-medium transition-colors [overflow-wrap:anywhere] hover:text-cyan">{value}</a>
                  ) : (
                    <p className="mt-0.5 font-medium">{value}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </aside>
      </section>
    </PageTransition>
  );
}
