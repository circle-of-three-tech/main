export const site = {
  name: "Circle of Three Technologies",
  shortName: "Co3",
  // Canonical origin for canonicals, sitemap, OG and JSON-LD. Production falls back to the live domain if the env var is missing.
  url: (process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? "https://circleofthreetech.com" : "http://localhost:3000")).replace(/\/$/, ""),
  locale: "en_NG",
  description:
    "Circle of Three Technologies (Co3) is a Nigerian technology company and software development studio building custom software, web platforms, mobile apps and AI systems for ambitious businesses in Nigeria, Africa and worldwide.",
  keywords: [
    "technology company",
    "Nigerian tech company",
    "software company in Nigeria",
    "software development company Nigeria",
    "custom software development",
    "software company Lagos",
    "software company Abuja",
    "web development company Nigeria",
    "mobile app development Nigeria",
    "AI automation Nigeria",
    "tech company Africa",
    "Circle of Three Technologies",
    "Co3",
  ],
  nav: [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/portfolio" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ],
} as const;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
