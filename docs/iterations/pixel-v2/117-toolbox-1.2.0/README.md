# Toolbox 1.2.0 (PX-117)

Prepared for Toolbox 1.2.0, the first Rust/Tauri release. Approved by Timothy and published on 2026-10-26.

## Downloads

- `src/lib/toolbox.ts`: `APP.version` is 1.2.0. `VERSIONS` holds each platform's build version separately (macOS follows `APP.version`; Windows and Linux are their own values, both 1.2.0). Set Linux back to `'1.1.1'` there if its 1.2.0 build can't ship; its four links then point at the v1.1.1 release and the page says "Version 1.1.1." in its note.
- Windows is back, unsigned: NSIS installers for x64 and arm64, named by `WINDOWS_INSTALLER` and `WINDOWS_INSTALLER_ARM64` (`Toolbox-Setup-1.2.0.exe`, `Toolbox-Setup-1.2.0-arm64.exe`; Timothy set these names).
- The download-click check (`tools/review/admin.mjs`) uses the 1.2.0 DMG. Historical analytics fixtures keep their versions. Download names are URL-decoded on both sides of the click count, so a name with spaces still matches. The admin table marks Windows builds before 1.2.0 as historical (`releases.ts`, a new test).

## Copy

- Study (`work.ts`): tools Rust, Tauri, Leptos, Claude Code; new timeline; Outcome rewritten for 1.2.0 (Rust rebuild, the chat and AI removed, organize over MCP/CLI, projects home, Edges, Windows back unsigned); one sentence on organizing in "App, command line, and agents".
- Platforms: `APP.platforms`, `APP.description` (157 characters), tool meta descriptions, the tool pages' download link and the phone note name Windows.
- CLI & MCP: `toolbox --version`, `--edgeSmoothing` in Advanced, a new "Organize a folder" section (scan, dry run, show the user, apply, undo). Commands were run against the 1.2.0 binary on a scratch folder (scan and dry run only).
- `tools/toolbox/sync-options.mjs` now reads the binary (`toolbox list`, `toolbox <tool> --help`) instead of the deleted TypeScript catalog. The regenerated `toolbox-options.ts` differs from 1.1.1 only by `edgeSmoothing` on all four tools and `longestEdge`'s minimum of 1.

## Screens

`screens-old-vs-new.png`: each screen, 1.1 left and 1.2.0 right, plus the study cover.

- Captured from a trunk build of the app's `crates/ui` in its hidden WebKit harness (`parity/ui/run.mjs`: alpha-0, never-key windows; no window appeared). The scenarios are in `capture/`; nothing was added to the app repo.
- 1440×872 at 2×, dark, motion on, the Edges sections shown. Lockup shows PARC's stacked logo (`PARC_BOGO-02.svg`, Timothy's pick in place of 1.1's Pocketwatch mark), recaptured from a build of app `71de161`. The rest are 1.1's sources: the Less Noise posters (Palette, Convert) and Helvetica (Specimen).
- Home is the projects index with four seeded projects (Less Noise, Acme, Cobalt Studio, Birch & Co) and some saved work.
- Convert: the browser stand-in measures with WebKit's canvas encoders, which can't encode WebP. `capture/native-sizes.js` answers its encodes of the two posters with the byte counts the 1.2.0 CLI measures natively (`toolbox convert … --formats jpeg webp --action inspect --json`). The sizes on screen are the app's own, and the same as 1.1's.
- The clock reads "GMT+0 09:41:00": the harness freezes time and runs in UTC.
- Phone crops recut (`tools/images/phone-crops.py`, new boxes for all five); `PHONE` in `toolbox.ts` has their sizes. The study cover was regenerated from the new home screen (`node tools/covers/generate.mjs toolbox`).
- Share images: on Timothy's word, `pnpm images:derive` then `pnpm social:generate`. Five changed, all for the new screens or cover: `static/og/work.png` (the Toolbox cover in the collage) and `static/og/toolbox-{lockup,palette,specimen,convert}.png` (each tool's screen). The other 13 share images, the favicons and `docs/social/wide-launch.png` and `story-launch.png` came out byte-identical. The generator also rewrites the uncommitted `25-social-site/assets.json`; it was restored byte for byte from a backup and checked by SHA-1. `social:verify` was not run (it rewrites `23-social/verification.json`).

To capture again (from the app repo's `parity/ui`, after `trunk build --release --dist <dist>` in `crates/ui`):

```sh
node serve-dist.mjs <dist> 5291 &                    # stop it by its PID
node run.mjs --a http://127.0.0.1:5291/ --b http://127.0.0.1:5291/ \
  --scenarios <this folder>/capture --out ../out/site-shots
# Convert: serve a copy of <dist> whose index.html loads native-sizes.js, and run --only convert
```

Each screen is `<out>/<id>/01-*/b.png`, saved as RGB PNG to `static/toolbox/<id>.png`.

`verification.json` records the checks.
