import { expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({ config: null as any, db: { set: vi.fn().mockResolvedValue('OK'), getdel: vi.fn() }, env: { ADMIN_EMAIL: 'owner@example.com', AUTH_SECRET: 'test-secret', AUTH_RESEND_KEY: 'test-key', AUTH_EMAIL_FROM: 'admin@example.com' } }));
vi.mock('$env/dynamic/private', () => ({ env: state.env }));
vi.mock('../src/lib/server/redis', () => ({ redis: () => state.db }));
vi.mock('@auth/upstash-redis-adapter', () => ({ UpstashRedisAdapter: () => ({}) }));
vi.mock('@auth/sveltekit', () => ({ SvelteKitAuth: (config: any) => { state.config = config; return { handle: vi.fn() }; } }));
import '../src/auth';
it('rejects other addresses both before sending and after a verification link is used', async () => {
  const config = await state.config();
  expect(await config.callbacks.signIn({ user: { email: 'other@example.com' }, email: { verificationRequest: true } })).toBe(false);
  expect(await config.callbacks.signIn({ user: { email: 'other@example.com' } })).toBe(false);
  expect(await config.callbacks.signIn({ user: { email: 'owner@example.com' } })).toBe(true);
});
it('throttles repeated sign-in emails durably', async () => {
  const config = await state.config(); state.db.set.mockResolvedValueOnce('OK').mockResolvedValueOnce(null);
  const args = { user: { email: 'owner@example.com' }, email: { verificationRequest: true } };
  expect(await config.callbacks.signIn(args)).toBe(true); expect(await config.callbacks.signIn(args)).toBe(false);
});
it('uses expiring verification tokens and atomic one-time consumption', async () => {
  const { adapter } = await state.config(); const token = { identifier: 'owner@example.com', token: 'hashed-token', expires: new Date(Date.now() + 60000) };
  await adapter.createVerificationToken(token); expect(state.db.set).toHaveBeenLastCalledWith(expect.any(String), token, { ex: expect.any(Number) });
  state.db.getdel.mockResolvedValueOnce({ ...token, expires: token.expires.toISOString() }).mockResolvedValueOnce(null);
  expect(await adapter.useVerificationToken(token)).toEqual(token); expect(await adapter.useVerificationToken(token)).toBeNull();
});
it('does not redirect to outside sites or unrelated public pages', async () => {
  const config = await state.config(); const baseUrl = 'https://www.timothyali.com';
  for (const url of ['https://evil.test/admin/', '//evil.test/', '/toolbox/']) expect(config.callbacks.redirect({ url, baseUrl })).toBe(`${baseUrl}/admin/`);
});
