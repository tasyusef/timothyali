<script lang="ts">
  import { signOut } from '@auth/sveltekit/client';
  let { data } = $props();
  let version = $state('all');
  const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);
  const shortDate = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(date));
  const downloads = $derived(data.releases?.rows.filter(row => version === 'all' || row.version === version) ?? []);
  const versions = $derived([...new Set(data.releases?.rows.map(row => row.version) ?? [])]);
  const maxViews = $derived(Math.max(1, ...(data.traffic?.daily.map(day => day.views) ?? [])));
  let signingOut = $state(false);
  async function logout() { signingOut = true; try { await signOut({ redirectTo: '/admin/login/' }); } finally { signingOut = false; } }
</script>
<svelte:head><title>Site activity / Timothy Ali</title><meta name="robots" content="noindex, nofollow" /></svelte:head>
<main class="inner-page admin body" id="main" tabindex="-1">
  <header class="heading">
    <div><p class="lbl">Private / Site admin</p><h1 class="display">Site activity.</h1></div>
    <button class="quiet lbl" onclick={logout} disabled={signingOut}>Sign out ↗</button>
  </header>
  <div class="toolbar">
    <nav aria-label="Traffic date range">{#each [7,30,90] as days}<a class="lbl" class:active={data.days === days} href={`?days=${days}`} aria-current={data.days === days ? 'page' : undefined}>{days} days</a>{/each}</nav>
    <p class="note">Through today · UTC · This browser is excluded from tracking</p>
  </div>
  <section aria-label="Overview" class="stats">
    <article><h2 class="lbl">Page views / {data.days} days</h2><p class="display">{data.traffic ? fmt(data.traffic.views) : '—'}</p><p class="note">Includes repeat visits.</p></article>
    <article><h2 class="lbl">Download clicks / {data.days} days</h2><p class="display">{data.traffic ? fmt(data.traffic.clicks) : '—'}</p><p class="note">Clicks on this site’s build links.</p></article>
    <article><h2 class="lbl">File downloads / All time</h2><p class="display">{data.releases ? fmt(data.releases.rows.reduce((sum, row) => sum + row.count, 0)) : '—'}</p><p class="note">GitHub totals across public releases.</p></article>
  </section>
  {#if !data.traffic}
    <p role="status" class="notice">{data.trafficError ? 'Traffic data is temporarily unavailable. Try refreshing in a moment.' : 'Traffic storage is not connected yet. Counts will start when tracking goes live.'}</p>
  {:else}
    <section class="section">
      <div class="section-heading"><h2 class="display-s">Page traffic</h2><p class="note">{data.traffic.started ? `First recorded visit: ${shortDate(data.traffic.started)}` : 'No visits recorded yet.'}</p></div>
      <div class="chart" role="img" aria-label={`Daily page views for the last ${data.days} days. Exact values are in the daily totals table below.`}>
        {#each data.traffic.daily as day}<div class="bar-slot" title={`${shortDate(day.day)}: ${fmt(day.views)} views · ${fmt(day.visitors)} estimated visitors`}><span style:height={`${day.views / maxViews * 100}%`}></span></div>{/each}
      </div>
      <div class="chart-axis lbl"><span>{shortDate(data.traffic.daily[0].day)}</span><span>{shortDate(data.traffic.daily.at(-1)!.day)}</span></div>
      <details><summary class="lbl">Daily totals</summary><!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the table horizontally.) -->
<div class="table-wrap" tabindex="0" role="region" aria-label="Daily totals"><table><thead><tr><th scope="col">Day (UTC)</th><th scope="col">Views</th><th scope="col">Estimated visitors</th></tr></thead><tbody>{#each [...data.traffic.daily].reverse() as day}<tr><th scope="row">{shortDate(day.day)}</th><td>{fmt(day.views)}</td><td>{fmt(day.visitors)}</td></tr>{/each}</tbody></table></div><p class="note">Visitors are estimated separately each day from a temporary hash of IP address and browser type. Shared connections can merge visitors. These daily counts are not a count of unique people across the whole period.</p></details>
    </section>
    <div class="split">
      <section class="section"><h2 class="display-s">Pages</h2>{#if data.traffic.pages.length}<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the table horizontally.) -->
<div class="table-wrap" tabindex="0" role="region" aria-label="Page traffic"><table><thead><tr><th scope="col">Page</th><th scope="col">Views</th></tr></thead><tbody>{#each data.traffic.pages as row}<tr><th scope="row"><a href={row.name}>{row.name}</a></th><td>{fmt(row.count)}</td></tr>{/each}</tbody></table></div>{:else}<p class="empty">Page visits will appear here.</p>{/if}</section>
      <section class="section"><h2 class="display-s">Referrals</h2>{#if data.traffic.referrers.length}<table><thead><tr><th scope="col">Source</th><th scope="col">Views</th></tr></thead><tbody>{#each data.traffic.referrers.slice(0, 20) as row}<tr><th scope="row">{row.name}</th><td>{fmt(row.count)}</td></tr>{/each}</tbody></table>{:else}<p class="empty">Referral sources will appear here.</p>{/if}<p class="note">Direct / unknown includes internal navigation and visits where the browser doesn’t share a referrer.</p></section>
    </div>
    <section class="section"><h2 class="display-s">Devices</h2><div class="devices">{#each data.traffic.devices as row}<p><span class="lbl">{row.name}</span> {fmt(row.count)} views</p>{:else}<p class="empty">Device totals will appear here.</p>{/each}</div></section>
  {/if}
  <section class="section">
    <div class="section-heading"><h2 class="display-s">Toolbox downloads</h2>{#if versions.length}<label class="lbl">Release <select bind:value={version}><option value="all">All releases</option>{#each versions as v}<option value={v}>{v}</option>{/each}</select></label>{/if}</div>
    <p>Downloads by build, including downloads made directly from GitHub.</p>
    {#if data.releases}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the table horizontally.) -->
<div class="table-wrap" tabindex="0" role="region" aria-label="Toolbox downloads by build"><table class="build-table"><thead><tr><th scope="col">Build</th><th scope="col">Version</th><th scope="col">File downloads<br /><span class="note">All time</span></th><th scope="col">Site clicks<br /><span class="note">{data.days} days</span></th></tr></thead><tbody>{#each downloads as row}<tr><th scope="row"><span>{row.platform} · {row.architecture} · {row.format}</span><small>{row.file}</small></th><td>{row.version}</td><td>{fmt(row.count)}</td><td>{data.traffic ? fmt(data.traffic.downloads.find(file => file.name === row.file)?.count ?? 0) : '—'}</td></tr>{/each}</tbody></table></div>
      <p class="note">Updated {new Date(data.releases.updated).toLocaleString('en-US', { timeZone: 'UTC' })} UTC · Cached for up to 5 minutes.</p>
    {:else}<p role="status" class="notice">GitHub’s download counts are unavailable right now. Try refreshing in a moment.</p>{/if}
    <p class="note">File downloads are requests for release files, including repeats and automated checks. They don’t tell us how many people installed the app. Windows is shown only for historical releases. Checksums and update metadata are excluded.</p>
  </section>
  <footer class="notes"><p class="lbl">How to read these numbers</p><p class="note">Traffic is recorded when a public page becomes visible. Ad blockers, disabled JavaScript and known bots can leave visits out. Counts are retained for 366 days. Raw IP addresses, full referrer URLs and browser strings aren’t stored. There is no tracking cookie; signing in sets an exclusion cookie for this browser.</p></footer>
</main>
<style>
  .admin{width:100%;min-width:0;padding:var(--s8) var(--gutter);max-width:1536px;margin:auto;display:flex;flex-direction:column;gap:var(--s6)}
  .heading,.toolbar,.section-heading{display:flex;align-items:center;justify-content:space-between;gap:var(--s3);flex-wrap:wrap}.heading>div{min-width:0;max-width:100%}.heading h1{margin-top:var(--s2)}
  button,select{font:inherit;background:var(--paper);color:var(--fg);cursor:pointer}button{min-height:48px;padding:var(--s2)}.quiet{border:2px solid var(--fg)}
  nav{display:flex;gap:var(--s1);flex-wrap:wrap}nav a{padding:var(--s2);border:2px solid var(--fg)}nav a.active{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
  .stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--s3)}.stats article{padding:var(--s3);background:var(--fg);color:var(--paper)}.stats article .display{margin:var(--s3) 0 var(--s2)}
  .note,small{font-family:var(--face-text);font-size:22.5px;line-height:24px}.note{max-width:90ch}.section{min-width:0;display:flex;flex-direction:column;gap:var(--s3)}
  .split{display:grid;grid-template-columns:1.2fr 1fr;gap:var(--s6)}.table-wrap{overflow-x:auto;max-width:100%}table{width:100%;border-collapse:collapse;text-align:left}th{font-weight:400}th,td{padding:var(--s2) var(--s1);border-bottom:2px solid var(--grid-major);vertical-align:top}thead th{font-family:var(--face-label);font-size:12.5px;line-height:16px;text-transform:uppercase}td{text-align:right;white-space:nowrap}thead th:not(:first-child){text-align:right}tbody th{overflow-wrap:anywhere}tbody th a{text-decoration:underline;text-underline-offset:4px}small{display:block;margin-top:var(--s1)}
  .chart{height:192px;display:flex;align-items:flex-end;gap:4px;border-bottom:2px solid var(--fg)}.bar-slot{height:100%;flex:1;display:flex;align-items:flex-end;min-width:0}.bar-slot span{width:100%;background:var(--accent)}.chart-axis{display:flex;justify-content:space-between}summary{padding:var(--s2) 0;cursor:pointer}details .note{margin-top:var(--s2)}.devices{display:flex;flex-wrap:wrap;gap:var(--s4)}.devices .lbl{display:block;margin-bottom:var(--s1)}select{padding:var(--s2);margin-left:var(--s1);border:2px solid var(--fg)}.build-table{min-width:640px}.notice{border-left:8px solid var(--accent);padding:var(--s3);background:var(--grid-fine)}.notes{display:flex;flex-direction:column;gap:var(--s2)}.empty{padding:var(--s3) 0}
  @media(max-width:900px){.stats{grid-template-columns:1fr}.split{grid-template-columns:1fr}.admin{padding-top:var(--s4)}}
  @media(max-width:420px){.heading h1{font-size:27.5px;line-height:32px}.toolbar .note{max-width:24ch}.chart{gap:2px}.stats article{padding:var(--s2)}}
</style>
