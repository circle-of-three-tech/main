import Link from "next/link";
import { cacheLife } from "next/cache";
import { Mail, MapPin, Phone } from "lucide-react";
import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from "@/components/site/social-icons";
import { getServices, getSettings } from "@/lib/queries";
import { site } from "@/lib/site";
import { Co3Mark } from "@/components/brand/co3-mark";
import { Marquee } from "@/components/motion/marquee";
import { ButtonLink } from "@/components/site/ui";

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
    <footer className="relative mt-32 overflow-hidden border-t border-line">
      <div className="py-10">
        <Marquee duration={50}>
          {["Build", "Scale", "Transform"].map((w) => (
            <span key={w} className="flex items-center gap-10 pr-10 font-display text-[clamp(3rem,9vw,8rem)] font-bold uppercase leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgb(138_147_201/0.4)]">
              {w}
              <span className="h-4 w-4 rotate-45 bg-cyan" aria-hidden />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-x grid gap-14 border-t border-line py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-4">
            <Co3Mark className="h-14 w-14 text-fg" />
            <div>
              <p className="font-display text-lg font-semibold tracking-[0.2em]">CIRCLE OF THREE</p>
              <p className="font-display text-xs tracking-[0.5em] text-muted">TECHNOLOGIES</p>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-muted">{settings.tagline} A Nigerian technology company engineering software for Africa and the world.</p>
          <div className="mt-8">
            <ButtonLink href="/contact" cursor="Talk">Start a project</ButtonLink>
          </div>
        </div>

        <nav aria-label="Services" className="md:col-span-3">
          <p className="hud-label">Services</p>
          <ul className="mt-5 space-y-3">
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
          <p className="hud-label">Company</p>
          <ul className="mt-5 space-y-3">
            {[...site.nav, { label: "Contact", href: "/contact" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition-colors hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="not-italic md:col-span-2">
          <p className="hud-label">Contact</p>
          <ul className="mt-5 space-y-3 text-sm text-muted">
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
              <a href={`mailto:${settings.email}`} className="break-all hover:text-fg">{settings.email}</a>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-fg">{settings.phone}</a>
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
              <span>{settings.address}, {settings.country}</span>
            </li>
          </ul>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition hover:border-cyan hover:text-cyan">
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </address>
      </div>

      <div className="container-x flex flex-col items-start justify-between gap-4 border-t border-line py-8 text-xs text-muted md:flex-row md:items-center">
        <p>© {currentYear} {site.name}. All rights reserved.</p>
        <p className="font-mono uppercase tracking-[0.2em]">Engineered in Nigeria · Shipped worldwide</p>
      </div>
    </footer>
  );
}
