# PX-51 — Study layout mocks (2026-09-28)

**Outcome:** Timothy chose B with the plain face (0136); it shipped to every study as PX-52 and the mock route and script were removed. The captures below are the record.

Timothy: the case study pages “with the large full bleed images are hard to follow”, then “yes, commit px-50 and mock both layouts.” Sonde only, on the dev server at `/mock/study/{a,b,a-plain,b-plain}/` (dev-only like `/og/[id]`; never crawled, never shipped). The live study is unchanged at `/work/sonde/`. A bar at the bottom right switches between Current, A and B, and between the pixel and a plain reading face.

## What the current study does

Text and screens sit in separate bands. “Making the data readable” describes the account page, which is the image above it, and the gallery after it shows network, markets and portfolio screens the text never mentions. No image has a caption. Each full-width screenshot is about 1376×774 at 1440, nearly a screen of dark interface, while the app's content fills only its middle two thirds, so its type shows at about 86% of its real size. Headings sit in an empty left column beside paragraphs on the right.

## What both mocks change

- The copy is the live study's, regrouped into six points plus the Outcome; each point is a short heading, its paragraph, and the screens it talks about, with a caption that describes only what the crop shows. Headings and captions are the assistant's.
- Crops (`static/work/sonde/crop/`) cut each 1600px capture to the app's content column. The overview shows the account page's content at 1116px instead of the full frame, and every crop in A is shown at no more than its own width.
- **A** stacks each point: heading, text, then its screens directly under it.
- **B** holds the heading and text in view in the left third while the point's screens scroll past on the right. Below 900px it is A. Headings step one size down on desktop to fit the column.
- **-plain** sets the lead and paragraphs in a system sans at 20/32 instead of Jersey 15 at 27/40, with font smoothing back on for them alone. A stand-in for a chosen text face.

## Measurements (1440×900 and 390×844, motion off)

| | desktop | phone |
|---|---|---|
| Current | 6.7 screens | 7.3 |
| A, pixel | 9.4 | 8.7 |
| B, pixel | 7.3 | 8.7 (same as A) |
| A, plain | 8.9 | 7.6 |
| B, plain | 6.9 | 7.6 |

A is longer because its screens are larger; B is about as long as the current page with the screens beside their text. On a phone both are the same, and a 1116px crop in a 358px column is still dense: phone-specific crops would be the next step for whichever layout is chosen.

## Files

- `1440-full-current-a-b.png`, `1440-full-current-a-b-plain.png`, `390-full-current-a-a-plain.png`: whole pages side by side at a quarter (desktop) and half (phone) size.
- `1440-point-*.png`: the same passage (“Three readers, three depths”, the current page's “Making the data readable”) at screen size; `b-scrolled` shows the text held beside the second screen.
- Captured with `node tools/review/px51.mjs` against the dev server.

`pnpm check` 0/0; `pnpm build` passes with the mock route excluded (no mock HTML in the output).
