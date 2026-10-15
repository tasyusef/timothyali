# Mobile audit (PX-104, 2026-10-14)

Requested by Timothy: "do a full audit throughout the site on mobile. see if you spot anything that would be bad for users or could be improved".

Method: `tools/review/mobile-audit.mjs` captured all 21 pages at 390×844 and 320×640 (motion off, dark), plus light theme and motion-on samples (`shots/`, `metrics.json`). Four parallel reviewers then tapped through the pages with Playwright (isMobile, hasTouch), and one measured a production build (`pnpm preview`, DPR 3, 4× CPU throttle, Slow 3G). Nothing in the repo was changed by the audit.

Baseline: no horizontal overflow at 320 or 390, and no console errors on any page. CLS is about 0 everywhere and LCP is under 400 ms unthrottled. Reduced motion is honoured, pinch zoom is allowed, form inputs are 27px (so iOS won't zoom on focus), and every key page renders without JavaScript.

## A. Broken or costly (fix first)

1. **Home hero name clipped below ~353px with motion on.** The typed `Decode` is `white-space:pre` at 129px, so "i'm tim." is 321px wide on a 320 screen and loses its period. Fix: `.hero-name` 86/88 at ≤420.
2. **Home canvas redraws every display frame.** The field only changes every 160 ms, but `draw()` runs each rAF (61 clears/s). Home main thread is 65.6% at 4× throttle versus 1.4% with motion off; Contact is 24% and study heroes 12–20%. Fix: skip `draw()` when the frame, heat, bursts and visible rows are unchanged.
3. **Home canvas is page-tall at full DPR.** It is 11.8 Mpx (45 MB) at 390 and 13.5 Mpx at 430, against iOS Safari's ~16.7 Mpx per-canvas limit (above that it draws blank; inferred, not tested on a device). It also redraws six times in the first 75 ms. Fix: cap DPR at 2 for page-tall fields and debounce `resize()`.
4. **Videos download in full on phones.** xrp.cafe pulls 8.5 MB of mp4 and Do Androids Dream? 2.6 MB plus a 482 KB JPEG poster. WebP posters already exist (56 KB and 31 KB). Fix: WebP posters, a smaller phone encode, and play on tap on phones or with Save-Data.
5. **Videos can't be played or paused by touch.** They are muted, looping and autoplay with no controls. With reduced motion or iOS Low Power Mode, DAD's hero is a still poster with no sign it's a video. Fix: a play button over the poster when autoplay is off or fails, and a pause control.
6. **Study images served at half resolution on phones.** `galleryClass()` says rows of 2+ images are half width, but on phones they stack full width, so the browser picks 640w for a 1074-device-px slot. This affects about 66 images (PARC ~25). Fix: `calc(100vw - 32px)` below 700px unless the row tiles.

## B. Touch behaviour (sitewide)

7. **Hover sticks after a tap.** No `:hover` rule is behind `@media(hover:hover)` and no tap highlight is set. After a tap, Toolbox picker buttons and demo chips show the hover colour instead of the selected yellow, cards and the cog stay inverted, and iOS/Android add their own flash. Fix: `@media(hover:hover)` around hover rules; `-webkit-tap-highlight-color:transparent`.
8. **Small tap targets on the main actions.** Hero "Resume" is 112×16, the Contact links (résumé, email, LinkedIn) are 16px tall at a 24px pitch, Work's closing link is 358×16, nav links and cog are 32px, and the Toolbox demos have 38 targets under 44px. Fix: enlarge hit areas with padding and negative margin (`::after` inset) without changing the look; demo chips 44px on phones.
9. **Back-tabbing hides focus under the header.** The header reappears on upward scroll and covers 88px of the focused card. Fix: `scroll-padding-top` equal to the header height.

## C. Readability and contrast

10. **`--dim` (.55) fails contrast on light grounds: 3.8:1 at 12.5px.** In the default dark theme this hits the Contact form labels and links on the light panel; in the light theme it hits study meta labels, captions, the footer and Toolbox labels. The Toolbox demo numerals are 2.1:1 (dark) and 1.7:1 (light). Fix: dim ≥ .62 on light grounds (~4.7:1).
11. **Desktop UI screenshots are unreadable at phone width.** Toolbox (5), Pocketwatch (5), PARC site screens (14), Jade (4), First Ledger guide slides, and the Sonde/Pocketwatch/Toolbox covers on Home and Work. Sonde's `phone` crops show the fix works. Fix: phone crops, Toolbox and Pocketwatch first.
12. **Case studies show no work on the first screen.** In 8 of 9 the first image starts 856–1192px down (PARC 1.4 screens), below a meta list of 280–512px. Fix: on phones, hero image after the lead and meta after it.
13. **Captions are long all-caps bitmap text** (up to 107 characters, 3 lines), and a caption can sit four images below the image it describes. Fix: reading-face captions on phones, or captions of 40 characters or fewer.
14. **Reading lines are short:** Plex Mono 18/32 gives 33 characters at 390 and 26 at 320. Option: 16/24 on phones (~37 characters).
15. **404 hierarchy is inverted.** The 41px sentence (5–7 lines) outweighs "lost.", and the "404 / SYS.ERR" row is an eyebrow. Fix: smaller sentence, drop "Head back home.", drop the row.
16. **Nav labels sit on fractional pixels below 420** (soft bitmap text; at 320 "INDEX" starts 6.5px from the edge). Fix: whole-pixel item widths.

## D. Toolbox on phones

17. **Phones get raw desktop installers.** Six links go straight to .dmg/.AppImage/.deb with no "desktop only" note and no sizes. Fix: a phone note ("Runs on macOS and Linux. Open this on your computer.") with share/copy link.
18. **The Specimen demo breaks words mid-word and runs 2.3–3.4 screens tall.** Fix: step type down at ≤420 and use `overflow-wrap:break-word`.
19. **Disabled Export buttons explain themselves only in `title`, which touch never shows.** Fix: a visible "Exports run in the desktop app" note.
20. **Demos clip key information:** the Palette CSS preview, Convert's file name and source size, and the readout path. Fix: wrap at ≤700.
21. **The Convert slider thumb is 8×16.** Fix: a 44px hit area.
22. **Tool pages are ~58% options reference on phones, and the h1 is the same size as the h2s.** None links to downloads. Fix: options in `<details>` on phones; h1 one step up; a download link.
23. Lockup demo logo touches its plate at ≤420; Continue leaves the demo scrolled mid-screen; CLI & MCP has no jump list, and JSON continuation indents lose their nesting.

## E. Smaller

24. Slow 3G: PARC Pixel (`font-display:block`) arrives at 4.6 s, leaving nav labels and the hero chips blank until then. Fix: inline it (1.7 KB per weight) or `swap`.
25. Home hero blanks and retypes once JavaScript lands (the prerender already shows the full text).
26. No-JS contact: no sent/error message, and stray yellow caret blocks over labels.
27. Work @320: card titles mix 27.5 and 20.625. Fix: one size per grid.
28. Home @320: the "Selected work" chip wraps to two lines. Fix: `flex-wrap` on the actions, chip `nowrap`.
29. Work ends on a 16px dim link while Home ends on a yellow row. Fix: reuse the invitation row.
30. Jade shows the same pages twice on phones (desktop pair, then phone tiles).
31. Card covers are 2.2× oversized at DPR 3 (no 1200w rung); `firststrike` 1600w files are about 300 KB.
32. Contact: no `autocapitalize="words"` on name and no `enterkeyhint` on the message.

## Works well

- No sideways scroll anywhere. Code blocks wrap and keep commands whole.
- The header hides on scroll down and returns on scroll up. Anchors land cleanly. The cog menu closes on outside tap, Escape and scroll.
- The Contact form has the right types, autocomplete and inline errors, and focuses the first error.
- The Toolbox demos really work by touch: file counts and folder trees update, and Convert re-encodes.
- The next-study row gives every study a clear next step.
- Images, fonts and HTML are cached and compressed; CLS is about 0.
