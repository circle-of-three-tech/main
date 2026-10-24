import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const words = (html: string) => html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;

const services = [
  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    tagline: "Software shaped around how your business actually works.",
    icon: "Code2",
    summary:
      "End-to-end custom software development for Nigerian and global businesses: discovery, architecture, engineering and long-term support for platforms that run your operations.",
    content:
      "<p>Off-the-shelf tools force your team to work around them. We build software that works around your team. As a Nigerian software development company, Circle of Three Technologies designs and engineers custom platforms, internal tools, portals and APIs that encode the way your business creates value.</p><h2>How we build</h2><p>Every engagement starts with a discovery sprint where we map workflows, data and the outcomes that matter. We then ship in short, demo-driven iterations so you see working software every one to two weeks, not a big reveal at the end.</p><h2>Built for African realities</h2><p>We design for intermittent connectivity, mobile-first users, local payment rails like Paystack and Flutterwave, and regulatory requirements such as the NDPA, while meeting the engineering standards of any global software company.</p>",
    deliverables: ["Discovery & product strategy", "System architecture", "Full-stack engineering", "API & integrations", "QA automation", "Maintenance & SLAs"],
    faqs: [
      { q: "How much does custom software development cost in Nigeria?", a: "Most projects start from a fixed-scope discovery sprint, after which we provide a transparent milestone-based estimate. Pricing depends on scope, integrations and timelines, and we offer phased delivery so you can launch an MVP first." },
      { q: "How long does it take to build custom software?", a: "A focused MVP typically ships in 6 to 12 weeks. Larger platforms are delivered incrementally, with usable releases every few weeks." },
      { q: "Do you work with clients outside Nigeria?", a: "Yes. We are based in Nigeria and serve clients across Africa, the UK, Europe and North America with overlapping working hours." },
    ],
  },
  {
    slug: "web-development",
    title: "Web Development",
    tagline: "Fast, search-optimised websites and web apps that convert.",
    icon: "Globe",
    summary:
      "High-performance websites, web applications and e-commerce built with Next.js and modern cloud infrastructure, optimised for speed, SEO and conversion.",
    content:
      "<p>Your website is your hardest-working salesperson. We build web experiences that load in under two seconds, rank on Google and turn visitors into customers.</p><h2>What we deliver</h2><p>Marketing sites, content platforms with custom CMS dashboards, SaaS products, client portals and e-commerce. Every build ships with technical SEO, structured data, analytics and accessibility baked in.</p><h2>Technology</h2><p>We specialise in React, Next.js, TypeScript, Node.js and PostgreSQL, deployed on edge infrastructure for global performance.</p>",
    deliverables: ["Corporate & marketing websites", "Web applications & SaaS", "Headless CMS & dashboards", "E-commerce", "Technical SEO", "Performance optimisation"],
    faqs: [
      { q: "Will my website be SEO-friendly?", a: "Yes. Every site includes server rendering, structured data, sitemaps, Core Web Vitals optimisation and metadata controls you can edit yourself." },
      { q: "Can I update the content myself?", a: "Yes. We build a custom dashboard so your team can publish posts, projects and pages without touching code." },
    ],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    tagline: "Native-quality iOS and Android apps from one codebase.",
    icon: "Smartphone",
    summary:
      "Cross-platform mobile app development for iOS and Android with React Native and Flutter, from MVP to app-store launch and beyond.",
    content:
      "<p>Africa is mobile-first, so your product should be too. We design and build mobile apps that feel native, work offline and scale with your users.</p><h2>From idea to app store</h2><p>We handle UX research, interface design, engineering, backend APIs, store submission and post-launch analytics, so you have one accountable team.</p>",
    deliverables: ["iOS & Android apps", "Offline-first architecture", "Push notifications", "Payments integration", "App store launch", "Analytics & crash reporting"],
    faqs: [
      { q: "Native or cross-platform?", a: "For most products we recommend React Native or Flutter: one codebase, native performance and lower cost. We go fully native when hardware access or performance demands it." },
    ],
  },
  {
    slug: "ai-automation",
    title: "AI & Automation",
    tagline: "Put intelligent automation to work on your hardest problems.",
    icon: "BrainCircuit",
    summary:
      "Applied AI solutions including LLM-powered assistants, document intelligence, AI assessments and workflow automation that cut costs and unlock new products.",
    content:
      "<p>AI is only valuable when it ships into real workflows. We build practical AI systems, from assistants grounded in your data to automated assessment engines, with evaluation, guardrails and cost controls from day one.</p><h2>Proven in production</h2><p>Our work includes AI-powered exam and assessment generation for education platforms, turning any study material into practice tests in minutes.</p>",
    deliverables: ["LLM assistants & copilots", "Retrieval-augmented generation (RAG)", "Document & data extraction", "AI assessment engines", "Workflow automation", "Model evaluation & guardrails"],
    faqs: [
      { q: "Is our data safe when using AI?", a: "Yes. We design data flows that keep sensitive information within approved boundaries, use providers with zero-retention options and comply with Nigeria's data protection requirements." },
    ],
  },
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    tagline: "Infrastructure that scales quietly in the background.",
    icon: "Cloud",
    summary:
      "Cloud architecture, CI/CD, observability and cost optimisation on AWS, GCP, Azure and Vercel so your software stays fast, secure and online.",
    content:
      "<p>We design cloud infrastructure that is secure by default, observable and cost-efficient, then automate it so every release is boring in the best way.</p>",
    deliverables: ["Cloud architecture", "CI/CD pipelines", "Infrastructure as code", "Monitoring & alerting", "Security hardening", "Cost optimisation"],
    faqs: [],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX & Product Design",
    tagline: "Interfaces people understand instantly and enjoy using.",
    icon: "PenTool",
    summary:
      "Product discovery, UX research, interface design and design systems that make complex software feel simple.",
    content:
      "<p>Great software starts with understanding people. Our designers run research, map journeys and prototype quickly, then hand over production-ready design systems that engineers love.</p>",
    deliverables: ["User research", "Journey mapping", "Wireframes & prototypes", "Visual & interaction design", "Design systems", "Usability testing"],
    faqs: [],
  },
];

