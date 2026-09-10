# timothyali2 — Personal Rebrand

Rebrand of Timothy Ali: positioning, brand identity, website (v2 of timothyali.com), and social media presence.

Started 2026-09-08. The previous site lives in `../timothyali` (SvelteKit 2, Swiss-modernist, dark mode primary).

## How this project is documented

Every decision is logged. The goal is a process that can be shown publicly at the end.

- `docs/decision-log.md` — numbered decisions, newest at the bottom. Each entry records the question, the options considered, what was chosen, and why.
- `docs/open-questions.md` — things not yet decided, with the current leaning if there is one.
- `docs/context.md` — facts about the starting point (current site, positioning, track record) so decisions can be read without opening the old codebase.

Rules for the log:
1. A decision is logged when Timothy confirms it, not when it is proposed.
2. If the reason for a decision is unclear, ask before logging. Never guess the "why".
3. Reversed decisions are not deleted. They get a `Superseded by` line and a new entry.

## Current working version

The active site is the pixel/type alternate, iteration PX-20 (decisions 0047–0080; the Work page carries the whole index in two tiers and every visible project has an on-site case study, eight in all, per 0077; Work rows and four on-site case studies built 2026-09-09, then Timothy’s review fixes in 0067–0070 the design-system extraction in 0071, the mobile status strip and footer in 0072–0073, the Work rows without surface or plates in 0074, and the design system accepted with a light-theme text accent in 0075; Do Androids Dream replaced Pocketwatch (0055); the Work/case-study layout is still awaiting his visual review): black and white with a theme toggle, yellow as a sparse accent, colour photographs and video at their own resolution (0054), no rules, every face a bitmap design sized to one measured pixel grid (Jacquard 24, Jersey 25/15, Silkscreen, Press Start 2P), ASCII textures generated on canvas, and type that types, scrambles and steps by whole cells. Terminal chrome; the home page runs hero → one sentence (thesis + looks. moves. works. + proof + CTA) → selected work → invitation. There is no Three.js runtime. The previous city version is saved independently in `../timothyali2-city-v1-2026-09-08`.

```sh
pnpm install
pnpm dev
pnpm check
pnpm build
```

Use Node 22.12 or newer. The static build is written to `build/`. Existing case-study links still open timothyali.com. Nothing has been deployed.

Read `docs/design-system.md` for the tokens, type roles and components, `docs/alternate-v2.md` for the editing map, `docs/decision-log.md` for decisions, and `docs/iteration-log.md` for iterations with screenshots and source archives.
