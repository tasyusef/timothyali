import { DOWNLOAD_FILE, DOWNLOAD_VERSION, DIRECT, isSource } from '$lib/analytics';
import { RELEASES } from '$lib/toolbox';
import { ignored } from '$lib/server/ingest';
import { placeOf, recordDownload } from '$lib/server/analytics';
import type { RequestHandler } from './$types';
export const prerender = false;
export const trailingSlash = 'never';
// The site's download links come here, are counted on the server (so ad blockers and pages
// without JavaScript still count, once per person, file and day) and go on to the GitHub file.
// `?s=` is the visit's source, which Analytics adds to the link. A failed count never stops a download.
export const GET: RequestHandler = async ({ params, url, request, cookies, getClientAddress }) => {
  if (!DOWNLOAD_VERSION.test(params.version) || !DOWNLOAD_FILE.test(params.file)) return new Response('Not found', { status: 404 });
  const source = url.searchParams.get('s');
  if (!ignored({ cookies, request })) {
    try { await recordDownload(params.file, isSource(source) ? source : DIRECT, getClientAddress(), (request.headers.get('user-agent') || '').slice(0, 512), placeOf(request.headers)); }
    catch { console.error('Download count unavailable'); }
  }
  return new Response(null, { status: 302, headers: { Location: `${RELEASES}/download/${params.version}/${encodeURIComponent(params.file)}`, 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex' } });
};
