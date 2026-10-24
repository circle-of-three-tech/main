import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  noindex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  keywords,
  noindex,
}: PageMeta): Metadata {
  const url = absoluteUrl(path);
  // Route-level opengraph-image files still take precedence over this default.
  const images = [{ url: absoluteUrl(image ?? "/opengraph-image"), width: 1200, height: 630, alt: title }];
  return {
    title,
    description,
    keywords: keywords ? [...keywords, ...site.keywords.slice(0, 4)] : undefined,
    alternates: { canonical: url, languages: { "en-NG": url, en: url, "x-default": url } },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      images,
      ...(type === "article" && { publishedTime, modifiedTime }),
    },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
    ...(noindex && { robots: { index: false, follow: false } }),
  };
}

/* ---------------- JSON-LD builders ---------------- */

const orgId = `${site.url}/#organization`;

type Settings = {
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  twitter: string | null;
  linkedin: string | null;
  github: string | null;
  instagram: string | null;
};

export function organizationJsonLd(s: Settings) {
  const sameAs = [s.twitter, s.linkedin, s.github, s.instagram].filter(Boolean);
  return [
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "ProfessionalService"],
      "@id": orgId,
      name: site.name,
      alternateName: ["Co3", "Circle of Three Tech", "Circle of Three Technology"],
      url: site.url,
      logo: absoluteUrl("/brand/co3-mark.png"),
      image: absoluteUrl("/opengraph-image"),
      description: site.description,
      email: s.email,
      telephone: s.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: s.address,
        addressLocality: s.city,
        addressCountry: "NG",
      },
      areaServed: [
        { "@type": "Country", name: "Nigeria" },
        { "@type": "Continent", name: "Africa" },
        { "@type": "Place", name: "Worldwide" },
      ],
      knowsAbout: [
        "Software development",
        "Custom software",
        "Web development",
        "Mobile app development",
        "Artificial intelligence",
        "Cloud computing",
        "UI/UX design",
        "Digital transformation",
      ],
      priceRange: "$$",
      sameAs,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { "@id": orgId },
      inLanguage: "en-NG",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${site.url}/blog?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(post: {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  tags: string[];
  category: string;
  author: { name: string } | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.coverImage ?? `/blog/${post.slug}/opengraph-image`),
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.author?.name ?? site.name },
    publisher: { "@id": orgId },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.tags.join(", "),
    articleSection: post.category,
    inLanguage: "en-NG",
  };
}

export function projectJsonLd(p: {
  slug: string;
  title: string;
  summary: string;
  client: string;
  url: string | null;
  year: number;
  coverImage: string | null;
  techStack: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.summary,
    url: absoluteUrl(`/portfolio/${p.slug}`),
    sameAs: p.url ?? undefined,
    dateCreated: String(p.year),
    image: p.coverImage ? absoluteUrl(p.coverImage) : undefined,
    creator: { "@id": orgId },
    sourceOrganization: { "@type": "Organization", name: p.client },
    keywords: p.techStack.join(", "),
  };
}

export function serviceJsonLd(s: { slug: string; title: string; summary: string }, faqs: { q: string; a: string }[]) {
  const out: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.title,
      serviceType: s.title,
      description: s.summary,
      url: absoluteUrl(`/services/${s.slug}`),
      provider: { "@id": orgId },
      areaServed: ["Nigeria", "Africa", "Worldwide"],
    },
  ];
  if (faqs.length) {
    out.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return out;
}

export function jobJsonLd(job: {
  slug: string;
  title: string;
  description: string;
  createdAt: Date;
  type: string;
  location: string;
  remote: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
}) {
  const validThrough = new Date(job.createdAt);
  validThrough.setDate(validThrough.getDate() + 60);
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt.toISOString(),
    validThrough: validThrough.toISOString(),
    employmentType: job.type.toUpperCase().replace(/[^A-Z]/g, "_"),
    hiringOrganization: { "@type": "Organization", name: site.name, sameAs: site.url, logo: absoluteUrl("/brand/co3-mark.png") },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "NG" },
    },
    ...(job.remote && { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "Nigeria" } }),
    ...(job.salaryMin && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: job.currency,
        value: { "@type": "QuantitativeValue", minValue: job.salaryMin, maxValue: job.salaryMax ?? job.salaryMin, unitText: "MONTH" },
      },
    }),
    url: absoluteUrl(`/careers/${job.slug}`),
  };
}
