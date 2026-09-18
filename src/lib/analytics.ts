import { socialPages } from './social';
import { builds } from './toolbox';
export const publicPaths = socialPages.map((page) => page.path);
export const downloadFiles = builds.flatMap((build) => build.files.map((file) => ({
  name: new URL(file.href).pathname.split('/').at(-1)!, label: `${build.os} · ${file.label}`, href: file.href
})));
export type Visit = { type: 'view'; path: string; referrer: string };
export type Download = { type: 'download'; path: string; file: string };
export type AnalyticsEvent = Visit | Download;
export function parseEvent(value: unknown): AnalyticsEvent | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (typeof v.path !== 'string' || !publicPaths.includes(v.path)) return null;
  if (v.type === 'view') {
    let referrer = 'Direct / unknown';
    if (typeof v.referrer === 'string' && v.referrer.length <= 2048) {
      try { const url = new URL(v.referrer); if (/^https?:$/.test(url.protocol) && !['www.timothyali.com', 'timothyali.com'].includes(url.hostname)) referrer = url.hostname.slice(0, 150); } catch {}
    }
    return { type: 'view', path: v.path, referrer };
  }
  if (v.type === 'download' && typeof v.file === 'string' && downloadFiles.some((file) => file.name === v.file)) return { type: 'download', path: v.path, file: v.file };
  return null;
}
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
export function ranking(counts: DailyCounts, prefix: string) {
  return Object.entries(counts).filter(([key]) => key.startsWith(prefix)).map(([key, count]) => ({ name: key.slice(prefix.length), count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
