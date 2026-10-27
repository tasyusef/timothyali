import { redis } from './redis';
import { dateRange } from '$lib/analytics';
export type ReleaseAsset = { name: string; download_count: number; created_at: string };
export type Release = { tag_name: string; draft: boolean; prerelease: boolean; published_at: string | null; assets: ReleaseAsset[] };
// Windows builds stopped at 1.1.0 and came back, unsigned, in 1.2.0; earlier ones stay historical.
const beforeWindowsReturned = (tag: string) => { const [major = 0, minor = 0] = tag.replace(/^v/, '').split('.').map(Number); return major < 1 || (major === 1 && minor < 2); };
// Installers are what the site links; zips are the portable builds on the releases page; the
// .app.tar.gz is what the Mac app's updater fetches (on Windows and Linux it fetches the installer).
const kindOf = (name: string) => /\.app\.tar\.gz$/i.test(name) ? 'Update package' : /\.zip$/i.test(name) ? 'Portable zip' : 'Installer';
const platformOf = (name: string, tag: string) => /\.exe$|-win\.zip$/i.test(name) ? (beforeWindowsReturned(tag) ? 'Windows (historical)' : 'Windows') : /\.(appimage|deb)$/i.test(name) ? 'Linux' : 'macOS';
export function releaseDownloads(releases: Release[]) {
  return releases.filter((release) => !release.draft && !release.prerelease).flatMap((release) => release.assets.filter((asset) => /\.(dmg|zip|appimage|deb|exe)$|\.app\.tar\.gz$/i.test(asset.name)).map((asset) => ({
    version: release.tag_name, file: asset.name, count: asset.download_count, published: (release.published_at ?? asset.created_at).slice(0, 10), created: asset.created_at.slice(0, 10),
    platform: platformOf(asset.name, release.tag_name), kind: kindOf(asset.name),
    architecture: /arm64|aarch64/i.test(asset.name) ? 'ARM64' : 'Intel / x64',
    format: /\.app\.tar\.gz$/i.test(asset.name) ? 'app.tar.gz' : asset.name.split('.').at(-1)!
  })));
}
export type BuildRow = ReturnType<typeof releaseDownloads>[number];
export type Snapshot = Record<string, number | string> | null;
// GitHub only reports all-time counts, so each UTC day keeps a copy of them (the day's last
// reading wins) and a period's downloads are today's count less the count the day before it began.
// A file uploaded inside the period started at 0. Without a reading from before the period, the
// count runs from the first reading inside it (`since`); with none before today it is unknown.
export function periodDownloads(rows: BuildRow[], dates: string[], snapshots: Record<string, Snapshot>) {
  const before = new Date(Date.parse(dates[0]) - 86400000).toISOString().slice(0, 10);
  const today = dates.at(-1)!;
  return rows.map((row) => {
    if (row.created >= dates[0]) return { ...row, period: row.count, since: null as string | null };
    const base = snapshots[before]?.[row.file];
    if (base != null) return { ...row, period: Math.max(0, row.count - Number(base)), since: null };
    const first = dates.find((day) => day < today && snapshots[day]?.[row.file] != null);
    return first ? { ...row, period: Math.max(0, row.count - Number(snapshots[first]![row.file])), since: first } : { ...row, period: null, since: null };
  });
}
async function fetchReleases() {
  const releases: Release[] = [];
  // Follow pagination; don't silently present a truncated all-time count.
  for (let page = 1; page <= 20; page++) {
    const result = await fetch(`https://api.github.com/repos/tasyusef/toolbox/releases?per_page=100&page=${page}`, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'timothyali-admin', 'X-GitHub-Api-Version': '2022-11-28' }, signal: AbortSignal.timeout(8000) });
    if (!result.ok) throw new Error('GitHub download counts unavailable');
    const batch: Release[] = await result.json(); releases.push(...batch);
    if (batch.length < 100) break;
    if (page === 20) throw new Error('Release history exceeds supported pagination');
  }
  return releases;
}
/** All-time counts, cached five minutes; a fresh reading also becomes the day's snapshot. */
export async function currentReleases() {
  const db = redis();
  const cacheKey = 'tim:releases:v2';
  try { const cached = await db?.get<{ rows: BuildRow[]; updated: string }>(cacheKey); if (cached) return cached; } catch {}
  const data = { rows: releaseDownloads(await fetchReleases()), updated: new Date().toISOString() };
  try {
    const key = `tim:gh:${data.updated.slice(0, 10)}`;
    await db?.pipeline().set(cacheKey, data, { ex: 300 }).hset(key, Object.fromEntries(data.rows.map((row) => [row.file, row.count]))).expire(key, 400 * 86400).exec();
  } catch {}
  return data;
}
export async function readReleases(days: number) {
  const data = await currentReleases();
  const dates = dateRange(days);
  const db = redis(); const snapshots: Record<string, Snapshot> = {};
  const wanted = [new Date(Date.parse(dates[0]) - 86400000).toISOString().slice(0, 10), ...dates];
  try {
    if (db) { const pipeline = db.pipeline(); for (const day of wanted) pipeline.hgetall(`tim:gh:${day}`); (await pipeline.exec()).forEach((value, i) => { snapshots[wanted[i]] = value as Snapshot; }); }
  } catch {}
  const tracked = wanted.find((day) => snapshots[day]);
  return { ...data, rows: periodDownloads(data.rows, dates, snapshots), tracked: tracked ?? null };
}
