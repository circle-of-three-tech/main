import { whatsappUrl } from "@/lib/utils";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from "@/components/site/social-icons";
import { getServices, getSettings } from "@/lib/queries";
import { site } from "@/lib/site";
import { LogoLink } from "@/components/brand/logo-link";

async function year() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const [settings, services, currentYear] = await Promise.all([getSettings(), getServices(), year()]);
  const socials = [
    { href: settings.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: settings.twitter, label: "X / Twitter", Icon: XIcon },
    { href: settings.github, label: "GitHub", Icon: GithubIcon },
    { href: settings.instagram, label: "Instagram", Icon: InstagramIcon },
  ].filter((s) => s.href);

  return (
    <footer className="on-dark relative z-10 rounded-t-[40px] bg-band text-fg md:rounded-t-[64px]">
      <div className="container-x grid gap-12 pb-12 pt-20 md:grid-cols-12 md:pt-24">
        <div className="md:col-span-4 lg:col-span-4">
          <LogoLink />
          <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-muted">
            {settings.tagline} A software and technology company based in Nigeria, building for clients at home and around the world.
          </p>
          {socials.length > 0 && (
            <ul className="mt-7 flex gap-2.5">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:bg-white/10 hover:text-fg"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Services" className="md:col-span-3 lg:col-span-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-fg">Services</p>
          <ul className="mt-6 space-y-3.5 text-[0.95rem]">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-muted transition-colors hover:text-fg">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company" className="md:col-span-2">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-fg">Company</p>
          <ul className="mt-6 space-y-3.5 text-[0.95rem]">
            {[...site.nav, { label: "Contact", href: "/contact" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition-colors hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="not-italic md:col-span-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-fg">Get in touch</p>
          <ul className="mt-6 space-y-4 text-[0.95rem] text-muted">
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <a href={`mailto:${settings.email}`} className="break-words font-medium text-fg transition-opacity [overflow-wrap:anywhere] hover:opacity-70">{settings.email}</a>
            </li>
            <li className="flex gap-3">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <a href={whatsappUrl(settings.phone)} target="_blank" rel="noopener" className="transition-opacity hover:opacity-70">
                <span className="font-medium text-fg">{settings.phone}</span>
                <span className="block text-xs">WhatsApp messages only</span>
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{settings.address}, {settings.country}</span>
            </li>
          </ul>
        </address>
      </div>

      {/* Oversized wordmark */}
      <div aria-hidden className="container-x select-none overflow-hidden">
        <p className="whitespace-nowrap text-center font-display text-[clamp(3rem,13.5vw,12.5rem)] font-extrabold leading-[0.9] tracking-[-0.06em] text-white/[0.07]">Circle of Three</p>
      </div>

      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-3 border-t border-line py-7 text-xs text-muted md:flex-row md:items-center">
          <p>© {currentYear} {site.name}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span aria-hidden className="bg-sunset h-1.5 w-1.5 rounded-full" />
            Lagos, Nigeria · Working with teams worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
