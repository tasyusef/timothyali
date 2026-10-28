# PX-125 design audit / codex-sol

## Scope and Coverage

**Full review. Six actionable findings: 0 HIGH, 6 MEDIUM, 0 LOW.**

Reviewed the public build at `http://127.0.0.1:4173`, including Timothy's interaction addendum. Worked independently. Applied `~/.claude/skills/better-interface/SKILL.md`, all six domain skills and their reference files. Project instructions, the design system and current decisions took precedence.

Pages: `/`, `/work/`, `/work/parc/`, `/work/xrpcafe/`, `/work/firstledger/`, `/work/do-androids-dream/`, `/work/jade-aesthetics/`, `/work/firststrike/`, `/work/toolbox/`, `/toolbox/`, `/toolbox/lockup/`, `/toolbox/palette/`, `/toolbox/specimen/`, `/toolbox/convert/`, `/toolbox/agents/`, `/contact/`, `/nope/`.

Stack: Svelte 5 and SvelteKit 2, plain CSS, shared primitive and semantic tokens, bitmap cell-table type, IBM Plex Mono for study reading, canvas fields and stepped motion. Recommendations retain those conventions.

- **Rendered matrix:** all 17 pages at 1440, 1100, 900, 700, 420, 390 and 320px, both themes, with reduced motion. Reused the 238 saved first-screen captures and full-page evidence; rebuilt the interrupted measurements in [scan.json](scan.json).
- **Motion:** another 238 live page/width/theme checks with motion enabled. Reduced-motion field comparison, video playback/pause, real pointer interaction and a theme transition slowed to 10% speed.
- **Visitor flows:** actual clicks, keyboard traversal and top-to-bottom wheel scrolling at 390 and 1440px. The 390px visitor context also used touch/coarse-pointer emulation, which exposed a problem absent from narrow desktop screenshots.
- **Contact:** empty, invalid, corrected, sending, sent, server-failed and network-failed paths. Every send was intercepted and answered locally. No real message was sent.
- **Boundaries:** no private admin, dev-only OG pages or résumé contents. No source changes, build, server restart or git commands. Audit scripts and evidence stay in this folder.

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | All pages' Tab order; skip links; settings; demo switches, buttons, ranges and selects; accessible names; video controls; contact validation and responses; coarse-pointer hit tests; reduced motion; forced colors | 4 findings: #1, #2, #4, #5 |
| Layout | All seven widths and both themes; every page scrolled at 390 and 1440; study sticky text; phone download panel; expanded options | 1 finding: #3 |
| Writing | Rendered page copy, labels, guide navigation, command instructions, form errors and recovery messages, download and 404 copy | Clear |
| Typography | Loaded faces and cell-table ladder; title wrapping; study paragraphs and captions; commands, options and phone text | 1 finding: #6 |
| Colors | Both themes, panel inversion, hover/press states, text and focus tokens; measured rendered focus/background pairs | Focus contrast consolidated under Accessibility #1; no separate finding |
| UI | Live hover/press feedback, settings states, field swell/ripples, video controls, demo state changes and slowed dither transition | Clear; focus transfer consolidated under Accessibility #4 |

## Findings

Ordered by user impact and shared-component reach. Each interaction row states the action, observed result and expected behavior.

| # | Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | MEDIUM | Accessibility | `src/lib/styles/tokens.css:47`; `src/lib/styles/base.css:27`; `src/lib/styles/blocks.css:102`. `/contact/`, 390 and 1440, both themes; also the inverted Automate panel on `/toolbox/`. | Root declares `--focus-ring:2px solid var(--accent-text)`. `.panel` changes `--accent-text` but inherits the already-resolved ring. **Action:** focus a contact input by keyboard. **Observed:** dark theme draws `#f2d600` against `#efefeb`, **1.27:1**; light draws `#6f6200` against `#181814`, **2.90:1**. [Dark evidence](contact-focus-390-dark.png), [light evidence](contact-focus-390-light.png), [computed values](visitor.json). | Resolve the focus token again on the inverted surface, for example `.panel{--focus-ring:2px solid var(--accent-text)}`. Keep the existing 2px outline and offset. The intended pairs are **5.32:1** and **12.20:1**. | The entire input outline sits on the panel and misses the 3:1 non-text state contrast requirement. Expected: a clearly distinguishable focus ring in either theme. This is a regression against **0106**, which explicitly rejected yellow focus on white; **0210**'s token abstraction does not preserve that behavior. |
| 2 | MEDIUM | Accessibility | `src/lib/components/toolbox/demo.css:167`; `src/lib/components/toolbox/LockupDemo.svelte:105`; `src/lib/components/toolbox/PlateToggle.svelte:9`. `/toolbox/`, Lockup, 390px touch. | Swatches are 32px squares with an 8px gap; each gets `::after{inset:-10px}` on touch. Their 52px targets overlap by 12px. **Action:** tap x=227, y=416, inside the visible Light swatch. **Observed:** the Dark button receives the tap and its pressed state becomes true. [Hit-test log](verification.json), [capture](swatch-overlap-confirmed-390.png). | Use distinct 48px target boxes with the existing 8px gap, or constrain the extensions so they cannot overlap. Expected: every point inside the Light swatch selects Light. | A neighboring target steals part of the visible control. The enlargement from **0206** needs a collision check; larger targets must remain unambiguous. |
| 3 | MEDIUM | Layout | `src/routes/toolbox/+page.svelte:103`; `src/lib/styles/blocks.css:30`. `/toolbox/#download`, 320 and 390px touch. | Phone sharing action uses `flex-wrap:nowrap`; both child spans inherit `flex:none`. **Action:** scroll to Download on a touch viewport. **Observed:** at 390px, the button ends at x=374 but its arrow extends to x=408; page width becomes 408px. At 320px it becomes 338px. [Capture](phone-cta-overflow-390.png), [geometry](phone-overflow.json), [width sweep](targeted.json). | Let the label shrink and wrap inside the remaining space, for example `.on-phone .send>span:first-child{flex:1;min-width:0}`, with the arrow retaining its fixed width. Expected: the entire action fits the phone gutter without sideways panning. | The phone-only control creates horizontal overflow and places its arrow outside its background. It also fails 320px reflow. Keep **0206**'s phone handoff action; repair its flex allocation. |
| 4 | MEDIUM | Accessibility | `src/lib/components/toolbox/LockupDemo.svelte:21`; `src/lib/components/toolbox/LockupDemo.svelte:95`. `/toolbox/`, 390 and 1440px. | Continue executes `step = 'review'; review(e.currentTarget)`, then is replaced by a disabled Export button. `review()` only schedules scrolling through the outgoing element's `closest('.demo')`. **Action:** focus Continue and press Enter. **Observed:** focus becomes `BODY`; the next Tab lands on **CLI & MCP docs**, beyond the new Review tree and package-name field. [Interaction log](visitor.json), [after next Tab](lockup-after-continue-390.png). | Capture a stable demo/review reference before changing state. After rendering, focus the Review heading or its first useful control and position that stable element in view. Expected: keyboard navigation continues through the newly opened Review content. | Advancing the wizard abandons the relevant controls instead of taking the reader into the result. The existing scroll repair in **0206** does not supply focus transfer and depends on a detached trigger. |
| 5 | MEDIUM | Accessibility | `src/lib/components/toolbox/demo.css:157`; `src/lib/components/toolbox/LockupDemo.svelte:91`. `/toolbox/`, 320, 390 and 420px. | `.demo .steps button span{display:none}` hides Upload, Outputs and Review from the accessibility tree. **Action:** Tab to the steps and inspect their accessible names. **Observed at 390px:** the group contains buttons named only **01**, **02**, **03**. At 1440px they include their words. [Accessibility snapshots](controls.json), [phone Review](lockup-keyboard-review-390.png). | Keep the words available with the existing `.sr-only` pattern at this breakpoint, or provide names containing both the visible number and full step label. Expected names: “02 Outputs” and “03 Review”. | Numbers convey order but do not identify the destination. Retain **0206**'s compact visual treatment while preserving usable control names. |
| 6 | MEDIUM | Typography | `src/routes/toolbox/[tool]/+page.svelte:15`; `src/lib/styles/type.css:64`. `/toolbox/specimen/`, 320px, both themes and motion modes. | Tool titles render `<h1 class="display-title">` without the study title's `fitWord` action. At 320px, the 41.25px Specimen word is 312px wide inside a 288px content area. **Action:** open the guide at 320px. **Observed:** its right edge reaches x=328 and the page scrolls sideways. [Capture](toolbox-specimen-320-dark-top.png), [matrix measurements](scan.json). | Apply the existing title-fitting action to tool titles. Use the next **on-table 27.5/32** step when the word does not fit. Expected: the whole title remains within the gutter at 320px. | A supported narrow width clips the page's identifying word and fails reflow. The current cell table already provides the required size; no off-table font size or identity change is needed. |

## Considered but Rejected

| Location | Candidate | Rejected because |
| --- | --- | --- |
| `src/lib/styles/type.css`; public pages | Replace the bitmap faces, smooth them globally, or use generic type sizes and line-height recipes | The identity and measured glyph cells are explicit decisions **0078**, **0089**, **0137**. Study reading already has its own plain face. Findings preserve the table and identify actual failures instead. |
| `src/lib/styles/blocks.css`; cards and figures | Add image outlines, card borders or separator rules for depth | This would reverse **0047** and **0196**. Rendered grouping works through space, the dither mat and shared edges. No observed accessibility failure justifies new rules. |
| `src/lib/components/Ascii.svelte`; Home and study scenes | Remove the fields, replace the stepped feedback with eased scale effects, or flatten the portrait hero | Decisions **0099**, **0100**, **0179**, **0203** and **0217** establish this behavior. Live pointer tests worked, reduced motion stayed static and videos had operable pause controls. Generic motion recipes would reverse the direction. |
| `src/lib/components/Code.svelte`; `/toolbox/agents/` | Require copy buttons on every command | There are no copy controls to test. Actual text selection plus Command-C copied the complete shortcut correctly at both widths, including quotes and spaces. No demonstrated failure warrants another control. Commands already wrap under **0200**. |
| `src/routes/toolbox/+page.svelte:24`; phone sharing | Treat the headless browser's uncompleted native share sheet as a broken button | The real click invoked `navigator.share` with the correct URL. The OS sheet cannot be completed in this run. With Web Share unavailable, a real click copied the correct URL and displayed “Link copied”. Native sharing remains a verification boundary, not a finding. |

