import { RELEASES } from '$lib/toolbox';
import { analyticsReady, placeOf, recordUpdateCheck } from '$lib/server/analytics';
import type { RequestHandler } from './$types';
export const prerender = false;
export const trailingSlash = 'never';
// The app's check for updates (its updater's first endpoint, `{{target}}/{{arch}}/{{current_version}}`
// with `?bundle={{bundle_type}}`, the app repo's tauri.conf.json):
// counted, then sent on to the feed on the newest GitHub release. The app falls back to GitHub
// itself when this doesn't answer.
export const GET: RequestHandler = async ({ params, url, request, getClientAddress }) => {
  if (!/^(darwin|windows|linux)$/.test(params.target) || !/^(x86_64|aarch64|i686|armv7)$/.test(params.arch) || !/^\d{1,3}\.\d{1,3}\.\d{1,3}(-[0-9A-Za-z.-]{1,20})?$/.test(params.version)) return new Response('Not found', { status: 404 });
  if (analyticsReady()) {
    try { await recordUpdateCheck(params.target, params.arch, params.version, /^(app|appimage|deb|rpm|msi|nsis)$/.test(url.searchParams.get('bundle') ?? '') ? url.searchParams.get('bundle')! : null, getClientAddress(), placeOf(request.headers)); }
    catch { console.error('Update check count unavailable'); }
  }
  return new Response(null, { status: 302, headers: { Location: `${RELEASES}/latest/download/latest.json`, 'Cache-Control': 'private, no-store' } });
};
