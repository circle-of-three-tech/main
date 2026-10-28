# Co3 Design Direction (takes precedence over everything below)

**Source:** the "Lumio" template in `stitch_lumio_saas_landing_page/` (see its `DESIGN.md` and `code.html`).
**Positioning:** premium, calm and editorial, like a consumer-electronics product site. Warm ivory, near-monochrome, huge tight headlines, very large radii, frosted glass layers and one sunset accent. Content and real client work lead.

## Palette
Light theme only. Token names are legacy (kept stable for the dashboard); values are what matter.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#FAF9F5` | Page background (warm ivory) |
| `--indigo` | `#F0EFEB` | Soft panels: stats, process steps, testimonials, sidebars |
| `--surface` | `#FFFDF8` | Cards, form |
| `--fg` / `--muted` | `#1B1B1B` / `#6B675F` | Text / secondary text (5.3:1) |
| `--cyan` | `#181818` | **Primary: near-black.** Buttons, chips, number badges |
| `--spark` / `--sunset` | `#FF4B2B` / `#FF416C → #FF4B2B` | **Accent gradient** (`bg-sunset`): indicator rails, dots, small icon chips, progress. Decorative only, never body text |
| `--violet` | `#C7321F` | Sunset as text (AA): eyebrow categories, check icons |
| `--band` | `#151515` | Footer, header pill, photo cards |
| `--mark-*`, `--sky` | teal | Logo only (unchanged brand mark) |

`.on-photo` / `.on-dark` flip the tokens to light-on-dark (header pill, footer, service cards, hero frame, photo bands).

## Typography
- **Display:** Inter Tight 700–800, tracking −0.04 to −0.055em, leading ~1.0. Hero `clamp(2.75rem, 7.6vw, 6.25rem)`; section titles `clamp(2rem, 4.2vw, 3.25rem)`.
- **Body/UI:** Inter. **Code:** JetBrains Mono via `font-code`.
- **Eyebrow:** `hud-label` / `SectionLabel`: 12px, 600, uppercase, 0.12em, muted, with a sunset dot.
- **Second tone:** `text-highlight` (charcoal at 55% on ivory) for the second clause of a headline. Large text only.

## Shape and depth
- Radii: buttons/chips/inputs pill (`rounded-full` / `rounded-2xl`); cards 24–32px; large frames 40px; footer top 64px.
- `glass`: white 55% + 24px backdrop blur + white edge + charcoal-tinted shadow. `glass-dark` for chips/rails on photos.
- Shadows are always low-opacity charcoal, never pure black. Prefer no borders; separate sections with space, not rules.

## Components
- **Header:** floating black pill (max 880px) centred near the top; ivory "Contact us" pill; mobile menu drops down as a dark rounded card.
- **Home hero:** centred eyebrow, two-line headline (second line `text-highlight`), lead, two buttons; below, a 40px-radius media frame cycling service photos with a glass service rail (progress, pause, arrow keys) and a glass slide chip.
- **Marquee:** shipped product names under the hero (`WorkMarquee`), edge-faded, pauses on hover.
- **Pillars:** soft gradient panel with the active photo and a floating glass capability card, beside a vertical list with a sunset rail on the active item.
- **Services:** edge-to-edge photo cards with a dark fade, glass icon chip, title + tagline at the bottom.
- **Process:** sticky heading beside soft step cards; sunset rail draws on hover.
- **Testimonials:** first quote large and centred; any others as soft cards.
- **CTA:** mark in a ring, huge centred headline, two buttons on ivory (faint sunset glow behind).
- **Footer:** black, rounded top, column links, oversized faint "Circle of Three" wordmark.
- **Inner page hero (`PageHero`):** centred title and intro, image in a wide 40px-radius parallax frame below.
- **Buttons (`buttonClass`):** `accent`/`primary` charcoal pill (accent gains a sunset glow on hover), `ghost` translucent bordered pill that fills charcoal on hover, `light` ivory pill for dark surfaces.
- **Filter chips:** pills; active charcoal, inactive white with a hairline shadow.

## Motion
Unchanged principles: CSS hero fades, `Reveal` fade-ups, `ParallaxImage`, Ken Burns in the hero frame, marquee; all disabled under `prefers-reduced-motion`. No beams, tech grids or glows.

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
