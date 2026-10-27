import { describe, it, expect } from 'vitest';
import { dateRange, parseEvent, summarize, ranking, daysOf, downloadFiles, client, BOT, DOWNLOAD_FILE, type DailyCounts } from '../src/lib/analytics';
import { sourceOf, isSource } from '../src/lib/sources';
import { isOwner, isPrivatePath } from '../src/lib/server/access';

describe('analytics inputs', () => {
  it('only accepts public pages and strips referrer paths and search parameters', () => {
    expect(parseEvent({ type: 'view', path: '/', referrer: 'https://www.linkedin.com/feed/?token=private', entry: true })).toEqual({ type: 'view', path: '/', source: 'linkedin.com', campaign: null, entry: true });
    for (const path of ['/admin/', '/auth/session/', '/does-not-exist/', '/?email=a', 'https://evil.test/']) expect(parseEvent({ type: 'view', path })).toBeNull();
    expect(parseEvent(null)).toBeNull();
  });
  it('links every build through the counted download route', () => {
    for (const file of downloadFiles) { expect(file.href).toMatch(/^\/download\/v\d+\.\d+\.\d+\//); expect(file.name).toMatch(DOWNLOAD_FILE); }
    expect(parseEvent({ type: 'download', path: '/toolbox/', file: downloadFiles[0].name })).toBeNull();
  });
  it('names sources by site, app, tag and campaign', () => {
    expect(sourceOf({ referrer: 'https://lnkd.in/abc' })).toBe('linkedin.com');
    expect(sourceOf({ referrer: 'android-app://com.linkedin.android/' })).toBe('linkedin.com');
    expect(sourceOf({ referrer: 'https://www.google.co.uk/' })).toBe('google.com');
    expect(sourceOf({ referrer: 'https://l.facebook.com/x' })).toBe('facebook.com');
    expect(sourceOf({ referrer: 'https://x.com', via: 'acme', utm: 'news' })).toBe('Link / acme');
    expect(sourceOf({ referrer: 'https://x.com', utm: 'news' })).toBe('Campaign / news');
    for (const s of ['linkedin.com', 'Direct / unknown', 'Link / acme', 'Campaign / news']) expect(isSource(s)).toBe(true);
    for (const s of ['<script>', 'Link / Acme', '', 'a'.repeat(200)]) expect(isSource(s)).toBe(false);
  });
  it('keeps engagement within bounds and only known scroll depths', () => {
    expect(parseEvent({ type: 'engage', path: '/', seconds: 42.4, reached: [25, 50, 50, 33] })).toEqual({ type: 'engage', path: '/', seconds: 42, reached: [25, 50] });
    for (const seconds of [-1, 1801, 'x']) expect(parseEvent({ type: 'engage', path: '/', seconds, reached: [] })).toBeNull();
    expect(parseEvent({ type: 'engage', path: '/', seconds: 0, reached: [] })).toBeNull();
  });
  it('keeps only the host of a link out', () => {
    expect(parseEvent({ type: 'out', path: '/contact/', host: 'www.linkedin.com' })).toEqual({ type: 'out', path: '/contact/', host: 'linkedin.com' });
    expect(parseEvent({ type: 'out', path: '/contact/', host: 'email' })?.type).toBe('out');
    for (const host of ['www.timothyali.com', 'javascript:alert(1)', 'a b']) expect(parseEvent({ type: 'out', path: '/', host })).toBeNull();
  });
  it('reads browsers and systems, and leaves out bots but not curl', () => {
    expect(client('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15')).toEqual({ os: 'macOS', browser: 'Safari', device: 'Desktop' });
    expect(client('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) CriOS/130.0 Mobile/15E148 Safari/604.1')).toEqual({ os: 'iOS', browser: 'Chrome', device: 'Mobile' });
    expect(client('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36 Edg/130.0')).toEqual({ os: 'Windows', browser: 'Edge', device: 'Desktop' });
    for (const ua of ['Googlebot/2.1', 'Slackbot-LinkExpanding 1.0', 'python-requests/2.31', 'WhatsApp/2.23']) expect(BOT.test(ua)).toBe(true);
    for (const ua of ['curl/8.4.0', 'Wget/1.21', 'Mozilla/5.0 (X11; Linux x86_64) Firefox/131.0']) expect(BOT.test(ua)).toBe(false);
  });
  it('does not retain internal or invalid referrer URLs', () => {
    for (const referrer of ['https://www.timothyali.com/work/', 'javascript:alert(1)', '', 'bad URL']) expect(parseEvent({ type: 'view', path: '/', referrer })).toEqual({ type: 'view', path: '/', source: 'Direct / unknown', campaign: null, entry: false });
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
  it('lists the days a referrer was counted on, newest first', () => {
    const daily: { day: string; counts: DailyCounts | null }[] = [{ day: '2026-10-01', counts: { 'referrer:www.linkedin.com': 2 } }, { day: '2026-10-02', counts: null }, { day: '2026-10-03', counts: { 'referrer:www.linkedin.com': 1, 'referrer:x.com': 4 } }];
    expect(daysOf(daily, 'referrer:www.linkedin.com')).toEqual([{ day: '2026-10-03', count: 1 }, { day: '2026-10-01', count: 2 }]);
    expect(daysOf(daily, 'referrer:nowhere')).toEqual([]);
  });
  it('counts a tagged link under its tag, and ignores a malformed one', () => {
    expect(parseEvent({ type: 'view', path: '/', referrer: 'https://boards.greenhouse.io/x', via: 'acme-2' })?.type === 'view' && parseEvent({ type: 'view', path: '/', referrer: 'https://boards.greenhouse.io/x', via: 'acme-2' })).toMatchObject({ source: 'Link / acme-2' });
    for (const via of ['Acme', '-x', 'a'.repeat(41), 'a b', 'a/b', 3]) expect(parseEvent({ type: 'view', path: '/', referrer: '', via })).toMatchObject({ source: 'Direct / unknown' });
    expect(parseEvent({ type: 'view', path: '/', utm: 'newsletter', campaign: 'oct-26' })).toMatchObject({ source: 'Campaign / newsletter', campaign: 'oct-26' });
  });
});
