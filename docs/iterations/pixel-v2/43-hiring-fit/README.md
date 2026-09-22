# PX-43 — Hiring fit

2026-09-22. Decisions 0118 to 0122. The three reviews and Timothy's answers are filed privately beside the résumé source (0115).

`before/` is the live site (www.timothyali.com) captured with `tools/review/hiring-fit.mjs` before any change; `after/` is the preview build after the pass. Each route at 1440 and 390: the first screen (`-fold`) and the full page (`-full`) for Home, Work, PARC, Jade Aesthetics and Contact.

What to compare:

- `1440-home-fold` and `390-home-fold`: the role line, the status line with the résumé link, and “Selected work” replacing “Scroll”.
- `1440-home-full`: the chips (Brand, Motion, Web), the companion sentence under the statement, and the new card order (PARC, Jade, xrp.cafe, Do Androids Dream).
- `1440-work-fold` and `-full`: the same order in the rows; First Ledger as index entry 05; the counts to 09.
- `1440-work-parc-fold` and `390-work-parc-fold`: one lead paragraph, contribution first, at 54/72 and 27/40; the Team row.
- `1440-work-parc-full`: “Where it started” as the first block, the decision paragraph, two quotes.
- `1440-work-jade-aesthetics-*`: the study that joined the selected four, headings without em dashes.
- `1440-contact-fold` and `-full`: the hiring line, the availability line, résumé, email and LinkedIn links, the foot note “Brand / motion / web”.

Verification on the preview build: `pnpm check` 0/0, 24 tests, production build, `social:verify` 18 pages, `blocks.mjs` 0 off-grid block tops on 28 checks, focus rings on the new hero links, light theme. The résumé PDFs (one page each, embedded fonts, clickable links, reading-order text, no em dashes) are in the résumé source folder outside this repository; only the phone-less site copy is in `static/resume/`.
