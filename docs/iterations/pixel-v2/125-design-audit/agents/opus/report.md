# PX-125 design audit / opus reviewer

Method: `better-interface` in **full** mode, with all six domain skills and their reference files loaded from `~/.claude/skills/`. Project rules first: `AGENTS.md`, `docs/design-system.md`, `docs/decision-log.md` (through 0227). Read-only; nothing outside this folder was changed. Scripts, JSON and screenshots are in this folder (`sweep.mjs`, `focus.mjs`, `use-*.mjs`, `shots/`).

(Saved by the main session: the sub-agent's Write tool refused report files. Text as the agent returned it.)

## Scope and Coverage

- **Mode:** full.
- **Scope:** the built site at `http://127.0.0.1:4173`:
  - `/` and `/work/`
  - the seven visible studies: `parc`, `xrpcafe`, `firstledger`, `do-androids-dream`, `jade-aesthetics`, `firststrike`, `toolbox`
  - `/toolbox/`, its four tool pages and `/toolbox/agents/`
  - `/contact/` and `/nope/`
- **States:**
  - dark and light themes
  - motion on, motion off and `prefers-reduced-motion: reduce`
  - keyboard focus
  - the contact form empty, invalid, sending, sent and failed (send-failed, rate-limited, network), plus the no-JavaScript `?sent` / `?error` returns
  - widths 1440, 1100, 900, 700, 420, 390 and 320, with touch and with a mouse
- **Stack:** SvelteKit 2 and Svelte 5, prerendered. Plain CSS in layered files (`primitives` > `tokens` > `base` > `type` > `chrome` > `layout` > `blocks`), hex tokens, px sizes on the cell table.
- **Boundary:** `/admin/`, `/og/` and the résumé PDF are out of scope. Out of reach: a real screen reader, Safari and Firefox, Windows forced colours, the real iOS share sheet.
- **Interaction (addendum):** every page was driven with Playwright in Chrome:
  - the nav links and wordmark, all Work cards and the way back, the study and tool Next chains, the Toolbox picker and guide links, the 404's way home
  - the settings cog by mouse and by keyboard
  - hover and press on 11 control types in both themes, and the field's swell and ripple
  - Tab from the top of 12 pages
  - the contact form, with `**/api/contact**` answered by the script
  - all eight download links, with `**/download/**` answered by the script
  - the phone "send the link" control, and the CLI & MCP jump list and code blocks
  - a top-to-bottom scroll of 14 pages at 390 and at 1440

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | Focus ring on every Tab stop of 12 pages in both themes (322 stops, contrast against the ground behind each ring), skip link on 7 pages, settings menu keys, video buttons, contact form states, aria snapshots of 5 pages, reduced motion | 6 findings |
| Layout | Overflow scan of 17 pages: 7 widths in dark plus 2 in light (153 renders); touch vs mouse at 390; sticky chrome and held study text while scrolling; CLS while scrolling | 2 findings |
| Writing | All visible copy on the controls, form notes and errors, settings labels, link labels | 2 findings |
| Typography | Cell-table sizes, fit steps (`fitWord`, `fitTitles`), reading measure, input sizes, wrapping at 320 | Clear (the title that overflows at 320 is reported under Layout) |
| Colors | APCA and WCAG for every token pair (`apca.mjs`), focus ring pairs, both themes, panels | 1 finding |
| UI | Hover and press on links, CTAs, cards, the picker and downloads in both themes; motion on and off; field swell and ripple | 1 finding |

## Findings

| # | Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Accessibility | `src/lib/styles/tokens.css:47`, `src/lib/styles/base.css:27`, `src/lib/styles/blocks.css:102` | `--focus-ring:2px solid var(--accent-text);` is declared on `:root`, so `var(--accent-text)` is resolved there. `.panel{--accent-text:var(--accent-on-fg)}` no longer reaches the ring. Tabbing through `/contact/` at 1440: the ring on Name, Email, Message, Send and the three links is yellow on the white panel, **1.27:1** (dark theme), and deep yellow on the ink panel, **2.9:1** (light). Same on Toolbox's "CLI & MCP docs" in the Automate panel and on the phone "send the link" panel. Evidence: `shots/contact-name-focus-dark.png`, `shots/contact-link-focus-dark.png`, `shots/toolbox-machine-link-focus-dark.png`, `focus.json` | Resolve the ring on the element again: in `base.css` write `:focus-visible{outline:2px solid var(--accent-text);outline-offset:2px}`, or redeclare `--focus-ring` inside `.panel` | Visible focus rings (WCAG 2.4.7; 1.4.11 needs 3:1). Decision 0106 set the panel ring to deep yellow on white (5.3:1) and yellow on ink (12.2:1). The 0210 token extraction undid that on every panel, including the main conversion form. The three contact links have no other focus cue |
| 2 | MEDIUM | Colors | `src/lib/styles/tokens.css:16`, `:58` | `--dim:.55` on the dark ground, and `--dim-on-fg:.55` on the light theme's ink panel. White at 55% on ink measures **APCA Lc −40** (WCAG 5.4:1). It carries the 12.5px caps labels (study meta, captions, point counters, light-theme form labels), the status strip, the footer, the page-foot links, Toolbox download notes and the 27px option descriptions. The light ground's .65 measures Lc 70.5 | Raise the dark-ground dim to about .75 (Lc −63, 9.1:1) and the light panel's `--dim-on-fg` to match. Add `@media (prefers-contrast: more){:root{--dim:1;--dim-on-fg:1}}`. Measure again after any change | APCA needs Lc 60 for non-body text and Lc 75 for body text. It passes WCAG 2 AA, so this is a readability call against 0206 and 0210, raised because the dimmed text includes captions and descriptions people actually read |
| 3 | MEDIUM | UI | `src/lib/components/PageFoot.svelte:6-8`, `src/lib/styles/blocks.css:52`, `src/routes/toolbox/+page.svelte:98-99` | I hovered and pressed the page-foot link on all 7 studies, 4 tool pages, Toolbox and Contact. In both themes nothing changed at rest, hover or press (`bg=rgba(0,0,0,0)` in all three). The link also sits inside `.page-foot.dim`, so it rests at Lc −40. Download links light up on hover but have no press state | Give `.page-foot a` the quiet-link behaviour (accent on hover, the cell-wide accent block on `:active`), or render it with `QuietLink`. Add `.downloads .files a:active{background:var(--accent);color:var(--on-accent)}` | Decision 0099 says every link now has a press state. These are the only links that answer neither hover nor press, and the page-foot link is the last action on 13 pages |
| 4 | MEDIUM | Accessibility | `src/lib/components/Clip.svelte:55-59` | `{#if !playing}<button class="play">…{:else}<button class="pause">…{/if}`. On `/work/xrpcafe/` and `/work/do-androids-dream/` I focused "Pause video" and pressed Enter. The video paused, the button was replaced, and focus fell to `<body>`. Pressing Space next scrolled the page 860px instead of resuming. The same happens under reduced motion, starting from "Play video" | Keep one `<button>` and swap its icon and `aria-label` (or use `aria-pressed`) when `playing` flips, so the focused element survives | Full keyboard support and focus order (WCAG 2.4.3). Affects every study clip: PARC, xrp.cafe and Do Androids Dream? |
| 5 | MEDIUM | Layout | `src/routes/toolbox/+page.svelte:103`, `src/lib/styles/blocks.css:30` | On a touch phone at 390, the "Send the link to your computer ->" row has `flex-wrap:nowrap` and a label span set to `flex:none;max-width:100%`. The arrow sits at 376 to 408px, outside the 374px yellow block, and the page scrolls sideways 18px. The same happens at 360 and 320. Evidence: `shots/toolbox-390-sendon-overflow.png` | Drop `flex-wrap:nowrap`, or let the label shrink and wrap with `.on-phone .send>span:first-child{flex:1 1 auto;min-width:0}` | Plan for growth and clipping; reflow at 320 (WCAG 1.4.10). The control exists only for phone visitors, and it breaks the page for exactly them |
| 6 | MEDIUM | Layout | `src/routes/toolbox/[tool]/+page.svelte:15` | `<h1 class="display-title"><Decode text={t.name} step={STEP} /></h1>` has no `use:fitWord`. At 320, "SPECIMEN" at 41.25px is 312px wide in a 288px column. The N is clipped and the page scrolls sideways 8px. Evidence: `shots/specimen-320-title-overflow.png` | `<h1 class="display-title" use:fitWord={t.name}>`, as the study title does | Reflow at 320, and the project's rule that a title may wrap but not break a word (0079, 0207) |
| 7 | MEDIUM | Accessibility | `src/lib/components/toolbox/demo.css:92-94` | `.demo .swatch-chip{outline:1px solid var(--rim)}` outranks `:focus-visible`. When the unselected "Dark preview background" chip is focused it shows only its 1px rim (1.17:1). Evidence: `shots/toolbox-plate-chip-focus-dark.png` | Add `.demo .swatch-chip:focus-visible{outline:var(--focus-ring);outline-offset:2px}` after the `.on` rule | WCAG 2.4.7: these are the only demo controls with no visible focus |
| 8 | LOW | Accessibility | `src/routes/+layout.svelte:134-137` | `<a><b>01</b>Index</a>` gives the accessible names "01Index", "02Work", "03Contact", "04Toolbox" | `<b aria-hidden="true">01</b>` | A run-together name reads oddly, and voice control has to rely on fuzzy matching |
| 9 | LOW | Writing | `src/routes/+layout.svelte:146` | `<button aria-pressed={theme.light}>Theme [dark]</button>`: what "pressed" means is not stated | Name the ON state ("Light theme [on/off]"), or drop `aria-pressed` | Settings should describe the ON state. Motion's row already does this |
| 10 | LOW | Writing | `src/lib/components/home/Hero.svelte:84` | Home's link says "Resume" and opens a PDF; Contact's says "Resume (PDF)" | Use `label="Resume (PDF)"` on Home too | Links describe their destination; one term for one thing |
| 11 | LOW | Accessibility | `src/routes/toolbox/+page.svelte:21-28`, `:64` | "Link copied" shows as the button label for 2.4s, with no live region. When the clipboard is refused, `catch { return; }` gives no feedback at all | Add a `role="status"` region next to the button, with a failure message | Announce dynamic content; silent failure leaves the visitor guessing |
| 12 | LOW | Accessibility | `src/lib/components/ContactForm.svelte:60` | Cmd+Enter in the message field does nothing; no request is made | Submit on `(metaKey \|\| ctrlKey) && Enter` in the textarea | In a textarea, Cmd/Ctrl+Enter should submit |

## Considered but Rejected

| Location | Candidate | Rejected because |
| --- | --- | --- |
| `ContactForm.svelte:63` | Send is disabled while sending, so focus falls to `<body>` | The skill allows disabling once the request starts. The polite live region announces the result. Chrome keeps the Tab position: the next Tab after sending landed on "Resume (PDF)" |
| `toolbox/agents/+page.svelte`, `Code.svelte:26` | No copy buttons on the eleven command blocks of the CLI & MCP page | No owning rule requires them, and selecting a block copies it with its line breaks intact (checked on `#run`). Still worth a separate proposal for phone readers |
| `Hero.svelte:47-69`, `Ascii.svelte` | The typing loop and the field move for more than 5 seconds with no visible pause | The Motion toggle stops all of it site-wide, and reduced motion is honoured by default (0128, 0141, 0168). Verified: no animations run and the field stays still |
| `ContactForm.svelte:87` | Error notes use the same yellow as the Send action | This is decision 0092. Note text is ink on yellow at 12.2:1, and each note is linked to its field with `aria-describedby` and `aria-invalid` |
| `+layout.svelte:51-54` | After a route change focus is on `<body>`, not the new `<h1>` | SvelteKit's announcer reads the new title, all titles were correct after navigating, and the skip link comes first on every page |

## Verification

**Passed**

- **Sweep** (`sweep.mjs`, 153 renders):
  - no horizontal scroll anywhere except items 5 and 6
  - every page returns 200; `/nope/` returns 404 as it should
  - every page title is specific to its page
- **Focus** (`focus.mjs`, 322 Tab stops):
  - outside the panels and the plate chips, every ring is 2px at 12.2:1 (dark) or 5.3:1 (light)
  - the skip link is the first stop on every page and is visible when focused
- **Navigation and settings** (`use-nav.mjs`):
  - every nav link, the wordmark, every card, both Next chains, the Toolbox picker and guide links, and the 404's way home land correctly
  - Back restores the Work page's scroll position
  - Theme and Motion hold across client navigation and a full reload
  - the cog opens on Enter and Space; Escape closes it and returns focus to the cog
- **Hover, press and motion** (`use-hover.mjs`):
  - every other control lights to the foreground colour on hover and to the accent on press, in both themes
  - the field swells under the pointer and ripples on click
  - a double click beside the hero text selects nothing (0225)
  - under reduced motion: Motion is off, no animations run, the field doesn't react, and clips show a Play button
- **Keyboard** (`use-keys.mjs`):
  - the skip link focuses `<main>` on all 7 pages tested, and the next Tab is the first control in the content
  - the Toolbox picker works with Space and Enter
  - the CLI & MCP jump links land their headings below the chrome
- **Contact form** (`use-form.mjs`, 8 intercepted requests, none sent; `form-kb.mjs`):
  - an empty submit shows three notes, sets `aria-invalid` and `aria-describedby`, and focuses Name
  - an invalid email gets the example hint and focus
  - Sending, Sent, send-failed, rate-limited and network each show the right message in the live region, and fields are kept on failure
  - the no-JavaScript `?sent` / `?error` returns show their notes
  - inputs are 27px, so iOS won't zoom
- **Downloads and phone send** (`use-dl.mjs`):
  - all 8 download links go to `/download/v1.2.3/<file>?s=…`
  - without the share sheet, the phone send button copies `/toolbox/#download` to the clipboard
- **Scrolling** (`use-scroll*.mjs`, `hold.mjs`):
  - the header hides on scroll down and returns on scroll up
  - held study text stays under the chrome
  - CLS is 0 everywhere except Jade at 390 (0.0104, the title's fit step during font load)
- **Contrast** (`apca.mjs`): the measurements behind items 1 and 2.

**Not verified**

- Screen reader output (VoiceOver or NVDA).
- Safari, Firefox and Windows forced colours.
- `prefers-contrast: more`: the site has no rule for it to test.
- The real iOS and Android share sheet.
- Hover on real touch hardware.

## Verdict

**Block**: one HIGH finding remains (item 1, the panel focus ring). It is a one-line change in `base.css` or `blocks.css`; with it fixed, the verdict would be Needs changes.
