import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { parseEvent } from '$lib/analytics';
import { analyticsReady, recordEvent } from '$lib/server/analytics';
import type { RequestHandler } from './$types';
export const prerender = false;
export const POST: RequestHandler = async ({ request, url, cookies, getClientAddress }) => {
  const headers = { 'Cache-Control': 'no-store' };
  const empty = () => new Response(null, { status: 204, headers });
  const origin = request.headers.get('origin');
  if (origin !== url.origin || (!dev && origin !== 'https://www.timothyali.com')) return new Response(null, { status: 403, headers });
  if (Number(request.headers.get('content-length') || 0) > 4096) return new Response(null, { status: 413, headers });
  if (!request.headers.get('content-type')?.startsWith('application/json')) return new Response(null, { status: 415, headers });
  if (cookies.get('tim-analytics-exclude') === '1' || !analyticsReady() || (dev && env.ANALYTICS_DEV !== '1')) return empty();
  const ua = request.headers.get('user-agent') || '';
  if (!ua || /bot|crawler|spider|headless|lighthouse|preview|facebookexternalhit/i.test(ua)) return empty();
  // Enforce an actual byte limit too, including chunked requests with no Content-Length.
  const reader = request.body?.getReader(); if (!reader) return new Response(null, { status: 400, headers });
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > 4096) { await reader.cancel(); return new Response(null, { status: 413, headers }); } chunks.push(value); }
  let event;
  try { event = parseEvent(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { return new Response(null, { status: 400, headers }); }
  if (!event) return new Response(null, { status: 400, headers });
  try { await recordEvent(event, getClientAddress(), ua.slice(0, 512)); }
  catch { console.error('Analytics event storage unavailable'); return new Response(null, { status: 503, headers }); }
  return empty();
};
