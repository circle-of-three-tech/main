"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { useOnChange } from "@/lib/hooks";
import { ArrowUpRight } from "lucide-react";
import { LogoLink } from "@/components/brand/logo-link";
import { Magnetic } from "@/components/motion/magnetic";
import { GlyphScramble } from "@/components/motion/glyph-scramble";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 240 && y > prev && !open);
  });

  useOnChange(pathname, () => setOpen(false));
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-x pt-4">
          <nav
            aria-label="Primary"
            className={cn(
              "flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 md:px-5",
              scrolled ? "glass shadow-[0_10px_40px_-10px_var(--shadow)]" : "border border-transparent",
            )}
          >
            <LogoLink />
            <ul className="hidden items-center gap-1 lg:flex">
              {site.nav.map((item) => (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={cn("relative block px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.2em] transition-colors", isActive(item.href) ? "text-fg" : "text-muted hover:text-fg")}
                  >
                    {isActive(item.href) && (
                      <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full border border-cyan/30 bg-cyan/10" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                    )}
                    <GlyphScramble text={item.label} trigger="hover" speed={22} />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Magnetic className="hidden sm:inline-block">
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-ink"
                  data-cursor="Talk"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan to-violet transition-transform duration-500 ease-expo group-hover:translate-x-0" />
                  <span className="relative">Start a project</span>
                  <ArrowUpRight className="relative h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
                </Link>
              </Magnetic>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
              >
                <span className="relative block h-3 w-5">
                  <span className={cn("absolute left-0 top-0 h-px w-5 bg-fg transition-transform duration-500", open && "translate-y-[6px] rotate-45")} />
                  <span className={cn("absolute bottom-0 left-0 h-px w-5 bg-fg transition-transform duration-500", open && "-translate-y-[5px] -rotate-45")} />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink/95 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) 3rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) 3rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) 3rem)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="grid-bg absolute inset-0 opacity-40" aria-hidden />
            <ul className="container-x relative mt-32 space-y-2">
              {[{ label: "Home", href: "/" }, ...site.nav, { label: "Contact", href: "/contact" }].map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ delay: 0.15 + i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                    <Link href={item.href} className="flex items-baseline gap-4 py-1 font-display text-5xl font-bold tracking-tight text-fg">
                      <span className="font-mono text-xs text-cyan">0{i + 1}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
