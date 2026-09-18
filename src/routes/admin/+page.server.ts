import { readAnalytics } from '$lib/server/analytics';
import { readReleases } from '$lib/server/releases';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ url, setHeaders }) => {
  setHeaders({ 'Cache-Control': 'private, no-store' });
  const requested = Number(url.searchParams.get('days') || 30);
  const days = [7, 30, 90].includes(requested) ? requested : 30;
  const [traffic, releases] = await Promise.allSettled([readAnalytics(days), readReleases()]);
  return { days, traffic: traffic.status === 'fulfilled' ? traffic.value : null,
    releases: releases.status === 'fulfilled' ? releases.value : null,
    trafficError: traffic.status === 'rejected', releasesError: releases.status === 'rejected' };
};
