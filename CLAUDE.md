# timothyali.com — Project Rules

## What This Project Is
Personal portfolio website for Timothy Ali — a designer working across product, brand, and motion. The site showcases case studies, a blog, and contact info. The design language is Swiss-modernist: dark mode primary, clean grids, no decorative UI, sharp typographic hierarchy. Every page follows a 12-column grid with consistent spacing tokens.

## Workflow
- **Always start in Plan mode.** Outline what you'll do and why before writing any code. Wait for approval before executing.
- **Verify your work.** After making changes, run `pnpm lint` and `pnpm check`. For UI changes, open the browser preview and confirm the UI looks correct.
- **Keep PRs small and focused.** One feature or fix per PR. If scope creeps, suggest splitting into separate PRs.
- **Commit with clear messages.** Use conventional commits: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`.
- **Keep this file current.** When adding new pages, components, or changing architecture, update the relevant sections of this CLAUDE.md in the same commit.
- Be creative.
- Be infinitely resourceful.
- Ask me questions.

## Tech Stack
- **Framework:** SvelteKit 2 (fully prerendered — `export const prerender = true` in the root layout)
- **Language:** TypeScript throughout
- **UI:** Svelte 5 (runes — `$state`, `$derived`, `$effect`, `$props`, snippets)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` — all design tokens defined in `src/app.css` via `@theme inline` block (no config file)
- **Animation:** No animation library. Svelte transitions (`fade`, `slide`, `fly`, `crossfade`), `svelte/motion` `Spring`, CSS transitions, and the View Transitions API for page fades
- **Blog:** Markdown + mdsvex — posts in `src/content/posts/*.md` with YAML frontmatter
- **Images:** `@sveltejs/enhanced-img` — build-time AVIF/WebP + responsive srcset for everything in `src/lib/images`
- **SEO:** `Seo.svelte` component (meta + OG + JSON-LD), prerendered `sitemap.xml`, satori-generated OG images
- **Package manager:** pnpm (never npm or yarn)
- **Linting:** ESLint 9 (flat config, `eslint-plugin-svelte`) + Prettier (`prettier-plugin-svelte`, `prettier-plugin-tailwindcss`)
- **Deployment:** Vercel (`@sveltejs/adapter-vercel`; the build output is fully static)
- **Fonts:** Space Grotesk (self-hosted via `@fontsource-variable/space-grotesk`) + Satoshi (Fontshare stylesheet in `app.html`)

## Design System — Non-Negotiable
All design tokens are encoded in `src/app.css`. These are the rules:

### Fonts
- **Space Grotesk** (`font-sans` / `--font-sans`) — headings, nav links, labels, uppercase metadata. Used via `.heading-swiss` and `.label-swiss` utility classes.
- **Satoshi** (`font-body`) — body text, paragraphs, descriptions. Set as the default body font.
- **JetBrains Mono** (`font-mono` / `--font-mono`, self-hosted via `@fontsource-variable/jetbrains-mono`) — data only: index numbers, years, dates, stat values, the clock. Used via the `.data-swiss` utility class, never for prose.

### Colors
- Never hardcode hex values. Always use CSS custom properties from `app.css`.
- Dark mode is the primary theme (`--color-background: #0a0a0a`). Light mode is toggled via `[data-theme="light"]`.
- `--color-foreground` for primary text, `--color-muted` for secondary/labels, `--color-border` for dividers.
- `--color-surface` — one elevation step above the background (`#111111` dark / `#ffffff` light). Used only by `.panel-swiss`.

### Fluid Type Scale
Font sizes are fluid `clamp()` values defined as CSS custom properties. Use the corresponding utility classes — never use inline `style="font-size: …"`:
- `text-display` → `--text-display` — hero headlines (clamp 3rem–11rem)
- `text-headline` → `--text-headline` — page titles, hero text (clamp 2rem–5rem)
- `text-subhead` → `--text-subhead` — section headings, project titles (clamp 1.25rem–2.5rem)
- `text-caption-size` → `--text-caption` — labels, metadata, small text (clamp 0.6875rem–0.875rem)
- Body text (`--text-body`) is set globally on the `<body>` element (clamp 1rem–1.25rem)