type SeedProject = {
  slug: string;
  title: string;
  client: string;
  url: string;
  summary: string;
  content: string;
  category: string;
  services: string[];
  techStack: string[];
  year: number;
  featured?: boolean;
  published?: boolean;
  accent: string;
  coverImage?: string;
  metrics?: { label: string; value: string }[];
};

const projects: SeedProject[] = [
  {
    slug: "oakvale-learning",
    title: "Oakvale Learning",
    client: "Oakvale",
    url: "https://learn.oakvaleltd.com",
    summary: "A certification platform for globally aligned Adult Care and Child Care tracks, with placements and career pathways.",
    content:
      "<p>Oakvale Learning helps aspiring caregivers become verified healthcare professionals. We built the learning platform that delivers certification tracks, tracks learner progress and connects graduates to hands-on placements.</p><h2>The challenge</h2><p>Combine structured coursework, assessments and verification into one trustworthy, mobile-friendly experience for learners across Nigeria.</p><h2>What we built</h2><p>Enrolment and payments, course delivery, assessment flows, certificate issuance and an admin console for the Oakvale team.</p>",
    category: "EdTech",
    services: ["Web Development", "Custom Software Development", "UI/UX & Product Design"],
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    year: 2026,
    featured: true,
    accent: "#3DF2FF",
    coverImage: "/work/oakvale-learning.png",
  },
  {
    slug: "oakvale-jobs",
    title: "Oakvale Jobs",
    client: "Oakvale",
    url: "https://jobs.oakvaleltd.com",
    summary: "A gated, credential-verified workforce marketplace connecting certified caregivers with trusted employers in Nigeria.",
    content:
      "<p>Oakvale Jobs closes the loop from training to employment. Only credential-verified caregivers can apply, giving employers confidence and professionals a fair marketplace.</p><h2>What we built</h2><p>Verified profiles, job posting and matching, employer onboarding and application tracking, integrated with Oakvale Learning certifications.</p>",
    category: "Marketplace",
    services: ["Custom Software Development", "Web Development"],
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    year: 2026,
    featured: true,
    accent: "#7B5CFF",
    coverImage: "/work/oakvale-jobs.png",
  },
  {
    slug: "livingrite-care",
    title: "LivingRite Care",
    client: "LivingRite Care",
    url: "https://livingritecare.com",
    summary: "The digital home of a Nigerian home-healthcare provider offering post-stroke recovery, ICU care, physiotherapy and palliative support.",
    content:
      "<p>LivingRite Care brings hospital-trained nurses into patients' homes. We built a calm, trustworthy web presence with consultation booking, service discovery, caregiver training registration and lead capture.</p>",
    category: "HealthTech",
    services: ["Web Development", "UI/UX & Product Design"],
    techStack: ["Next.js", "Tailwind CSS", "Vercel"],
    year: 2026,
    featured: true,
    accent: "#19D3A2",
    coverImage: "/work/livingrite-care.png",
  },
  {
    slug: "learnogauge",
    title: "LearnoGauge",
    client: "LearnoGauge",
    url: "https://learnogauge.com",
    summary: "An AI-powered assessment hub that turns any study material into exams and practice tests in minutes.",
    content:
      "<p>LearnoGauge uses AI to generate assessments from learners' own study material. We engineered the generation pipeline, credit system, organisation accounts and the learner experience.</p>",
    category: "AI / EdTech",
    services: ["AI & Automation", "Custom Software Development"],
    techStack: ["AI / LLMs", "Python", "React", "PostgreSQL"],
    year: 2025,
    featured: true,
    accent: "#2F7BFF",
    coverImage: "/work/learnogauge.png",
  },
  {
    slug: "iyknel",
    title: "Iyknel",
    client: "Iyknel",
    url: "https://iyknel.biz",
    summary: "A wholesale FMCG ordering platform: businesses order, invoice, pay and track dispatch in one place.",
    content:
      "<p>Iyknel digitises wholesale distribution of fast-moving consumer goods. We built ordering, invoicing, payment and dispatch workflows for retailers and the operations team.</p>",
    category: "Commerce",
    services: ["Custom Software Development", "Web Development"],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Payments"],
    year: 2026,
    featured: true,
    accent: "#FFB547",
    coverImage: "/work/iyknel.png",
  },
  {
    slug: "carter-consulting",
    title: "Carter Consulting",
    client: "Carter Consulting",
    url: "https://www.carterltd.com",
    summary: "A refreshed digital presence for a management and technology consultancy translating policy and strategy into outcomes since 2009.",
    content:
      "<p>Carter Consulting works with governments, development partners and businesses. We designed and built a site that communicates authority and depth: from intent to impact.</p>",
    category: "Corporate",
    services: ["Web Development", "UI/UX & Product Design"],
    techStack: ["Next.js", "Tailwind CSS", "Vercel"],
    year: 2026,
    accent: "#3DF2FF",
    coverImage: "/work/carter.png",
  },
  {
    slug: "accendora-consulting",
    title: "Accendora",
    client: "Accendora Consulting",
    url: "https://accendoraconsulting.com",
    summary: "Website for an organisational development firm connecting talent, capability and opportunity.",
    content:
      "<p>Accendora builds stronger organisations through people, programmes and partnerships. We crafted a clear, editorial web experience around their message: People. Capability. Opportunity.</p>",
    category: "Corporate",
    services: ["Web Development", "UI/UX & Product Design"],
    techStack: ["Next.js", "Tailwind CSS"],
    year: 2026,
    accent: "#7B5CFF",
    coverImage: "/work/accendora.png",
  },
  {
    slug: "breaking-hundred",
    title: "Breaking Hundred Circle",
    client: "Breaking Hundred",
    url: "https://breakinghundred.org",
    summary: "Leadership community, fellowship and annual gatherings for women from minority ethnic backgrounds.",
    content:
      "<p>Breaking Hundred Circle backs women leaders to rise. We built the community's home on the web, covering programmes, fellowship applications and events.</p>",
    category: "Non-profit",
    services: ["Web Development", "UI/UX & Product Design"],
    techStack: ["Next.js", "Tailwind CSS"],
    year: 2026,
    accent: "#FF5CA8",
    coverImage: "/work/breaking-hundred.png",
  },
  {
    slug: "oakvale",
    title: "Oakvale",
    client: "Oakvale",
    url: "https://www.oakvaleltd.com",
    summary: "Corporate platform for evidence-based workforce, leadership and organisational development for Africa's health systems.",
    content:
      "<p>The Oakvale corporate site anchors an ecosystem of products including Learning, Jobs and an operations app, all designed and engineered by Co3.</p>",
    category: "Corporate",
    services: ["Web Development"],
    techStack: ["Next.js", "Tailwind CSS"],
    year: 2026,
    accent: "#19D3A2",
    coverImage: "/work/oakvale.png",
  },
  {
    slug: "oakvale-app",
    title: "Oakvale Operations App",
    client: "Oakvale",
    url: "https://app.oakvaleltd.com",
    summary: "The internal operations application powering Oakvale's learner, employer and placement workflows.",
    content: "<p>A secure web application for Oakvale's team to manage learners, placements, employers and verification.</p>",
    category: "Internal Platform",
    services: ["Custom Software Development"],
    techStack: ["Next.js", "TypeScript", "PostgreSQL"],
    year: 2026,
    accent: "#2F7BFF",
  },
  // Unverified at build time: kept as drafts until confirmed in the dashboard.
  { slug: "neurogauge", title: "NeuroGauge", client: "NeuroGauge", url: "https://neurogauge.com", summary: "Draft: confirm details in the dashboard.", content: "<p>Draft.</p>", category: "AI", services: [], techStack: [], year: 2025, published: false, accent: "#7B5CFF" },
  { slug: "atghj", title: "ATGHJ", client: "ATGHJ", url: "https://atghj.com", summary: "Draft: confirm details in the dashboard.", content: "<p>Draft.</p>", category: "Web Platform", services: [], techStack: [], year: 2025, published: false, accent: "#3DF2FF" },
  { slug: "citadel", title: "Citadel", client: "Citadel", url: "https://citadel.com", summary: "Draft: confirm details in the dashboard.", content: "<p>Draft.</p>", category: "Web Platform", services: [], techStack: [], year: 2025, published: false, accent: "#FFB547" },
];

