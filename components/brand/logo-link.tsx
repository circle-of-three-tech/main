import Link from "next/link";
import { Co3Mark } from "./co3-mark";

export function LogoLink() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Circle of Three Technologies home">
      <span className="block h-8 w-8 text-fg">
        <Co3Mark label={false} className="h-full w-full" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-[0.95rem] font-semibold tracking-[-0.01em] text-fg">Circle of Three</span>
        <span className="mt-1 block text-[0.6rem] font-medium uppercase tracking-[0.2em] text-muted">Technologies</span>
      </span>
    </Link>
  );
}
