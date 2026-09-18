import { SvelteKitAuth } from '@auth/sveltekit';
import Resend from '@auth/sveltekit/providers/resend';
import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter';
import { env } from '$env/dynamic/private';
import { redis } from '$lib/server/redis';
import { isOwner } from '$lib/server/access';

export const authReady = () => Boolean((env.ADMIN_EMAILS || env.ADMIN_EMAIL) && env.AUTH_SECRET && (env.AUTH_RESEND_KEY || env.RESEND_API_KEY) && (env.AUTH_EMAIL_FROM || env.CONTACT_FROM) && redis());
export const { handle: authHandle } = SvelteKitAuth(async () => {
  const db = redis();
  return {
    secret: env.AUTH_SECRET,
    trustHost: true,
    adapter: db ? {
      ...UpstashRedisAdapter(db, { baseKeyPrefix: 'tim:auth:' }),
      // Expire unused links and consume each token atomically, even under concurrent requests.
      async createVerificationToken(token) {
        await db.set(`tim:auth:link:${token.identifier}:${token.token}`, token, { ex: Math.max(1, Math.ceil((token.expires.getTime() - Date.now()) / 1000)) });
        return token;
      },
      async useVerificationToken({ identifier, token }) {
        const value = await db.getdel<{ identifier: string; token: string; expires: string }>(`tim:auth:link:${identifier}:${token}`);
        return value ? { ...value, expires: new Date(value.expires) } : null;
      }
    } : undefined,
    providers: [Resend({ apiKey: env.AUTH_RESEND_KEY || env.RESEND_API_KEY, from: env.AUTH_EMAIL_FROM || env.CONTACT_FROM, maxAge: 15 * 60 })],
    session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
    pages: { signIn: '/admin/login/', verifyRequest: '/admin/login/?sent=1', error: '/admin/login/' },
    callbacks: {
      async signIn({ user, email }) {
        if (!authReady() || !isOwner(user.email, env.ADMIN_EMAILS || env.ADMIN_EMAIL)) return false;
        if (email?.verificationRequest) return Boolean(await db!.set('tim:auth:send-cooldown', '1', { nx: true, ex: 60 }));
        return true;
      },
      redirect({ url, baseUrl }) {
        // Sign-in links only return to this site's admin, never an arbitrary callback URL.
        try { const next = new URL(url, baseUrl); if (next.origin === baseUrl && next.pathname.startsWith('/admin/')) return next.href; } catch {}
        return `${baseUrl}/admin/`;
      }
    },
    logger: { error(error) { console.error('Admin authentication failed:', error.name); } }
  };
});
