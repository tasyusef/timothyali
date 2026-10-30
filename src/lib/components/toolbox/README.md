# The Toolbox diagrams (PX-131)

One diagram per tool on the landing page, each what the app makes, in one line: what goes in on
its plate, an arrow, what Toolbox wrote for it. Under it, a count ("1 logo → 39 files") and the
real files to download. They took the place of the app-screen miniatures (0095), which showed
each tool's settings rather than what it makes.

Nothing on them is drawn from a guess. `tools/toolbox/samples.mjs` runs the Toolbox 1.2.7 CLI
on two inputs and writes, for each tool, the zip of what it wrote to
`static/toolbox/samples/<tool>/` and the manifest `<tool>-sample.json` the diagram reads:

- `LockupFlow`: `tools/toolbox/acme.svg` (the landing demo's logo). PRINT and WEB, a row a
  colourway, one square a file on its plate in its colours.
- `PaletteFlow`: `tools/toolbox/poster.svg`. The four colours Palette found, then its six files.
- `SpecimenFlow`: the site's three type roles (PARC Pixel Bold, PARC Pixel, Jersey 15) at the
  site's sizes, each shown in its own face, then the sheet the app set (its real PNG), then PDF
  and PNG. The app sets installed fonts only; Jersey 15 is installed from the site's own WOFF.
- `ConvertFlow`: the poster as a PNG and as each format Convert wrote, the same picture; a bar
  under each is its file's size against the PNG's.

The poster picture is the app's too: a Convert of the PNG to an 800px WebP.

- `ToolDemo.svelte` shows the picked tool's diagram. All four come with the page.
- `demo.css` is the shared layout (the flow): every size a whole number of `--fu`, a 54th of
  the frame (a 32nd on a phone, where what goes in stands over what comes out), so a diagram
  fills its frame at any width and each tool's boxes are the size of the next's.
- `plan.ts` keeps the app's size and change wording (`file_size`, the change percentage).
- `Options.svelte` is the detail pages' option table, from `$lib/toolbox`.

`tests/toolbox-samples.test.ts` holds each manifest to its files and its zip;
`tools/review/toolbox-demo.mjs` checks the four diagrams at six widths in both themes. Rerun
`samples.mjs` after each Toolbox release. The tool descriptions stay in `$lib/toolbox` and the
detail pages.
