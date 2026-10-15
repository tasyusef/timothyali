# Overnight review, 2026-10-14

**Bottom line: the site is in good shape.**
- **Nothing is broken badly.** One button I shipped today is buggy, and there are a few real costs.
- **Speed:** every page loads its main content in under 2.5 s on a throttled phone.
- **Checks:** type check is clean and 24/24 tests pass. No sideways scroll, no console errors.
- **SEO:** no high-severity problems.

Four reviewers ran, all read-only: SEO and site health, code audit, simplification, and optimization. Tags: **[SEO] [Audit] [Simplify] [Perf]**. Effort: **S** about an hour or less, **M** half a day.

---

## 1. Fix first

1. **The video Play button does nothing when the phone blocks autoplay** (e.g. iPhone Low Power Mode). That case is why the button exists; the bug is from today. **[Audit] S**
2. **The desktop xrp.cafe video is 8.5 MB** for a small box. A re-encode gets it to 0.8 MB with no visible loss. **[Perf] S**
3. **The contact form has no rate limit.** A script could flood your inbox and use up the email quota, so real messages would fail. **[Audit] S–M**
4. **The contact form's hidden spam trap is a field named `company`.** Browser autofill can fill it, which silently drops a real message while showing "Sent". **[Audit] S**
5. **The contact endpoint crashes on odd input or a network error** and shows a raw error page. **[Audit] S**

## 2. Quick wins (small, low risk)

6. **Two pages share the title "Toolbox / Timothy Ali":** the Toolbox page and the Toolbox case study. **[SEO] S**
7. **Search data on inner pages names no author.** It points to "you" defined only on Home, and Google doesn't follow that. Add a small "Timothy Ali" entry to every page. **[SEO] S**
8. **Every analytics ping is redirected first:** a trailing slash, so it costs two calls per visit. **[SEO] S**
9. **The hero mountain picture isn't cached.** One word to add in `vercel.json`, and it can be half the size. **[SEO] [Perf] S**
10. **Home loads the first two work covers at top priority** even though they're below the fold. That slows the fonts. **[SEO] [Perf] S**
11. **13 KB of unused font data blocks every page:** Russian and Greek fallbacks of one face. **[SEO] [Perf] S**
12. **Two unused font packages:** Jersey 25 and Silkscreen. **[Audit] [Simplify] S**
13. **Text shifts when fonts arrive** on the Home name and the tool pages. Fallback sizing would stop it. **[Perf] S–M**
14. **Screenshots are compressed lighter than they need to be** (quality 90). Quality 80 cuts 30–40% on PARC/Sonde. Needs a quick look at text sharpness. **[Perf] S**
15. **The image size ladder skips the size 2× desktops need** for Work cards, so they pull a 293 KB file. About 300 KB saved on `/work/`. **[Perf] S**
16. **The texture still twitches on hover and click with Motion off.** It should be fully still. **[Audit] S**
17. **The texture can throw an error after you leave a page:** a late image or font load. **[Audit] S**
18. **Share-image alt text runs two sentences together** ("…on yellow Design by Timothy Ali."). **[SEO] S**

## 3. Speed: bigger jobs

19. **The texture redoes its "cut-out around text" maths for every cell, every tick.** That's a quarter of Home's CPU, and caching it is easy. **[Perf] S**
20. **PARC's palm-tree scene is half that page's CPU.** It draws the fronds for every cell. **[Perf] S**
21. **The texture's animation loop keeps running when it's off screen.** Stopping it saves battery. **[Perf] M**
22. **Every page ships all nine studies' data** for the meta tags: 17 KB of JS on each page. **[Perf] M**
23. **Jacquard (the blackletter) is a 35 KB file** for about 25 letters. Trimming it saves ~25 KB per page. It needs care, because the scramble animation may use other letters. **[Perf] S**
24. **The canvas runs at full phone density** (20 MB on Home). The reviewer says 1× would look identical since the art is whole pixels. **I'm not sure: the glyphs may soften.** Test on a real phone first. **[Perf] S**
25. **The PARC phone video is still 2.4 MB** (2:24 long). It could be a shorter loop or play only on tap on phones. **[Perf] S**

## 4. Code cleanup (no visual change)

26. **Dead code:**
    - the old Work-row styles, now used only by the share-image generator;
    - `IndexRow`, `fitTitle` and other unused exports;
    - eight review scripts that point at removed UI.

    About 250 lines. **[Simplify] S–M**
27. **Repeated code:**
    - title and description written twice per page;
    - the same five scene settings at 8 call sites;
    - the inner-page header CSS written three times;
    - one card component for Home and Work.

    **[Simplify] S–M**
28. **Stale comments** that describe the old Work rows and wrong breakpoints. **[Simplify] S**
29. **Accessibility labels screen readers never read:** code block names, the status strip, and the Toolbox settings rows. **[Audit] S–M**

## 5. Your call

30. **The Home h1 is "i'm tim."**, so the strongest SEO signal on Home has neither your full name nor your role. Options:
    - 1. Leave it. The page title and search data already carry the name. **(my pick)**
    - 2. Add "Timothy Ali" for screen readers only, inside the h1.
    - 3. Put the name in the visible role line.
31. **Study page titles are short**, e.g. "Sonde / Timothy Ali". Add a few words like "Sonde: XRP Ledger explorer"? **[SEO]**
32. **Security header (CSP):** worth adding, tested in report-only mode first. **[SEO] [Audit] M**

## Outside the repo (you, in Vercel/settings)

- **`timothyali.com` → `www` is a 307 redirect. It should be a 308** (Vercel domain settings).
- **The résumé PDF's author field says "Chromium".**

---

## What I'd do

**Batch A:** items 1–18, about half a day. **Batch B:** the speed jobs 19–25. Cleanup (26–29) can come along with either.

Full reports with file and line numbers: `docs/reviews/2026-10-14-reports.md`.
