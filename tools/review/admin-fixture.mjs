// Local verification only. It serves explicit fixture data to a dev server through
// the same Redis REST interface as production. Never used by application code.
import http from 'node:http';
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const authRequire = createRequire(import.meta.resolve('@auth/sveltekit'));
const { encode } = await import(pathToFileURL(authRequire.resolve('@auth/core/jwt')).href);
export const secret = 'local-verification-only-not-a-production-secret-0123456789';
const fixture = {
  rows: [{ version: 'v1.1.0', file: 'Toolbox-1.1.0-arm64.dmg', count: 32, platform: 'macOS', architecture: 'ARM64', format: 'dmg' }, { version: 'v1.1.0', file: 'Toolbox-1.1.0.dmg', count: 12, platform: 'macOS', architecture: 'Intel / x64', format: 'dmg' }, { version: 'v1.0.0', file: 'Toolbox-1.0.0.exe', count: 1, platform: 'Windows (historical)', architecture: 'Intel / x64', format: 'exe' }], updated: new Date().toISOString()
};
function command(cmd) {
  const [op, key] = cmd;
  if (op.toLowerCase() === 'get') return key === 'tim:releases:v1' ? JSON.stringify(fixture) : key === 'tim:analytics:started' ? '2026-09-17T12:00:00Z' : null;
  if (op.toLowerCase() === 'hgetall') return ['views', '12', 'clicks', '2', 'page:/', '8', 'page:/toolbox/', '4', 'referrer:www.linkedin.com', '5', 'referrer:Direct / unknown', '7', 'device:Desktop', '9', 'device:Mobile', '3', 'download:Toolbox-1.1.0-arm64.dmg', '2'];
  if (op.toLowerCase() === 'pfcount') return 8;
  return 'OK';
}
const cookies = await Promise.all(['owner@example.com', 'other@example.com'].map(async email => ({ name: 'authjs.session-token', value: await encode({ secret, salt: 'authjs.session-token', token: { email }, maxAge: 3600 }), domain: '127.0.0.1', path: '/', httpOnly: true, sameSite: 'Lax', secure: false })));
writeFileSync('/tmp/tim-admin-test-cookies.json', JSON.stringify(cookies), { mode: 0o600 });
http.createServer(async (req, res) => {
  let body = ''; for await (const chunk of req) body += chunk;
  const payload = JSON.parse(body);
  const encodeResult = value => typeof value === 'string' && value !== 'OK' ? Buffer.from(value).toString('base64') : Array.isArray(value) ? value.map(encodeResult) : value;
  const result = Array.isArray(payload[0]) ? payload.map(cmd => ({ result: encodeResult(command(cmd)) })) : { result: encodeResult(command(payload)) };
  res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(result));
}).listen(8766, '127.0.0.1', () => console.log('Local admin fixture ready on 8766 (synthetic counts).'));
