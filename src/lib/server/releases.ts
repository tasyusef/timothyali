import { redis } from './redis';
export type ReleaseAsset = { name: string; download_count: number };
export type Release = { tag_name: string; draft: boolean; prerelease: boolean; assets: ReleaseAsset[] };
export function releaseDownloads(releases: Release[]) {
  return releases.filter((release) => !release.draft && !release.prerelease).flatMap((release) => release.assets.filter((asset) => /\.(dmg|zip|appimage|deb|exe)$/i.test(asset.name)).map((asset) => ({
    version: release.tag_name, file: asset.name, count: asset.download_count,
    platform: /\.(dmg|zip)$/i.test(asset.name) ? 'macOS' : /\.exe$/i.test(asset.name) ? 'Windows (historical)' : 'Linux',
    architecture: /arm64/i.test(asset.name) ? 'ARM64' : 'Intel / x64',
    format: asset.name.split('.').at(-1)!
  })));
}
export async function readReleases() {
  const db = redis();
  const cacheKey = 'tim:releases:v1';
  try { const cached = await db?.get<{ rows: ReturnType<typeof releaseDownloads>; updated: string }>(cacheKey); if (cached) return cached; } catch {}
  const releases: Release[] = [];
  // Follow pagination; don't silently present a truncated all-time count.
  for (let page = 1; page <= 20; page++) {
    const result = await fetch(`https://api.github.com/repos/tasyusef/toolbox/releases?per_page=100&page=${page}`, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'timothyali-admin', 'X-GitHub-Api-Version': '2022-11-28' }, signal: AbortSignal.timeout(8000) });
    if (!result.ok) throw new Error('GitHub download counts unavailable');
    const batch: Release[] = await result.json(); releases.push(...batch);
    if (batch.length < 100) break;
    if (page === 20) throw new Error('Release history exceeds supported pagination');
  }
  const data = { rows: releaseDownloads(releases), updated: new Date().toISOString() };
  try { await db?.set(cacheKey, data, { ex: 300 }); } catch {}
  return data;
}
