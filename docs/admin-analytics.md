# Private website analytics

Status: live at https://www.timothyali.com/admin/. Storage, server authorization, existing public routes and live analytics ingestion are verified. The approved owner address now has a verified Auth.js account, confirming the real email link completed verification.

## What it shows

Since 0223 (2026-10-27), for the last 7, 30 or 90 UTC days, including today:

- **Visitors** (different people, estimated per calendar month), **visits** (a visit ends after 30 minutes without activity or when someone arrives from a new source), **page views**, and **active time per visit**.
- **Sources** by visit: every page of a visit counts under where the visit came from (a referring site, a `?via=` tag, or a `utm_source` campaign), with views, downloads and resume opens per source. Hosts are grouped (lnkd.in and the LinkedIn app are linkedin.com; Google's country domains are google.com). Days before 0223 counted views per referrer host; they read as views per source.
- **Pages**: views, how often each was a visit's first page, active time per view, and the share of views that scrolled halfway and to the end.
- **Places** (country, region, city from Vercel's `x-vercel-ip-*` headers), **devices, systems and browsers** by visit, **links out** by host (mailto counts as email), **resume opens** (clicks on the resume link), and **contact messages** sent (counted by `api/contact.js`).
- **Site downloads**: the Toolbox page links to `/download/<version>/<file>`, which counts on the server (ad blockers and pages without JavaScript included) once per person, file and day, with the visit's source (`?s=`), country and system, then redirects to the GitHub file. A failed count never stops the download. Before 0223 these were browser click events (`clicks`), still added in.
- **Toolbox app**: update checks by version, platform and country, and installs checking (different copies, estimated per calendar month), from `/api/update/<target>/<arch>/<version>?bundle=<type>`, which counts and redirects to the newest release's `latest.json`. The app asks it first from the release after 1.2.1 (app repo, `tauri.conf.json`), only when someone clicks Updates; GitHub's address is its fallback.
- GitHub release-asset download counts by version, operating system, architecture, file format and kind (installer, portable zip, Mac update package), for the selected period and all time. These are requests for files, including repeats, the app's updater, the owner's own downloads and automated checks; they are not unique people or installations, and they are usually larger than site clicks, which only count this site's links from browsers that haven't signed in. Historical Windows assets remain visible. Checksums and the update feed are excluded.
- GitHub only reports all-time counts. Each fresh reading is stored as that UTC day's snapshot (`tim:gh:<day>`, kept 400 days), and a daily Vercel cron (`/api/releases-snapshot`, 23:50 UTC) makes sure every day has one. A period's count is today's count less the snapshot from the day before the period; a file uploaded inside the period counts in full. Without an earlier snapshot the row shows "since <date>" or a dash. Snapshots began 2026-10-27.
- A notice lists any download link on the Toolbox page whose file isn't in a published GitHub release (those links 404).
- GitHub results are cached for five minutes. Missing services or failures are explicitly shown as unavailable; there is no production sample-data fallback.

## Access and configuration

`/admin/` requires an Auth.js email session matching the `ADMIN_EMAILS` allowlist. Every admin page, child route and data request passes the server hook; matching an address in a client form never grants access. Removing an address from `ADMIN_EMAILS` immediately prevents that address from accessing the dashboard. The legacy single-address `ADMIN_EMAIL` setting is also supported. Production authentication is restricted to `https://www.timothyali.com`.

Auth.js uses Resend for sign-in email and Upstash Redis for verification tokens. Links last 15 minutes and are consumed atomically with GETDEL. Requests for another email are rejected before sending; repeat sends have a Redis-backed 60-second cooldown. Sessions are encrypted JWTs in HttpOnly, SameSite cookies, secure in production, with a seven-day lifetime. Private responses are no-store/noindex with a no-referrer policy. No secrets or account addresses belong in this repository.

Server environment variables:

| Variable | Purpose |
| --- | --- |
| `ADMIN_EMAILS` | Comma-separated permitted addresses, supplied by Timothy |
| `AUTH_SECRET` | Random secret of at least 32 bytes |
| `AUTH_RESEND_KEY` or `RESEND_API_KEY` | Email delivery key |
| `AUTH_EMAIL_FROM` or `CONTACT_FROM` | Sender on a domain verified with Resend |
| `UPSTASH_REDIS_REST_URL` or `KV_REST_API_URL` | Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` or `KV_REST_API_TOKEN` | Redis REST credential |
| `ANALYTICS_SECRET` | Separate random secret of at least 32 bytes for daily visitor hashes |
| `CRON_SECRET` | Optional. When set, `/api/releases-snapshot` only answers Vercel's cron (which sends it); without it, calls still go through the five-minute cache |
| `ANALYTICS_DEV` | Leave unset/0 in local development; set 1 only against a separate test database |

Provision Upstash and Resend through the Vercel Marketplace where available. Use free plans unless Timothy approves otherwise. Vercel CLI is now linked to the correct portfolio project. Existing production `RESEND_API_KEY` and `CONTACT_FROM` settings can be reused; actual delivery still needs verification. Upstash is provisioned on the free plan with automatic paid upgrades disabled. Timothy supplied three owner addresses; they are stored privately in Vercel, not in this repository. Keep all credentials in Vercel's environment settings or an ignored local env file. Verify a sender domain before attempting real email delivery.

## Measurement and retention

Public pages remain prerendered. A small browser component (`Analytics.svelte`) posts to `/api/e` (renamed from `/api/analytics`, which block lists drop; the old path still answers): a view when a public route becomes visible, skipping hash/query-only changes; an engagement report when a page is left or hidden (active seconds since the last report, counted while visible with input in the last 90 seconds, and the 25/50/75/100% scroll depths newly reached); clicks out and on the resume link. Only known public paths are accepted. Body size and content type are checked; cross-origin requests and known bots, link previews and scripts (`BOT` in `src/lib/analytics.ts`; curl and wget still count) are ignored. A per-IP-hash rate limit permits at most 120 events per minute. This reduces ordinary abuse but does not make browser analytics immune to fabricated requests.

The browser keeps the current visit's raw arrival (referrer, `via`, `utm_source`, `utm_campaign`) in `localStorage` (`tim-visit`) for 30 minutes after its last event; nothing identifying is sent. The server names the source from it.

A daily HMAC of IP and user agent goes into a per-day HyperLogLog (`tim:visitors:<day>`), and an HMAC that changes each calendar month into `tim:uniq:<day>`; the period's visitors are the union of the period's `tim:uniq` days, so someone who visits in two calendar months counts once in each. App installs use the same monthly scheme over IP, platform and architecture (`tim:installs:<day>`). Raw IPs and browser strings are not stored; places are stored only as counts. Only the external referrer hostname is kept. Browsers can suppress referrers or block analytics.

Daily aggregates and distinct-count structures expire after 366 days. The first-recorded-visit timestamp is retained separately. There is no tracking cookie. After successful admin access, a 366-day HttpOnly exclusion cookie prevents this browser's public browsing from being counted, including after sign-out. Other devices are counted until signed in there. Clearing the exclusion cookie restores tracking.

## Routing and builds

The site now uses adapter-vercel, with a Node 24 server for admin/auth/analytics and static output for the existing public pages. Legacy redirects are retained in `vercel.json`; the former static catch-all is replaced by SvelteKit routing and the existing custom 404 composition. Development-only `/og/[id]` compositions return 404 in production. Social verification reads `.vercel/output/static`.

## Verification

- `pnpm check`, `pnpm test`, `pnpm build`, `pnpm social:verify`.
- Unit tests cover event validation and aggregation, owner allowlisting, private request gating, malformed/oversized/cross-origin ingestion, known bot and owner exclusion, unavailable storage, sign-in cooldown, token consumption, redirect restrictions, and release-asset filtering.
- `tools/review/admin-fixture.mjs` serves **synthetic Redis REST data only for local verification**. It also writes short-lived JWTs signed with a public local-test secret to `/tmp/tim-admin-test-cookies.json`. This script is never imported by the app. Run it beside the `admin-fixture` server in `.claude/launch.json` (the matching local-test settings, port 5193). Do not use the public test secret in production.
- `tools/review/admin.mjs` uses Chrome to test real Auth.js JWT verification (owner and unauthorized address), anonymous page/data denial, no-store headers, date and release filters, sign-out, owner exclusion cookie, mobile widths, browser errors, route-view events, hash deduplication, build-click events, and the GitHub period and all-time totals against fixture snapshots. Tracking writes stay off during this browser test. Screenshots marked `fixture` contain synthetic counts.

### Required before publication

1. Completed: owner addresses and Vercel CLI sign-in.
2. Completed: free Redis and server secrets configured. Existing Resend sender/key reused; actual email delivery remains to be checked.
3. Completed: `tools/review/admin-storage.mjs` verified actual Redis writes, rate limits, aggregates, expiry and atomic token consumption with disposable keys. Those keys were deleted after the test.
4. Completed: Resend accepted the sign-in email and the owner then completed verification through the real link. The database confirms the approved account is email-verified. Real token atomicity and local sign-out passed. No real email link is stored in evidence.
5. Completed: deployment 7ae1e30 is live. All three approved addresses were verified with short-lived server-signed test sessions, an unapproved address and anonymous page/data requests were denied, GitHub counts rendered, public pages/redirects/404/contact endpoint passed, and a controlled build-click event reached Redis. Test increments were removed; no installer was downloaded. The real email-link verification was confirmed separately through the resulting verified account.
