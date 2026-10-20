// The contact form's mail relay (decision 0090). A Vercel Function beside the static build:
// the form POSTs here, this sends one email through Resend and answers JSON (or, without
// JavaScript, redirects back to the page with ?sent=1 / ?error=1).
//
// Environment (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   required; nothing is sent without it
//   CONTACT_TO       optional; defaults to studio@timothyali.com
//   CONTACT_FROM     optional; defaults to Resend's onboarding sender, which can only reach
//                    the address the Resend account was registered with — verify
//                    timothyali.com in Resend and set this to a sender on it for anything else
//   UPSTASH_REDIS_REST_URL / _TOKEN (or KV_REST_API_URL / _TOKEN), the analytics store:
//                    optional; with it each address may send 5 messages per 10 minutes
export const config = { runtime: 'nodejs' };
import { createHash } from 'node:crypto';
import { Redis } from '@upstash/redis';

import { SITE_URL as SITE, EMAIL as ADDRESS, LIMITS, EMAIL_PATTERN as EMAIL } from '../src/lib/shared.js';

const TO = process.env.CONTACT_TO ?? ADDRESS;
const FROM = process.env.CONTACT_FROM ?? 'timothyali.com <onboarding@resend.dev>';

const clean = (v, max) => (typeof v === 'string' ? v.replace(/\r\n?/g, '\n').trim().slice(0, max) : '');
// one line, no control characters: the name goes into the subject
const line = (v, max) => clean(v, max).replace(/[\u0000-\u001f\u007f]+/g, ' ').trim();
const RATE = { max: 5, seconds: 600 };
const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// A flood would fill the inbox and spend the Resend quota, so real messages would fail.
// The counter is keyed by a hash of the address (no raw IPs are stored); without Redis
// the form still sends.
async function allowed(request) {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || request.headers.get('x-real-ip') || '';
  if (!url || !token || !ip) return true;
  try {
    const db = new Redis({ url, token });
    const key = `tim:contact:${createHash('sha256').update(ip).digest('hex').slice(0, 32)}`;
    const count = await db.incr(key);
    if (count === 1) await db.expire(key, RATE.seconds);
    return count <= RATE.max;
  } catch (e) { console.error('contact rate', e); return true; }
}

// A browser sends Origin on every POST; one from another site is refused.
function sameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === request.headers.get('host'); } catch { return false; }
}

async function readForm(request) {
  const type = request.headers.get('content-type') ?? '';
  if (type.includes('application/json')) return await request.json();
  const fd = await request.formData();
  return Object.fromEntries(fd.entries());
}

function answer(request, status, body) {
  const wantsHtml = !(request.headers.get('accept') ?? '').includes('application/json') && (request.headers.get('accept') ?? '').includes('text/html');
  if (wantsHtml) return Response.redirect(`${SITE}/contact/?${body.ok ? 'sent=1' : 'error=' + encodeURIComponent(body.error)}#${body.ok ? 'contact-sent' : 'contact-failed'}`, 303);
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

export async function POST(request) {
  let data;
  if (!sameOrigin(request)) return answer(request, 403, { ok: false, error: 'bad-request' });
  try { data = await readForm(request); } catch { return answer(request, 400, { ok: false, error: 'bad-request' }); }
  if (!data || typeof data !== 'object') return answer(request, 400, { ok: false, error: 'bad-request' });
  // `hp_check` is the honeypot: a hidden field people never see and bots fill in. Its name
  // means nothing to autofill (a field called `company` could be filled by the browser and
  // drop a real message).
  if (clean(data.hp_check, 10)) { console.info('contact honeypot'); return answer(request, 200, { ok: true }); }
  const name = line(data.name, LIMITS.name), email = line(data.email, LIMITS.email), message = clean(data.message, LIMITS.message);
  if (!name || !message || !EMAIL.test(email)) return answer(request, 400, { ok: false, error: 'invalid' });
  if (!process.env.RESEND_API_KEY) return answer(request, 500, { ok: false, error: 'unconfigured' });
  if (!(await allowed(request))) return answer(request, 429, { ok: false, error: 'rate-limited' });

  const subject = `${name} via timothyali.com`;
  const text = `${message}\n\n—\n${name}\n${email}\n${new Date().toISOString()}`;
  const html = `<pre style="font:16px/1.5 ui-monospace,monospace;white-space:pre-wrap">${escape(message)}</pre><p style="font:14px/1.5 ui-monospace,monospace;color:#666">— ${escape(name)} &lt;${escape(email)}&gt;<br>${new Date().toISOString()}</p>`;
  let res;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, text, html }),
      signal: AbortSignal.timeout(8000)
    });
  } catch (e) { console.error('resend', e); return answer(request, 502, { ok: false, error: 'send-failed' }); }
  if (!res.ok) { console.error('resend', res.status, await res.text()); return answer(request, 502, { ok: false, error: 'send-failed' }); }
  return answer(request, 200, { ok: true });
}

export function GET() { return new Response('POST only', { status: 405, headers: { allow: 'POST' } }); }
