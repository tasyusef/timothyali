import { env } from '$env/dynamic/private';
import { currentReleases } from '$lib/server/releases';
import type { RequestHandler } from './$types';
export const prerender = false;
// The worker's daily cron (wrangler.jsonc, `scheduled` in svelte.config.js) keeps a reading of GitHub's counts for every UTC day, so the
// admin can show a period's downloads on days nobody opens it. Readings go through the five-minute
// cache, so outside calls add at most one GitHub request per five minutes and can't change a count.
export const GET: RequestHandler = async ({ request }) => {
  const headers = { 'Cache-Control': 'no-store' };
  if (env.CRON_SECRET && request.headers.get('authorization') !== `Bearer ${env.CRON_SECRET}`) return new Response(null, { status: 401, headers });
  try { await currentReleases(); } catch { return new Response(null, { status: 503, headers }); }
  return new Response(null, { status: 204, headers });
};
