# Private website analytics

Status: production storage and the private email allowlist are configured. Real Redis writes, counts, limits, expiry and one-time token consumption have passed. Deployment and email delivery verification are in progress.

## What it shows

- Page views, estimated visitors per day, page breakdown, referrer hosts and device groups for the last 7, 30 or 90 UTC days, including today.
- Toolbox download-link clicks from this website, by filename, within the selected traffic period.
- GitHub release-asset download counts by version, operating system, architecture and file format. These are all-time requests for files, including repeats and automated checks; they are not unique people or installations. Historical Windows assets remain visible. Checksums and updater metadata are excluded.
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
| `ANALYTICS_DEV` | Leave unset/0 in local development; set 1 only against a separate test database |

Provision Upstash and Resend through the Vercel Marketplace where available. Use free plans unless Timothy approves otherwise. Vercel CLI is now linked to the correct portfolio project. Existing production `RESEND_API_KEY` and `CONTACT_FROM` settings can be reused; actual delivery still needs verification. Upstash is provisioned on the free plan with automatic paid upgrades disabled. Timothy supplied three owner addresses; they are stored privately in Vercel, not in this repository. Keep all credentials in Vercel's environment settings or an ignored local env file. Verify a sender domain before attempting real email delivery.

## Measurement and retention

Public pages remain prerendered. A small browser component records a view when a public route becomes visible, skipping hash/query-only changes. Direct GitHub download links keep their normal behavior; failed event delivery never prevents downloads. Only known public paths and current download filenames are accepted by the ingestion endpoint. Body size and content type are checked; cross-origin requests and known bot user agents are rejected/ignored. A per-IP-hash rate limit permits at most 60 events per minute. This reduces ordinary abuse but does not make browser analytics immune to fabricated requests.

A daily HMAC of IP and user agent goes into a HyperLogLog distinct-count estimate. Raw IPs and browser strings are not stored. Each day uses a different hash, so daily visitor estimates must **not** be summed and described as unique people over a month. Only the external referrer hostname is stored; internal navigation and missing referrers appear as Direct / unknown. This is a count of page views by referrer, not session acquisition attribution. Browsers can suppress referrers or block analytics. Page-view totals include repeat visits.

Daily aggregates and distinct-count structures expire after 366 days. The first-recorded-visit timestamp is retained separately. There is no tracking cookie. After successful admin access, a 366-day HttpOnly exclusion cookie prevents this browser's public browsing from being counted, including after sign-out. Other devices are counted until signed in there. Clearing the exclusion cookie restores tracking.

## Routing and builds

The site now uses adapter-vercel, with a Node 24 server for admin/auth/analytics and static output for the existing public pages. Legacy redirects are retained in `vercel.json`; the former static catch-all is replaced by SvelteKit routing and the existing custom 404 composition. Development-only `/og/[id]` compositions return 404 in production. Social verification reads `.vercel/output/static`.

## Verification

- `pnpm check`, `pnpm test`, `pnpm build`, `pnpm social:verify`.
- Unit tests cover event validation and aggregation, owner allowlisting, private request gating, malformed/oversized/cross-origin ingestion, known bot and owner exclusion, unavailable storage, sign-in cooldown, token consumption, redirect restrictions, and release-asset filtering.
- `tools/review/admin-fixture.mjs` serves **synthetic Redis REST data only for local verification**. It also writes short-lived JWTs signed with a public local-test secret to `/tmp/tim-admin-test-cookies.json`. This script is never imported by the app. Run it beside a dev server configured with the matching local-test settings in the script, port 5193. Do not use the public test secret in production.
- `tools/review/admin.mjs` uses Chrome to test real Auth.js JWT verification (owner and unauthorized address), anonymous page/data denial, no-store headers, date and release filters, sign-out, owner exclusion cookie, mobile widths, browser errors, route-view events, hash deduplication and build-click events. Tracking writes stay off during this browser test. Screenshots marked `fixture` contain synthetic counts.

### Required before publication

1. Completed: owner addresses and Vercel CLI sign-in.
2. Completed: free Redis and server secrets configured. Existing Resend sender/key reused; actual email delivery remains to be checked.
3. Completed: `tools/review/admin-storage.mjs` verified actual Redis writes, rate limits, aggregates, expiry and atomic token consumption with disposable keys. Those keys were deleted after the test.
4. Send an authorized sign-in email to the owner, consume the link once, verify a replay fails, verify sign-out and anonymous data denial. Avoid persisting real sign-in links in screenshots/logs.
5. Deploy; verify live login/owner access, current GitHub totals, public pages, old redirects, custom 404, excluded admin traffic and a controlled public event with a build click. Do not download installers merely to test tracking.
