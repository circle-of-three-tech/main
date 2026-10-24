import Link from "next/link";
import { Co3Mark } from "./co3-mark";

export function LogoLink() {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Circle of Three Technologies home" data-cursor="Home">
      <span className="relative block h-10 w-10 text-fg transition-transform duration-700 ease-expo group-hover:rotate-[120deg]">
        <Co3Mark label={false} className="h-full w-full" />
      </span>
      <span className="hidden leading-none sm:block">
        <span className="block font-display text-[0.8rem] font-semibold tracking-[0.28em] text-fg">CIRCLE OF THREE</span>
        <span className="mt-1 block font-display text-[0.62rem] tracking-[0.5em] text-muted">TECHNOLOGIES</span>
      </span>
    </Link>
  );
}
