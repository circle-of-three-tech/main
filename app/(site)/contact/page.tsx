import { whatsappUrl } from "@/lib/utils";
import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHero, buttonClass } from "@/components/site/ui";
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
    { Icon: MessageCircle, label: "WhatsApp (messages only)", value: settings.phone, href: whatsappUrl(settings.phone) },
    { Icon: MapPin, label: "Studio", value: `${settings.address}, ${settings.country}` },
    { Icon: Clock, label: "Hours", value: "Mon–Fri · 9:00–18:00 WAT" },
  ];
  return (
    <PageTransition>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
      <PageHero label="Contact" title="Let's talk about your project." image={photo("lagos")} intro="Tell us about your idea, challenge or product. A senior member of our team will reply within one business day.">
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`mailto:${settings.email}`} className={buttonClass("primary")}>
            <Mail className="h-4 w-4" aria-hidden />
            {settings.email}
          </a>
          <a href={whatsappUrl(settings.phone)} target="_blank" rel="noopener" className={buttonClass("ghost")}>
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp {settings.phone}
          </a>
        </div>
      </PageHero>
      <section className="container-x section-y grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm services={services.map((s) => s.title)} />
        </div>
        <aside aria-label="Contact details" className="order-first space-y-3 lg:order-none lg:col-span-4 lg:col-start-9 xl:col-span-5 xl:col-start-8">
          {channels.map(({ Icon, label, value, href }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <div className="flex items-start gap-4 rounded-[24px] bg-indigo p-5 md:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-fg text-ink">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-muted">{label}</p>
                  {href ? (
                    <a href={href} className="mt-0.5 block font-medium transition-colors [overflow-wrap:anywhere] hover:opacity-70">{value}</a>
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
