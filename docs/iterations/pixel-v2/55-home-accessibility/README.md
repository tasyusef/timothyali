# PX-55 — Home reading and keyboard fixes

Direction: 0141. User authorized the four fixes reported in review. Existing stage visuals remain; text travel and focus behavior are corrected.

## Evidence

- `before-phone.png`: returning to the old statement leaves the opening clipped.
- `after-phone-return.png`: scrolling back restores the opening below the header.
- `after-phone-paragraph.png`: scrolling forward exposes the whole companion paragraph.
- `before-nojs.png`: old contact link had inherited `pointer-events: none`.
- `nojs-1440.png`, `nojs-390.png`: server-rendered statement visible. The regression test also clicks through to Contact with JavaScript disabled.
- `keyboard-contact-1440.png`, `keyboard-contact-390.png`: contact action revealed on keyboard focus.
- `checks.json`: focused browser check results.

Run `node tools/review/px55.mjs [origin]` with a local dev or preview server; default origin is `http://127.0.0.1:5194`. Uses installed Google Chrome through Playwright.

Browser verification is Chromium-based; a screen reader and physical Safari/iOS device were not used.

## Verification

- Focused regression runner: 14 checks passed.
- Additional Shift+Tab checks at 1440px and 390px: links stay visible from the invitation back through the wheel to the résumé.
- `pnpm check`: zero errors or warnings.
- `pnpm test`: 24 tests passed.
- `pnpm build`: passed.
- `pnpm social:verify`: 18 pages and share images passed.
- `git diff --check`: passed.

Verified locally; commit and publication authorized by Timothy on 2026-09-29 (“commit and push”).
