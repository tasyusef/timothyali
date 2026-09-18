import { expect, it, vi } from 'vitest';
vi.mock('../src/lib/server/redis', () => ({ redis: () => null }));
import { releaseDownloads } from '../src/lib/server/releases';
it('counts installer assets and historical Windows releases, excluding metadata and drafts', () => {
  const assets = [{ name: 'Toolbox-arm64.dmg', download_count: 3 }, { name: 'Toolbox.exe', download_count: 2 }, { name: 'SHA256SUMS.txt', download_count: 99 }, { name: 'latest-mac.yml', download_count: 99 }];
  const rows = releaseDownloads([{ tag_name: 'v1', draft: false, prerelease: false, assets }, { tag_name: 'v2', draft: true, prerelease: false, assets }]);
  expect(rows).toHaveLength(2); expect(rows.reduce((sum, row) => sum + row.count, 0)).toBe(5); expect(rows[0].architecture).toBe('ARM64'); expect(rows[1].platform).toBe('Windows (historical)');
});
