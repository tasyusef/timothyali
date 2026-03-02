# timothyali.com — Project Rules

## What This Project Is
Personal portfolio website for Timothy Ali — a designer working across product, brand, and motion. The site showcases case studies, a blog, and contact info. The design language is Swiss-modernist: dark mode primary, clean grids, no decorative UI, sharp typographic hierarchy. Every page follows a 12-column grid with consistent spacing tokens.

## Workflow
- **Always start in Plan mode.** Outline what you'll do and why before writing any code. Wait for approval before executing.
- **Verify your work.** After making changes, run `pnpm lint` and `npx tsc --noEmit`. For UI changes, open the browser preview and confirm the UI looks correct.
- **Keep PRs small and focused.** One feature or fix per PR. If scope creeps, suggest splitting into separate PRs.
- **Commit with clear messages.** Use conventional commits: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`.
- **Keep this file current.** When adding new pages, components, or changing architecture, update the relevant sections of this CLAUDE.md in the same commit.
- Be creative.
- Be infinitely resourceful.
- Ask me questions.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Server Components by default)
- **Language:** TypeScript throughout
- **React:** 19
- **Styling:** Tailwind CSS v4 — all design tokens defined in `globals.css` via `@theme inline` block (no `tailwind.config.ts`)
- **Animation:** Framer Motion (page transitions, scroll reveals, entrance animations)
- **Blog:** MDX (`@mdx-js/loader`, `next-mdx-remote`, `gray-matter`)
- **SEO:** Per-page metadata exports, JSON-LD structured data, dynamic OpenGraph images via `next/og`
- **Package manager:** pnpm (never npm or yarn)
- **Linting:** ESLint 9 (flat config, `eslint-config-next`)
- **Deployment:** Vercel
- **Fonts:** Space Grotesk (Google Fonts, `--font-space-grotesk`) + Satoshi (Fontshare, `--font-body`)

## Design System — Non-Negotiable
All design tokens are encoded in `src/app/globals.css`. These are the rules:

### Fonts
- **Space Grotesk** (`font-sans` / `--font-space-grotesk`) — headings, nav links, labels, uppercase metadata. Used via `.heading-swiss` and `.label-swiss` utility classes.
- **Satoshi** (`font-body`) — body text, paragraphs, descriptions. Set as the default body font.

### Colors
- Never hardcode hex values. Always use CSS custom properties from `globals.css`.
- Dark mode is the primary theme (`--color-background: #0a0a0a`). Light mode is toggled via `[data-theme="light"]`.
- `--color-foreground` for primary text, `--color-muted` for secondary/labels, `--color-border` for dividers.

### Fluid Type Scale
Font sizes are fluid `clamp()` values defined as CSS custom properties. Use the corresponding utility classes — never use inline `style={{ fontSize }}`:
- `text-headline` → `--text-headline` — page titles, hero text (clamp 2rem–5rem)
- `text-subhead` → `--text-subhead` — section headings, project titles (clamp 1.25rem–2.5rem)
- `text-caption-size` → `--text-caption` — labels, metadata, small text (clamp 0.6875rem–0.875rem)
- Body text (`--text-body`) is set globally on the `<body>` element (clamp 1rem–1.25rem)
- Display text (`--text-display`) for hero headlines (clamp 3rem–11rem) — applied via inline style only on the homepage hero

### Swiss Utility Classes
These are the core CSS utility classes defined in `globals.css`:
- `.label-swiss` — uppercase, caption-size, muted color, Space Grotesk. Used for all metadata labels.
- `.heading-swiss` — Space Grotesk, light weight, negative tracking. Used on all headings.
- `.hover-swiss` — opacity transition on hover. Used on all interactive text links.
- `.arrow-reveal` / `.arrow-reveal-sm` / `.arrow-reveal-lg` — slide-in arrow on parent hover.
- `.bullet-swiss` — small muted dot for list items.
- `.px-swiss` — horizontal section padding using `--spacing-section`.
- `.page-wrapper` — standard page padding (horizontal + vertical).
- `.py-row` / `.pb-row` — consistent row padding.
- `.mb-section` / `.mt-section` — section margin spacing (8vh mobile, 12vh desktop).

### Spacing
- `--spacing-section` — responsive horizontal padding (8px → 12px → 20px at breakpoints).
- `--gap-gallery` (4px) and `--gap-gallery-tight` (2px) — gallery grid gaps.
- Use Tailwind's spacing scale for everything else. Don't use arbitrary values like `p-[13px]`.

