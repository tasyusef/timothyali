# PX-59 — SEO audit and optimisation (2026-10-02, 0145)

Timothy: “i want to set up a thorough SEO audit. get things nice and optimized.” Semrush's API had no units, so the audit is first-hand.

- `before-pages.txt` — the static pass over the build at `e8ea981`: titles, descriptions, canonicals, headings, images, JSON-LD, sitemap and share-image parity (`audit-script-used-for-before.mjs`, since folded into `tools/review/seo.mjs`).
- `before-headers.txt` — live response headers on 2026-10-02: `max-age=0` on every static file, no security headers, `/index.html` answering 200, the apex redirect a 307.
- `lighthouse-before.json` — mobile Lighthouse against production before the change: Home 80 (LCP 3.1s, TBT 510ms), Work 80 (LCP 5.4s), PARC 98; SEO, accessibility and best practices 100 on all three.
- `lighthouse-local-before-after.json` — the same pages built from `e8ea981` and from PX-59, served by the same local static server (no compression, so slower than production in absolute terms, but comparable): total bytes and LCP per page, and which image files each run fetched (PNG before, WebP after).
- `after-pages.txt`, `after-pages.json` — `pnpm seo:check` on the PX-59 build: 19 pages, 18 in the sitemap, 121 sitemap images, PASS.

Production headers and Lighthouse after the deploy are not in this folder; `curl -I` on an image and a page will show the cache and security headers once `master` is pushed.