### Swiss Utility Classes
These are the core CSS utility classes defined in `app.css`:
- `.label-swiss` — uppercase, caption-size, muted color, Space Grotesk. Used for all metadata labels.
- `.data-swiss` — JetBrains Mono + tabular figures. For data values only (index numbers, years, dates, stats, the clock); composes with `.label-swiss`.
- `.panel-swiss` — surface background + 1px border + `--radius-panel` (6px, the only radius on the site). Reserved for "data objects": stats cards, keycaps, browser frames, the command menu, interactive demos. Everything else stays borders-only — don't card the editorial layers (prose/quick-link sections were tried as panels and reverted: it read as clutter).
- `.heading-swiss` — Space Grotesk, light weight, negative tracking. Used on all headings.
- `.hover-swiss` — opacity transition on hover. Used on all interactive text links.
- `.arrow-reveal` / `.arrow-reveal-sm` / `.arrow-reveal-lg` — slide-in arrow on parent hover.
- `.bullet-swiss` — small muted dot for list items.
- `.px-swiss` — horizontal section padding using `--spacing-section`.
- `.page-wrapper` — standard page padding (horizontal + vertical).
- `.py-row` / `.pb-row` — consistent row padding.
- `.mb-section` / `.mt-section` / `.py-section` — section spacing (8vh mobile, 12vh desktop).
- `.entrance` — initial page-load fade-in; stagger with `style="--entrance-delay: 100ms"`.
- `.reveal` / `.reveal-visible` — scroll-triggered entrance, applied by the `reveal` action (never by hand).
- `.prose-swiss` — markdown blog post body styles (h2, paragraphs, bulleted lists).

### Spacing
- `--spacing-section` — responsive horizontal padding (8px → 12px → 20px at breakpoints).
- `--gap-gallery` (4px) and `--gap-gallery-tight` (2px) — gallery grid gaps.
- Use Tailwind's spacing scale for everything else. Don't use arbitrary values like `p-[13px]`.

### Animation Strategy
- **CSS transitions** for simple interactions: hover opacity, arrow reveals, color changes. Use `.hover-swiss` or Tailwind `transition-*` with `duration-fast` and `ease-swiss`.
- **`.entrance` CSS class** for initial page-load fades (header rows, heroes) — staggered via `--entrance-delay`.
- **`reveal` action** (`$lib/actions/reveal`) for scroll-triggered entrances — IntersectionObserver + `.reveal` CSS.
- **Svelte transitions** for overlays and expands: `transition:fade` / `slide` / `fly` with `duration` (ms) and `easeSwiss` from `$lib/motion`.
- **`Spring` from `svelte/motion`** for physics (cursor-following preview).
- **View Transitions API** for cross-page fades — wired in `+layout.svelte` via `onNavigate`, styled in `app.css`.
- All motion must respect `prefers-reduced-motion` (CSS handles `.reveal`/`.entrance`/view transitions; use `prefersReducedMotion()` from `$lib/motion` in components).

### UI Patterns
- **Grid:** 12-column grid (`grid-cols-12`) on desktop, single column on mobile.
- **Page layout:** Every page uses `.page-wrapper` for consistent padding (case studies use their own header pattern).
- **Focus rings:** Global `:focus-visible` with 2px solid foreground outline.
- **Image protection:** Context menu and drag disabled on images/videos via inline scripts in `app.html`.
- **Selection:** Inverted colors (`background: foreground, color: background`).

