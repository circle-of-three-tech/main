# Co3 Design Direction (takes precedence over everything below)

**Positioning:** a calm, editorial, globally credible look, closer to an established consultancy or product company than a sci-fi studio. Content and real client work lead; decoration is minimal.

## Palette
Token names are legacy (kept stable for the dashboard); values are what matter. **Light theme only:** the dark theme and theme toggle were removed, so the Dark column below is historical.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--ink` | `#FFFFFF` | `#08111C` | Page background |
| `--indigo` | `#F0F8FF` | `#0D1826` | Sky-tinted alternate section / subtle surface |
| `--surface` | `#FFFFFF` | `#101D2D` | Cards |
| `--fg` | `#09182C` | `#EDF2F8` | Text |
| `--muted` | `#4F6178` | `#93A1B5` | Secondary text; second tone in headlines (`text-highlight`) |
| `--cyan` | `#0A6FD0` | `#5CB6FF` | **Primary: clear summer-afternoon sky blue.** Buttons, links, eyebrows, icons (AA on white). Flips to pale sky `#8FD0FF` on photos (`.on-photo`) |
| `--cyan-strong` | `#0858A8` | `#8CCBFF` | Primary hover |
| `--sky` / `--sky-light` | `#2EA3F7` / `#8FD0FF` | `#3FA9FF` / `#A6DCFF` | Bright sky for decorative fills, gradients and the logo ring only (not for text on white) |
| `--mark-top` / `--mark-mid` / `--mark-deep` | `#9BD6FF` / `#38A6F7` / `#0A6FD0` | `#B4E0FF` / `#4EAEFC` / `#1F7FE0` | Logo cube faces: lit top, mid left, deep right |
| `--cyan-soft` | `#DEF0FF` | sky 13% | Icon chips, tints |
| `--violet` | `#B45309` | `#FFB24D` | **Complementary accent: afternoon-sun amber** as text (pillar keys) |
| `--spark` | `#FF9F1C` | `#FFB24D` | Sunlight amber for small decorative fills only (eyebrow dash, stat dots) |
| `--accent-ink` | `#FFFFFF` | `#08111C` | Text on the primary |
| `--band` | `#08325F` | `#0A2C52` | Deep late-sky blue overlay for photo bands and the CTA |

## Hero and logo
- **Hero:** full-screen service showcase. Each service photo fills the hero as a cross-fading background (slow Ken Burns) inside a parallax layer, under a flat dark overlay (`#040B16` at 65%, no gradients). Copy sits on the left; the main call to action uses the sun-amber accent button (`buttonClass("accent")`, dark text); a frosted service rail along the bottom shows the active service, its link and progress. All slides are server-rendered; reduced motion stops autoplay and transforms.
- **Header:** transparent and `.on-photo` over the home hero, then a frosted `bg-ink/85` bar once scrolled.
- **Logo:** three isometric cubes shaded in sky blues (`--mark-*`) inside a sky-gradient ring; outlines and the wordmark follow `--fg`; "Technologies" is set in the primary blue. `markSvg()` in `lib/mark.ts` renders the same mark for icons and OG images.

## Typography
- **Display:** Inter Tight 600, tracking −0.025 to −0.035em, sentence case.
- **Body/UI:** Inter. `font-mono` now maps to Inter so legacy HUD labels read as normal UI text.
- **Code:** JetBrains Mono via `font-code` / `--font-code` (article `code`/`pre`).
- **Eyebrow:** `hud-label` / `SectionLabel`: 12px, 600, uppercase, 0.08em tracking, accent colour.
- **Headline second tone:** muted colour for the second clause ("Three disciplines. *One accountable team.*"), not a bright highlight.

## Components
- Buttons: `rounded-lg`, `px-5 py-3`, 14px semibold. Primary = accent fill; ghost = 1px border on surface. Use `ButtonLink` / `buttonClass()`.
- Cards: 1px `line` border, `rounded-xl`, flat surface; hover only strengthens the border or adds a soft shadow. No glow, no tilt, no HUD brackets.
- Sections: `section-y` vertical rhythm, `container-x` (1240px). Alternate white and `bg-indigo` bands separated by 1px borders.
- Use `SectionHeading` for eyebrow + title + lead.

## Motion
- Hero copy: pure opacity fade (`hero-fade`), staggered with `animation-delay`. The text is in the HTML from first byte.
- Scroll: fade-ups (`Reveal`, ≤0.6s, ≤16px) on section headings, cards and stats; counters on stats.
- Parallax: `ParallaxImage` (photo drifts inside its frame, travel clamped so edges never show) and `Parallax` (foreground offset). Used in inner page heroes, pillar cards, the Lagos section, full-bleed `ParallaxBand`s and the CTA.
- Hover: buttons lift 1px with a soft azure shadow; cards lift 4px; images zoom slightly; nav links get an azure underline that draws in.
- Header: shadow and a thin azure scroll-progress bar once scrolled.
- Hero service rail (`HeroShowcase`): services cross-fade every 6s as full-screen backgrounds with a slow Ken Burns zoom; the rail shows progress, pauses on hover/focus, has a pause control and arrow-key support, and does not autoplay under reduced motion. All slides are server-rendered so every service and link is crawlable.
- No custom cursor, preloader, film grain, scroll-jacking, text scrambles or WebGL. Everything respects `prefers-reduced-motion`.

## Imagery
Real product screenshots first. Photography sits in rounded frames or full-bleed parallax bands; text on photos always sits on the flat `band` overlay. No gradient fills (soft blurred azure/orange shapes behind heroes are fine).

---

# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** co3
**Generated:** 2026-10-24 13:46:33
**Category:** Luxury/Premium Brand

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#1E293B` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#334155` | `--color-secondary` |
| Accent/CTA | `#DC2626` | `--color-accent` |
| Background | `#F8FAFC` | `--color-background` |
| Foreground | `#0F172A` | `--color-foreground` |
| Muted | `#E9EDF1` | `--color-muted` |
| Border | `#E2E8F0` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| Ring | `#1E293B` | `--color-ring` |

**Color Notes:** Premium dark + action red

### Typography

- **Heading Font:** Exo
- **Body Font:** Roboto Mono
- **Mood:** science, technology, research, data, futuristic, precise
- **Google Fonts:** [Exo + Roboto Mono](https://fonts.googleapis.com/css2?family=Exo:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400;500;700&display=swap)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Exo:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400;500;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #DC2626;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #1E293B;
  border: 2px solid #1E293B;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #1E293B;
  outline: none;
  box-shadow: 0 0 0 3px #1E293B20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Liquid Glass

**Keywords:** Flowing glass, morphing, smooth transitions, fluid effects, translucent, animated blur, iridescent, chromatic aberration

**Best For:** Premium SaaS, high-end e-commerce, creative platforms, branding experiences, luxury portfolios

**Key Effects:** Morphing elements (SVG/CSS), fluid animations (400-600ms curves), dynamic blur (backdrop-filter), color transitions

### Page Pattern

**Pattern Name:** Storytelling + Feature-Rich

- **CTA Placement:** Above fold
- **Section Order:** Hero > Features > CTA

---

## Anti-Patterns (Do NOT Use)

- ❌ Cheap visuals
- ❌ Fast animations

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
