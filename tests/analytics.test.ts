import { describe, it, expect } from 'vitest';
import { dateRange, parseEvent, summarize, ranking, downloadFiles } from '../src/lib/analytics';
import { isOwner, isPrivatePath } from '../src/lib/server/access';

describe('analytics inputs', () => {
  it('only accepts public pages and strips referrer paths and search parameters', () => {
    expect(parseEvent({ type: 'view', path: '/', referrer: 'https://www.linkedin.com/feed/?token=private' })).toEqual({ type: 'view', path: '/', referrer: 'www.linkedin.com' });
    for (const path of ['/admin/', '/auth/session/', '/does-not-exist/', '/?email=a', 'https://evil.test/']) expect(parseEvent({ type: 'view', path })).toBeNull();
    expect(parseEvent(null)).toBeNull();
  });
  it('only accepts release files actually linked on the site', () => {
    expect(parseEvent({ type: 'download', path: '/toolbox/', file: downloadFiles[0].name })?.type).toBe('download');
    expect(parseEvent({ type: 'download', path: '/toolbox/', file: '../../secret' })).toBeNull();
  });
  it('does not retain internal or invalid referrer URLs', () => {
    for (const referrer of ['https://www.timothyali.com/work/', 'javascript:alert(1)', '', 'bad URL']) expect(parseEvent({ type: 'view', path: '/', referrer })).toEqual({ type: 'view', path: '/', referrer: 'Direct / unknown' });
  });
  it('builds inclusive UTC ranges over month and year boundaries', () => {
    expect(dateRange(3, new Date('2026-01-01T00:30:00Z'))).toEqual(['2025-12-30', '2025-12-31', '2026-01-01']);
  });
  it('aggregates views and download clicks without mixing their totals', () => {
    const counts = summarize([{ views: 5, 'page:/': 5, clicks: 2 }, null, { views: 3, 'page:/work/': 3, clicks: 1 }]);
    expect(counts.views).toBe(8); expect(counts.clicks).toBe(3);
    expect(ranking(counts, 'page:')).toEqual([{ name: '/', count: 5 }, { name: '/work/', count: 3 }]);
  });
});
describe('owner access', () => {
  it('requires an exact configured email, including after owner changes', () => {
    expect(isOwner(' OWNER@example.com ', 'owner@example.com')).toBe(true);
    for (const value of [null, '', 'other@example.com', 'owner@example.com.evil', 'owner+tag@example.com']) expect(isOwner(value, 'owner@example.com')).toBe(false);
    expect(isOwner('owner@example.com', undefined)).toBe(false);
  });
  it('allows every explicitly listed address without partial or domain matches', () => {
    const owners = 'one@example.com,two@example.com\nthree@example.org';
    for (const email of ['one@example.com', 'two@example.com', 'THREE@example.org']) expect(isOwner(email, owners)).toBe(true);
    for (const email of ['four@example.com', 'example.com', 'one@example.com.evil']) expect(isOwner(email, owners)).toBe(false);
  });
  it('covers nested admin and auth routes', () => {
    for (const path of ['/admin', '/admin/', '/admin/export/', '/admin/__data.json', '/auth/callback/resend/']) expect(isPrivatePath(path)).toBe(true);
    expect(isPrivatePath('/work/')).toBe(false);
  });
});
