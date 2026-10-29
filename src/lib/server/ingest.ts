import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { parseEvent, BOT } from '$lib/analytics';
import { SITE_URL } from '$lib/site';
import { analyticsReady, recordEvent, placeOf } from './analytics';
import type { RequestEvent } from '@sveltejs/kit';
/** True when a request shouldn't be counted: the owner's browsers, bots, or tracking switched off. */
export function ignored({ cookies, request }: Pick<RequestEvent, 'cookies' | 'request'>) {
  const ua = request.headers.get('user-agent') || '';
  return cookies.get('tim-analytics-exclude') === '1' || !analyticsReady() || (dev && env.ANALYTICS_DEV !== '1') || !ua || BOT.test(ua);
}
// The browser's events (Analytics.svelte): same origin, small JSON, one event a request.
export async function ingest({ request, url, cookies, getClientAddress, platform }: RequestEvent) {
  const headers = { 'Cache-Control': 'no-store' };
  const empty = () => new Response(null, { status: 204, headers });
  const origin = request.headers.get('origin');
  if (origin !== url.origin || (!dev && origin !== SITE_URL)) return new Response(null, { status: 403, headers });
  if (Number(request.headers.get('content-length') || 0) > 4096) return new Response(null, { status: 413, headers });
  if (!request.headers.get('content-type')?.startsWith('application/json')) return new Response(null, { status: 415, headers });
  if (ignored({ cookies, request })) return empty();
  // Enforce an actual byte limit too, including chunked requests with no Content-Length.
  const reader = request.body?.getReader(); if (!reader) return new Response(null, { status: 400, headers });
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > 4096) { await reader.cancel(); return new Response(null, { status: 413, headers }); } chunks.push(value); }
  let event;
  try { event = parseEvent(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { return new Response(null, { status: 400, headers }); }
  if (!event) return new Response(null, { status: 400, headers });
  try { await recordEvent(event, getClientAddress(), (request.headers.get('user-agent') || '').slice(0, 512), placeOf(platform?.cf)); }
  catch { console.error('Analytics event storage unavailable'); return new Response(null, { status: 503, headers }); }
  return empty();
}
