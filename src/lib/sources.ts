// How a visit's source is named, for the browser (Analytics.svelte, download links) and the server
// alike. It imports only `site`, so the page bundle stays without the work index (0207).
import { HOSTS, VIA } from './site';
export const DIRECT = 'Direct / unknown';
// A tagged link (`?via=acme`), for a link given out somewhere a referrer is not passed on, such
// as a job application: its visits count under their own source instead of Direct / unknown.
export const viaSource = (via: string) => `Link / ${via}`;
// a campaign link's `utm_source` / `utm_campaign`, lowercased
export const UTM = /^[a-z0-9][a-z0-9._-]{0,39}$/;
export const utmSource = (source: string) => `Campaign / ${source}`;
// One site under one name: the app and short-link hosts, and the subdomains that only bounce.
const ALIASES: Record<string, string> = { 'lnkd.in': 'linkedin.com', 'com.linkedin.android': 'linkedin.com', 't.co': 'x.com', 'twitter.com': 'x.com', 'com.twitter.android': 'x.com', 'com.google.android.gm': 'Gmail app', 'com.google.android.googlequicksearchbox': 'google.com', 'com.slack': 'slack.com', 'com.reddit.frontpage': 'reddit.com', 'out.reddit.com': 'reddit.com', 'old.reddit.com': 'reddit.com' };
export function hostSource(host: string) {
  const name = host.toLowerCase().replace(/^(www|m|l|lm|mobile|out)\./, '');
  if (ALIASES[name]) return ALIASES[name];
  if (/^(.+\.)?google\.[a-z.]+$/.test(name)) return 'google.com';
  return name.slice(0, 150);
}
/** Where a visit came from: its tag, its campaign, the site that linked it, or Direct / unknown. */
export function sourceOf(v: { referrer?: unknown; via?: unknown; utm?: unknown }) {
  if (typeof v.via === 'string' && VIA.test(v.via)) return viaSource(v.via);
  if (typeof v.utm === 'string' && UTM.test(v.utm)) return utmSource(v.utm);
  if (typeof v.referrer === 'string' && v.referrer.length <= 2048) {
    try {
      const url = new URL(v.referrer);
      // an Android app passes `android-app://<package>/`
      if (url.protocol === 'android-app:') return hostSource(url.hostname);
      if (/^https?:$/.test(url.protocol) && !HOSTS.includes(url.hostname)) return hostSource(url.hostname);
    } catch {}
  }
  return DIRECT;
}
// what a download's `?s=` or a stored source may be: one of the names above
export const isSource = (s: unknown): s is string => typeof s === 'string' && s.length <= 150 && (s === DIRECT || /^Link \/ [a-z0-9][a-z0-9-]{0,39}$/.test(s) || /^Campaign \/ [a-z0-9][a-z0-9._-]{0,39}$/.test(s) || s === 'Gmail app' || /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(s));
