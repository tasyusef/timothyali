// Local verification only. It serves explicit fixture data to a dev server through
// the same Redis REST interface as production. Never used by application code.
import http from 'node:http';
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const authRequire = createRequire(import.meta.resolve('@auth/sveltekit'));
const { encode } = await import(pathToFileURL(authRequire.resolve('@auth/core/jwt')).href);
export const secret = 'local-verification-only-not-a-production-secret-0123456789';
const row = (version, file, count, created, platform, architecture, format, kind = 'Installer') => ({ version, file, count, published: created, created, platform, architecture, format, kind });
const fixture = {
  rows: [row('v1.2.0', 'Toolbox-1.2.0-arm64.dmg', 17, new Date().toISOString().slice(0, 10), 'macOS', 'ARM64', 'dmg'), row('v1.1.0', 'Toolbox-1.1.0-arm64.dmg', 32, '2026-09-15', 'macOS', 'ARM64', 'dmg'), row('v1.1.0', 'Toolbox-1.1.0.dmg', 12, '2026-09-15', 'macOS', 'Intel / x64', 'dmg'), row('v1.0.0', 'Toolbox-Setup-1.0.0.exe', 1, '2026-09-12', 'Windows (historical)', 'Intel / x64', 'exe')], updated: new Date().toISOString()
};
// every day's GitHub reading: the 1.1.0 Apple silicon build at 20, so a period shows 12
const snapshot = ['Toolbox-1.1.0-arm64.dmg', '20', 'Toolbox-1.1.0.dmg', '12', 'Toolbox-Setup-1.0.0.exe', '1'];
// one day of counts, the same every day; the detailed counts (0223) began three days ago
const detailed = new Date(Date.now() - 3 * 86400000).toISOString();
const day = { views: 12, visits: 5, 'page:/': 8, 'page:/toolbox/': 4, 'entry:/': 4, 'entry:/toolbox/': 1, 'sourceview:linkedin.com': 5, 'referrer:www.linkedin.com': 1, 'source:linkedin.com': 2, 'sourceview:Direct / unknown': 6, 'source:Direct / unknown': 3, 'device:Desktop': 9, 'vdevice:Desktop': 4, 'vdevice:Mobile': 1, 'os:macOS': 4, 'os:iOS': 1, 'browser:Safari': 3, 'browser:Chrome': 2, 'country:US': 4, 'country:GB': 1, 'region:US-CO': 3, 'city:Denver / US-CO': 3, 'city:London / GB-ENG': 1, 'time:/': 240, 'time:/toolbox/': 120, 'reach50:/': 4, 'reach100:/': 2, downloads: 1, 'download:Toolbox-1.1.0-arm64.dmg': 1, 'dlsource:linkedin.com': 1, 'dlcountry:US': 1, resume: 1, 'resumesource:linkedin.com': 1, outs: 2, 'out:linkedin.com': 2, contact: 1, updates: 3, 'update:1.2.1': 3, 'updateplatform:macOS · ARM64': 3, 'updatecountry:US': 3, 'campaign:oct': 1 };
function command(cmd) {
  const [op, key] = cmd;
  if (op.toLowerCase() === 'get') return key === 'tim:releases:v2' ? JSON.stringify(fixture) : key === 'tim:analytics:started' ? '2026-09-17T12:00:00Z' : key === 'tim:analytics:detailed' ? detailed : null;
  if (op.toLowerCase() === 'hgetall' && key.startsWith('tim:gh:')) return snapshot;
  if (op.toLowerCase() === 'hgetall') return Object.entries(day).flat().map(String);
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
