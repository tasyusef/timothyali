<script lang="ts">
  import { signOut } from '@auth/sveltekit/client';
  import Cta from '$lib/components/Cta.svelte';
  let { data } = $props();
  let version = $state('all');
  const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);
  const pct = (part: number, whole: number) => whole ? `${Math.round(part / whole * 100)}%` : '—';
  // active seconds as “2m 05s”
  const time = (seconds: number) => !Number.isFinite(seconds) ? '—' : seconds < 60 ? `${Math.round(seconds)}s` : `${Math.floor(seconds / 60)}m ${String(Math.round(seconds % 60)).padStart(2, '0')}s`;
  // a source's visit days, newest first: “Oct 14 · Oct 9 (2)”, the last eight and a count of the rest
  const dayList = (days: { day: string; count: number }[]) => days.slice(0, 8).map((d) => shortDate(d.day) + (d.count > 1 ? ` (${d.count})` : '')).join(' · ') + (days.length > 8 ? ` · +${days.length - 8} more days` : '');
  const shortDate = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(date));
  const regions = new Intl.DisplayNames(['en'], { type: 'region' });
  const country = (code: string) => { try { return /^[A-Z]{2}$/.test(code) ? regions.of(code) ?? code : code; } catch { return code; } };
  const city = (name: string) => name.replace(' / ', ', ');
  const builds = $derived(data.releases?.rows ?? []);
  const downloads = $derived(builds.filter(row => version === 'all' || row.version === version));
  // GitHub's period count is complete unless a release predates the first daily reading (releases.ts)
  const periodTotal = $derived(builds.reduce((sum, row) => sum + (row.period ?? 0), 0));
  const partial = $derived(builds.some(row => row.period === null || row.since));
  const siteFor = (file: string) => data.traffic?.downloads.find(row => row.name === file)?.count ?? 0;
  const versions = $derived([...new Set(data.releases?.rows.map(row => row.version) ?? [])]);
  const maxViews = $derived(Math.max(1, ...(data.traffic?.daily.map(day => day.views) ?? [])));
  const t = $derived(data.traffic?.totals);
  // visits, visitors, places, time and sources by visit began with 0223; earlier days have views only
  const detailedFrom = $derived(data.traffic?.detailed && data.traffic.daily[0] && data.traffic.detailed.slice(0, 10) > data.traffic.daily[0].day ? data.traffic.detailed : null);
  let signingOut = $state(false);
  async function logout() { signingOut = true; try { await signOut({ redirectTo: '/admin/login/' }); } finally { signingOut = false; } }
