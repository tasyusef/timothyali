import { describe, expect, it, vi } from 'vitest';
vi.mock('../src/lib/server/redis', () => ({ redis: () => null }));
import { releaseDownloads, periodDownloads } from '../src/lib/server/releases';
it('counts installer assets and historical Windows releases, excluding metadata and drafts', () => {
  const assets = [{ name: 'Toolbox-arm64.dmg', download_count: 3, created_at: '2026-09-12T00:00:00Z' }, { name: 'Toolbox.exe', download_count: 2, created_at: '2026-09-12T00:00:00Z' }, { name: 'SHA256SUMS.txt', download_count: 99, created_at: '2026-09-12T00:00:00Z' }, { name: 'latest-mac.yml', download_count: 99, created_at: '2026-09-12T00:00:00Z' }];
  const rows = releaseDownloads([{ tag_name: 'v1', draft: false, prerelease: false, published_at: null, assets }, { tag_name: 'v2', draft: true, prerelease: false, published_at: null, assets }]);
  expect(rows).toHaveLength(2); expect(rows.reduce((sum, row) => sum + row.count, 0)).toBe(5); expect(rows[0].architecture).toBe('ARM64'); expect(rows[1].platform).toBe('Windows (historical)');
});
it('counts Windows installers from 1.2.0 on as current, not historical', () => {
  const rows = releaseDownloads([{ tag_name: 'v1.2.0', draft: false, prerelease: false, published_at: null, assets: [{ name: 'Toolbox.Setup.1.2.0.exe', download_count: 4, created_at: '2026-10-26T00:00:00Z' }] }, { tag_name: 'v1.0.0', draft: false, prerelease: false, published_at: null, assets: [{ name: 'Toolbox-Setup-1.0.0.exe', download_count: 1, created_at: '2026-09-12T00:00:00Z' }] }]);
  expect(rows.map((row) => row.platform)).toEqual(['Windows', 'Windows (historical)']);
});
describe('release downloads', () => {
  const asset = (name: string, download_count: number, created_at = '2026-10-26T20:00:00Z') => ({ name, download_count, created_at });
  const rows = releaseDownloads([
    { tag_name: 'v1.2.0', draft: false, prerelease: false, published_at: '2026-10-26T20:14:29Z', assets: [asset('Toolbox-1.2.0-arm64.dmg', 17), asset('Toolbox-1.2.0-win.zip', 2), asset('Toolbox-1.2.0.app.tar.gz', 4), asset('SHA256SUMS', 1), asset('latest.json', 9)] },
    { tag_name: 'v1.1.1', draft: false, prerelease: false, published_at: '2026-09-20T13:40:14Z', assets: [asset('toolbox_1.1.1_arm64.deb', 8, '2026-09-20T04:19:10Z')] },
    { tag_name: 'v1.0.0', draft: false, prerelease: false, published_at: '2026-09-12T13:35:06Z', assets: [asset('Toolbox-Setup-1.0.0.exe', 1, '2026-09-12T13:34:26Z')] }
  ]);
  it('classifies builds and leaves out checksums and the update feed', () => {
    expect(rows.map((row) => [row.file, row.platform, row.kind])).toEqual([
      ['Toolbox-1.2.0-arm64.dmg', 'macOS', 'Installer'], ['Toolbox-1.2.0-win.zip', 'Windows', 'Portable zip'], ['Toolbox-1.2.0.app.tar.gz', 'macOS', 'Update package'],
      ['toolbox_1.1.1_arm64.deb', 'Linux', 'Installer'], ['Toolbox-Setup-1.0.0.exe', 'Windows (historical)', 'Installer']
    ]);
  });
  it('counts a period from the reading the day before it, or from a file uploaded inside it', () => {
    const dates = ['2026-10-25', '2026-10-26', '2026-10-27'];
    const result = periodDownloads(rows, dates, { '2026-10-24': { 'toolbox_1.1.1_arm64.deb': 5 }, '2026-10-25': { 'Toolbox-Setup-1.0.0.exe': 0 } });
    expect(result.map((row) => [row.period, row.since])).toEqual([[17, null], [2, null], [4, null], [3, null], [1, '2026-10-25']]);
  });
  it('leaves a period unknown when the only reading is today’s', () => {
    expect(periodDownloads(rows, ['2026-10-26', '2026-10-27'], { '2026-10-27': { 'toolbox_1.1.1_arm64.deb': 8 } })[3].period).toBeNull();
  });
});