## Verification

**Completed checks**

All commands below were run from the repository root with Playwright's installed Chrome channel. They write only within this audit folder.

| Command or interaction | Observed result |
| --- | --- |
| `METADATA_ONLY=1 node docs/iterations/pixel-v2/125-design-audit/agents/codex-sol/scan.mjs` | 238 static page/theme/width measurements. No page errors or broken images. Only Specimen at 320px overflowed in the fine-pointer matrix. Saved captures were reused. |
| `node docs/iterations/pixel-v2/125-design-audit/agents/codex-sol/verify.mjs` | 238 motion-enabled checks, all with motion on. Tabbed all 17 pages from the top at both 390 and 1440; no offscreen or aria-hidden stops in the default states. Reduced-motion Home canvas stayed identical under pointer movement; motion-on canvas changed. PARC, xrp.cafe and Androids clips advanced and paused through their controls. |
| `node docs/iterations/pixel-v2/125-design-audit/agents/codex-sol/visitor.mjs` | Clicked all four nav destinations, all seven Work cards and four Home cards at both widths; followed visible study links and all four tool guides and their return links; used the 404's home action. Internal destinations matched. External study destinations were intercepted after activation. |
| Same visitor run, wheel scrolling | Scrolled every page top to bottom at 390 and 1440. All 34 passes reached a visible footer. Study text held beside its images on desktop where it fit; phone reading remained in flow. Header collapse left the desktop readout visible. No additional stuck section or jump was found during these passes. Midpoint and bottom screenshots are retained. |
| Same visitor run, settings and feedback | Opened the cog with Enter; changed Motion and Theme with Space; Escape closed it and restored focus. Both choices persisted through client navigation. Hover and held press on a CTA, quiet link and card produced the system's foreground/accent feedback. Mouse movement and a click changed the field's swell/ripple rendering. |
| Same visitor run, contact | Empty submission focused Name; invalid email focused Email with linked inline errors. Corrected each form, intercepted `**/api/contact**`, delayed the reply to inspect Sending, then fulfilled success/failure or aborted for network failure. One intercepted request per valid test. Success reset the form; both failures retained the message and gave recovery instructions. Six intercepted send scenarios, zero real sends. |
| Same visitor run, downloads and commands | Activated all eight download links at each width, intercepting `**/download/**` with 204 responses: 16 intercepted requests, no downloads. Used all eight CLI jump links. Selected and copied the complete macOS shortcut at both widths. |
| `node docs/iterations/pixel-v2/125-design-audit/agents/codex-sol/controls.mjs` and `targeted.mjs` | Operated demo switches and format buttons with Space/Enter, ranges with arrows, native font selects, name/sample inputs, Review/Back, all six Palette previews and all nine Specimen size choices. Native option disclosures opened with Enter and closed with Space. Found the mobile step-name loss and overlapping swatch targets. Forced-colors input focus remained visible. |
| `targeted.mjs`, phone handoff and motion | Invoked native sharing with the correct page URL; separately exercised the clipboard fallback, which displayed “Link copied” and copied `/toolbox/#download`. Swept touch widths 320 through 1440, confirming #3 only at 320 and 390 in that sweep. Measured the four focus contrast pairs above. Inspected theme dither at 0.1 playback rate; reduced motion had no active transition animations. |
| No-JavaScript checks in `verify.mjs` | Home, Toolbox, PARC, Contact and the 404 rendered readable content and links at 390px. This was a supplemental sample, not an all-page no-JavaScript claim. |

`node docs/iterations/pixel-v2/125-design-audit/agents/codex-sol/final-flows.mjs` completed the remaining tool-page Next, download-section and CLI-setup links, plus the four CLI option links, at both widths: **40 link activations**. All **34 skip-link activations** focused `main`. Theme and Motion survived both reload and subsequent navigation at 390 and 1440. Additional desktop Palette previews and Specimen controls passed. See [final results](final-flows.json).

**Not verified**

- Native OS share-sheet completion and receipt on another computer.
- VoiceOver/NVDA announcements. Accessible names, roles, states and error relationships were inspected in Chrome; this is not a screen-reader certification.
- Actual 200% browser zoom. Four Command-plus shortcuts left headless Chrome at 1440px and DPR 1, so this run does not establish browser-zoom behavior. The complete 320px reflow matrix was checked separately.
- Real mail delivery, external site availability and installer contents were deliberately not exercised. Their UI paths were activated with interception as specified.
- Source edits and remediation tests are outside this read-only audit. No build or project test command was run.

## Verdict

Needs changes
