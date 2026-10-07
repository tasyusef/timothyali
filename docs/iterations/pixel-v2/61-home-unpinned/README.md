# PX-61 — Home scrolls again (2026-10-07, 0147, 0148)

Timothy: “i also think i want to get rid of this scroll thing we tried. i think we go back to a more traditional web page.” Of restoring the pre-PX-54 page or keeping today's looks unpinned, he chose the latter. The PX-54 stages before the change are in `../54-home-stages/`.

- `full-1440.png`, `full-1100.png`, `full-700.png`, `full-390.png`, `full-320.png` — the whole page with motion on after the statement has played (headless; the first capture's lazy covers below the fold are blank in Playwright's full-page shot, they load on scroll in a browser, checked in the pane at 1440).
- `nojs-1440.png`, `nojs-390.png` — the no-JavaScript render.

All from `node tools/review/px61.mjs http://127.0.0.1:4173 docs/iterations/pixel-v2/61-home-unpinned`, which also asserts: nothing sticky inside `main`, no horizontal overflow, the statement typed, all three words and chips shown and the paragraph printed within nine seconds of entering view, Tab reaching the work chip, the first study, All work and Get in touch with each on screen when focused, the contact link working without JavaScript, no page errors.
