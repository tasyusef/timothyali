# Performance audit, 2026-10-20

**Bottom line: loading is fine; the animated background is where the time goes.**
- **Desktop:** Lighthouse scores 100 on every page.
- **Phones:** 93–95 on most pages, but **Home scores 83**: its background is drawn four times over while the page starts, one 449ms block.
- **While you're on the page:** a pointer resting on the background, or a ripple, keeps the whole visible field repainting about half of every second.
- **Layout shift is near zero everywhere** (0–0.002).

Sources:
- a Fable agent, which measured with a browser: profiles, traces, a 4× slower phone CPU;
- Codex on `gpt-6-astra`, which read the code only, because its browser was blocked;
- Lighthouse 13.5.0, run by the assistant, on five pages, phone and desktop.

Tags:
- **[F]** Fable, **[C]** Codex, **[LH]** Lighthouse;
- **S** is an hour or less, **M** is up to half a day.

Full reports and numbers: `2026-10-20-performance-reports.md`.

**Status:** all 17 applied on Timothy's "do all of it" (PX-111, decision 0214), pushed 2026-10-20. Results in `docs/iterations/pixel-v2/111-performance/`.

---

## A. The animated background (biggest measured cost; no visible change)

1. **Home draws its whole field four times at start-up.**
   - Why: resize, the theme setting, the motion setting and the hero's measure each trigger a draw of the full page-tall field, about 124,000 glyph draws before the first visible paint needs 9,500.
   - Impact: this is the 449ms phone block, and the reason Home scores 83 while other pages score 93–95.
   - Fix: one draw per frame, and only the visible rows at start; the rest drawn later in idle time.
   - **[F] [LH] M**
2. **After any pointer movement, the field repaints every visible cell at 60fps for about 4 seconds.**
   - Cost: about 440ms of every second on desktop Home, about 500ms during ripples, and 545ms on a phone.
   - Fix: repaint only the cells the pointer and the rings touch, and end the warm period sooner.
   - **[F] [C] M**
3. **Any resize redraws the whole field and lays out the mountains again, even when the size hasn't changed.**
   - Fires on font load, image load and the body's resize observer; it costs a third task of 62–69ms on a phone.
   - Fix: act only on a real size change, and cache the mountain layout.
   - **[F] [C] S**
4. **The field costs about 100ms a second on an idle desktop tab,** and keeps its loop when the tab is hidden.
   - Fix: skip rows that haven't changed, and pause when the tab is hidden.
   - **[F] S**
5. **Light mode's dithered field costs about twice dark mode's per tick** (four fills per cell).
   - Fix: pre-drawn pixel patterns or batched fills.
   - **[F] M**
6. **The typing loops and the clock keep running off screen.**
   - The hero polls every 300ms, and the clock ticks on phones, where it's hidden.
   - Fix: pause on scroll-out and on a hidden tab.
   - Visible: typing resumes where it stopped instead of having moved on.
   - **[C] M**

## B. Loading (no visible change)

7. **Five CSS files block the first paint:** about 430ms on phones, 890ms on Toolbox.
   - Phone LCP is the text on Home, Contact and Toolbox, so first paint is the thing to move.
   - Fix: inline the small CSS (SvelteKit's `inlineStyleThreshold`).
   - **[F] [LH] S**
8. **Home, Work and every study download the whole project catalog and the Toolbox option tables:** about 21KB compressed, 23% of Home's JavaScript.
   - Fix: split the card summaries from the study content.
   - **[F] [C] S–M**
9. **Home finds its mountain image only after its scripts run** (72.7KB), so the scene is drawn without it and then again with it.
   - Fix: preload it on Home.
   - **[C] S**
10. **Toolbox loads all four demos at once.** Convert also makes two 1800×2400 canvases (35MB of pixels) and encodes a JPEG it doesn't need.
    - Fix: load the inactive demos when you pick them, and skip the unneeded encode.
    - **[C] M**
11. **Studies preload a typeface they don't show** (Jersey 15, 16.6KB). **[C] S**
12. **Home loads 36 JavaScript files, eleven of them under 1KB.**
    - Fix: merge the small ones.
    - **[F] S, low gain**

## C. Changes a visitor could see (need your call)

13. **Study hero images are served at the 2400px size on 2× desktops:** First Strike's is 978KB, First Ledger's 481KB.
    - Fix: cap or re-encode the top size.
    - Visible: slightly softer on big retina screens.
    - **[F] S**
14. **PARC's 5.2MB clip autoplays on desktop** (phones already tap to play).
    - Fix: tap to play on desktop too, or a lighter desktop encode.
    - **[F] S**
15. **Some image size hints are off.**
    - Phone crops and uneven gallery rows (PARC's 25/75 pair) ask for the wrong file width.
    - Visible: a few images get sharper, a few smaller.
    - **[C] S**

## D. Other

16. **The contact form's rate-limit check can add delay when the store is slow** (two round trips, default retries, no time limit).
    - Fix: one atomic call, with bounded retries.
    - **[C] S**
17. **Six unused font files in `static/`** (2KB each). **[F] S**

Not acted on:
- the hero's possible shift when its typing loop takes over [C]: Fable measured layout shift at 0 on Home;
- Lighthouse's cache warning and console error, which only appear on the local preview.

## Already good (leave alone)

- **Fonts:** preloads, swap and size-matched fallbacks.
- **Images:** size ladders, lazy loading, posters and video `preload=none`.
- **Live delivery:** Brotli, immutable caching, edge-cached HTML, no third parties.
- **The field at rest:** it sleeps when nothing moves.
- **Page-to-page navigation:** no long tasks.

## Suggested batches

- **A: the background (1–6).** About a day. The biggest gain: Home's phone score and battery while browsing.
- **B: loading (7–12).** About half a day.
- **C: visible (13–15).** Small, but each changes what people see.
- **D: other (16–17).** An hour.
