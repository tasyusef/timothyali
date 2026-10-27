import { readAnalytics } from '$lib/server/analytics';
import { readReleases } from '$lib/server/releases';
import { downloadFiles } from '$lib/analytics';
import type { PageServerLoad } from './$types';
// the date ranges the page offers and the load accepts (0210; both wrote 7, 30, 90)
const RANGES = [7, 30, 90];
export const load: PageServerLoad = async ({ url, setHeaders }) => {
  setHeaders({ 'Cache-Control': 'private, no-store' });
  const requested = Number(url.searchParams.get('days') || 30);
  const days = RANGES.includes(requested) ? requested : 30;
  const [traffic, releases] = await Promise.allSettled([readAnalytics(days), readReleases(days)]);
  // Download links on the site whose file isn't in a published release: they answer 404.
  const unpublished = releases.status === 'fulfilled' ? downloadFiles.filter((file) => !releases.value.rows.some((row) => row.file === file.name)).map((file) => file.name) : [];
  return { days, ranges: RANGES, traffic: traffic.status === 'fulfilled' ? traffic.value : null,
    releases: releases.status === 'fulfilled' ? releases.value : null, unpublished,
    trafficError: traffic.status === 'rejected', releasesError: releases.status === 'rejected' };
};
