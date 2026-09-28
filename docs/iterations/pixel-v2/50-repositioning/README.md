# PX-50 — Product designer who ships in code (2026-09-28, 0132–0134)

Timothy's repositioning plan (private), his three answers to the assistant's review of it (Toolbox in slot 03, Framer kept in the Jade study, “building.” kept) and “commit px-49 and go”. PX-49 was committed first as `21800d6`.

## Before and after

`before/` is the live site (PX-48), `after/` the local preview, both with motion off in the dark theme, captured by `node tools/review/px50.mjs <origin> <outdir>`: the first screen of Home, Work, Sonde, Pocketwatch, Toolbox (after only) and Contact, and Home and Work in full, at 1440 and 390.

| | before | after |
|---|---|---|
| Hero line | Brand and web designer. Identities, motion, and websites built in code. | Product designer who ships in code. Interfaces, design systems, and the front ends that run them. |
| Statement | Designer for teams that don’t have one yet. | I design the product and build the front end. |
| Chips | Brand, Motion, Web | Interface, Motion, Code |
| Selected four | PARC, Jade Aesthetics, xrp.cafe, Do Androids Dream? | Sonde, Pocketwatch, Toolbox, PARC |
| Studies | eight, 01–08 | nine, 01–09 |
| Sonde and Pocketwatch covers | the landing page, a campaign ad | the account page, the dashboard |
| Hosted résumé | brand track | product track |

## Checks

- `pnpm check` 0 errors, 0 warnings (409 files); `pnpm test` 24 passed; `pnpm build`.
- `OG_PORT=4176 pnpm social:generate`, then `pnpm social:verify`: PASS, 18 pages, 18 PNGs.
- `tools/social/navigation.mjs`: PASS (Home → first card → Contact, one OG image each).
- `tools/review/blocks.mjs` with Pocketwatch and Toolbox added: 0 block tops off the 8-grid on 9 routes at 1440, 1100, 700 and 390.
- Overflow sweep, 13 routes (Home, Work, Contact, Toolbox, the nine studies) at 320, 390, 768, 1024 and 1440: no horizontal overflow. The only console error is the analytics endpoint answering 403 under `vite preview`.
- Work row titles at 16 widths from 1920 to 320: none wider than its box (Pocketwatch steps to 41.25 from 901 to about 1500, and to 27.5 where 41.25 would not fit).
- Hero typed line through a full loop: one height (96px at 320, 64px at 390 and 1440); the name does not move.
- Résumé: four one-page PDFs (product, brand and web with the phone; product without, hosted), tagged, embedded TrueType, no em dash; the hosted copy has no phone number and no client name.
