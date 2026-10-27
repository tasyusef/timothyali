<script lang="ts">
  import { signOut } from '@auth/sveltekit/client';
  import Cta from '$lib/components/Cta.svelte';
  let { data } = $props();
  let version = $state('all');
  const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);
  // a source's visit days, newest first: “Oct 14 · Oct 9 (2)”, the last eight and a count of the rest
  const dayList = (days: { day: string; count: number }[]) => days.slice(0, 8).map((d) => shortDate(d.day) + (d.count > 1 ? ` (${d.count})` : '')).join(' · ') + (days.length > 8 ? ` · +${days.length - 8} more days` : '');
  const shortDate = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(date));
  const builds = $derived(data.releases?.rows ?? []);
  const downloads = $derived(builds.filter(row => version === 'all' || row.version === version));
  // GitHub's period count is complete unless a release predates the first daily reading (releases.ts)
  const periodTotal = $derived(builds.reduce((sum, row) => sum + (row.period ?? 0), 0));
  const partial = $derived(builds.some(row => row.period === null || row.since));
  const clicksFor = (file: string) => data.traffic?.downloads.find(row => row.name === file)?.count ?? 0;
  const versions = $derived([...new Set(data.releases?.rows.map(row => row.version) ?? [])]);
  const maxViews = $derived(Math.max(1, ...(data.traffic?.daily.map(day => day.views) ?? [])));
  let signingOut = $state(false);
  async function logout() { signingOut = true; try { await signOut({ redirectTo: '/admin/login/' }); } finally { signingOut = false; } }
