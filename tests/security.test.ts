import { beforeEach, describe, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({ ready: true, email: null as string | null, env: { ADMIN_EMAIL: 'owner@example.com' }, record: vi.fn(), download: vi.fn() }));
vi.mock('$app/environment', () => ({ dev: false }));
vi.mock('$env/dynamic/private', () => ({ env: state.env }));
vi.mock('../src/auth', () => ({ authReady: () => state.ready, authHandle: async ({ event, resolve }: any) => { event.locals.auth = async () => ({ user: { email: state.email } }); return resolve(event); } }));
vi.mock('../src/lib/server/analytics', () => ({ analyticsReady: () => true, recordEvent: state.record, recordDownload: state.download, placeOf: () => ({ country: 'US', region: 'US-CO', city: 'Denver / US-CO' }) }));
import { handle } from '../src/hooks.server';
import { POST } from '../src/routes/api/e/+server';
import { GET as download } from '../src/routes/download/[version]/[file]/+server';
function context(path: string) { return { url: new URL(path, 'https://www.timothyali.com'), locals: {}, cookies: { set: vi.fn(), get: () => undefined } } as any; }
beforeEach(() => { state.email = null; state.ready = true; state.record.mockReset(); state.download.mockReset(); });
describe('server authorization', () => {
  it.each(['/admin/', '/admin/export/', '/admin/__data.json'])('blocks anonymous access to %s before loading data', async (path) => {
    const resolve = vi.fn(); const response = await handle({ event: context(path), resolve });
    expect(response.status).toBe(303); expect(resolve).not.toHaveBeenCalled(); expect(response.headers.get('Cache-Control')).toContain('no-store');
  });
  it('blocks a valid session belonging to another email', async () => {
    state.email = 'other@example.com'; const resolve = vi.fn();
    expect((await handle({ event: context('/admin/'), resolve })).status).toBe(303); expect(resolve).not.toHaveBeenCalled();
  });
  it('allows the owner and excludes their browser from analytics', async () => {
    state.email = 'owner@example.com'; const event = context('/admin/'); const response = await handle({ event, resolve: async () => new Response('private counts') });
    expect(response.status).toBe(200); expect(event.cookies.set).toHaveBeenCalledWith('tim-analytics-exclude', '1', expect.objectContaining({ httpOnly: true, secure: true }));
    expect(response.headers.get('X-Robots-Tag')).toContain('noindex');
  });
  it('fails closed when configuration is missing, and rejects unexpected production hosts', async () => {
    state.ready = false; expect((await handle({ event: context('/auth/session/'), resolve: vi.fn() })).status).toBe(503);
    const event = context('/admin/'); event.url = new URL('https://evil.test/admin/');
    expect((await handle({ event, resolve: vi.fn() })).status).toBe(403);
  });
  it('keeps the public site accessible without authentication', async () => {
    state.ready = false; expect((await handle({ event: context('/'), resolve: async () => new Response('public') })).status).toBe(200);
  });
});
async function post(body: string, headers: Record<string, string> = {}, excluded = false) {
  const event = context('/api/e'); event.request = new Request(event.url, { method: 'POST', headers: { Origin: event.url.origin, 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 Safari', ...headers }, body });
  event.getClientAddress = () => '192.0.2.1'; event.cookies.get = () => excluded ? '1' : undefined;
  return POST(event);
}
describe('ingestion boundary', () => {
  const valid = JSON.stringify({ type: 'view', path: '/' });
  it('rejects cross-origin events', async () => { expect((await post(valid, { Origin: 'https://evil.test' })).status).toBe(403); expect(state.record).not.toHaveBeenCalled(); });
  it('rejects malformed and oversized bodies', async () => {
    expect((await post('{')).status).toBe(400); expect((await post('a'.repeat(4097))).status).toBe(413); expect((await post(valid, { 'Content-Type': 'text/plain' })).status).toBe(415);
  });
  it('ignores known bots and the owner exclusion cookie', async () => {
    expect((await post(valid, { 'User-Agent': 'Googlebot' })).status).toBe(204); expect((await post(valid, {}, true)).status).toBe(204); expect(state.record).not.toHaveBeenCalled();
  });
  it('records valid requests and returns storage failure instead of a false success', async () => {
    expect((await post(valid)).status).toBe(204); expect(state.record).toHaveBeenCalledOnce();
    state.record.mockRejectedValueOnce(new Error('offline')); expect((await post(valid)).status).toBe(503);
  });
});
describe('download links', () => {
  function get(path: string, ua = 'Mozilla/5.0 Safari', excluded = false) {
    const event = context(path); const [, , version, file] = event.url.pathname.split('/');
    event.params = { version, file }; event.request = new Request(event.url, { headers: { 'User-Agent': ua } });
    event.getClientAddress = () => '192.0.2.1'; event.cookies.get = () => excluded ? '1' : undefined;
    return download(event);
  }
  it('counts a download with its source, then sends it to the GitHub file', async () => {
    const response = await get('/download/v1.2.1/Toolbox-1.2.1-arm64.dmg?s=linkedin.com');
    expect(response.status).toBe(302); expect(response.headers.get('Location')).toBe('https://github.com/tasyusef/toolbox/releases/download/v1.2.1/Toolbox-1.2.1-arm64.dmg');
    expect(response.headers.get('Cache-Control')).toContain('no-store'); expect(state.download).toHaveBeenCalledWith('Toolbox-1.2.1-arm64.dmg', 'linkedin.com', '192.0.2.1', 'Mozilla/5.0 Safari', expect.anything());
  });
  it('downloads without counting for bots and the owner, and when the count fails', async () => {
    expect((await get('/download/v1.2.1/Toolbox-1.2.1.dmg', 'Slackbot-LinkExpanding 1.0')).status).toBe(302);
    expect((await get('/download/v1.2.1/Toolbox-1.2.1.dmg', undefined, true)).status).toBe(302); expect(state.download).not.toHaveBeenCalled();
    state.download.mockRejectedValueOnce(new Error('offline')); expect((await get('/download/v1.2.1/Toolbox-1.2.1.dmg')).status).toBe(302);
  });
  it('refuses other files and a source it doesn’t know', async () => {
    for (const path of ['/download/v1.2.1/evil.sh', '/download/latest/Toolbox-1.2.1.dmg', '/download/v1.2.1/..%2F..%2Fx.dmg']) expect((await get(path)).status).toBe(404);
    await get('/download/v1.2.1/Toolbox-1.2.1.dmg?s=%3Cscript%3E'); expect(state.download.mock.calls[0][1]).toBe('Direct / unknown');
  });
});
