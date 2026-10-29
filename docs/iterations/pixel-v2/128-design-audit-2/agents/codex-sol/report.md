# Design audit 2 / codex-sol

**Needs changes: four medium findings and two low findings. No high findings.**

## Scope and Coverage

**Full mode.** Independent review using `~/.claude/skills/better-interface/SKILL.md`, all six domain skills and their local references. Read `AGENTS.md`, the design system and relevant decisions through 0230. No other reviewer's report or round 1 report was opened.

Stack: Svelte 5, SvelteKit 2, shared plain CSS layers, project color tokens and bitmap cell table. Recommendations preserve the pixel system.

All 17 public routes inspected:

- `/`, `/work/`, `/contact/`, `/nope/`.
- Studies: `/work/parc/`, `/work/xrpcafe/`, `/work/firstledger/`, `/work/do-androids-dream/`, `/work/jade-aesthetics/`, `/work/firststrike/`, `/work/toolbox/`.
- Toolbox: `/toolbox/`, `/toolbox/lockup/`, `/toolbox/palette/`, `/toolbox/specimen/`, `/toolbox/convert/`, `/toolbox/agents/`.

Every route captured at **1440, 1100, 900, 700, 420, 390 and 320px**, in both themes. Also checked 720px as a 200% reflow simulation. Desktop viewport height: 960px. Touch checks used 390 × 844 and demo checks used 900px height.

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | Every page's Tab sequence; skip links; settings; form validation and intercepted replies; all demo controls; video play/pause; field gestures and reduced motion; names and roles | 3 findings: #2, #4, #5 |
| Layout | All routes and required widths, both themes; top-to-bottom scrolling at 1440 and 390; touch demo and share states | 1 finding: #3 |
| Writing | All public page text; settings, demo labels, form errors and recovery; tool and CLI instructions | 1 finding: #6 |
| Typography | Rendered titles, paragraphs, captions, commands, inputs and narrow wrapping; cell-table and reading-face rules | Clear |
| Colors | Runtime theme tokens, composited secondary text, focus indicators, poster pixels, increased contrast and forced colors | 1 finding: #1 |
| UI | Hover and held press on cards, CTAs, text links and downloads; theme wipe at 10% speed; fields, demos and video controls | Clear beyond findings owned above |

## Findings

| # | Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | MEDIUM | colors | `src/lib/styles/base.css:27`; `src/lib/components/Clip.svelte:65`.<br>**Pages:** PARC, xrp.cafe and Do Androids Dream studies, **390px**, both themes | `:focus-visible{outline:var(--focus-ring);outline-offset:2px}` plus `.play:focus-visible{background:var(--accent);color:var(--on-accent);opacity:1}` within the combined selector. The ring sits over the poster. | Give focused media buttons an opaque paper ground and draw the accent ring inside it, with a foreground icon. Verify the complete ring at **3:1 or better**. | Focused each play button with motion off. On PARC's dark poster, yellow `#f2d600` against sampled sky `#81ccea` is **1.22:1**; sampled perimeter pairs range **1.12–1.61:1**. xrp.cafe also fails in light mode: deep yellow `#6f6200` against blue `#1379f8` is **1.50:1**. This is a real focus-contrast exception to decision **0106**, not a request to replace its accent. [Screenshot](media-focus-parc-dark.png), [pixel evidence](media-focus.json). |
| 2 | MEDIUM | accessibility | `src/routes/work/[slug]/+page.svelte:173`; `src/routes/contact/+page.svelte:15`, `:48`.<br>**Pages:** `/work/xrpcafe/`, **390px**; `/contact/`, **900 and 1100px** | `.meta{order:1;padding:var(--s4) var(--gutter) 0}` and `.contact-foot{order:2}` visually move content while its controls retain the earlier DOM position. | Match the interactive DOM order to the visible sequence. Keep the phone study's image-first layout from **0206** and Contact's stacked layout. Avoid positive `tabindex`. | Tab from Settings reaches xrp.cafe's Live link at scroll **1148**, then jumps back to Play at **420**. Contact reaches the bottom “See my work” link before the Name field above it. Expected focus follows the visible content. [Recorded sequence](followup.json), [Live](order-work_xrpcafe_390-7.png), [next Tab](order-work_xrpcafe_390-8.png). |
| 3 | MEDIUM | layout | `src/routes/toolbox/+page.svelte:30`, `:68`, `:110`.<br>**Page:** `/toolbox/`, **320px touch**, clipboard and share refused | Failure label: `Couldn’t copy. The address is timothyali.com/toolbox`.<br>`.on-phone :global(.send>span:first-child){flex:1 1 auto;min-width:0}` has no way to break the address. | Keep the action label short. Put the fallback address in a separate, breakable status message, or apply `overflow-wrap:anywhere` to the failure text. | Denied both browser APIs, then activated Send. The layout viewport expanded from **320 to 350px** and the arrow clipped at the right edge. The recovery state should retain the normal 320px layout. [Screenshot](send-link-failed-320-touch.png), [state data](demos-320-touch.json). |
| 4 | MEDIUM | accessibility | `src/routes/toolbox/+page.svelte:31`.<br>**Page:** `/toolbox/`, **390px touch**, also reproduced at 320 and 900px | `setTimeout(() => (sent = ''), 4000);` clears success and failure alike. | Clear only the low-stakes success confirmation automatically. Keep failure and its fallback address visible until retry or dismissal. | With share and clipboard rejected, the error appeared, then both the visible label and live status cleared after four seconds. Slow readers lose the recovery instruction. The fallback and announcement added in **0228** should remain. [Recorded immediate/after states](demos-390-touch.json). |
| 5 | LOW | accessibility | `src/lib/components/toolbox/PaletteDemo.svelte:61`.<br>**Page:** `/toolbox/`, Palette demo, **1440, 390 and 320px** | `onclick={() => colors.splice(i, 1)}` removes the focused Remove button without choosing a new focus target. | Focus the next color's field after removal, or Add color when removing the last row. | Added a color, focused “Remove color 5” and pressed Space. Focus moved to `BODY`, leaving no visible focus indicator. The next Tab does reach Add color, so this is limited disruption rather than a blocked flow. [Evidence](followup.json), [demo states](demos-1440.json). |
| 6 | LOW | writing | `src/lib/toolbox.ts:111`.<br>**Page:** `/toolbox/convert/`, **1440 and 390px** | “On both platforms it reads PNG, JPEG, WebP, GIF, BMP, ICO, AVIF, and SVG.” | “It reads PNG, JPEG, WebP, GIF, BMP, ICO, AVIF, and SVG.” | The same page offers macOS, Windows and Linux. “Both” leaves the supported pair unclear. Removing the count preserves the stated format support and macOS exceptions without adding a new claim. [Rendered copy](copy-toolbox_convert_390-dark.png). |

## Considered but Rejected

| Location | Candidate | Rejected because |
| --- | --- | --- |
| `src/app.css`; `src/lib/styles/type.css` | Replace bitmap faces, add smoothing everywhere, or choose arbitrary intermediate sizes | The cell grid and type families are deliberate: **0046, 0078, 0089**. Study reading uses Plex Mono under **0136–0137**. Rendered wrapping stayed usable at the required widths. |
| `src/lib/styles/blocks.css`; `src/lib/styles/chrome.css` | Add image borders, rounded cards, eased icon swaps or scale-on-press | Conflicts with **0047** and the instant accent press language in **0099–0100**. Existing static hover and press cues are visible. |
| `src/lib/components/Ascii.svelte` | Remove drag, prevent text selection across the whole page, or disable fields unconditionally | **0225 and 0230** explicitly retain selectable content and add bare-field dragging. Cross-text drags selected nothing, subsequent links worked, motion-off and reduced-motion canvases stayed unchanged, and touch swipes scrolled. |
| `src/lib/styles/tokens.css` | Raise all secondary text opacity again | **0228** deliberately sets these levels. Measured normal-text contrast is **9.07:1** on dark and **5.21:1** on light; label APCA magnitudes are **63.5 and 70.4**. Increased contrast removes dimming. No new failure established for these tokens. |

## Verification

**Executed against the existing preview only.** Own browsers launched with `chromium.launch({ channel: 'chrome' })`. No server start, stop, build, source edit, commit or push.