</script>
<svelte:head><title>Site activity / Timothy Ali</title><meta name="robots" content="noindex, nofollow" /></svelte:head>
<main class="inner-page admin body" id="main" tabindex="-1">
  <header class="heading">
    <div><p class="lbl">Private / Site admin</p><h1 class="display">Site activity.</h1></div>
    <Cta type="button" onclick={logout} disabled={signingOut}>Sign out</Cta>
  </header>
  <div class="toolbar">
    <nav aria-label="Traffic date range">{#each data.ranges as days}<a class="lbl" class:active={data.days === days} href={`?days=${days}`} aria-current={data.days === days ? 'page' : undefined}>{days} days</a>{/each}</nav>
    <p class="note read-s">Through today · UTC · This browser is excluded from tracking</p>
  </div>
  <section aria-label="Overview" class="stats">
    <article class="panel"><h2 class="lbl">Page views / {data.days} days</h2><p class="display">{data.traffic ? fmt(data.traffic.views) : '—'}</p><p class="note read-s">Includes repeat visits.</p></article>
    <article class="panel"><h2 class="lbl">Site download clicks / {data.days} days</h2><p class="display">{data.traffic ? fmt(data.traffic.clicks) : '—'}</p><p class="note read-s">Clicks on this site’s download links. Your signed-in browsers aren’t counted.</p></article>
    <article class="panel"><h2 class="lbl">GitHub downloads / {data.days} days</h2><p class="display">{data.releases ? fmt(periodTotal) : '—'}</p><p class="note read-s">{partial && data.releases ? `Releases from before this period count from ${data.releases.tracked ? shortDate(data.releases.tracked) : 'today'}, when daily readings began.` : 'Every request for a release file on GitHub.'}</p></article>
    <article class="panel"><h2 class="lbl">GitHub downloads / All time</h2><p class="display">{data.releases ? fmt(builds.reduce((sum, row) => sum + row.count, 0)) : '—'}</p><p class="note read-s">Across every public release.</p></article>
  </section>
  {#if !data.traffic}
    <p role="status" class="notice">{data.trafficError ? 'Traffic data is temporarily unavailable. Try refreshing in a moment.' : 'Traffic storage is not connected yet. Counts will start when tracking goes live.'}</p>
  {:else}
    <section class="section">
      <div class="section-heading"><h2 class="display-s">Page traffic</h2><p class="note read-s">{data.traffic.started ? `First recorded visit: ${shortDate(data.traffic.started)}` : 'No visits recorded yet.'}</p></div>
      <div class="chart" role="img" aria-label={`Daily page views for the last ${data.days} days. Exact values are in the daily totals table below.`}>
        {#each data.traffic.daily as day}<div class="bar-slot" title={`${shortDate(day.day)}: ${fmt(day.views)} views · ${fmt(day.visitors)} estimated visitors`}><span style:height={`${day.views / maxViews * 100}%`}></span></div>{/each}
      </div>
      <div class="chart-axis lbl"><span>{shortDate(data.traffic.daily[0].day)}</span><span>{shortDate(data.traffic.daily.at(-1)!.day)}</span></div>
      <details><summary class="lbl">Daily totals</summary><!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the table horizontally.) -->
<div class="table-wrap" tabindex="0" role="region" aria-label="Daily totals"><table><thead class="lbl"><tr><th scope="col">Day (UTC)</th><th scope="col">Views</th><th scope="col">Estimated visitors</th></tr></thead><tbody>{#each [...data.traffic.daily].reverse() as day}<tr><th scope="row">{shortDate(day.day)}</th><td>{fmt(day.views)}</td><td>{fmt(day.visitors)}</td></tr>{/each}</tbody></table></div><p class="note read-s">Visitors are estimated separately each day from a temporary hash of IP address and browser type. Shared connections can merge visitors. These daily counts are not a count of unique people across the whole period.</p></details>
    </section>
    <div class="split">
      <section class="section"><h2 class="display-s">Pages</h2>{#if data.traffic.pages.length}<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the table horizontally.) -->
<div class="table-wrap" tabindex="0" role="region" aria-label="Page traffic"><table><thead class="lbl"><tr><th scope="col">Page</th><th scope="col">Views</th></tr></thead><tbody>{#each data.traffic.pages as row}<tr><th scope="row"><a href={row.name}>{row.name}</a></th><td>{fmt(row.count)}</td></tr>{/each}</tbody></table></div>{:else}<p class="empty">Page visits will appear here.</p>{/if}</section>
      <section class="section"><h2 class="display-s">Referrals</h2>{#if data.traffic.referrers.length}<table><thead class="lbl"><tr><th scope="col">Source</th><th scope="col">Last visit</th><th scope="col">Views</th></tr></thead><tbody>{#each data.traffic.referrers.slice(0, 20) as row}<tr><th scope="row">{row.name}<small class="days read-s">{dayList(row.days)}</small></th><td>{row.days[0] ? shortDate(row.days[0].day) : '—'}</td><td>{fmt(row.count)}</td></tr>{/each}</tbody></table>{:else}<p class="empty">Referral sources will appear here.</p>{/if}<p class="note read-s">Direct / unknown includes internal navigation and visits where the browser doesn’t share a referrer. Dates are UTC days; times aren’t stored. “Link / acme” is a visit from a tagged link such as <code>timothyali.com/?via=acme</code>; every page that visit views counts under it.</p></section>
    </div>
    <section class="section"><h2 class="display-s">Devices</h2><div class="devices">{#each data.traffic.devices as row}<p><span class="lbl">{row.name}</span> {fmt(row.count)} views</p>{:else}<p class="empty">Device totals will appear here.</p>{/each}</div></section>
  {/if}
  <section class="section">
    <div class="section-heading"><h2 class="display-s">Toolbox downloads</h2>{#if versions.length}<label class="lbl">Release <select bind:value={version}><option value="all">All releases</option>{#each versions as v}<option value={v}>{v}</option>{/each}</select></label>{/if}</div>
    <p class="note">GitHub counts every request for a file: this site’s links, the GitHub releases page, the app’s updater, your own downloads and bots. Site clicks count only this site’s links, from browsers you haven’t signed in on, so GitHub’s number is usually the larger one.</p>
    {#if data.unpublished.length}<p role="status" class="notice">The Toolbox page links {data.unpublished.length === 1 ? 'a file that isn’t' : `${data.unpublished.length} files that aren’t`} in a published GitHub release, so {data.unpublished.length === 1 ? 'that link fails' : 'those links fail'}: {data.unpublished.join(', ')}.</p>{/if}
    {#if data.releases}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the table horizontally.) -->
<div class="table-wrap" tabindex="0" role="region" aria-label="Toolbox downloads by build"><table class="build-table"><thead class="lbl"><tr><th scope="col">Build</th><th scope="col">Version</th><th scope="col">GitHub<br /><span class="note read-s">{data.days} days</span></th><th scope="col">GitHub<br /><span class="note read-s">All time</span></th><th scope="col">Site clicks<br /><span class="note read-s">{data.days} days</span></th></tr></thead><tbody>{#each downloads as row}<tr><th scope="row"><span>{row.platform} · {row.architecture} · {row.format}</span><small class="read-s">{row.file} · {row.kind}</small></th><td>{row.version}<small class="read-s">{shortDate(row.published)}</small></td><td>{row.period === null ? '—' : fmt(row.period)}{#if row.since}<small class="read-s">since {shortDate(row.since)}</small>{/if}</td><td>{fmt(row.count)}</td><td>{data.traffic ? fmt(clicksFor(row.file)) : '—'}</td></tr>{/each}</tbody></table></div>
      <p class="note read-s">Updated {new Date(data.releases.updated).toLocaleString('en-US', { timeZone: 'UTC' })} UTC · Cached for up to 5 minutes.</p>
    {:else}<p role="status" class="notice">GitHub’s download counts are unavailable right now. Try refreshing in a moment.</p>{/if}
    <p class="note read-s">GitHub counts are requests for files, including repeats, updates and automated checks, not people or installs. GitHub only reports all-time totals, so the site reads them every day and a period’s count is the difference; a dash means a release from before the first reading. The Mac updater fetches the update package; on Windows and Linux it fetches the installer. Windows builds from before 1.2.0 are marked historical. Checksums and the update feed are excluded.</p>
  </section>
  <footer class="notes"><p class="lbl">How to read these numbers</p><p class="note read-s">Traffic is recorded when a public page becomes visible. Ad blockers, disabled JavaScript and known bots can leave visits out. Counts are retained for 366 days. Raw IP addresses, full referrer URLs and browser strings aren’t stored. There is no tracking cookie; signing in sets an exclusion cookie for this browser.</p></footer>
</main>
<style>
  .admin{width:100%;min-width:0;padding:var(--s8) var(--gutter);max-width:1536px;margin:auto;display:flex;flex-direction:column;gap:var(--s6)}
  .heading,.toolbar,.section-heading{display:flex;align-items:center;justify-content:space-between;gap:var(--s3);flex-wrap:wrap}.heading>div{min-width:0;max-width:100%}.heading h1{margin-top:var(--s2)}
  select{font:inherit;background:var(--paper);color:var(--fg);cursor:pointer}
  nav{display:flex;gap:var(--s1);flex-wrap:wrap}nav a{padding:var(--s2);border:2px solid var(--fg)}nav a.active{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
  .stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--s3)}.stats article{padding:var(--s3)}.stats article .display{margin:var(--s3) 0 var(--s2)}
  .note{max-width:90ch}.section{min-width:0;display:flex;flex-direction:column;gap:var(--s3)}
  .split{display:grid;grid-template-columns:1.2fr 1fr;gap:var(--s6)}.table-wrap{overflow-x:auto;max-width:100%}table{width:100%;border-collapse:collapse;text-align:left}th{font-weight:400}th,td{padding:var(--s2) var(--s1);border-bottom:2px solid var(--tint-major);vertical-align:top}td{text-align:right;white-space:nowrap}thead th:not(:first-child){text-align:right}tbody th{overflow-wrap:anywhere}tbody th a{text-decoration:underline;text-underline-offset:4px}small{display:block;margin-top:var(--s1)}
  .chart{height:192px;display:flex;align-items:flex-end;gap:4px;border-bottom:2px solid var(--fg)}.bar-slot{height:100%;flex:1;display:flex;align-items:flex-end;min-width:0}.bar-slot span{width:100%;background:var(--accent)}.chart-axis{display:flex;justify-content:space-between}summary{padding:var(--s2) 0;cursor:pointer}details .note{margin-top:var(--s2)}.days{opacity:var(--dim);white-space:normal}.devices{display:flex;flex-wrap:wrap;gap:var(--s4)}.devices .lbl{display:block;margin-bottom:var(--s1)}select{padding:var(--s2);margin-left:var(--s1);border:2px solid var(--fg)}.build-table{min-width:720px}.notice{border-left:8px solid var(--accent);padding:var(--s3);background:var(--tint-fine)}.notes{display:flex;flex-direction:column;gap:var(--s2)}.empty{padding:var(--s3) 0}
  @media(max-width:1100px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:900px){.split{grid-template-columns:1fr}.admin{padding-top:var(--s4)}}
  @media(max-width:420px){.stats{grid-template-columns:1fr}.heading h1{font-size:27.5px;line-height:32px}.toolbar .note{max-width:24ch}.chart{gap:2px}.stats article{padding:var(--s2)}}
</style>
