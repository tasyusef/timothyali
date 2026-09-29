# Open Questions

Undecided items. Each one gets promoted to the decision log once resolved.

| # | Question | Current leaning | Raised |
|---|----------|-----------------|--------|
| Q10 | Posting cadence. Currently sporadic, posts when he feels like it. | Not planned yet. Comes after positioning. | 2026-09-08 |
| Q25 | Confirm Eskapade Fraktur, Amador, Blonde Fraktur are actually on Adobe Fonts under Timothy's plan. | Unverified, from a 2026 round-up. | 2026-09-08 |
| Q28 | What visual treatment do the separate Work and case-study pages use? | 0023 settles page roles. PX-08 (2026-09-09) built a proposal on the pixel system: Work as one wide row per project; studies as blackletter title, 54px lead beside a meta block, hero row, half-width text sections, aspect-justified galleries, numbered outcome, yellow next-project row. Awaiting Timothy’s reaction. | 2026-09-09 |
| Q29 | How do the four accepted narrative beats map to the DAD environment, transitions, and visual destination? | Storyboard 03 responds to 0027: distinct billboard scenes, dense futuristic city, understructure-to-rooftop ending, and a mapped continuous route. Review storyboards/storyboard-03.md plus storyboard-route-03.svg. | 2026-09-08 |
| Q30 | Does the shorter v2 copy retain the desired voice, and should a founder credit accompany it? | v1 remains accepted wording. v2 shortens the middle passages in response to 0026; see landing-copy-v2.md. Optional founder credit remains open. | 2026-09-08 |
| Q31 | PX-04 loose ends: approve the four supporting pixel faces (Jersey 25, Jersey 15, Silkscreen, Press Start 2P); keep or cut the footer line “A little human. A little machine.” and the terminal strings (`~/tim/`, `SYS.OK`, `EOF`, coordinates, clock); keep the dimmed-yellow secondary tone; Work cards two per row or one wide card each; per-band texture density (sky .8, ASCII .5, bands .45, rain .55)? | Assistant leaning: keep faces, terminal strings and dim tone; cut the footer line. Work: one wide row each, built in PX-08 and stripped to plain index entries in PX-16 (0074; Home keeps 2×2 cards on the rain, so the two pages differ on purpose). Eyebrow labels resolved — removed on Timothy’s instruction (0047). | 2026-09-08 |
| Q33 | Which projects belong on Work? After 0055 the index is PARC, xrp.cafe, First Ledger, Do Androids Dream (the assistant’s pick as Pocketwatch’s replacement, to be confirmed); the old site also has FirstStrike, Gridform, Sonde, Jade Aesthetics and the PARC site build. Confirm the fourth, and decide whether a second tier is wanted. | Resolved by 0077: the selected four stand; the rest are index entries 05–08; Gridform Studio and Studio Gridform hidden. | 2026-09-09 |
| Q32 | Accent scope after 0049: yellow on cursors + active nav + primary actions (current), or cursors + nav only? Dark or light as the default theme? | Assistant leaning: keep the three uses; dark default. | 2026-09-08 |
| Q34 | Design system extraction: Timothy wants tokens (colour, type, spacing, motion) and reusable components pulled out of the current code. **Built in PX-14 — see `docs/design-system.md`** (decision 0071). Outstanding confirmations: (a) the five-file layer split and the token names (`--s1…--s16`, `--cell-*`, `--face-*`, `--z-*`, `--surface-card*`, `--grid-fine`/`--grid-major`, `--tick-cursor`, `--nudge`); (b) `.display-xl` unified on Work's ladder, so “building.” is 129 not 86 between 381 and 700 on Home and Contact; (c) `.page-foot` arrows in Press Start, which costs 2px of page height on five pages; (d) Contact's ≤700 section padding 64 → 48; (e) keeping two CTA hover directions as two roles instead of unifying them; (f) one `Cursor` component with two sizes; (g) font sizes staying literal rather than becoming tokens; (h) whether `--accent` needs a per-theme value; (i) whether the 1300 and 380 breakpoints stay; (j) whether a `/system` page documents this on the site. | Built and awaiting Timothy's review of the names and the four unifications; `docs/design-system.md` lists all thirteen assumptions. | 2026-09-09 |
| Q35 | Mobile navigation: Timothy — “we also probably need to make the mobile nav a hamburger menu”. Currently three full-width tabs under the wordmark (header 99px at 390, off the 8px unit). Hamburger, or keep the tabs and tighten the header? | Resolved by 0070: Timothy chose the height fix (104px header, tabs kept) over the hamburger. | 2026-09-09 |
| Q36 | Status strip on tablet and phone: Timothy — “we also need to rethink the status bar under the nav for tablet and mobile”. At 16px Press Start the five items (path, Denver, coordinates, clock, SYS.OK) need about 1,040px, so every tablet width clips the right end; long study paths clip below about 1,300px; phones drop to 8px type. | Resolved by 0072 (built PX-15). Footer follow-up is 0073, a proposal awaiting Timothy. | 2026-09-09 |
| Q37 | A `/system` specimen page on the site documenting the tokens, type roles and components visually. Accepted in principle (0075). When? | Assistant leaning: after the remaining page work; it doubles as a portfolio piece. | 2026-09-09 |
| Q38 | The full index on Work: Timothy — “i also want to bring in all the other projects. so we need to figure out a good way to display them in teh works page”. Six more exist on the old site with studies and assets (FirstStrike, Sonde, Gridform Studio, PARC Website, Jade Aesthetics, Studio Gridform); Pocketwatch stays out per 0055 unless he says otherwise. Which four stay “selected” as wide rows, and do the six get ported studies now? | Resolved by 0077: two tiers, Gridform pair hidden, all eight visible projects get studies (PX-18). | 2026-09-09 |
| Q39 | Is the pixel and terminal aesthetic right for the product positioning (0132)? Timothy, 2026-09-28: “idk if this is really the right aesthetic for the site. is it too expressive?” | Timothy moved to layout rather than aesthetic (“maybe we just need to really spend some time on refining the layout”); studies now use layout B with a plain reading face (0136). The hero and Home stay as they are for now: “later on i want to completely re work it” (Q41). | 2026-09-28 |
| Q41 | A full rework of Home, hero included. Timothy, 2026-09-28: “the hero and the homepage is fine for now. later on i want to completely re work it.” | Deferred on his word. The assistant's notes for it: the hero sentence types and clears, so the positioning line is fully visible only about 6 s in, for 1.6 s. | 2026-09-28 |
| Q11 | Payment terms and scope rules for seed/crypto clients (risk noted in 0008). | Not decided. | 2026-09-08 |

