# Design audit brief (PX-125, 2026-10-28)

Timothy asked for a design audit of timothyali.com by three independent reviewers, each running the
`better-interface` review. You are one of them. Work alone; don't look for the others' reports.

## The method

Follow `~/.claude/skills/better-interface/SKILL.md` exactly, in **full** mode, and load the six domain
skills it names from `~/.claude/skills/better-<domain>/SKILL.md` (plus the reference files each one
points to in its own folder). Its output format is your report's format. Read-only: change no
project file.

## Scope

The public site, built and served at **http://127.0.0.1:4173** (`pnpm preview`, already running;
don't start or stop it). Every page:

`/` · `/work/` · `/work/parc/` `/work/xrpcafe/` `/work/firstledger/` `/work/do-androids-dream/`
`/work/jade-aesthetics/` `/work/firststrike/` `/work/toolbox/` · `/toolbox/` `/toolbox/lockup/`
`/toolbox/palette/` `/toolbox/specimen/` `/toolbox/convert/` `/toolbox/agents/` · `/contact/` ·
a 404 (`/nope/`).

Out of scope: `/admin/` (private), `/og/` (dev-only share images), the résumé PDF's contents.

States to cover where they exist: light and dark theme (the theme toggle), motion on and
`prefers-reduced-motion`, keyboard focus, the contact form's empty/invalid/sending/sent/failed
states (read the code for sent/failed; don't submit the real form), and widths 1440, 1100, 900,
700, 420, 390 and 320.

## The project's rules come first

Read `AGENTS.md`, then `docs/design-system.md`. `docs/decision-log.md` is the source of truth when
docs disagree; the newest explicit decision wins. This is a deliberate pixel/type system: bitmap
faces on a measured cell grid, black and white with a theme toggle, yellow as a sparse accent, no
rules or borders, no eyebrow labels, generated ASCII/dither fields, terminal chrome.

A finding that would reverse a recorded decision is not a finding: put it under **Considered but
Rejected** with the decision number, unless the decision causes a real accessibility failure
(contrast, focus, names, keyboard, reduced motion, zoom/reflow), in which case report it and cite
the decision it conflicts with. Font sizes must stay on the cell table at the top of
`src/app.css`; don't recommend off-table sizes.

## Evidence

Inspect the rendered pages, not only the source. Playwright is installed in the repo
(`import { chromium } from '@playwright/test'`, `chromium.launch({ channel: 'chrome' })`); write
any scripts and screenshots inside your own folder below, never elsewhere in the repo. Every
finding cites `path/to/file:line` and the current code, as the skill requires, plus the page and
width where you saw it.

## Output

Write your report to `docs/iterations/pixel-v2/125-design-audit/agents/<you>/report.md`, where
`<you>` is `opus`, `fable` or `codex-sol`, in the skill's format (Scope and Coverage, Findings, at most 15,
Considered but Rejected, Verification, Verdict). Keep screenshots you cite in the same
folder. Plain English; no em dashes.

## Addendum: use the site, not only screenshots (Timothy, 2026-10-28)

Click around like a visitor, with Playwright driving a real page (headed or headless), and report
what happens. At least:

- Every nav link, the Work cards, study links, the Toolbox tool links and back, the 404's way home.
- The theme toggle and the settings cog (every option in it), and that the choice holds across pages.
- Hover and press states on links, CTAs and cards; the pointer's swell/ripples on the fields.
- Keyboard only: Tab through each page from the top (skip link, focus order, visible focus, Enter
  and Space on every control, Escape on anything that opens).
- The contact form: type, tab, submit empty, submit invalid, fix it (stop before a real send:
  intercept `**/api/contact**` with `page.route` and answer it yourself for sent and failed).
- The Toolbox page's download links (intercept `**/download/**`; don't download), the "send the
  link to your computer" control on a phone width, and the copy/command controls on the CLI & MCP page.
- Scroll each page top to bottom at 390 and 1440: sticky or pinned parts, anything that jumps.

Findings from interaction cite what you did, what happened and what should have happened.
