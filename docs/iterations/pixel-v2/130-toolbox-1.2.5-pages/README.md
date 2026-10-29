# Toolbox pages match 1.2.5 (PX-130)

Timothy: the Toolbox pages were "outdated and i dont think matches the app", then "Do it all" (screens, demos, copy).

## Screens

`screens-old-vs-new.png`: each screen as the site had it (1.2.0) and as the app is now (1.2.5).

- Captured the same way as PX-117, with its scenarios unchanged (`../117-toolbox-1.2.0/capture/`, byte-identical), from a trunk build of the 1.2.5 `crates/ui` in the app's hidden WebKit harness; no window appeared. Convert used `native-sizes.js` as before.
- Phone crops recut (`tools/images/phone-crops.py`): Convert is now the file list with its totals line (965×855, was a 1200×476 strip that cut the second file); Home keeps its box with the bottom moved down 0.4% so "Birch & Co" isn't clipped; Lockup, Palette and Specimen keep their boxes. `PHONE` in `toolbox.ts` has the sizes.
- The study cover was regenerated from the new home (`node tools/covers/generate.mjs toolbox`) and its phone crop recut.
- Share images: `pnpm images:derive`, then `pnpm social:generate`. Five changed, all for the new screens or cover (`static/og/work.png` and `static/og/toolbox-{lockup,palette,specimen,convert}.png`); the rest came out byte-identical. `25-social-site/assets.json`, which the generator rewrites, was restored from git. `share-images-and-cover.png`: before left, after right.

## Demos

`demos-before-after-app.png`: each landing demo before, after, and the app, at 1440 in dark.

- Rebuilt to the 1.2.5 screens (design batches A–C): route words in the readout, drawn checkboxes (`CheckRow.svelte`, a real checkbox; `AppToggle.svelte` removed), Lockup's step tabs, the bottom bar's status line and one yellow primary, white/ink pressed chips, drawn 12px icons (`Icon.svelte`), plain numbers with " · ", Edges (`EdgeChoice.svelte`), and each tool's 1.2.5 sections (Palette's Artwork | Swatch sheet and Found row, Specimen's points field and selects, Convert's per-format sizes, totals line and Background).
- Nothing exports. The status line says "Exports run in the desktop app." (Convert: "Conversions run in the desktop app.") and the primary that would export is disabled, so the touch-only `.export-note` under the demo is gone.
- Kept from the site: its own example artwork (Acme, the posters drawn in the browser), the site's pixel faces in Specimen, Lockup's padding starting at 10% and Convert starting on JPEG + WebP.
- `base.css`: the forced-colours rule for the old `[on]` toggle became one for the ticked box (Highlight fill).
- `/toolbox/` JavaScript (gzipped, beyond the shared app): 33.1 kB → 35.7 kB; the lazy Palette, Specimen and Convert demos 2.8 / 2.6 / 2.7 kB → 4.9 / 3.7 / 3.9 kB.

## Copy

- CLI & MCP: the Windows binary (`%LOCALAPPDATA%\Toolbox\Toolbox.exe`, per user, not on PATH; checked against the app's `check-installed.ps1` and `package.ps1`), a setup note (use the full path; `| more` waits for output), the Windows path for MCP config, Linux "toolbox, or the AppImage file". The path breaks after `\` as well as `/`, and `--mcp` stays whole at a line end. `copy-390.png`.
- `toolbox.ts`: "swatch sheet" (the app's name for it); the Lockup, Palette, Specimen and Convert alt text describe the 1.2.5 screens.
- Study: the app shares "its type, its dither patterns, and several components" with the site (it no longer has the terminal look); the Outcome adds in-app updates since 1.2.1 and the 1.2.4/1.2.5 design passes.
- Download: "Already on 1.2.1 or later? Update from the bottom of the app's sidebar."
- `toolbox-options.ts` regenerated from the 1.2.5 binary: only its header changed (51 options, the same as 1.2.0's).

## Checks

`verification.json`.
