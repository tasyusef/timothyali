# timothyali2: Timothy Ali's rebrand and timothyali.com

The live site at https://www.timothyali.com and the rebrand behind it (positioning, identity, site, social). It is a pixel/type system: bitmap faces on one measured grid, black and white with a theme toggle, yellow as a sparse accent, generated ASCII/dither fields, terminal chrome. No Three.js.

## Where things are

- `docs/decision-log.md`: numbered decisions, newest at the bottom. It is the source of truth when other docs disagree, and the latest explicit direction from Timothy wins over older entries.
- `docs/design-system.md`: tokens, type roles, components and the cell table. Read it before design work.
- `docs/iteration-log.md`, with before/after evidence under `docs/iterations/`.
- `docs/open-questions.md` (undecided items) and `docs/context.md` (the starting point).
- `docs/admin-analytics.md`: the private admin, email sign-in and analytics.
- `tools/review/README.md` (review scripts) and `tools/social/README.md` (favicons and share images).
- Older docs predate the current site: `alternate-v2.md`, the PX-07/PX-08 handoffs, and the city-era `codex-handoff.md`, `implementation-v1.md`, `vector-world.md`, `landing-story.md`, landing copy and storyboards. Check them against the decision log.
- The city version of the landing is saved at `/Users/twocakes/Desktop/PROJECTS/timothyali2-city-v1-2026-09-08`. Don't modify it.
- `../timothyali` is the pre-rebrand checkout of the same repo. Leave it untouched.

## Commands

- `pnpm dev`, `pnpm check`, `pnpm test` (vitest), `pnpm build` (runs `tools/images/derive.mjs` for the WebP derivatives first), `pnpm preview`. Node 22.12 or newer.
- `pnpm seo:check` after a build.
- Share images and icons: `pnpm social:generate`, then `pnpm build` and `pnpm social:verify`. Re-run when titles, selected projects, covers, tools or identity change. They are rendered by the site from the dev-only `/og/[id]` route.
- Toolbox option tables: `tools/toolbox/sync-options.mjs` writes `src/lib/toolbox-options.ts`.
- Review scripts run against `pnpm preview --host 127.0.0.1 --port 4173`.

## Deploy and git

- **Commit and push only on Timothy's word.** Every push to `master` on `origin` (GitHub) is a production deploy through Vercel.
- After pushing `master` to `origin`, push it to `gitlab` too. It is a private mirror and does not deploy.
- The contact form (`src/routes/api/contact/+server.ts`, Resend) and the admin/auth/analytics routes need Vercel's environment. Locally the form reports the relay as unconfigured.
- No root `api/` folder: Vercel's zero-config functions there make every dynamic `/api/...` SvelteKit route answer Vercel's own 404 (0226). Server code goes in `src/routes`.
- Decision numbers 0149 to 0160 belong to the set-aside modernist-v3 work (branch `modernist-v3` and a stash). New decisions continue from the latest number in the log.

## Recording decisions

- Log a decision when Timothy confirms it, not when it is proposed. Label assistant proposals as proposals, and never call a design approved without his confirmation.
- Record his reasons as he gives them. If the reason is unclear, ask; never invent his "why".
- Reversed decisions are not deleted: add a `Superseded by` line and a new entry.
- Log each meaningful iteration in `docs/iteration-log.md`, with before/after evidence under `docs/iterations/`.
- Be a candid peer. Keep direction-setting on the concept and save execution detail for implementation.
- Work directly: Timothy asked for no orchestration skill.

## Privacy

- Résumé sources, cover letters, application material and reviews of his brief are kept privately outside this repo, and résumé and LinkedIn changes are handled there. The only copy here is the phone-free `static/resume/Timothy-Ali-Resume.pdf`.

## Design rules

Details and values are in `docs/design-system.md`. These are the standing rules:

- Every face is a bitmap design sized as cells per em × cell. Font sizes stay on the cell table at the top of `src/app.css`, or the glyph pixels blur. The one exception is the study reading face, IBM Plex Mono (0136, 0137).
- Faces: Jacquard 24 for the wordmark and emphasis, PARC Pixel Bold for uppercase display, PARC Pixel Regular for labels (0078), Jersey 15 for text, Press Start 2P for the readout. PARC Pixel is Timothy's own typeface; it is extended by `tools/fonts/extend-parc-pixel.py`.
- Spacing is in 8px units (0089).
- No rules or borders, and no eyebrow labels anywhere (0047, 0196).
- Black and white with a theme toggle; yellow is a sparse accent (0049).
- Images and video render at their own resolution. Only the generated textures are pixelated (0054).
- Every motion piece has a static version for motion off, no JavaScript and the prerender (0128, 0141).
- Breakpoints are 420, 700, 900 and 1100 (0075).
- Copy has no em dashes. Page titles and quote attributions use "/" (0122). The role is "Designer" (0229; was "Product designer", 0172).
- Projects live in `src/lib/work.ts`. Hide one with `hidden: true` and its data stays; every count derives from the visible set. Sonde and Pocketwatch are hidden for now (0219).
- Study facts come from Timothy or recorded sources; the wording around them is marked as the assistant's.