Resolved: Q1 → 0002. Q2 → 0005. Q3 → 0006. Q4 → 0002 (reasoning). Q5 → 0004. Q7 → 0008. Q8 → 0001 accepted. Q6 → 0010. Q6b → 0010 reasoning. Q9 → 0009 accepted. Q14 → 0012 accepted. Q12 → references.md + 0013/0017. Q15 → 0015. Q16 → 0014. Q17 → 0016. Q18 → 0014. Q19 → 0014 reasoning. Q20 → 0018. Q21 → context.md (modest budget). Q22 → context.md (Tungsten, unverified). Q23 → 0018 accepted. Q26, Q27 → 0019 reasoning. Q24 → 0020. Q13 → 0013/0015/0018 (unique = yellow/black, blackletter on grid, flat parallax).

Q30 copy/voice portion resolved by 0024; optional supporting credit remains open.

Q40 (study layout) → 0136: layout B with the plain reading face, on Timothy's pick. Q42 (reading face) → 0137: IBM Plex Mono. Q43 (Sonde pricing; unused images) → 0138: pricing changed after launch; the 37 unused images are deleted.

## To supply (Timothy)

The repositioning's missing pieces (0132, 0133). Nothing here is written for him; each study gains its section when he supplies it. Résumé and profile items are in the private résumé README (0115).

- [ ] Sonde: how the account page came to be (the directions considered, or why the newcomer → trader → analyst tabs were the first instinct).
- [ ] Sonde: what a good answer from Ask the Ledger looked like, if there were criteria, or run a small evaluation against the open-source build.
- [ ] Sonde: any user or subscriber numbers, even small.
- [ ] Sonde: why the pricing changed after launch (paid portfolio and investigation tools at launch; by July 2026 the whole explorer free and Pro at $5 for Claude-powered questions). A real decision, worth its own point.
- [ ] Sonde: what you'd do differently.
- [ ] Pocketwatch: what it did that other budgeting apps didn't.
- [ ] Pocketwatch: two or three design decisions you're proud of.
- [ ] Pocketwatch: the launch month and who it launched to (beta or public), and any numbers.
- [ ] Pocketwatch: the lesson, in your words (the facts are settled: too expensive to run, and you never worked out how to market it, 0135).
- [ ] Toolbox: why you built it, what you chose against, what you'd change, and any usage.