</script>
{#snippet list(title: string, rows: { name: string; count: number }[], unit: string, label: (name: string) => string = (name) => name, limit = 15)}
  <section class="section"><h2 class="display-s">{title}</h2>
    {#if rows.length}<table><thead class="lbl"><tr><th scope="col">{title}</th><th scope="col">{unit}</th></tr></thead><tbody>{#each rows.slice(0, limit) as row}<tr><th scope="row">{label(row.name)}</th><td>{fmt(row.count)}</td></tr>{/each}</tbody></table>{#if rows.length > limit}<p class="note read-s">+{rows.length - limit} more</p>{/if}
    {:else}<p class="empty">Nothing recorded in this period.</p>{/if}
  </section>
{/snippet}
{#snippet stat(title: string, value: string, note: string)}
  <article class="panel"><h2 class="lbl">{title} / {data.days} days</h2><p class="display">{value}</p><p class="note read-s">{note}</p></article>
{/snippet}
<svelte:head><title>Site activity / Timothy Ali</title><meta name="robots" content="noindex, nofollow" /></svelte:head>
<main class="inner-page admin body" id="main" tabindex="-1">
  <header class="heading">
    <div><p class="lbl">Private / Site admin</p><h1 class="display">Site activity.</h1></div>
    <Cta type="button" onclick={logout} disabled={signingOut}>Sign out</Cta>
  </header>
  <div class="toolbar">
    <nav aria-label="Traffic date range">{#each data.ranges as days}<a class="lbl" class:active={data.days === days} href={`?days=${days}`} aria-current={data.days === days ? 'page' : undefined}>{days} days</a>{/each}</nav>
    <p class="note read-s">Last {data.days} days through today · UTC · Your signed-in browsers aren’t counted</p>
  </div>
  <section aria-label="Overview" class="stats">
    {@render stat('Visitors', t ? fmt(t.uniques) : '—', 'Different people, estimated. Someone who visits in two calendar months counts once in each.')}
    {@render stat('Visits', t ? fmt(t.visits) : '—', 'A visit ends after 30 minutes without activity or when someone arrives from somewhere new.')}
    {@render stat('Page views', t ? fmt(t.views) : '—', 'Every page shown, repeats included.')}
    {@render stat('Time per visit', t?.visits ? time(t.seconds / t.visits) : '—', 'Average active time: the page visible and someone scrolling, pointing or typing.')}
    {@render stat('Site downloads', t ? fmt(t.downloads) : '—', 'Through this site’s download links, once per person, file and day.')}
    {@render stat('GitHub downloads', data.releases ? fmt(periodTotal) : '—', partial && data.releases ? `Releases from before this period count from ${data.releases.tracked ? shortDate(data.releases.tracked) : 'today'}, when daily readings began.` : 'Every request for a release file on GitHub, from anywhere.')}
    {@render stat('Resume opens', t ? fmt(t.resume) : '—', 'Clicks on the resume link on this site.')}
    {@render stat('Messages', t ? fmt(t.contact) : '—', 'Sent through the contact form.')}
  </section>
  {#if detailedFrom}<p role="status" class="notice">Visits, visitors, places, time on page, resume opens and messages are recorded from {shortDate(detailedFrom)}. Days before that have page views, sources by page view and download clicks only.</p>{/if}
  {#if !data.traffic}
    <p role="status" class="notice">{data.trafficError ? 'Traffic data is temporarily unavailable. Try refreshing in a moment.' : 'Traffic storage is not connected yet. Counts will start when tracking goes live.'}</p>
  {:else}
    <section class="section">
      <div class="section-heading"><h2 class="display-s">Page traffic</h2><p class="note read-s">{data.traffic.started ? `First recorded visit: ${shortDate(data.traffic.started)}` : 'No visits recorded yet.'}</p></div>
      <div class="chart" role="img" aria-label={`Daily page views for the last ${data.days} days. Exact values are in the daily totals table below.`}>
        {#each data.traffic.daily as day}<div class="bar-slot" title={`${shortDate(day.day)}: ${fmt(day.views)} views · ${fmt(day.visits)} visits · ${fmt(day.downloads)} downloads`}><span style:height={`${day.views / maxViews * 100}%`}></span></div>{/each}
      </div>
      <div class="chart-axis lbl"><span>{shortDate(data.traffic.daily[0].day)}</span><span>{shortDate(data.traffic.daily.at(-1)!.day)}</span></div>
      <details><summary class="lbl">Daily totals</summary><!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the table horizontally.) -->
<div class="table-wrap" tabindex="0" role="region" aria-label="Daily totals"><table><thead class="lbl"><tr><th scope="col">Day (UTC)</th><th scope="col">Visitors</th><th scope="col">Visits</th><th scope="col">Views</th><th scope="col">Site downloads</th></tr></thead><tbody>{#each [...data.traffic.daily].reverse() as day}<tr><th scope="row">{shortDate(day.day)}</th><td>{fmt(day.visitors)}</td><td>{fmt(day.visits)}</td><td>{fmt(day.views)}</td><td>{fmt(day.downloads)}</td></tr>{/each}</tbody></table></div><p class="note read-s">Visitors here are counted separately each day, so they don’t add up to the period’s visitors. Shared connections can merge people.</p></details>
    </section>
    <section class="section"><h2 class="display-s">Sources</h2>{#if data.traffic.sources.length}<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the table horizontally.) -->
<div class="table-wrap" tabindex="0" role="region" aria-label="Sources"><table class="wide-table"><thead class="lbl"><tr><th scope="col">Source</th><th scope="col">Visits</th><th scope="col">Page views</th><th scope="col">Downloads</th><th scope="col">Resume</th><th scope="col">Last seen</th></tr></thead><tbody>{#each data.traffic.sources.slice(0, 25) as row}<tr><th scope="row">{row.name}<small class="days read-s">{dayList(row.days)}</small></th><td>{fmt(row.visits)}</td><td>{fmt(row.views)}</td><td>{fmt(row.downloads)}</td><td>{fmt(row.resume)}</td><td>{row.days[0] ? shortDate(row.days[0].day) : '—'}</td></tr>{/each}</tbody></table></div>{:else}<p class="empty">Sources will appear here.</p>{/if}
      <p class="note read-s">Every page of a visit counts under the place the visit came from. Direct / unknown is a typed address, a bookmark, or a browser or app that doesn’t share where it came from. “Link / acme” is a tagged link like <code>timothyali.com/?via=acme</code>; “Campaign / newsletter” is a link with <code>?utm_source=newsletter</code>. Dates are UTC days.</p></section>
    {#if data.traffic.campaigns.length}<div class="split">{@render list('Campaigns', data.traffic.campaigns, 'Visits')}</div>{/if}
    <section class="section"><h2 class="display-s">Pages</h2>{#if data.traffic.pages.length}<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the table horizontally.) -->
<div class="table-wrap" tabindex="0" role="region" aria-label="Pages"><table class="wide-table"><thead class="lbl"><tr><th scope="col">Page</th><th scope="col">Views</th><th scope="col">First page of a visit</th><th scope="col">Time per view</th><th scope="col">Read halfway</th><th scope="col">Read to the end</th></tr></thead><tbody>{#each data.traffic.pages as row}<tr><th scope="row"><a href={row.name}>{row.name}</a></th><td>{fmt(row.views)}</td><td>{fmt(row.entries)}</td><td>{row.seconds ? time(row.seconds / row.views) : '—'}</td><td>{row.reach[50] ? pct(row.reach[50], row.views) : '—'}</td><td>{row.reach[100] ? pct(row.reach[100], row.views) : '—'}</td></tr>{/each}</tbody></table></div>{:else}<p class="empty">Page visits will appear here.</p>{/if}
      <p class="note read-s">Read halfway and to the end are the share of views that scrolled that far. Time per view is active time.</p></section>
    <div class="split">
      {@render list('Countries', data.traffic.countries, 'Visits', country)}
      {@render list('Cities', data.traffic.cities, 'Visits', city)}
    </div>
    <div class="triple">
      {@render list('Devices', data.traffic.devices, 'Visits')}
      {@render list('Systems', data.traffic.os, 'Visits')}
      {@render list('Browsers', data.traffic.browsers, 'Visits')}
    </div>
    <div class="split">
      {@render list('Links out', data.traffic.outbound, 'Clicks')}
      {@render list('Downloads by country', data.traffic.downloadCountries, 'Downloads', country)}
    </div>
  {/if}
  <section class="section">
    <div class="section-heading"><h2 class="display-s">Toolbox downloads</h2>{#if versions.length}<label class="lbl">Release <select bind:value={version}><option value="all">All releases</option>{#each versions as v}<option value={v}>{v}</option>{/each}</select></label>{/if}</div>
    <p class="note">GitHub counts every request for a file: this site’s links, the GitHub releases page, the app’s updater, your own downloads and bots. Site downloads count only this site’s links, once per person, file and day, and not from your signed-in browsers, so GitHub’s number is usually the larger one.</p>
    {#if data.unpublished.length}<p role="status" class="notice">The Toolbox page links {data.unpublished.length === 1 ? 'a file that isn’t' : `${data.unpublished.length} files that aren’t`} in a published GitHub release, so {data.unpublished.length === 1 ? 'that link fails' : 'those links fail'}: {data.unpublished.join(', ')}.</p>{/if}
    {#if data.releases}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the table horizontally.) -->
<div class="table-wrap" tabindex="0" role="region" aria-label="Toolbox downloads by build"><table class="build-table"><thead class="lbl"><tr><th scope="col">Build</th><th scope="col">Version</th><th scope="col">GitHub<br /><span class="note read-s">{data.days} days</span></th><th scope="col">GitHub<br /><span class="note read-s">All time</span></th><th scope="col">Site<br /><span class="note read-s">{data.days} days</span></th></tr></thead><tbody>{#each downloads as row}<tr><th scope="row"><span>{row.platform} · {row.architecture} · {row.format}</span><small class="read-s">{row.file} · {row.kind}</small></th><td>{row.version}<small class="read-s">{shortDate(row.published)}</small></td><td>{row.period === null ? '—' : fmt(row.period)}{#if row.since}<small class="read-s">since {shortDate(row.since)}</small>{/if}</td><td>{fmt(row.count)}</td><td>{data.traffic ? fmt(siteFor(row.file)) : '—'}</td></tr>{/each}</tbody></table></div>
      <p class="note read-s">Updated {new Date(data.releases.updated).toLocaleString('en-US', { timeZone: 'UTC' })} UTC · Cached for up to 5 minutes.</p>
    {:else}<p role="status" class="notice">GitHub’s download counts are unavailable right now. Try refreshing in a moment.</p>{/if}
    <p class="note read-s">GitHub counts are requests for files, including repeats, updates and automated checks, not people or installs. GitHub only reports all-time totals, so the site reads them every day and a period’s count is the difference; a dash means a release from before the first reading. The Mac updater fetches the update package; on Windows and Linux it fetches the installer. Windows builds from before 1.2.0 are marked historical. Checksums and the update feed are excluded.</p>
  </section>
  {#if data.traffic}
    <section class="section">
      <h2 class="display-s">Toolbox app</h2>
      <div class="stats">
        {@render stat('Installs checking', fmt(t!.installs), 'Different copies of the app that checked for updates, estimated, once per calendar month.')}
        {@render stat('Update checks', fmt(t!.updates), 'Every check, repeats included.')}
      </div>
      <div class="triple">
        {@render list('Versions', data.traffic.updates.versions, 'Checks')}
        {@render list('Platforms', data.traffic.updates.platforms, 'Checks')}
        {@render list('Where', data.traffic.updates.countries, 'Checks', country)}
      </div>
      <p class="note read-s">The app checks for updates when someone clicks Updates in its sidebar, through this site and then GitHub. Versions before the one that checks through this site go straight to GitHub and aren’t counted. Your own copies count too.</p>
    </section>
  {/if}
  <footer class="notes"><p class="lbl">How to read these numbers</p><p class="note read-s">Pages are recorded in the browser when they become visible; ad blockers and switched-off JavaScript can leave some out. Downloads and app checks are counted on the server, so those still count. Known bots and link previews are left out. Places come from the network address, which Vercel reads; the address itself isn’t stored. Visitors are counted with a hash of the address and browser that changes every calendar month; raw addresses, full referrer URLs and browser strings aren’t stored. There is no tracking cookie; the browser keeps the current visit’s source for 30 minutes. Signing in here sets an exclusion cookie for this browser. Counts are kept for 366 days.</p></footer>
</main>
<style>
  .admin{width:100%;min-width:0;padding:var(--s8) var(--gutter);max-width:1536px;margin:auto;display:flex;flex-direction:column;gap:var(--s6)}
  .heading,.toolbar,.section-heading{display:flex;align-items:center;justify-content:space-between;gap:var(--s3);flex-wrap:wrap}.heading>div{min-width:0;max-width:100%}.heading h1{margin-top:var(--s2)}
  select{font:inherit;background:var(--paper);color:var(--fg);cursor:pointer}
  nav{display:flex;gap:var(--s1);flex-wrap:wrap}nav a{padding:var(--s2);border:2px solid var(--fg)}nav a.active{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
  .stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--s3)}.stats article{padding:var(--s3)}.stats article .display{margin:var(--s3) 0 var(--s2)}
  .note{max-width:108ch}.section{min-width:0;display:flex;flex-direction:column;gap:var(--s3)}
  .split{display:grid;grid-template-columns:1fr 1fr;gap:var(--s6)}.triple{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--s6)}.table-wrap{overflow-x:auto;max-width:100%}table{width:100%;border-collapse:collapse;text-align:left}th{font-weight:400}th,td{padding:var(--s2) var(--s1);border-bottom:2px solid var(--tint-major);vertical-align:top}td{text-align:right;white-space:nowrap}thead th:not(:first-child){text-align:right}tbody th{overflow-wrap:anywhere}tbody th a{text-decoration:underline;text-underline-offset:4px}small{display:block;margin-top:var(--s1)}
  .chart{height:192px;display:flex;align-items:flex-end;gap:4px;border-bottom:2px solid var(--fg)}.bar-slot{height:100%;flex:1;display:flex;align-items:flex-end;min-width:0}.bar-slot span{width:100%;background:var(--accent)}.chart-axis{display:flex;justify-content:space-between}summary{padding:var(--s2) 0;cursor:pointer}details .note{margin-top:var(--s2)}.days{opacity:var(--dim);white-space:normal}select{padding:var(--s2);margin-left:var(--s1);border:2px solid var(--fg)}.build-table,.wide-table{min-width:720px}.notice{border-left:8px solid var(--accent);padding:var(--s3);background:var(--tint-fine)}.notes{display:flex;flex-direction:column;gap:var(--s2)}.empty{padding:var(--s3) 0}
  @media(max-width:1100px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}.triple{grid-template-columns:1fr 1fr}}
  @media(max-width:900px){.split,.triple{grid-template-columns:1fr}.admin{padding-top:var(--s4)}}
  @media(max-width:420px){.stats{grid-template-columns:1fr}.heading h1{font-size:27.5px;line-height:32px}.toolbar .note{max-width:29ch}.chart{gap:2px}.stats article{padding:var(--s2)}}
</style>
