# The Toolbox examples (0095)

Four miniatures of the app's tool screens for the landing page, each the tool's own
layout with its real settings: a readout strip, a stage beside a rail, the bottom bar.

- `AppToggle.svelte`, `PlateToggle.svelte`, `SwatchDot.svelte` are copied from Toolbox's
  `src/renderer/src/ui/` in `/Users/twocakes/Desktop/GRAPHIC DESIGN/01_WORK/GRIDFORM/Studio/gridform`.
- `demo.css` is the app's `styles/blocks.css` and `chrome.css` scoped under `.demo`
  (switch rows, chips, dithered fields, mats and plates, the plan tree, the file stack,
  the toolbar). The values are the site's tokens, which the app shares.
- `plan.ts` ports the app's engine where a number or a text on the page has to be the
  app's: the Lockup export plan and tree builder, the Palette CSS / SCSS / tokens
  generators and OKLCH notation, the file-size and change formatting.
- `LockupDemo` — steps 02 and 03 of the wizard: formats, treatments and sizes drive a
  live file count and the exact folder tree. `PaletteDemo` — colours, outputs, and the
  files list with each file previewable (generated text, swatch sheet, ASE).
  `SpecimenDemo` — brand sheet / specimen templates over the four site faces at
  cell-table sizes. `ConvertDemo` — two authored posters encoded in the browser at
  the chosen format, compression and longest edge; sizes and percentages are measured
  (TIFF and PDF computed the way the app's writers lay them out).

Nothing exports: Export is the app's disabled state, since no destination can be chosen
here. No Electron stores, disk access or upload dialogs. The tool descriptions stay in
`$lib/toolbox` and the detail pages.
