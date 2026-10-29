# PX-128 design audit, round 2: opus

Reviewer: opus. Date: 2026-10-28. Read-only: nothing outside this folder was changed.

## Scope and Coverage

- **Mode:** better-interface, full, with its six domain skills.
- **Scope:** every page on the running preview at http://127.0.0.1:4173:
  - `/`, `/work/` and the seven studies;
  - `/toolbox/`, its four tool pages and `/toolbox/agents/`;
  - `/contact/` and the 404 at `/nope/`.
- **Out of scope:** `/admin/`, `/og/` and the résumé PDF's contents.
- **Stack:** SvelteKit with Svelte 5 runes and plain CSS in `src/lib/styles/`, on bitmap faces sized from the cell table.
- **Browser:** my own Playwright Chrome (`chromium.launch({ channel: 'chrome' })`). The preview server was not touched.
- **States covered:**
  - widths 1440, 1100, 900, 700, 420, 390 and 320;
  - dark and light theme;
  - motion on, `prefers-reduced-motion`, and Motion off in the cog;
  - keyboard Tab and Shift+Tab;
  - touch emulation at 390;
  - `forced-colors: active`;
  - WCAG 1.4.12 text spacing.
- **Scripts and logs:** all in this folder (`*.mjs`, `*.log`, `*.json`). Screenshots are in `shots/`.

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | Tab and Shift+Tab on all 17 pages at 1440, 900 and 390 (`keys.mjs`, `obscured.mjs`); accessibility tree names (`axnames.mjs`, `contact.mjs`); landmarks and headings (`semantics.mjs`); forced colors; reduced motion; touch hit areas (`targets.mjs`) | 4 findings (1, 2, 4, 5) |
| Layout | Overflow on 17 pages × 7 widths × 2 themes (`sweep.mjs`); content clipped inside panels (`contactlinks.mjs`); layout shift while scrolling at 390 and 1440 (`scroll.mjs`); anchor landings | 1 finding (6), plus a second location in finding 1 |
| Writing | Labels, errors, empty and failed states, link text, the 404 | Clear |
| Typography | Cell-table sizes, heading names, measure on studies, text spacing | Clear |
| Colors | Rendered text contrast on every page in both themes (`sweep.mjs`); focus ring colours; hover and press colours (`hover.mjs`, `press.mjs`) | 1 finding (3) |
| UI | Hover, press, the cog, the tool picker, the field swell and drag (`drag.mjs`, `motionoff.mjs`), the phone send control (`sendon.mjs`), CLI copy (`copy.mjs`) | 1 finding (7) |

## Findings

| # | Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Accessibility | `src/lib/styles/chrome.css:6` and `src/lib/styles/base.css:20` | `.nav-chrome{position:sticky;top:0;...}`, with no `scroll-padding-top` anywhere (`base.css:20` only sets `:root:has(.site.motion){scroll-behavior:smooth}`) | Add `:root{scroll-padding-top:var(--chrome-height)}` in `base.css`. Then check that the in-page anchors (`#work`, `#tools`, the agents jump links, which already have `scroll-margin-top:var(--s4)`) still land where intended. | **Shift+Tab up a page puts the focused control under the sticky header** (WCAG 2.4.11).<br>What I did: Shift+Tab from the end of each page, then measured how much of the focused element sat under `.nav-chrome` (`obscured.mjs`).<br>At 1440 on Home:<br>- "Resume (PDF)": 100% covered;<br>- "Selected work": 94% (motion off) and 100% (motion on).<br>On `/toolbox/`:<br>- the Lockup demo's format chips: 66 to 100% covered;<br>- "Explore the tools": 79% covered.<br>Expected: the ring stays visible below the header. See `shots/obscured-1440-no-preference_.png`: focus is on "Resume (PDF)" and nothing visible has a ring.<br>The same cause shows at 390: "Download for macOS..." on a tool page opens `/toolbox/#download` with the "v1.2.4" label under the 104px header. |
| 2 | HIGH | Accessibility | `src/lib/components/ContactForm.svelte:78`, `src/lib/styles/blocks.css:26`, `src/lib/styles/chrome.css:24`, `src/routes/toolbox/+page.svelte:88`, `src/lib/components/toolbox/demo.css:55` | `input,textarea{...border:0;...background:var(--paper)}`; `.cta{...background:var(--accent)...}`; `nav a[aria-current]{background:var(--accent)...}`; `.tool-picker button[aria-pressed=true]{background:var(--accent)...}`; `.demo .chip[aria-pressed=true]{background:var(--accent)...}`. No `forced-colors` rule anywhere in `src`. | Add one `@media (forced-colors: active)` block in `base.css`. It is invisible in normal rendering, so the no-borders rule (0047) stands.<br>- `input,textarea,.cta,.cta-row,.chip,.tool-picker button{outline:1px solid CanvasText}` (or a 1px border);<br>- `[aria-current],[aria-pressed=true]{forced-color-adjust:none;background:Highlight;color:HighlightText}`. | **In Windows High Contrast, background-only boundaries and states disappear.**<br>What I did: loaded the pages with `forcedColors:'active'` (`misc.mjs`). What happened:<br>- the Name and Message fields are invisible until focused (`shots/forced-colors-contact-1440.png`);<br>- Send reads as plain text;<br>- the current nav item looks like the others (`shots/forced-colors-work-1440.png`);<br>- the selected tool and the "on" format chips are indistinguishable (`shots/forced-colors-toolbox-1440.png`).<br>Expected: fields, buttons and the selected state remain visible in system colours. |
| 3 | MEDIUM | Colors | `src/lib/styles/blocks.css:91` with `blocks.css:65` | `.card:active{background:var(--accent);color:var(--on-accent)}`, while `.card-body{...background:var(--paper)...}` keeps its own ground | Keep the body's own text colour while pressed: `.card:active .card-body{color:var(--fg)}`. Only the frame takes the accent, as it already does in light. | **In dark theme a pressed card's title and description vanish.**<br>What I did: held the mouse down on the first card on `/work/` and `/` at 1440 and 390 (`press.mjs`). The card body read `color=rgb(24,24,20) bg=rgb(24,24,20)`: ink on ink, a 1:1 ratio (`shots/press-card-dark-1440_work_.png`).<br>Light theme only works because `--on-accent` equals `--fg` there. Every tap on a phone in dark theme flashes the text away, and a long press leaves the card blank. |
| 4 | MEDIUM | Accessibility | `src/routes/contact/+page.svelte:45-48` and `src/routes/work/[slug]/+page.svelte:173` | Contact at 701 to 1100: `.contact-copy{display:contents}` `.contact-note{order:1...}` `.contact-foot{order:2}`. Study at 700 and below: `.meta{order:1;...}` | Make DOM order match what is shown.<br>- Contact: put `.contact-foot` after `.contact-note` in the markup. At desktop, place it with `grid-template-areas:"copy note" "foot note"`.<br>- Study: render the hero gallery before the `dl.meta` on phones, or as a minimum add `main.study{reading-flow:flex-visual}` (Chrome only). | **Focus order differs from the visual order** (WCAG 2.4.3).<br>What I did: Tab from the top (`keys.mjs`, `keys-Tab.json`).<br>- At 900 on Contact: focus goes to "See my work" (y 1136, under the form) before the Name field (y 688).<br>- At 390 on xrp.cafe: focus goes to the "xrp.cafe" Live link (y 1616) and then jumps back up to the clip's Pause button (y 868).<br>Expected: focus moves down the page in reading order. |
| 5 | LOW | Accessibility | `src/lib/components/ContactForm.svelte:60-62` | `<label class="field"><span class="lbl dim">Email</span><span class="box"><input ... aria-describedby="email-note" .../></span>{#if notes.email}<span class="lbl note" id="email-note">...</span>{/if}</label>` | Move each note out of the `<label>`. For example, wrap the field in a `div.field`, close the `<label>` after `.box`, and put the note after it. `aria-describedby` already points at it. | **Errors are heard twice.**<br>What I did: submitted with an invalid email and read the accessibility tree (`contact.mjs`).<br>The input's name became "EMAIL THAT DOESN’T LOOK LIKE AN EMAIL ADDRESS. TRY SOMETHING LIKE NAME@EXAMPLE.COM." and its description repeated the same sentence. Expected: name "Email" and description the error. Seen at 1440 and 390, both themes. |
| 6 | LOW | Layout | `src/routes/contact/+page.svelte:35` with `src/lib/styles/blocks.css:38` | `.contact-links{display:flex;flex-wrap:wrap;...}` holding `.quiet-link{display:inline-flex;...}`, whose email label cannot break | `.contact-links .quiet-link{flex-wrap:wrap;max-width:100%}`, so the arrow drops under the address when it does not fit. | **At 320 to about 331px the email link runs 12px past the panel and its arrow is cut off.**<br>Measured at 320: link right edge 316, panel right edge 304 (`contactlinks.mjs`). See `shots/320-dark_contact_.png` near the bottom of the panel. The address stays readable; the arrow is clipped. |
| 7 | LOW | UI | `src/lib/components/Code.svelte:26` (all 9 blocks on `/toolbox/agents/`, plus `toolbox --mcp` at `src/routes/toolbox/+page.svelte:61`) | `<pre class="code body panel" role="figure" aria-label={label}>` with no control | Add a small Copy button to each block. It should read "Copy" and switch to "Copied" in a polite status for about 2s, and copy `text` with the `# comments` stripped. | **A setup page with 9 command blocks has no copy control.**<br>What I did: looked for one, then triple-clicked and copied (`copy.mjs`).<br>Triple-click copies one clean line. Selecting a whole block at 390 puts each `# comment` on its own line (harmless in a shell, but noisy). A copy button is the expected tool on this page, and the brief asked to test one. |

## Considered but Rejected

