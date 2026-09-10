# Site icons and share images

`pnpm social:generate` builds the favicon set and twelve 1200×630 PNGs in `static/og/`.
Run from the project root with Node 22.18+ and Playwright Chromium installed. Set
`CHROMIUM_PATH` to select an executable; otherwise the generator uses the existing
local review browser when present or Playwright's installed Chromium. All fonts,
colours and project covers come from this repository; no external service is used.

- SVG favicon: actual Jacquard 24 uppercase T, rendered on a 32px grid, outlined as
  individual square cells; ink on yellow. No font dependency in SVG.
- ICO: embedded PNGs at 16, 32 and 48; separate PNG files are retained too.
- Apple touch icon: 180×180.
- Home / Contact: blackletter and PARC Pixel type; Work: selected four-cover collage.
- Nine study images: project cover, title, scope, year, and consistent site chrome.
- Re-run when titles, selected projects, covers or identity change. Adding a study
  automatically includes it in generation and metadata via the `studies` export.

`src/lib/social.ts` owns the public origin and per-page preview copy. The origin is
`https://www.timothyali.com`, retained from the previous site. `SocialMeta.svelte`
emits canonical, Open Graph and Twitter card tags during prerendering and navigation.
Unknown routes receive no misleading Home metadata. Existing document title and
meta-description tags remain owned by their routes; keep them in sync if copy changes.
Open Graph field reference: https://ogp.me/.

After generation, run `pnpm build && pnpm social:verify`. This reads the actual
prerendered HTML and shipped files, checking all 12 routes, unique image tags,
public URLs, nonempty descriptions/alt text, and PNG dimensions. The browser checks
in `navigation.mjs` expect the local site on port 4173. `proof.mjs` produces the
contact sheet; those review helpers use the existing local browser executable.

No deployment or external social-platform cache refresh is performed here.

## PX-25 — rendered by the site (decision 0084)

The twelve share images are screenshots of `src/routes/og/[id]/`, a dev-only route
that composes each image from the real components: the layout's header and status
strip (the route tells the layout which path to reflect via `chromePath`), a `Band`
with the canvas ASCII field and its text knockout, and the page's own blocks — the
hero name and cursor, the Work head and cards, the Contact head, a Work row for each
study. Nothing is drawn by hand in the generator any more.

`generate.mjs` starts its own Vite dev server on `127.0.0.1:4174`, forces motion off
(one seeded static frame, no blink, no Decode), freezes the clock at `MT 12:00:00`,
sheds the coordinates on study images the way the strip does below 1100px so a long
slug never clips, and screenshots `/og/<id>` at 1200×630. The route declares
`entries = () => []`, so it is never crawled and never ships; `svelte.config.js`
names it as the one unseen prerenderable route the build may ignore. Adding a study
still includes it automatically. Contact sheet: `docs/iterations/pixel-v2/25-social-site/contact-sheet.png`.
