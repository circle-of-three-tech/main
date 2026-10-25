"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useOnChange } from "@/lib/hooks";
import { LogoLink } from "@/components/brand/logo-link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonClass } from "@/components/site/ui";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || open ? "border-line bg-ink/85 shadow-[0_6px_24px_-16px_var(--shadow)] backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <nav aria-label="Primary" className="container-x flex h-[72px] items-center justify-between gap-6">
        <LogoLink />

        <ul className="hidden items-center gap-1 lg:flex">
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "group relative rounded-md px-3.5 py-2 text-[0.9rem] font-medium transition-colors duration-200",
                  isActive(item.href) ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-cyan transition-transform duration-300 ease-out",
                    isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/contact" className={cn(buttonClass("primary"), "hidden px-4 py-2.5 sm:inline-flex")}>
            Contact us
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-line text-fg lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {scrolled && <ScrollProgress />}

      {open && (
        <div id="mobile-menu" className="hero-fade h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-ink [animation-duration:300ms] lg:hidden">
          <ul className="container-x divide-y divide-line py-2">
            {[{ label: "Home", href: "/" }, ...site.nav, { label: "Contact", href: "/contact" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn("block py-4 text-lg font-medium", pathname === item.href ? "text-cyan" : "text-fg")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="container-x pb-10 pt-4">
            <Link href="/contact" className={cn(buttonClass("primary"), "w-full py-3.5")}>
              Start a project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
