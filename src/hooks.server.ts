import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';
import { authHandle, authReady } from './auth';
import { isOwner, isPrivatePath } from '$lib/server/access';
import { SITE_URL } from '$lib/site';

// The worker's responses get the security headers _headers gives static files. A response with
// fixed headers (a redirect made by Response.redirect, a passed-through fetch) is copied first.
const SECURITY: [string, string][] = [
  ['X-Content-Type-Options', 'nosniff'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['X-Frame-Options', 'SAMEORIGIN'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
  // two years, as Vercel sent it
  ['Strict-Transport-Security', 'max-age=63072000']
];
function secure(response: Response) {
  try { response.headers.set('X-Content-Type-Options', 'nosniff'); } catch { response = new Response(response.body, response); }
  for (const [k, v] of SECURITY) if (!response.headers.has(k)) response.headers.set(k, v);
  return response;
}

const route = async ({ event, resolve }: Parameters<Handle>[0]) => {
  const path = event.url.pathname;
  if (!dev && path.startsWith('/og/') && !path.endsWith('.png')) return new Response('Not found', { status: 404 });
  if (!isPrivatePath(path)) return resolve(event);
  const finish: typeof resolve = async (e, options) => {
    const login = e.url.pathname.replace(/\/$/, '') === '/admin/login';
    if (!login && e.url.pathname.startsWith('/admin')) {
      const session = authReady() ? await e.locals.auth() : null;
      if (!isOwner(session?.user?.email, env.ADMIN_EMAILS || env.ADMIN_EMAIL)) return new Response(null, { status: 303, headers: { Location: '/admin/login/' } });
    }
    if (!login && e.url.pathname.startsWith('/admin')) e.cookies.set('tim-analytics-exclude', '1', { path: '/', httpOnly: true, secure: !dev, sameSite: 'lax', maxAge: 366 * 86400 });
    return resolve(e, options);
  };
  let response: Response;
  // Auth.js trusts the deployment host; reject unexpected hosts before it creates links/cookies.
  if (!dev && event.url.origin !== SITE_URL) {
    response = new Response(`Admin is available at ${SITE_URL}/admin/`, { status: 403 });
  } else if (path.startsWith('/auth/') && !authReady()) {
    response = new Response('Sign-in is not configured yet.', { status: 503 });
  } else {
    response = authReady() ? await authHandle({ event, resolve: finish }) : await finish(event);
  }
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
};

export const handle: Handle = async (input) => secure(await route(input));
