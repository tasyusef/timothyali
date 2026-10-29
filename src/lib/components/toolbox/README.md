# The Toolbox examples (0095)

Four miniatures of the app's tool screens for the landing page, each the tool's own
layout with its real settings: a route readout, a stage beside a rail, the bottom bar.
They follow Toolbox 1.2.5, the Rust app (Tauri + Leptos) in
`/Users/twocakes/Desktop/GRAPHIC DESIGN/01_WORK/TOOLBOX/app`, after its design batches
A (one yellow; a pressed chip is ink on white), B (a status line in the bar, Lockup's
steps as tabs, the found row, the stage switch, Convert's outputs grid) and C (drawn
boxes, notes in the reading face, the route readout, drawn glyphs). Where a screenshot
and the source disagree, the source wins.

- `CheckRow.svelte` is the app's Toggle after batch C: a drawn box, a real checkbox,
  an unticked row dimmed. `Icon.svelte` draws the app's 12px marks (`ui-kit` `icon.rs`).
  `EdgeChoice.svelte`, `DestinationRow.svelte`, `DemoReadout.svelte` and
  `DemoToolbar.svelte` are the app's edges row, destination rows, readout and bar.
  `PlateToggle.svelte` and `SwatchDot.svelte` are the app's plate and swatch.
- `demo.css` is the app's `crates/ui/styles/blocks.css`, `chrome.css` and `design.css`
  scoped under `.demo` (boxes, chips, dithered fields, mats and plates, the plan tree,
  the file stack, the bar). The values are the site's tokens, which the app shares.
- `plan.ts` ports the app's engine where a number or a text on the page has to be the
  app's: the Lockup export plan and tree (`tool-lockup`), the Palette CSS / SCSS /
  tokens / ASE writers and OKLCH and CMYK notation, Convert's format and background
  notes and totals line, the file-size and change formatting.
- `LockupDemo`: the Outputs and Review steps as tabs: formats, treatments, sizes, the
  padding and the square social copy drive a live file count and the exact folder
  tree. `PaletteDemo`: the artwork with its found colours, the swatch sheet drawn by
  the app's layout, colours with OKLCH / CMYK / Pantone details, outputs, and each
  file previewable. `SpecimenDemo`: brand sheet and specimen templates laid out as
  `sheets/type_sheet.rs` does, over the site's pixel faces at sizes they draw crisp.
  `ConvertDemo`: two posters drawn and encoded in the browser at the chosen formats,
  compression, longest edge and background; sizes and percentages are measured (TIFF
  and PDF computed the way the app's writers lay them out).

Nothing exports: the primary is the app's disabled state and the bar says the work runs
in the desktop app. No uploads, disk access or save dialogs. The tool descriptions stay
in `$lib/toolbox` and the detail pages.
