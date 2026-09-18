import { createHmac } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { redis } from './redis';
import { dateRange, summarize, ranking, type AnalyticsEvent, type DailyCounts } from '$lib/analytics';
export const analyticsReady = () => Boolean(redis() && env.ANALYTICS_SECRET);
export function visitorKey(day: string, ip: string, userAgent: string) {
  if (!env.ANALYTICS_SECRET) throw new Error('Analytics is not configured');
  return createHmac('sha256', env.ANALYTICS_SECRET).update(JSON.stringify([day, ip, userAgent])).digest('hex');
}
// Counts and limits share one atomic operation. No raw IPs, user agents or full referrer URLs are stored.
export const RECORD_EVENT = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], 90) end
if count > 60 then return 0 end
redis.call('SET', 'tim:analytics:started', ARGV[1], 'NX')
redis.call('HINCRBY', KEYS[2], ARGV[2], 1)
redis.call('HINCRBY', KEYS[2], ARGV[3], 1)
if ARGV[2] == 'views' then
 redis.call('HINCRBY', KEYS[2], ARGV[4], 1)
 redis.call('HINCRBY', KEYS[2], ARGV[5], 1)
 redis.call('PFADD', KEYS[3], ARGV[6])
 redis.call('EXPIRE', KEYS[3], 31622400)
end
redis.call('EXPIRE', KEYS[2], 31622400)
return 1`;
export async function recordEvent(event: AnalyticsEvent, ip: string, ua: string) {
  const db = redis();
  if (!db || !analyticsReady()) return false;
  const now = new Date(); const day = now.toISOString().slice(0, 10);
  const visitor = visitorKey(day, ip, ua);
  const rateKey = visitorKey(day, ip, 'rate');
  const device = /ipad|tablet/i.test(ua) ? 'Tablet' : /mobi|iphone|android/i.test(ua) ? 'Mobile' : 'Desktop';
  return await db.eval(RECORD_EVENT, [`tim:rate:${Math.floor(now.getTime() / 60000)}:${rateKey}`, `tim:day:${day}`, `tim:visitors:${day}`], [now.toISOString(), event.type === 'view' ? 'views' : 'clicks', event.type === 'view' ? `page:${event.path}` : `download:${event.file}`, event.type === 'view' ? `referrer:${event.referrer}` : '', `device:${device}`, visitor]);
}
export async function readAnalytics(days: number) {
  const db = redis();
  if (!db || !analyticsReady()) return null;
  const dates = dateRange(days);
  const pipeline = db.pipeline();
  for (const day of dates) { pipeline.hgetall(`tim:day:${day}`); pipeline.pfcount(`tim:visitors:${day}`); }
  pipeline.get('tim:analytics:started');
  const values = await pipeline.exec();
  const daily = dates.map((day, i) => ({ day, counts: values[i * 2] as DailyCounts | null, visitors: Number(values[i * 2 + 1]) || 0 }));
  const counts = summarize(daily.map((row) => row.counts));
  return { started: values.at(-1) as string | null, views: counts.views || 0, clicks: counts.clicks || 0,
    daily: daily.map(({ day, counts, visitors }) => ({ day, views: Number(counts?.views) || 0, visitors })),
    pages: ranking(counts, 'page:'), downloads: ranking(counts, 'download:'), referrers: ranking(counts, 'referrer:'), devices: ranking(counts, 'device:') };
}
