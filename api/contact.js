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
export const config = { runtime: 'nodejs' };

const TO = process.env.CONTACT_TO ?? 'studio@timothyali.com';
const FROM = process.env.CONTACT_FROM ?? 'timothyali.com <onboarding@resend.dev>';
const SITE = 'https://www.timothyali.com';
const LIMITS = { name: 120, email: 200, message: 5000 };

const clean = (v, max) => (typeof v === 'string' ? v.replace(/\r\n?/g, '\n').trim().slice(0, max) : '');
const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

async function readForm(request) {
  const type = request.headers.get('content-type') ?? '';
  if (type.includes('application/json')) return await request.json();
  const fd = await request.formData();
  return Object.fromEntries(fd.entries());
}

function answer(request, status, body) {
  const wantsHtml = !(request.headers.get('accept') ?? '').includes('application/json') && (request.headers.get('accept') ?? '').includes('text/html');
  if (wantsHtml) return Response.redirect(`${SITE}/contact/?${body.ok ? 'sent=1' : 'error=' + encodeURIComponent(body.error)}#contact-form`, 303);
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

export async function POST(request) {
  let data;
  try { data = await readForm(request); } catch { return answer(request, 400, { ok: false, error: 'bad-request' }); }
  // `company` is the honeypot: a hidden field people never see and bots fill in.
  if (clean(data.company, 10)) return answer(request, 200, { ok: true });
  const name = clean(data.name, LIMITS.name), email = clean(data.email, LIMITS.email), message = clean(data.message, LIMITS.message);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return answer(request, 400, { ok: false, error: 'invalid' });
  if (!process.env.RESEND_API_KEY) return answer(request, 500, { ok: false, error: 'unconfigured' });

  const subject = `${name} via timothyali.com`;
  const text = `${message}\n\n—\n${name}\n${email}\n${new Date().toISOString()}`;
  const html = `<pre style="font:16px/1.5 ui-monospace,monospace;white-space:pre-wrap">${escape(message)}</pre><p style="font:14px/1.5 ui-monospace,monospace;color:#666">— ${escape(name)} &lt;${escape(email)}&gt;<br>${new Date().toISOString()}</p>`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, text, html })
  });
  if (!res.ok) { console.error('resend', res.status, await res.text()); return answer(request, 502, { ok: false, error: 'send-failed' }); }
  return answer(request, 200, { ok: true });
}

export function GET() { return new Response('POST only', { status: 405, headers: { allow: 'POST' } }); }
