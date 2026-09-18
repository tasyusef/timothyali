// Verify the production Redis protocol using disposable keys, without altering analytics.
import { Redis } from '@upstash/redis';
import { readFileSync, writeFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import assert from 'node:assert/strict';
const env = parseEnv(readFileSync('.env.production.local', 'utf8'));
const db = new Redis({ url: env.KV_REST_API_URL, token: env.KV_REST_API_TOKEN });
const prefix = `tim:verification:${crypto.randomUUID()}`;
const script = readFileSync('src/lib/server/analytics.ts', 'utf8').match(/export const RECORD_EVENT = `([\s\S]*?)`;/)[1].replaceAll('tim:analytics:started', `${prefix}:started`);
const keys = [`${prefix}:rate`, `${prefix}:day`, `${prefix}:visitors`];
const results = [];
try {
  const args = [new Date().toISOString(), 'views', 'page:/', 'referrer:Direct / unknown', 'device:Desktop', 'test-visitor'];
  assert.equal(await db.eval(script, keys, args), 1);
  assert.equal(await db.eval(script, keys, args), 1);
  assert.equal(await db.pfcount(keys[2]), 1); results.push('Repeat views count twice; daily visitor counts once');
  await db.eval(script, keys, [args[0], 'clicks', 'download:Toolbox-1.1.0-arm64.dmg', '', '', 'test-visitor']);
  const day = await db.hgetall(keys[1]); assert.equal(Number(day.views), 2); assert.equal(Number(day.clicks), 1); results.push('Build clicks and page views aggregate separately');
  const ttl = await db.ttl(keys[1]); assert.ok(ttl > 31622300 && ttl <= 31622400); results.push('Daily aggregates expire after 366 days');
  const pipeline = db.pipeline(); for (let i=0; i<58; i++) pipeline.eval(script, keys, args);
  const limitResults = await pipeline.exec(); assert.equal(limitResults.at(-1), 0); assert.equal(Number((await db.hgetall(keys[1])).views), 59); results.push('61st event in a minute is discarded atomically');
  await db.set(`${prefix}:link`, 'test-token', { ex: 900 });
  const consumed = await Promise.all([db.getdel(`${prefix}:link`), db.getdel(`${prefix}:link`)]); assert.equal(consumed.filter(Boolean).length, 1); results.push('Concurrent sign-in token consumption succeeds only once');
  writeFileSync('docs/iterations/pixel-v2/41-private-analytics/storage-verification.json', JSON.stringify({ realRedis: true, verifiedAt: new Date().toISOString(), results }, null, 2)); console.log(results.join('\n'));
} finally { await db.del(...keys, `${prefix}:started`, `${prefix}:link`); }