const posts = [
  {
    slug: "why-nigerian-businesses-need-custom-software",
    title: "Why Nigerian Businesses Are Choosing Custom Software in 2026",
    excerpt:
      "Spreadsheets and generic SaaS can only take a growing Nigerian business so far. Here is when custom software pays for itself, and how to start without overspending.",
    category: "Strategy",
    tags: ["custom software", "Nigeria", "digital transformation", "software development"],
    featured: true,
    content: `<p>Across Lagos, Abuja, Port Harcourt and beyond, a quiet shift is happening. Companies that once ran on spreadsheets, WhatsApp groups and a patchwork of foreign SaaS tools are commissioning <strong>custom software</strong> built around how they actually work.</p>
<h2>The hidden cost of "good enough" tools</h2>
<p>Generic tools are priced in dollars, designed for other markets and rarely integrate with local payment rails, logistics partners or regulatory reporting. The result is manual re-entry, reconciliation errors and teams that spend hours each week working around their software.</p>
<h2>When custom software pays for itself</h2>
<ul><li><strong>Your process is your advantage.</strong> If the way you deliver is what makes you different, software should encode it, not flatten it.</li><li><strong>You are paying for many seats across many tools.</strong> Consolidating can cut recurring costs dramatically.</li><li><strong>You need local integrations.</strong> Paystack, Flutterwave, NIBSS, Termii, local logistics APIs and NDPA-compliant data handling.</li></ul>
<h2>Start small, ship fast</h2>
<p>The best custom software projects begin with a two-week discovery sprint and a focused MVP. At Circle of Three Technologies, we ship working software every one to two weeks so you see value early and steer as you learn.</p>
<h2>Choosing a software development partner in Nigeria</h2>
<p>Look for a team that shows real, live products, communicates in plain language, owns quality with automated testing and plans for maintenance from day one. Ask to speak with past clients.</p>
<p>Thinking about custom software for your business? <a href="/contact">Talk to Co3</a>. We will help you decide whether to build, buy or blend.</p>`,
  },
  {
    slug: "ai-in-african-education-assessments",
    title: "How AI Is Transforming Assessments in African Education",
    excerpt:
      "From exam prep to workforce certification, AI-generated assessments are making quality practice accessible at scale. Lessons from building LearnoGauge and Oakvale Learning.",
    category: "AI",
    tags: ["AI", "EdTech", "assessments", "Africa"],
    featured: false,
    content: `<p>Quality practice questions have always been expensive to produce. For millions of learners across Africa, that has meant limited access to the feedback loops that make learning stick. AI is changing that.</p>
<h2>From study material to assessment in minutes</h2>
<p>Large language models can now read a learner's own notes, slides or textbooks and generate varied, curriculum-aligned questions with explanations. We built exactly this for <a href="/portfolio/learnogauge">LearnoGauge</a>.</p>
<h2>Guardrails matter</h2>
<p>AI-generated assessments must be accurate, fair and appropriately difficult. That means evaluation pipelines, human review for high-stakes content, and clear provenance so educators can trust the output.</p>
<h2>Beyond the classroom: workforce certification</h2>
<p>The same techniques power professional certification. On <a href="/portfolio/oakvale-learning">Oakvale Learning</a>, structured assessments help verify caregivers before they reach employers through Oakvale Jobs.</p>
<h2>What is next</h2>
<p>Adaptive difficulty, local-language support and offline-first delivery will define the next wave of African EdTech. If you are building in this space, <a href="/services/ai-automation">we would love to help</a>.</p>`,
  },
  {
    slug: "technical-seo-checklist-for-nigerian-websites",
    title: "The Technical SEO Checklist Every Nigerian Business Website Needs",
    excerpt:
      "Speed, structured data and local signals: a practical checklist to help your website rank on Google in Nigeria and beyond.",
    category: "Engineering",
    tags: ["SEO", "web development", "Next.js", "Nigeria"],
    featured: false,
    content: `<p>Most Nigerian business websites lose search traffic to fixable technical problems. Here is the checklist we apply to every site we build.</p>
<h2>1. Speed on real Nigerian networks</h2>
<p>Test on mid-range Android devices and 3G/4G throttling. Aim for Largest Contentful Paint under 2.5 seconds. Serve modern image formats (AVIF/WebP), lazy-load below-the-fold media and avoid heavy client-side JavaScript.</p>
<h2>2. Server-rendered, crawlable content</h2>
<p>Search engines should receive fully rendered HTML. Frameworks like Next.js make this the default.</p>
<h2>3. Structured data</h2>
<p>Add Organization, LocalBusiness, BreadcrumbList, Article, FAQPage and JobPosting schema where relevant. It helps search engines understand your business and can unlock rich results.</p>
<h2>4. Local signals</h2>
<p>Use consistent name, address and phone details across your site and Google Business Profile, set <code>en-NG</code> language hints and create location-relevant content.</p>
<h2>5. A content engine</h2>
<p>Rankings compound with helpful, regularly published content. Give your team a dashboard where they can publish without waiting on developers.</p>
<h2>6. Sitemaps, canonicals and clean URLs</h2>
<p>Submit an XML sitemap to Google Search Console and Bing Webmaster Tools, set canonical URLs and keep slugs short and descriptive.</p>
<p>Want a free technical SEO review of your site? <a href="/contact">Get in touch</a>.</p>`,
  },
];

