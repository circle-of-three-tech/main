import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHero } from "@/components/site/ui";
import { JsonLd } from "@/components/seo/json-ld";
import { getServices, getSettings } from "@/lib/queries";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

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
    { Icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    { Icon: MapPin, label: "Studio", value: `${settings.address}, ${settings.country}` },
    { Icon: Clock, label: "Hours", value: "Mon–Fri · 9:00–18:00 WAT" },
  ];
  return (
    <PageTransition>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
      <PageHero label="Contact" title="Let's build something remarkable." highlight={["remarkable."]} intro="Tell us about your idea, challenge or product. A senior member of our team will reply within one business day." />
      <section className="container-x grid gap-12 pb-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm services={services.map((s) => s.title)} />
        </div>
        <aside className="space-y-4 lg:col-span-5">
          {channels.map(({ Icon, label, value, href }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <div className="glass hud relative flex items-start gap-5 rounded-2xl p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line text-cyan">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="hud-label text-muted">{label}</p>
                  {href ? (
                    <a href={href} className="mt-1 block break-all font-display text-lg hover:text-cyan">{value}</a>
                  ) : (
                    <p className="mt-1 font-display text-lg">{value}</p>
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