## Code Style
- Svelte 5 runes only — no legacy stores/`$:`/`export let`. Props via `$props()` with a typed interface.
- Prefer named exports over default exports in `.ts` modules.
- No inline styles except dynamic values (`style:transform`, `style:--entrance-delay`). Use Tailwind classes or the CSS utility classes defined in `app.css`.
- Keep components under 150 lines. Extract sub-components when they grow.
- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<dl>`, etc.).
- All interactive elements must have visible focus states and hover states.
- Responsive by default: build mobile-first, then layer on `sm:`, `md:`, `lg:` breakpoints.
- Images: always go through `<Img>` (`$lib/components/Img.svelte`) so they hit the enhanced-img pipeline. Add new image files under `src/lib/images/<project>/` and reference them as `/images/<project>/<file>` — the manifest in `$lib/images.ts` resolves them. The manifest **throws at build time** on unknown paths, so typos fail fast.
- Videos are plain `<video>` tags served from `static/videos`.

## Architecture

### Page Structure
Every page follows a consistent pattern:
1. `<Seo>` component — title, description, `ogKey` (registered in `$lib/og.ts`), optional JSON-LD
2. `.page-wrapper` container with horizontal + vertical padding
3. Header row — `label-swiss` page title in a 12-column grid with bottom border (`.entrance` fade)
4. Content — 12-column grid sections separated by borders and `py-row` padding

### Case Study Pattern
Case study pages (`src/routes/work/<slug>/+page.svelte`) compose shared components:
1. `<Seo>` with `ogKey={slug}` + CreativeWork JSON-LD (`imageUrl()` from `$lib/images` for the image)
2. `CaseStudy` — wrapper handling back link, title, overview (snippet prop), metadata rows, hero, and next-project navigation
3. `TextSection` — titled prose section (label left, copy right)
4. `LiveEmbed` — labeled iframe embed with link to the external site
5. `ResultsList` — bordered results/bullet list
6. `Gallery` — image/video masonry grid with lightbox (keyboard nav, focus trap, scroll lock). All media renders full-bleed. (A BrowserFrame chrome treatment for product screenshots was tried and removed: fake browser bars added noise, especially dark UI on the dark theme.)
7. New case studies must also be added to `src/lib/projects.ts` and get an OG entry automatically via slug
8. Case-study-local interactive demos colocate in the route folder (non-`+` files are private modules); promote to `$lib/components` only when shared. Demo content colors must be the showcased product's real values, clearly commented as product colors, never site tokens. (A Pocketwatch category-pill demo was tried and scrapped; nothing interactive is embedded now.)

### Project Data
`src/lib/projects.ts` is the central data file for the homepage project index. Each project has:
- `slug`, `title`, `section` (`'brand' | 'web' | 'passion'`), `category`, `year`, `heroImage`, `heroAspect`
- `images: ProjectImage[]` (src + aspect ratio + alt)
- `stats?: ProjectStat[]` (label/value pairs for Key Metrics cards)
- `description` (one-liner)
- Optional: `heroVideo`, `videos`

The homepage renders three grouped work sections, all derived from `section`: "Brand & Motion" (`brandProjects`: FirstStrike, xrp.cafe, First Ledger, Do Androids Dream, Studio Gridform), then "Web & Product Design" (`webProjects`: website/product client work — currently Jade Aesthetics), then "Passion Projects & Open Source" (`passionProjects`: self-initiated apps and open source — Pocketwatch, Sonde, GRIDFORM Studio). The array is ordered brand → web → passion so numbering runs continuously (01–05, 06, 07–09 via the shared `startIndex` prop) and `getNextProject` cycles in the same order. New projects must set `section`.

**Homepage layout (production = `combo`):** each section renders a caption-less contact-sheet strip on desktop — `HomeContactSheet` (route-local): fixed-height (`h-64 lg:h-72`) sideways-scrolling row of hero media at aspect-true widths (`bentoImage ?? heroImage`), scroll arrows on overflow — followed at every viewport by `ProjectIndex` rows (number / title / category / year; cursor-following `CursorPreview` on desktop hover, tap-to-expand on mobile). The strip has no captions in this pairing because the rows directly below carry the meta (the standalone sheet layout keeps captions via its `captions` prop).

**Layout exploration rig (dev only):** `+page.svelte` holds `layout` state (default `'combo'` = production); `HomeLayoutSwitcher` (route-local, rendered only under `import.meta.env.DEV`, persists to localStorage) flips between candidates defined in `src/routes/homeLayout.ts`: `index` (rows only), `hybrid` (one feature image + rows), `bento` (the previous production layout), `dense` (bento with a re-curated `overrides` prop — more cards per band = shorter bands), `sheet` (captioned strips only), `combo`. `HomeWorkSections` (route-local) renders the three sections per layout. Delete the losing branches once the exploration is settled.

`ProjectBento` (kept for the bento/dense options) — aspect-justified bento bands: consecutive projects sharing a `bentoRow` number form one band; within a band, consecutive projects sharing a `bentoCol` stack vertically in one column. A solver sizes columns so every column of a band is equal height, and stacked cards split their column via flex-grow ∝ 1/aspect — all media renders aspect-true with zero cropping. Cards are full-bleed media tiles; the meta chin overlays the bottom edge on hover/focus. `bentoImage`/`bentoAspect` override the card media when the hero doesn't suit a tile (Pocketwatch uses its landscape ad); an optional per-slug `overrides` prop replaces `bentoRow`/`bentoCol`/aspect without touching `projects.ts`.

### Art
- `src/lib/art.ts` holds `ArtPiece { src, alt, title?, year? }` entries; images live in `src/lib/images/art/`. No aspect ratios are stored — `artAspect()` reads intrinsic dimensions from the enhanced-image manifest, so adding a piece is one file + one entry.
- `ArtGrid.svelte` renders them as an auto-justified bento: greedy row packing to a target aspect sum (3.4) with closest-fit wrapping, fr tracks ∝ aspect (equal-height rows, zero cropping), a phantom pad track so an underfilled last row doesn't oversize, 2-col masonry on mobile, `limit` prop for the homepage teaser row. Tiles open the shared `Lightbox.svelte` (extracted from Gallery; both use it).
- The /art page is currently HIDDEN by choice: no nav link, no homepage teaser, not in the sitemap. The route stays live for direct links. To unhide: add `{ href: '/art', label: 'Art' }` back to NAV_LINKS (+ a fourth `md:col-start-5` column entry), restore the homepage teaser section, and re-add /art to the sitemap.

### Blog
- Posts are markdown files in `src/content/posts/<slug>.md` with frontmatter: `title`, `date` (ISO), `excerpt`.
- `$lib/posts.ts` loads them via `import.meta.glob` (eager) and sorts by date; mdsvex compiles the body to a Svelte component.
- `/blog/[slug]` renders the post component inside `.prose-swiss`; `entries` in `+page.ts` drives prerendering.
- Adding a post = adding one markdown file. Index, sitemap, and OG image follow automatically.

### Images
- `src/lib/images/**` is globbed with `query: { enhanced: true }` in `$lib/images.ts` → AVIF/WebP + srcset at build time.
- `getImage('/images/…')` returns the picture data; `imageUrl(src, base)` returns the absolute optimized URL for JSON-LD/OG.
- `<Img src alt sizes eager>` wraps `<enhanced:img>`; `picture { display: contents }` in `app.css` keeps layout identical to a bare `<img>`.

### OpenGraph Images
- `$lib/og.ts` maps every `ogKey` → `{ title, subtitle }` (static pages by hand, projects/posts derived).
- `src/routes/og/[key].png/+server.ts` renders the dark card with satori + resvg using self-hosted Space Grotesk woffs, prerendered for every key.
- `<Seo ogKey="…">` points `og:image` at `/og/<key>.png`.

### Navigation
- `Navigation.svelte` — responsive nav with 12-column grid desktop layout and full-screen mobile overlay.
- `NAV_LINKS`, `NAV_LINK_COLUMNS`, and `isActiveLink()` live in `src/lib/nav.ts`.
- Active-link underline slides between links via Svelte `crossfade`.
- Mobile overlay uses `transition:fade` + the `focusTrap` action (Escape closes, Tab wraps).

### Motion Tokens
All animation values are centralized in `src/lib/motion.ts`:
- `duration` — fast (300), normal (600), slow (800), page (400), entrance (700) — in **ms**
- `delay` — stagger (100), section (200), hero (250)
- `easeSwiss` — cubic-bezier(0.4, 0, 0.2, 1) as a Svelte easing function
- `spring.cursor` — Spring preset for the cursor-following preview
- `prefersReducedMotion()` — SSR-safe media query check

### Theme
- Inline `<script>` in `app.html` reads `localStorage.getItem('theme')` before hydration (no FOUC).
- `$lib/theme.svelte.ts` is a runes-based store with `set(theme)` and `toggle()`; `ThemeToggle.svelte` is a plain floating icon button (no panel box — a segmented control was tried and reverted). The command menu's theme commands use `set()`.
- Light mode uses the `[data-theme="light"]` CSS selector to swap color tokens.

### Command Menu (⌘K)
- `$lib/commandMenu.svelte.ts` — runes store for open state (triggers live in Navigation and StatusBar; the menu mounts once in `+layout.svelte`).
- `$lib/commands.ts` — builds the command list from `NAV_LINKS`, `projects`, and `theme.set` (groups: Navigate / Projects / Theme).
- `CommandMenu.svelte` — ⌘K/Ctrl+K global shortcut, filter input, arrow-key + Enter selection, `focusTrap`, `panel-swiss` styling.
- `CommandKey.svelte` — the small ⌘K keycap trigger button (footer status bar only — boxed chrome stays out of the typographic top nav).
- `focusTrap` keeps a module-level stack so nested overlays (e.g. menu over lightbox) only respond to Escape/Tab on the topmost trap.

### Footer
- Two rows only — keep it that way: `StatusBar.svelte` (pulse dot + "Open to work", "Get in touch" link to /about, `Denver, CO · <LocalTime seconds={false} />`, ⌘K keycap) then the nav/© row.
- The status row is the single sitewide availability/contact touchpoint — case studies have no separate contact CTA section, and there is no standalone Availability row (both were consolidated away after reading as stacked clutter).
- There is no /contact page — it duplicated About and was removed. `vercel.json` 308-redirects /contact → /about in production; the nav has three links (Work / About / Writing) and the homepage quick-links row has two cards (About + Latest Writing).
- `LocalTime.svelte` — live Denver clock, `''` during SSR/prerender then ticking client-side; `seconds` prop (homepage hero shows seconds, footer doesn't).

### SEO
- `Seo.svelte` renders title (auto-suffixed "— Timothy Ali"), description, author, canonical, OG tags (incl. `og:image:width/height/alt`), Twitter card tags (card format, title, description, image only — no account is named), optional `article` metadata, and JSON-LD.
- Structured data: Person + WebSite JSON-LD in `+layout.svelte`; ProfilePage on `/about` (`PERSON_ENTITY` from `$lib/site`); CreativeWork on case studies; Article (with `image`/`description`/`dateModified`) on blog posts; BreadcrumbList rendered automatically by `CaseStudy.svelte`.
- Every page needs exactly one `<h1>` with keyword-bearing text — use `sr-only` when the design has no visible heading (about, blog index). The homepage h1 is the visible positioning statement in the hero, with the keyword-bearing name/role/location in a trailing `sr-only` span.
- `src/routes/sitemap.xml/+server.ts` builds the sitemap from `projects` + `posts`; `lastmod` only where a real content date exists (posts) — never the build date. `static/robots.txt` points to it.
- `trailingSlash = 'never'` is pinned in `+layout.ts` — canonical URLs have no trailing slash.
- `+error.svelte` is the branded 404/error page (served by the adapter's catchall for unknown URLs).
- Meta descriptions ≤160 chars; page titles ≤60 chars including the "— Timothy Ali" suffix.
- Image alt text must carry project context ("First Ledger color palette", not "Color palette").
- Satoshi loads from Fontshare (preconnect hints in `app.html`); self-hosting the woff2s is the eventual goal — the CDN is blocked from CI environments.

## File Structure
```
src/
├── app.html                    # Shell — theme init, image protection, Satoshi font link
├── app.css                     # Tailwind v4 @theme tokens, Swiss utility classes, prose styles
├── app.d.ts
├── content/
│   └── posts/                  # Blog posts (markdown + frontmatter, compiled by mdsvex)
│       ├── the-designers-moment.md
│       └── starting-with-less.md
├── lib/
│   ├── site.ts                 # SITE_URL, titles, SOCIAL_LINKS, Person JSON-LD
│   ├── nav.ts                  # NAV_LINKS, NAV_LINK_COLUMNS, isActiveLink
│   ├── motion.ts               # duration/delay tokens (ms), easeSwiss, spring presets
│   ├── theme.svelte.ts         # Runes-based theme store
│   ├── projects.ts             # Project data array (slug, title, images, stats, description)
│   ├── art.ts                  # Art/misc pieces for /art + homepage teaser (aspect derives from the image manifest)
│   ├── posts.ts                # Markdown post loader (import.meta.glob) + formatDate
│   ├── images.ts               # Enhanced-image manifest — getImage / imageUrl
│   ├── og.ts                   # OG card registry (ogKey → title/subtitle)
│   ├── actions/
│   │   ├── reveal.ts           # IntersectionObserver scroll reveal (.reveal classes)
│   │   ├── focusTrap.ts        # Tab trap + Escape for modal overlays
│   │   └── portal.ts           # Move node to <body> (cursor preview)
│   ├── images/                 # Source images, optimized at build time (per-project folders)
│   └── components/
│       ├── Seo.svelte          # Head meta + OG + JSON-LD
│       ├── Img.svelte          # <enhanced:img> wrapper resolving "/images/…" paths
│       ├── Navigation.svelte   # Responsive nav — crossfade underline, mobile overlay
│       ├── ThemeToggle.svelte
│       ├── Footer.svelte
│       ├── ProjectIndex.svelte # Homepage project rows (all viewports) — cursor preview / tap to expand
│       ├── ProjectBento.svelte # Bento grid (dev-only layout options) — aspect-justified bands
│       ├── ProjectImageStrip.svelte  # Horizontal media strip with scroll arrows
│       ├── ProjectStatsCard.svelte   # Key Metrics card
│       ├── CursorPreview.svelte      # Spring-driven hover preview (portaled to body)
│       ├── CaseStudy.svelte    # Case study wrapper — header, hero, metadata, next link
│       ├── TextSection.svelte  # Titled prose section
│       ├── LiveEmbed.svelte    # Labeled iframe embed
│       ├── ResultsList.svelte  # Bulleted results section
│       ├── Gallery.svelte      # Masonry gallery (case studies) — renders Lightbox
│       ├── Lightbox.svelte     # Shared full-screen lightbox (focus trap, arrows, backdrop close)
│       └── ArtGrid.svelte      # Auto-justified bento for art pieces + Lightbox
└── routes/
    ├── +layout.ts              # prerender = true, trailingSlash = 'never'
    ├── +layout.svelte          # app.css, view transitions, nav/footer, Person+WebSite JSON-LD, skip link
    ├── +error.svelte           # Branded 404/error page
    ├── +page.svelte            # Homepage — hero grid, work sections (HomeWorkSections + dev layout switcher), quick links
    ├── about/+page.svelte
    ├── art/+page.svelte        # Auto-justified bento of misc work (art, prints, photography)
    ├── blog/
    │   ├── +page.svelte        # Post index
    │   └── [slug]/             # Dynamic post route (+page.ts loads from $lib/posts)
    ├── work/                   # One folder per case study (9 total)
    │   └── <slug>/+page.svelte
    ├── og/[key].png/+server.ts # Prerendered OG cards (satori + resvg)
    └── sitemap.xml/+server.ts
static/
├── robots.txt
├── icon.svg                    # Favicon
├── apple-touch-icon.png        # 180×180 PNG (iOS ignores SVG icons)
└── videos/                     # mp4 assets (served as-is)
```

## Common Mistakes — Don't Repeat These
- Don't hardcode colors. Use CSS custom properties from `app.css` (`var(--color-border)`, etc.).
- Don't use inline font-size styles. Use the utility classes: `text-display`, `text-headline`, `text-subhead`, `text-caption-size`.
- Don't use arbitrary spacing values like `p-[13px]`. Use Tailwind's spacing scale.
- Don't use plain `<img>` for repo images — use `<Img>` so they're optimized; plain `<video>` is correct for videos.
- Don't forget focus states on interactive elements. The global `:focus-visible` rule handles most cases.
- Don't forget `aria-labelledby`, `aria-label`, `role` attributes on semantic structures.
- Don't add an animation library — the Svelte primitives + tokens in `$lib/motion` cover everything.
- Don't forget to add projects to `src/lib/projects.ts` when creating new case studies (the OG card and sitemap derive from it).
- Don't forget the `<Seo>` component (with `ogKey`) and JSON-LD on every new page.
- Svelte attributes containing double quotes need curly quotes (`“”`) or an expression — Prettier will mangle `attr='… "…" …'`.

## Testing & Verification

### After Every Change (lightweight)
- Run `pnpm check` to catch type errors (svelte-check).
- Run `pnpm lint` to catch format/lint violations (`pnpm format` to fix).
- For UI changes, open the browser preview and visually confirm.

### Before Commits & PRs (full audit)
- Run the **design-check** agent to verify design system compliance.
- Run the **code-reviewer** agent to catch bugs and logic errors.
- Run the **code-simplifier** agent to clean up code quality.
- Run the **verify-app** agent to confirm the app builds and runs correctly.
- Run `pnpm build` to catch production build errors (also regenerates all prerendered pages and OG images).
- Verify dark mode and light mode both look correct.
- Check responsive layout at mobile, tablet, and desktop widths.
