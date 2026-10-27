import { socialPages } from './social';
import { builds } from './toolbox';
import { HOSTS } from './site';
import { sourceOf, hostSource, UTM } from './sources';
export { DIRECT, isSource } from './sources';
export const publicPaths = socialPages.map((page) => page.path);
export const downloadFiles = builds.flatMap((build) => build.files.map((file) => ({
  name: decodeURIComponent(file.href.split('/').at(-1)!), label: `${build.os} · ${file.label}`, href: file.href
})));
export type Visit = { type: 'view'; path: string; source: string; campaign: string | null; entry: boolean };
export type Engage = { type: 'engage'; path: string; seconds: number; reached: number[] };
export type Outbound = { type: 'out'; path: string; host: string };
export type Resume = { type: 'resume'; path: string; source: string };
export type AnalyticsEvent = Visit | Engage | Outbound | Resume;
export const DEPTHS = [25, 50, 75, 100];
export function parseEvent(value: unknown): AnalyticsEvent | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (typeof v.path !== 'string' || !publicPaths.includes(v.path)) return null;
  if (v.type === 'view') {
    const campaign = typeof v.campaign === 'string' && UTM.test(v.campaign) ? v.campaign : null;
    return { type: 'view', path: v.path, source: sourceOf(v), campaign, entry: v.entry === true };
  }
  if (v.type === 'engage') {
    // visible, active seconds since the last report, and the scroll depths first crossed since then
    const seconds = Math.round(Number(v.seconds));
    const reached = Array.isArray(v.reached) ? [...new Set(v.reached)].filter((d): d is number => DEPTHS.includes(d as number)) : [];
    if (!Number.isFinite(seconds) || seconds < 0 || seconds > 1800 || (!seconds && !reached.length)) return null;
    return { type: 'engage', path: v.path, seconds, reached };
  }
  if (v.type === 'out' && typeof v.host === 'string') {
    const host = v.host === 'email' ? 'email' : /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(v.host) && !HOSTS.includes(v.host.toLowerCase()) ? hostSource(v.host) : null;
    return host ? { type: 'out', path: v.path, host } : null;
  }
  if (v.type === 'resume') return { type: 'resume', path: v.path, source: sourceOf(v) };
  return null;
}
/** A site download link's version and file, as `/download/v1.2.1/Toolbox-1.2.1.dmg` names them. */
export const DOWNLOAD_VERSION = /^v\d{1,3}\.\d{1,3}\.\d{1,3}$/;
export const DOWNLOAD_FILE = /^(Toolbox|toolbox)[-_][A-Za-z0-9._-]{1,80}\.(dmg|zip|exe|AppImage|deb)$/;
export function dateRange(days: number, now = new Date()) {
  return Array.from({ length: days }, (_, i) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - days + i + 1)).toISOString().slice(0, 10));
}
export type DailyCounts = Record<string, number>;
export function summarize(rows: (DailyCounts | null)[]) {
  const result: DailyCounts = {};
  for (const row of rows) for (const [key, value] of Object.entries(row ?? {})) {
    if (Number.isFinite(Number(value)) && Number(value) >= 0) result[key] = (result[key] || 0) + Number(value);
  }
  return result;
}
// The days each entry was counted on, newest first: counts are kept per UTC day, so a day is the
// finest time a visit has (no times are stored)
export function daysOf(daily: { day: string; counts: DailyCounts | null }[], key: string) {
  return daily.filter((row) => Number(row.counts?.[key]) > 0).map((row) => ({ day: row.day, count: Number(row.counts![key]) })).reverse();
}
export function ranking(counts: DailyCounts, prefix: string) {
  return Object.entries(counts).filter(([key]) => key.startsWith(prefix)).map(([key, count]) => ({ name: key.slice(prefix.length), count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
/** The browser, operating system and device class from a user agent, coarsely. */
export function client(ua: string) {
  const os = /iphone|ipad|ipod/i.test(ua) ? 'iOS' : /android/i.test(ua) ? 'Android' : /cros/i.test(ua) ? 'ChromeOS' : /mac os x|macintosh/i.test(ua) ? 'macOS' : /windows/i.test(ua) ? 'Windows' : /linux/i.test(ua) ? 'Linux' : 'Other';
  const browser = /edg\//i.test(ua) ? 'Edge' : /opr\/|opera/i.test(ua) ? 'Opera' : /samsungbrowser/i.test(ua) ? 'Samsung Internet' : /firefox|fxios/i.test(ua) ? 'Firefox' : /chrome|crios|chromium/i.test(ua) ? 'Chrome' : /safari/i.test(ua) ? 'Safari' : /curl|wget/i.test(ua) ? 'Command line' : 'Other';
  const device = /ipad|tablet/i.test(ua) ? 'Tablet' : /mobi|iphone|android/i.test(ua) ? 'Mobile' : 'Desktop';
  return { os, browser, device };
}
/** Crawlers, link previews, monitors and scripts: never counted. curl and wget stay (a person on Linux). */
export const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|whatsapp|telegram|skype|discord|slack|vkshare|pinterest|bitly|okhttp|python|go-http|java\/|node-fetch|axios|undici|libwww|scrapy|httpclient|monitor|uptime|pingdom|check|validator|scan|fetch\b|feed|rss|semrush|ahrefs|mj12|dotbot|petal|bytespider|gptbot|claude|perplexity|ccbot|amazonbot|applebot/i;