| Check | Exact command or interaction | Observed result |
| --- | --- | --- |
| Route and viewport coverage | `node docs/iterations/pixel-v2/128-design-audit-2/agents/codex-sol/browser.mjs`; `tasks.scan(width, theme)` for every required pair | **238 distinct required page/width/theme states**, plus 720px checks. No default-state page-wide overflow. Honeypot coordinates were excluded from findings. [Survey](survey.json) |
| Scrolling | Scrolled each route in 740px steps to the bottom and back at 1440 and 390, both themes | Content, study sticky text and footer actions remained reachable. No pinned-stage trap observed. Full-page captures and bottom captures are in this folder. |
| Links | `actions.links(1440)` and `actions.links(390)`; all nav links, Home and Work cards, study links, tool guides, Next/back, jumps and 404 home | **175 link checks per width**. Pointer-hidden skip links were subsequently tested using Tab and Enter on every page. External destinations were intercepted after activation. [Desktop and form evidence](interactions-desktop-and-contact.json), [phone links](interactions.json), [skip rerun](followup.json) |
| Keyboard and settings | `tasks.keyboard(1440)`, `tasks.keyboard(390)`, `followup.run()`, `keyboardControls.run()`; Tab from top, Enter/Space, native controls, Escape | Skip link focuses `main`; settings open, operate and close with focus restored. Both choices survive navigation. **143 demo control checks** covered enabled buttons and native inputs. Findings #2 and #5 remain. [Tab traces](keyboard-390.json), [controls](keyboard-controls.json) |
| Contact | `actions.contact(1440)` and `(390)`; empty submit, invalid email, correction, delayed failure, retry with Cmd+Enter and success | Empty/invalid focus and inline errors work. Sending retains focus and announces state. Failure preserves values; success resets them. All requests answered by `page.route('**/api/contact', ...)`. **No real send.** Error and sent code paths also read. |
| Toolbox | `node docs/iterations/pixel-v2/128-design-audit-2/agents/codex-sol/run-demos.mjs` | Tested tool picker, Lockup review/back and tree, palettes and file previews, specimen template/family, conversion formats/size/compression, all eight intercepted download requests, and phone copy success/failure. Guide option disclosures work with Enter and Space. Findings #3–#5 remain. |
| CLI commands | Selected every command/JSON block and used Cmd+C; read clipboard | All nine blocks copy usable commands and line breaks. This page currently has **no copy buttons**. No terminal command was executed. [Copied text](followup.json) |
| Fields | `gestures.run()`, `finalChecks.crossText()`, `gestures.touch()` | All **11 field pages**: drag, hold 1.55s, release; cross text and links; no selected text; navigation still works. Canvases changed with motion on and stayed identical with motion off or reduced motion. At 390px, touch swipes scroll every scrollable field page. The 404 fits one screen. [Gestures](gestures.json), [cross-text](cross-text.json), [touch](touch-swipes.json) |
| Motion and video | `motionCheck.run()`; slowed theme animations to playback rate `0.1`; Enter to play and Space to pause all three study clips | Theme wipe inspected at 10% speed. Video button focus survives play/pause. Static and no-JavaScript page content remains available. [Motion](motion-check.json), [video and no-JS results](final-checks.json) |
| Colors | `node docs/iterations/pixel-v2/128-design-audit-2/agents/codex-sol/contrast.mjs`; `mediaFocus.run()`; forced-colors and increased-contrast emulation | Main text **15.44:1**, action text **12.20:1**, paper/panel accent rings **5.32:1 or 12.20:1**. Forced colors retains a 2px ring and increased contrast sets dimming to 1. Poster focus exceptions are finding #1. [Measurements](contrast.json), [poster samples](media-focus.json) |

**Not verified:** native browser 200% zoom, VoiceOver or another human screen-reader session, Safari/Firefox, real installer payloads, native OS share sheets, real email delivery and external destination content. The 720px reflow simulation passed; the headless browser did not change native zoom when sent the zoom shortcut. Clipboard/share refusal and success were browser-controlled fixtures.

## Verdict

Needs changes
