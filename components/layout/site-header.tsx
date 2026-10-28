"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useOnChange } from "@/lib/hooks";
import { LogoLink } from "@/components/brand/logo-link";
import { buttonClass } from "@/components/site/ui";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Floating black pill navigation, centred near the top of every page; the mobile menu drops down as a dark card. */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useOnChange(pathname, () => setOpen(false));
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 px-3 md:top-5">
      <nav
        aria-label="Primary"
        className={cn(
          "on-dark pointer-events-auto mx-auto flex h-14 max-w-[880px] items-center justify-between gap-4 rounded-full border border-white/10 bg-[#0b0b0b]/95 py-2 pl-2 pr-2 backdrop-blur-xl transition-shadow duration-300",
          scrolled ? "shadow-[0_18px_40px_-12px_rgb(0_0_0/0.45)]" : "shadow-[0_10px_30px_-14px_rgb(0_0_0/0.35)]",
        )}
      >
        <LogoLink compact />

        <ul className="hidden items-center gap-0.5 lg:flex">
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors duration-200",
                  isActive(item.href) ? "bg-white/10 text-fg" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <Link href="/contact" className={cn(buttonClass("light"), "hidden h-10 px-5 py-0 text-[0.72rem] uppercase tracking-[0.08em] sm:inline-flex")}>
            Contact us
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-fg transition-colors hover:bg-white/15 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="on-dark hero-fade pointer-events-auto mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-[880px] overflow-y-auto rounded-[28px] border border-white/10 bg-[#0b0b0b] p-3 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)] [animation-duration:300ms] lg:hidden"
        >
          <ul className="divide-y divide-line">
            {[{ label: "Home", href: "/" }, ...site.nav, { label: "Contact", href: "/contact" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn("flex items-center justify-between px-4 py-4 text-lg font-semibold tracking-[-0.01em]", pathname === item.href ? "text-fg" : "text-muted")}
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 opacity-50" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className={cn(buttonClass("light"), "mt-3 w-full py-3.5")}>
            Start a project
          </Link>
        </div>
      )}
    </header>
  );
}
