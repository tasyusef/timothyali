# PX-41 — Private analytics

New feature: there was no admin page before this iteration.

- `login-desktop.png`: local email sign-in page; no email sent.
- `dashboard-*-fixture.png`: local desktop/mobile dashboard with clearly designated synthetic fixture data.
- `browser-verification.json`: checks of authorization with actual Auth.js JWTs, UI interactions and event requests.

Implementation is local and not deployed. Real Redis tests now pass (`storage-verification.json`); real email delivery and live-site verification remain pending. See `docs/admin-analytics.md` for the deployment checklist and metric definitions.
