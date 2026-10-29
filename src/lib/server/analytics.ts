import { createHmac } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { redis } from './redis';
import { dateRange, summarize, ranking, daysOf, client, type AnalyticsEvent, type DailyCounts } from '$lib/analytics';
import { hostSource, DIRECT } from '$lib/sources';
export const analyticsReady = () => Boolean(redis() && env.ANALYTICS_SECRET);
export function visitorKey(...parts: string[]) {
  if (!env.ANALYTICS_SECRET) throw new Error('Analytics is not configured');
  return createHmac('sha256', env.ANALYTICS_SECRET).update(JSON.stringify(parts)).digest('hex');
}
const YEAR = 31622400;
// Counts, the guard and the distinct-count estimates share one atomic operation. The guard is a
// per-minute rate limit (`rate`), a once-a-day mark (`once`) or nothing. No raw IPs, user agents
// or full referrer URLs are stored.
export const RECORD = `
if ARGV[1] == 'rate' then
 local count = redis.call('INCR', KEYS[1])
 if count == 1 then redis.call('EXPIRE', KEYS[1], 90) end
 if count > 120 then return 0 end
elseif ARGV[1] == 'once' then
 if not redis.call('SET', KEYS[1], '1', 'NX', 'EX', 90000) then return 0 end
end
redis.call('SET', 'tim:analytics:started', ARGV[2], 'NX')
redis.call('SET', 'tim:analytics:detailed', ARGV[2], 'NX')
for i = 5, #ARGV, 2 do redis.call('HINCRBY', KEYS[2], ARGV[i], tonumber(ARGV[i + 1])) end
redis.call('EXPIRE', KEYS[2], ${YEAR})
if ARGV[3] ~= '' then redis.call('PFADD', KEYS[3], ARGV[3]) redis.call('EXPIRE', KEYS[3], ${YEAR}) end
if ARGV[4] ~= '' then redis.call('PFADD', KEYS[4], ARGV[4]) redis.call('EXPIRE', KEYS[4], ${YEAR}) end
return 1`;
type Guard = { mode: 'rate' | 'once' | 'none'; key: string };
type Counts = [string, number][];
async function record(guard: Guard, counts: Counts, daily = '', monthly = '', monthlyKey = 'tim:uniq') {
  const db = redis();
  if (!db || !analyticsReady()) return false;
  const now = new Date(); const day = now.toISOString().slice(0, 10);
  const pairs = counts.filter(([, n]) => n > 0).flatMap(([field, n]) => [field, String(n)]);
  return Boolean(await db.eval(RECORD, [guard.key, `tim:day:${day}`, `tim:visitors:${day}`, `${monthlyKey}:${day}`], [guard.mode, now.toISOString(), daily, monthly, ...pairs]));
}
/** Where a request is from, as Cloudflare reads it from the address (no address is kept). */
export type Place = { country: string | null; region: string | null; city: string | null };
type Where = { country?: unknown; regionCode?: unknown; city?: unknown };
export function placeOf(cf: Where | undefined): Place {
  const text = (v: unknown) => (typeof v === 'string' ? v : '');
  const country = text(cf?.country).toUpperCase();
  const region = text(cf?.regionCode).toUpperCase();
  let city = text(cf?.city);
  city = city.replace(/[\u0000-\u001f\u007f/]+/g, ' ').trim().slice(0, 60);
  const ok = /^[A-Z]{2}$/.test(country);
  return { country: ok ? country : null, region: ok && /^[A-Z0-9]{1,3}$/.test(region) ? `${country}-${region}` : null, city: ok && city ? `${city} / ${/^[A-Z0-9]{1,3}$/.test(region) ? `${country}-${region}` : country}` : null };
}
const placeCounts = (prefix: string, place: Place): Counts => [[`${prefix}country:${place.country ?? 'Unknown'}`, 1], ...(prefix ? [] : [[`region:${place.region ?? 'Unknown'}`, 1], [`city:${place.city ?? 'Unknown'}`, 1]] as Counts)];
const day = () => new Date().toISOString().slice(0, 10);
const month = () => new Date().toISOString().slice(0, 7);
export async function recordEvent(event: AnalyticsEvent, ip: string, ua: string, place: Place) {
  const rate: Guard = { mode: 'rate', key: `tim:rate:${Math.floor(Date.now() / 60000)}:${visitorKey(day(), ip, 'rate')}` };
  if (event.type === 'view') {
    const { os, browser, device } = client(ua);
    const counts: Counts = [['views', 1], [`page:${event.path}`, 1], [`sourceview:${event.source}`, 1], [`device:${device}`, 1]];
    if (event.entry) counts.push(['visits', 1], [`entry:${event.path}`, 1], [`source:${event.source}`, 1], [`os:${os}`, 1], [`browser:${browser}`, 1], [`vdevice:${device}`, 1], ...placeCounts('', place), ...(event.campaign ? [[`campaign:${event.campaign}`, 1]] as Counts : []));
    // a visitor is counted per day (the daily estimate) and per calendar month (unique visitors)
    return record(rate, counts, visitorKey(day(), ip, ua), visitorKey('month', month(), ip, ua));
  }
  if (event.type === 'engage') return record(rate, [[`time:${event.path}`, event.seconds], ...event.reached.map((depth) => [`reach${depth}:${event.path}`, 1] as [string, number])]);
  if (event.type === 'out') return record(rate, [['outs', 1], [`out:${event.host}`, 1]]);
  return record(rate, [['resume', 1], [`resumesource:${event.source}`, 1]]);
}
/** A download through the site's own link: one per person, file and day. */
export async function recordDownload(file: string, source: string, ip: string, ua: string, place: Place) {
  const { os } = client(ua);
  return record({ mode: 'once', key: `tim:dl:${day()}:${visitorKey(day(), ip, ua, file)}` }, [['downloads', 1], [`download:${file}`, 1], [`dlsource:${source}`, 1], [`dlos:${os}`, 1], ...placeCounts('dl', place)]);
}
/** The app's check for updates: every check, and each install once a calendar month. */
const OS: Record<string, string> = { darwin: 'macOS', windows: 'Windows', linux: 'Linux' };
const ARCH: Record<string, string> = { aarch64: 'ARM64', x86_64: 'x64', i686: 'x86', armv7: 'ARMv7' };
export async function recordUpdateCheck(target: string, arch: string, version: string, bundle: string | null, ip: string, place: Place) {
  const platform = [OS[target] ?? target, ARCH[arch] ?? arch, bundle === 'appimage' ? 'AppImage' : bundle === 'deb' ? 'deb' : null].filter(Boolean).join(' · ');
  return record({ mode: 'none', key: 'tim:none' }, [['updates', 1], [`update:${version}`, 1], [`updateplatform:${platform}`, 1], ...placeCounts('update', place)], '', visitorKey('install', month(), ip, target, arch), 'tim:installs');
}
// Days before 0223 counted views per `referrer:`; they read as views per source under today's names.
const legacySource = (name: string) => name === DIRECT || name.startsWith('Link / ') ? name : hostSource(name);
function migrate(counts: DailyCounts | null) {
  if (!counts) return null;
  const out: DailyCounts = {};
  for (const [key, value] of Object.entries(counts)) {
    const name = key.startsWith('referrer:') ? `sourceview:${legacySource(key.slice(9))}` : key;
    out[name] = (out[name] || 0) + Number(value);
  }
  return out;
}
export async function readAnalytics(days: number) {
  const db = redis();
  if (!db || !analyticsReady()) return null;
  const dates = dateRange(days);
  const pipeline = db.pipeline();
  for (const day of dates) { pipeline.hgetall(`tim:day:${day}`); pipeline.pfcount(`tim:visitors:${day}`); }
  pipeline.get('tim:analytics:started');
  // one estimate over the period's days: a calendar month's visitors share one hash
  pipeline.pfcount(...(dates.map((day) => `tim:uniq:${day}`) as [string, ...string[]]));
  pipeline.pfcount(...(dates.map((day) => `tim:installs:${day}`) as [string, ...string[]]));
  pipeline.get('tim:analytics:detailed');
  const values = await pipeline.exec();
  const at = dates.length * 2;
  const daily = dates.map((day, i) => ({ day, counts: migrate(values[i * 2] as DailyCounts | null), visitors: Number(values[i * 2 + 1]) || 0 }));
  const counts = summarize(daily.map((row) => row.counts));
  const n = (key: string) => counts[key] || 0;
  const sources = [...new Set([...ranking(counts, 'source:'), ...ranking(counts, 'sourceview:'), ...ranking(counts, 'dlsource:')].map((row) => row.name))]
    .map((name) => ({ name, visits: n(`source:${name}`), views: n(`sourceview:${name}`), downloads: n(`dlsource:${name}`), resume: n(`resumesource:${name}`), days: daysOf(daily, `sourceview:${name}`) }))
    .sort((a, b) => b.visits - a.visits || b.views - a.views || a.name.localeCompare(b.name));
  const pages = ranking(counts, 'page:').map(({ name, count }) => ({ name, views: count, entries: n(`entry:${name}`), seconds: n(`time:${name}`), reach: Object.fromEntries([25, 50, 75, 100].map((d) => [d, n(`reach${d}:${name}`)])) as Record<number, number> }));
  return {
    started: values[at] as string | null, detailed: values[at + 3] as string | null,
    totals: { views: n('views'), visits: n('visits'), uniques: Number(values[at + 1]) || 0, downloads: n('downloads') + n('clicks'), outs: n('outs'), resume: n('resume'), contact: n('contact'), updates: n('updates'), installs: Number(values[at + 2]) || 0, seconds: ranking(counts, 'time:').reduce((s, row) => s + row.count, 0) },
    daily: daily.map(({ day, counts, visitors }) => ({ day, views: Number(counts?.views) || 0, visits: Number(counts?.visits) || 0, visitors, downloads: (Number(counts?.downloads) || 0) + (Number(counts?.clicks) || 0) })),
    pages, sources, campaigns: ranking(counts, 'campaign:'),
    countries: ranking(counts, 'country:'), regions: ranking(counts, 'region:'), cities: ranking(counts, 'city:'),
    os: ranking(counts, 'os:'), browsers: ranking(counts, 'browser:'), devices: ranking(counts, 'vdevice:'),
    outbound: ranking(counts, 'out:'), downloads: ranking(counts, 'download:'), downloadCountries: ranking(counts, 'dlcountry:'), downloadOs: ranking(counts, 'dlos:'),
    updates: { versions: ranking(counts, 'update:'), platforms: ranking(counts, 'updateplatform:'), countries: ranking(counts, 'updatecountry:') }
  };
}