### Animation Strategy
- **CSS transitions** for simple interactions: hover opacity, arrow reveals, color changes. Use `.hover-swiss` or Tailwind `transition-*` with `duration-fast` and `ease-swiss`.
- **Framer Motion** for complex/orchestrated animations: page transitions, scroll reveals, entrance sequences. Import tokens from `@/lib/motion`.

### UI Patterns
- **Grid:** 12-column grid (`grid-cols-12`) on desktop, single column on mobile.
- **Page layout:** Every page uses `.page-wrapper` for consistent padding.
- **Focus rings:** Global `:focus-visible` with 2px solid foreground outline.
- **Image protection:** Context menu and drag disabled on images/videos via inline scripts.
- **Selection:** Inverted colors (`background: foreground, color: background`).

## Code Style
- Use functional components with hooks. No class components.
- Prefer named exports over default exports.
- No inline styles. Use Tailwind classes or the CSS utility classes defined in `globals.css`.
- Keep components under 150 lines. Extract sub-components when they grow.
- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<dl>`, etc.).
- All interactive elements must have visible focus states and hover states.
- Responsive by default: build mobile-first, then layer on `sm:`, `md:`, `lg:` breakpoints.
- Animations should be subtle and respect `prefers-reduced-motion`.

## Architecture

### Page Structure
Every page follows a consistent pattern:
1. `.page-wrapper` container with horizontal + vertical padding
2. Header row — `label-swiss` page title in a 12-column grid with bottom border
3. Content — 12-column grid sections separated by borders and `py-row` padding
4. Metadata export for SEO + JSON-LD structured data

### Case Study Pattern
Case study pages (`/work/[slug]/page.tsx`) use shared components:
1. `CaseStudyLayout` — handles hero, header metadata (title, category, year, role, timeline, tools, overview), JSON-LD, and next-project navigation
2. `TextSection` (from `CaseStudySection.tsx`) — titled prose section
3. `LiveEmbed` (from `CaseStudySection.tsx`) — labeled iframe embed with link to external site
4. `CaseStudyGallery` — image/video gallery grid with lightbox support
5. Each case study exports its own `Metadata` for SEO

### Project Data
`src/lib/projects.ts` is the central data file for the homepage project index. Each project has:
- `slug`, `title`, `category`, `year`, `heroImage`
- `images: ProjectImage[]` (src + aspect ratio)
- `stats?: ProjectStat[]` (label/value pairs for Key Metrics cards)
- `description` (one-liner)
- Optional: `heroVideo`, `videos`

### OpenGraph Images
Dynamic OG images are generated per-page using `next/og` via `opengraph-image.tsx` files. The shared `ogImage()` function in `src/lib/og.tsx` renders a dark card with title + subtitle.

### Navigation
- `Navigation.tsx` — responsive nav with 12-column grid desktop layout and full-screen mobile overlay
- `NAV_LINKS` and `NAV_LINK_COLUMNS` defined in `src/lib/layout.ts`
- Active link detection via `usePathname()`
- Mobile menu uses Framer Motion `AnimatePresence`

### Framer Motion Tokens
All animation values are centralized in `src/lib/motion.ts`:
- `ease.swiss` — `[0.4, 0, 0.2, 1]`
- `duration` — fast (0.3), normal (0.6), slow (0.8), page (0.4), entrance (0.7)
- `delay` — stagger (0.1), section (0.2), hero (0.25)
- `spring.nav` — spring config for nav animations
- `viewport` — IntersectionObserver margins for scroll reveals
- `transition` — pre-composed transition objects (fast, normal, slow, page, entrance)

### Theme Initialization
- Inline `<script>` in `layout.tsx` reads `localStorage.getItem('theme')` before React hydrates
- Prevents FOUC by setting `data-theme` attribute synchronously
- Light mode uses `[data-theme="light"]` CSS selector to swap color tokens

### SEO
- Every page exports `Metadata` with title, description, OpenGraph, and canonical URL
- `robots.ts` and `sitemap.ts` at app root for crawlers
- JSON-LD structured data (`Person` on root layout, `CreativeWork` on case studies, `Article` on blog posts)

## File Structure
```
src/
├── app/
│   ├── layout.tsx              # Root layout — fonts, theme init, nav, footer, JSON-LD
│   ├── globals.css             # Tailwind v4 @theme tokens, Swiss utility classes
│   ├── page.tsx                # Homepage — ProjectIndex with image strips + stats cards
│   ├── opengraph-image.tsx     # Dynamic OG image for homepage
│   ├── robots.ts               # Robots.txt generation
│   ├── sitemap.ts              # Sitemap generation
│   ├── about/
│   │   ├── page.tsx            # Bio, capabilities, tools, location, experience timeline
│   │   ├── layout.tsx          # About page layout wrapper
│   │   └── opengraph-image.tsx
│   ├── blog/
│   │   ├── page.tsx            # Blog index — post list
│   │   ├── layout.tsx          # Blog layout wrapper
│   │   ├── opengraph-image.tsx
│   │   ├── [slug]/             # Dynamic blog post route
│   │   │   ├── page.tsx
│   │   │   └── opengraph-image.tsx
│   │   └── the-designers-moment/  # Static blog post
│   │       ├── page.tsx
│   │       └── opengraph-image.tsx
│   ├── contact/
│   │   ├── page.tsx            # Contact page with email link
│   │   ├── layout.tsx
│   │   └── opengraph-image.tsx
│   └── work/                   # Case study pages
│       ├── sonde/page.tsx
│       ├── firststrike/page.tsx + opengraph-image.tsx
│       ├── jade-aesthetics/page.tsx
│       ├── xrpcafe/page.tsx + opengraph-image.tsx
│       ├── firstledger/page.tsx + opengraph-image.tsx
│       ├── do-androids-dream/page.tsx + opengraph-image.tsx
│       └── gridform/page.tsx + opengraph-image.tsx
├── components/
│   ├── Navigation.tsx          # Responsive nav — 12-col grid desktop, fullscreen mobile overlay
│   ├── Footer.tsx              # Site footer
│   ├── PageTransition.tsx      # Framer Motion page enter/exit wrapper
│   ├── ScrollReveal.tsx        # IntersectionObserver fade-in-up wrapper
│   ├── ProjectIndex.tsx        # Homepage project list — image strips with hover expand + stats cards
│   ├── ProjectCard.tsx         # Individual project card (used in /work grid if needed)
│   ├── CaseStudyLayout.tsx     # Shared case study wrapper — hero, metadata grid, next-project link
│   ├── CaseStudySection.tsx    # TextSection + LiveEmbed components for case study content
│   └── CaseStudyGallery.tsx    # Image/video gallery grid
├── lib/
│   ├── motion.ts               # Framer Motion tokens (ease, duration, delay, spring, transition)
│   ├── layout.ts               # NAV_LINKS, NAV_LINK_COLUMNS constants
│   ├── og.tsx                  # Shared OpenGraph image generator (ogImage, ogSize)
│   ├── projects.ts             # Project data array (slug, title, images, stats, description)
│   └── posts.ts                # Blog post data/utilities
```

## Common Mistakes — Don't Repeat These
- Don't hardcode colors. Use CSS custom properties from `globals.css` (`var(--color-border)`, etc.).
- Don't use inline `style={{ fontSize }}`. Use the utility classes: `text-headline`, `text-subhead`, `text-caption-size`.
- Don't use arbitrary spacing values like `p-[13px]`. Use Tailwind's spacing scale.
- Don't forget focus states on interactive elements. The global `:focus-visible` rule handles most cases.
- Don't forget `aria-labelledby`, `aria-label`, `role` attributes on semantic structures.
- Don't use default exports unless required by Next.js (page.tsx, layout.tsx). Prefer named exports.
- Don't forget to add projects to `src/lib/projects.ts` when creating new case studies.
- Don't forget SEO metadata exports and JSON-LD on every page.

## Testing & Verification

### After Every Change (lightweight)
- Run `npx tsc --noEmit` to catch type errors.
- Run `pnpm lint` to catch lint violations.
- For UI changes, open the browser preview and visually confirm.

### Before Commits & PRs (full audit)
- Run the **design-check** agent to verify design system compliance.
- Run the **code-reviewer** agent to catch bugs and logic errors.
- Run the **code-simplifier** agent to clean up code quality.
- Run the **verify-app** agent to confirm the app builds and runs correctly.
- Run `pnpm build` to catch production build errors.
- Verify dark mode and light mode both look correct.
- Check responsive layout at mobile, tablet, and desktop widths.
