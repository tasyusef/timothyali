# PX-54 — Home as stages held on the window (2026-09-29, 0140)

Timothy's direction: keep the terminal aesthetic, make the page feel still while the content moves, and give each section its own movement. Before: `before-1440-home.jpg` (the live Home on 2026-09-28).

- `1440-hero-scroll.jpg` — the hero through its hold: the lines go out in scanlines, the name is redrawn in the sky's glyphs, sinks into the field, and the window fills with the panel colour.
- `1440-statement-plays.jpg` — the statement once held, 0.2 s to 8.5 s: the sentence types, the three words scramble in with their chips, the companion prints.
- `1440-wheel-in-and-out.jpg` — Selected work arriving (the first card spins up into the frame) and leaving (the last card spins out over the top).
- `1440-invitation-scroll.jpg` — the rain comes up, the drops stack into “building.” in glyphs, the drawn word resolves, then the link.
- `1440-handoffs.jpg` — each handoff at half and at the end: the next stage slides in clear and empty, so nothing moves between stages.
- `390-wheel-844-and-700.jpg` — the wheel on a phone 844 and 700 tall: the copy keeps room for the longest blurb and the wheel takes the rest.
- `reduced-motion-1440-and-390.jpg` — motion off (and so no JavaScript and the prerender): plain sections and a list of the four projects.

Checks: `pnpm check` 0/0, `pnpm test` 24, build, `social:verify` PASS, `tools/review/blocks.mjs` 0 on every route and width, no horizontal overflow on Home at 320–1440 with motion on and off, no page errors. The spring measured in headless Chrome: a scroll just past halfway between two cards carries the wheel over in about a third of a second, one 8px step of overshoot, settled by about half a second.