const jobs = [
  {
    slug: "senior-full-stack-engineer",
    title: "Senior Full-Stack Engineer (Next.js / Node.js)",
    department: "Engineering",
    location: "Lagos, Nigeria",
    type: "Full-time",
    remote: true,
    summary: "Lead the design and delivery of production web platforms for clients across Africa and beyond.",
    description:
      "<p>We are looking for a senior engineer who loves shipping. You will own features end-to-end across React/Next.js, Node.js and PostgreSQL, mentor teammates and help shape our engineering standards.</p><h2>You will</h2><ul><li>Architect and build client platforms and internal products</li><li>Review code, raise quality and automate testing</li><li>Work directly with clients to turn goals into software</li></ul><h2>You have</h2><ul><li>5+ years building production web applications</li><li>Deep TypeScript, React and SQL experience</li><li>Clear written communication</li></ul>",
  },
  {
    slug: "product-designer",
    title: "Product Designer (UI/UX)",
    department: "Design",
    location: "Remote, Nigeria",
    type: "Full-time",
    remote: true,
    summary: "Design intuitive, beautiful products, from research through high-fidelity prototypes and design systems.",
    description:
      "<p>Join a small, senior team designing software used across healthcare, education, commerce and consulting.</p><h2>You have</h2><ul><li>A portfolio showing shipped product work</li><li>Strong Figma and prototyping skills</li><li>Experience running user research</li></ul>",
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed");

  const admin = await db.user.upsert({
    where: { email },
    update: {},
    create: { email, name: process.env.ADMIN_NAME ?? "Co3 Admin", role: "ADMIN", passwordHash: await bcrypt.hash(password, 12) },
  });

  await db.siteSettings.upsert({
    where: { id: "site" },
    update: {},
    create: {
      id: "site",
      tagline: "We engineer software that moves Africa forward.",
      description:
        "Circle of Three Technologies is a Nigerian technology company building custom software, web platforms, mobile apps and AI systems.",
      email: "circleofthreetechnologies@gmail.com",
      phone: "+234 800 000 0000",
      address: "Lagos",
      city: "Lagos",
      country: "Nigeria",
      stats: [
        { label: "Live products shipped", value: 10, suffix: "+" },
        { label: "Industries served", value: 6, suffix: "" },
        { label: "Core disciplines", value: 3, suffix: "" },
        { label: "Uptime target", value: 99.9, suffix: "%" },
      ],
    },
  });

  for (const [order, s] of services.entries()) {
    await db.service.upsert({ where: { slug: s.slug }, update: {}, create: { ...s, order } });
  }

  for (const [order, p] of projects.entries()) {
    const { published = true, featured = false, metrics = [], ...rest } = p;
    await db.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...rest, published, featured, metrics, order, gallery: [] },
    });
  }

  for (const [i, p] of posts.entries()) {
    const publishedAt = new Date(Date.UTC(2026, 9, 20 - i * 6, 9));
    await db.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        status: "PUBLISHED",
        publishedAt,
        readingTime: Math.max(1, Math.round(words(p.content) / 220)),
        authorId: admin.id,
      },
    });
  }

  for (const j of jobs) {
    await db.job.upsert({ where: { slug: j.slug }, update: {}, create: j });
  }

  console.log(`Seeded: admin ${email}, ${services.length} services, ${projects.length} projects, ${posts.length} posts, ${jobs.length} jobs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
