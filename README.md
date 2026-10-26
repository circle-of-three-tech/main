# Circle of Three Technologies: Website & CMS

Marketing site and content dashboard for **Circle of Three Technologies (Co3)**.

- **Public site:** Home, Services (+ an SEO landing page per service), Portfolio (+ case studies), Blog (+ articles, RSS), About, Careers (+ Google Jobs markup), Contact.
- **Dashboard** (`/dashboard`): manage posts, projects, services, jobs, team, testimonials, the contact inbox, site settings and users (Admin / Editor roles).
- **Stack:** Next.js 16 (App Router, Cache Components, Turbopack), React 19, Tailwind CSS v4, Motion, Prisma 7 + PostgreSQL, Tiptap, Vercel Blob.

## Local development

```bash
pnpm install
cp .env.example .env          # then fill in values (see below)
pnpm db:migrate               # create tables
pnpm db:seed                  # admin user, services, portfolio, starter posts
pnpm dev                      # http://localhost:3000
```

Local Postgres used during development (Docker):

```bash
docker run -d --name co3-postgres -e POSTGRES_USER=co3 -e POSTGRES_PASSWORD=co3dev -e POSTGRES_DB=co3 \
  -p 55440:5432 -v co3-pgdata:/var/lib/postgresql/data postgres:16
```

Sign in at `/dashboard/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`, then change the password under **Account**. Forgotten passwords can be reset from **Forgot password?** on the sign-in page, which emails a single-use link valid for 60 minutes (requires SMTP).

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `AUTH_SECRET` | yes | 32+ char secret for dashboard sessions (`openssl rand -base64 48`) |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical origin, e.g. `https://circleofthreetech.com` (used for canonicals, sitemap, OG) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | seed only | First admin account |
| `BLOB_READ_WRITE_TOKEN` | production | Image uploads via Vercel Blob (locally, uploads go to `public/uploads`) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | optional | SMTP for transactional email via nodemailer (contact notifications, auto-replies and password reset links). Email is skipped when unset |
| `CONTACT_NOTIFY_EMAIL` | optional | Where enquiries are emailed; defaults to the email in dashboard Settings |
| `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` | optional | Search Console / Bing Webmaster verification meta tags |

## Deploying to Vercel

1. Push this folder to a Git repository and import it in Vercel.
2. Add a Postgres database (Neon via the Vercel Marketplace) and a Blob store. Both inject their env vars.
3. Set `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_*` in Project → Settings → Environment Variables.
4. Vercel runs `pnpm vercel-build` (`prisma generate && prisma migrate deploy && next build`).
5. Seed once: `DATABASE_URL=<prod url> pnpm db:seed` from your machine.
6. Add your domain, then submit `https://your-domain/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## How content publishing works

Public pages are prerendered and cached (`'use cache'` + `cacheTag` in `lib/queries.ts`). Every dashboard save calls `updateTag(...)` (`lib/actions/content.ts`), so changes appear on the live site, sitemap and RSS immediately, with no redeploy.

## SEO features

- Per-page metadata, canonical URLs, `en-NG` language alternates, Open Graph/Twitter cards.
- Generated branded OG images for every page, post, project and service.
- JSON-LD: Organization + ProfessionalService, WebSite + SearchAction, BreadcrumbList, BlogPosting, CreativeWork, Service + FAQPage, JobPosting, ItemList.
- DB-driven `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `/blog/rss.xml`.
- Server-rendered content, CSS-driven above-the-fold animation (fast LCP), AVIF/WebP images.
- Editable SEO title/description with a live Google snippet preview in the dashboard.

## Project map

```
app/(site)/          public pages (layout has header and footer)
app/dashboard/       login + dashboard (request-time, role-checked)
components/motion/   restrained animation primitives (fade-up reveals, counters, page cross-fade)
components/dashboard form kit, rich editor, uploads, SEO panel
lib/                 db, auth, cached queries, server actions, SEO + JSON-LD builders
prisma/              schema, migrations, seed
design-system/co3/   brand tokens and motion rules
```
