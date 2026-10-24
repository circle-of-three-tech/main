import { Link2 } from "lucide-react";
import { LinkedinIcon, XIcon } from "@/components/site/social-icons";

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, label: "Share on LinkedIn", Icon: LinkedinIcon },
    { href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, label: "Share on X", Icon: XIcon },
    { href: `https://wa.me/?text=${t}%20${u}`, label: "Share on WhatsApp", Icon: Link2 },
  ];
  return (
    <div className="flex items-center gap-3">
      <span className="hud-label text-muted">Share</span>
      {links.map(({ href, label, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition hover:border-cyan hover:text-cyan">
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
