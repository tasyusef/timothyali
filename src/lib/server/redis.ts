import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';
let client: Redis | undefined;
export function redis() {
  const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return client ??= new Redis({ url, token, retry: { retries: 1, backoff: () => 150 } });
}