| Location | Candidate | Rejected because |
| --- | --- | --- |
| `src/lib/components/home/Hero.svelte` (typing loop) and the hero arrow nudge | Infinite motion without its own pause (WCAG 2.2.2) | The cog's Motion switch is a site-wide pause, `prefers-reduced-motion` starts it off, and every motion piece has a static version (0128, 0141). Verified that Motion off stops the hero and freezes the field under a drag (`motionoff.mjs`). |
| `src/routes/toolbox/+page.svelte:70-72` | Download links named "Intel", "Installer x64", "deb amd64" are vague out of context | The OS label sits in the same `<li>`, so link purpose is clear in context (2.4.4 AA passes). Only the AAA 2.4.9 rule would need the OS in the link. |
| `src/lib/components/toolbox/LockupDemo.svelte:94` | The demo's "01 Upload" step renders at 1.7:1 (light) and 2.1:1 (dark) | It is a `disabled` button in a mock of the app. Inactive controls are exempt from 1.4.3. |
| `src/lib/components/ContactForm.svelte:66` | The Send label changes to "Sending" (the skill prefers a stable label) | It is the only in-button progress cue, and `aria-disabled` holds focus and blocks a second press. Verified: one request after a double press. Accepted in 0228. |
| SvelteKit client navigation | Focus goes to `<body>` after a route change | This is SvelteKit's default: it announces the new title, and the skip link is the next Tab stop. Verified on every nav link and Next link. |

## Verification

### Passed

- **Page sweep** (`node sweep.mjs`): 17 pages × 7 widths × 2 themes. No horizontal page scroll, and no console errors besides the local analytics 403. Every text node meets 4.5:1 (3:1 large) against its ground, except the disabled demo step above.
- **Keyboard, Tab** (`keys.mjs`), at 1440, 900 and 390:
  - "Skip to content" is the first stop on every page and moves focus to `main`;
  - every stop has a 2px ring (`#f2d600` on dark, `#6f6200` on light and in panels);
  - no stop is unreachable.
- **Nav, cog and persistence** (`interact.mjs`):
  - every nav link loads its page with the right `aria-current` and title;
  - the cog opens on click and Enter, and Escape closes it and returns focus to the cog;
  - a click outside closes it;
  - Motion and Theme both toggle;
  - light theme and Motion off hold across a route change and a reload.
- **Work, studies, Toolbox and 404** (`interact.mjs`, `notfound.mjs`):
  - all 7 cards open their study, and Next loads at the top;
  - Back returns;
  - every tool page's "Get it" lands on `#download`;
  - the 404's "Back to home" goes home.
- **Field drag** (`drag.mjs`), with motion on, on 7 pages that have a reachable bare field:
  - the field moves;
  - a drag from the bare field across headings and links selects no text, and a double click selects nothing;
  - a link still clicks after a drag;
  - a press that starts on a card and drags off it does not navigate.
- **Field drag with motion reduced or off** (`drag.mjs`, `motionoff.mjs`): the field is pixel-identical before, during and after a drag.
- **Touch at 390** (`drag.mjs`): a swipe on the field scrolls the page by 235px on Home, Toolbox and Contact, with no selection.
- **Touch targets** (`targets.mjs`, coarse pointer at 320 and 390): every control's hit area is at least 24px. On desktop, the stacked contact links sit 24px apart, so they meet the spacing exception.
- **Contact form** (`contact.mjs`, `contact2.mjs`, with `**/api/contact**` intercepted and nothing sent):
  - empty submit shows three notes and focuses Name;
  - typing clears that note;
  - an invalid email gets its own note and focus;
  - Cmd+Enter sends;
  - while sending, the button shows "Sending" with `aria-disabled`, focus stays on it, and a second press sends nothing;
  - on success: "Sent. I’ll reply from studio@timothyali.com.", the fields clear and focus stays on Send;
  - send-failed, rate-limited and network errors each show their note and keep the typed fields.
- **Downloads** (`interact.mjs`, `**/download/**` intercepted): 8 links to the v1.2.4 files, and a click requests the intercepted URL.
- **"Send the link to your computer"** at 390 with touch (`sendon.mjs`):
  - with share it calls `navigator.share` with `/toolbox/#download`;
  - without share it copies the URL and announces "Link copied".
- **Scrolling** (`scroll.mjs`), every page at 1440 and 390:
  - layout shift is 0 while scrolling (0.01 on load for the Jade title fit at 390);
  - the header hides on scroll down and returns on scroll up.
- **Semantics** (`semantics.mjs`, `axnames.mjs`): one `main`, one h1 per page and no skipped heading levels. Every heading's accessible name reads as words. No unnamed controls or duplicate ids.

### Not verified

- **Real screen reader:** VoiceOver and NVDA output were not checked. Names come from Chrome's accessibility tree.
- **Other browsers:** Safari and Firefox were not run. In particular, the study fix's `reading-flow` is Chrome only.
- **Browser zoom:** real 200% and 400% zoom was not run; reflow is inferred from the 320 and 700 widths.
- **Text spacing at 320** (`misc.mjs`, WCAG 1.4.12): it adds a 5 to 42px sideways scroll, because single display words like "building." cannot wrap. This is an edge case and not reported.
- **Server answers:** the real `/api/contact` and the Vercel `?sent=1` / `?error=` no-JavaScript paths were not exercised (read in code only).

## Verdict

Block
