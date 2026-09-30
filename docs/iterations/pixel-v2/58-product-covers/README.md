# PX-58 — Covers for Sonde, Pocketwatch and Toolbox (2026-09-29, 0144)

Timothy: “i want to create better cover images for each project. especially pocketwatch, sonde, and toolbox.” The three were plain screenshots (`before-covers.jpg`); PARC and FirstStrike, a mark on a brand ground, read far better at card size.

- `directions-a-b-c.jpg` — the three directions shown: A, one UI card on the brand colour (after his own Sonde marketing card); B, the app large and cropped by the frame on its own dark ground under its logo; C, the logo alone. He chose B, and corrected the Pocketwatch logo: the white lockup is the one for dark grounds (the black one is for light).
- `after-wheel-and-work-1440.jpg` — the new covers on the Home wheel (Sonde, Pocketwatch, Toolbox) and on Work.
- `after-share-images.jpg` — the Work collage and the three study share images regenerated with them, and the Pocketwatch cover at full size.

Covers are rendered by `node tools/covers/generate.mjs` at 2880×1620 (laid out at 1600×900, 1.8×) into `static/work/{sonde,pocketwatch,toolbox}/cover.png`; the logos are in `tools/covers/marks/` (Sonde's from its app, Pocketwatch's white lockup from its brand files), the screens are the site's own (Sonde's portfolio page, Pocketwatch's dashboard, Toolbox's home screen).

Checks: `pnpm check` 0/0, 24 tests, build, `social:verify` PASS, grid audit 0 at every route and width, no page errors or broken images on Home and Work. The old covers (`static/work/sonde/account.png`, `static/work/pocketwatch/dashboard-cover.png`, `static/work/toolbox.png`) are no longer referenced and are kept until he says.
