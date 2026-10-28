import type { StaticImageData } from "next/image";

import ai from "@/public/images/ai.jpg";
import circuit from "@/public/images/circuit.jpg";
import codeCloseup from "@/public/images/code-closeup.jpg";
import codeDesk from "@/public/images/code-desk.jpg";
import code from "@/public/images/code.jpg";
import collab from "@/public/images/collab.jpg";
import cyber from "@/public/images/cyber.jpg";
import datacenter from "@/public/images/datacenter.jpg";
import design from "@/public/images/design.jpg";
import earth from "@/public/images/earth.jpg";
import lagos from "@/public/images/lagos.jpg";
import laptopGlow from "@/public/images/laptop-glow.jpg";
import mobile from "@/public/images/mobile.jpg";
import office from "@/public/images/office.jpg";
import servers from "@/public/images/servers.jpg";
import team from "@/public/images/team.jpg";
import workspace from "@/public/images/workspace.jpg";
import heroAi from "@/public/images/hero/ai-automation.jpg";
import heroCloud from "@/public/images/hero/cloud-devops.jpg";
import heroSoftware from "@/public/images/hero/custom-software-development.jpg";
import heroMobile from "@/public/images/hero/mobile-app-development.jpg";
import heroDesign from "@/public/images/hero/ui-ux-design.jpg";
import heroWeb from "@/public/images/hero/web-development.jpg";

/** Site photography (Unsplash License), self-hosted in public/images. */
export const PHOTOS = { ai, circuit, codeCloseup, codeDesk, code, collab, cyber, datacenter, design, earth, lagos, laptopGlow, mobile, office, servers, team, workspace };

export type Photo = { src: StaticImageData; alt: string };

const ALT: Record<keyof typeof PHOTOS, string> = {
  ai: "Abstract 3D rendering of the letters AI",
  circuit: "Close-up of a printed circuit board",
  codeCloseup: "Source code on a monitor",
  codeDesk: "Developer writing code on a laptop",
  code: "Code editor open on a laptop",
  collab: "Team collaborating around laptops on a wooden table",
  cyber: "Glowing circuit lines on a dark surface",
  datacenter: "Engineers walking through a data centre",
  design: "Designer sketching wireframes on a tablet",
  earth: "City lights across the Earth at night",
  lagos: "Aerial view of Lagos, Nigeria",
  laptopGlow: "Laptop glowing in a dark room",
  mobile: "Smartphone home screen with apps",
  office: "Bright open-plan technology office",
  servers: "Server rack with network cabling",
  team: "Software engineers working together at a laptop",
  workspace: "Team working at laptops in a shared studio",
};

export function photo(key: keyof typeof PHOTOS): Photo {
  return { src: PHOTOS[key], alt: ALT[key] };
}

const SERVICE_PHOTOS: Record<string, keyof typeof PHOTOS> = {
  "custom-software-development": "code",
  "web-development": "codeCloseup",
  "mobile-app-development": "mobile",
  "ai-automation": "ai",
  "cloud-devops": "servers",
  "ui-ux-design": "design",
};

export function servicePhoto(slug: string) {
  return photo(SERVICE_PHOTOS[slug] ?? "circuit");
}

/** Home hero frame photos, one per service: site photography re-cropped to the frame with a warm, muted grade. */
const HERO_ART: Record<string, Photo> = {
  "custom-software-development": { src: heroSoftware, alt: "Developer writing code on a laptop" },
  "web-development": { src: heroWeb, alt: "Laptop glowing in a dark room" },
  "mobile-app-development": { src: heroMobile, alt: "Smartphone home screen with apps" },
  "ai-automation": { src: heroAi, alt: "Glowing circuit lines on a dark surface" },
  "cloud-devops": { src: heroCloud, alt: "Engineers walking through a data centre" },
  "ui-ux-design": { src: heroDesign, alt: "Designer sketching wireframes on a tablet" },
};

export function heroArt(slug: string): Photo {
  return HERO_ART[slug] ?? servicePhoto(slug);
}

const POOL: (keyof typeof PHOTOS)[] = ["laptopGlow", "cyber", "codeDesk", "collab", "earth", "circuit", "workspace", "datacenter", "office"];

/** Stable stock photo for content without its own image, picked from the slug. */
export function fallbackPhoto(slug: string) {
  const h = [...slug].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return photo(POOL[h % POOL.length]);
}
