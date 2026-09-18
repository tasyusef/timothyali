# PX-41 — Private analytics

New feature: there was no admin page before this iteration.

- `login-desktop.png`: local email sign-in page; no email sent.
- `dashboard-*-fixture.png`: local desktop/mobile dashboard with clearly designated synthetic fixture data.
- `browser-verification.json`: checks of authorization with actual Auth.js JWTs, UI interactions and event requests.

Implementation is deployed. Real Redis tests pass (`storage-verification.json`), and live route/access/ingestion tests pass (`production-verification.json`). Resend accepted the owner sign-in email; inbox arrival and the owner clicking its link remain pending. Production dashboard screenshots are kept outside this public repository because the traffic data is private. See `docs/admin-analytics.md` for the deployment checklist and metric definitions.
