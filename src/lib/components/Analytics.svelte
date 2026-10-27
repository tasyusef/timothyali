<script lang="ts">
  // Public pages are the ones with share tags (the layout's `meta`); the endpoint checks them against
  // its own list. Without `$lib/analytics` here the page bundle no longer carries the work index and
  // the Toolbox tables (0207): `$lib/sources` and `$lib/site` import nothing else. No trailing slash:
  // an endpoint's URL has none. Downloads are counted by the server (`/download/…`, 0223).
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { HOSTS, RESUME_URL, VIA } from '$lib/site';
  import { sourceOf, UTM } from '$lib/sources';
  // A visit is what one person does until 30 minutes pass without a page or a click, or a new
  // source arrives (a referring site, `?via=`, a campaign). It is kept in this browser only, never
  // sent as an identifier: it says which pages count as the visit's first and where it came from.
  type Arrival = { referrer: string; via?: string; utm?: string; campaign?: string; last: number };
  const KEY = 'tim-visit'; const IDLE = 30 * 60000;
  let arrival: Arrival | null = null;
  function arrive(): boolean {
    const now = Date.now(); const params = new URLSearchParams(window.location.search);
    const via = params.get('via')?.toLowerCase() ?? ''; const utm = params.get('utm_source')?.toLowerCase() ?? ''; const campaign = params.get('utm_campaign')?.toLowerCase() ?? '';
    let referrer = ''; try { const url = new URL(document.referrer); if (!HOSTS.includes(url.hostname) && url.host !== window.location.host) referrer = document.referrer; } catch {}
    let stored: Arrival | null = null; try { stored = JSON.parse(localStorage.getItem(KEY) ?? 'null'); } catch {}
    const fresh = Boolean(referrer || VIA.test(via) || UTM.test(utm));
    if (stored && now - stored.last < IDLE && !fresh) { arrival = stored; touch(); return false; }
    arrival = { referrer, last: now, ...(VIA.test(via) ? { via } : {}), ...(UTM.test(utm) ? { utm, ...(UTM.test(campaign) ? { campaign } : {}) } : {}) };
    touch(); return true;
  }
  function touch() { if (!arrival) return; arrival.last = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(arrival)); } catch {} }
  const from = () => ({ referrer: arrival?.referrer, via: arrival?.via, utm: arrival?.utm });
  function send(value: object) {
    touch();
    void fetch('/api/e', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value), keepalive: true }).catch(() => {});
  }
  // Time on a page counts while it is visible and someone has scrolled, pointed or typed in the last
  // 90 seconds; scroll depth is the furthest 25/50/75/100% of the page seen. Each report sends what
  // is new since the last, so a tab hidden and shown again doesn't count twice.
  let current = ''; let active = 0; let since = 0; let input = 0; let reached = new Set<number>(); let reported = new Set<number>();
  const tick = () => { const now = Date.now(); if (since && document.visibilityState === 'visible' && now - input < 90000) active += Math.min(now - since, 5000); since = now; };
  function depth() {
    const seen = (window.scrollY + window.innerHeight) / Math.max(document.documentElement.scrollHeight, 1) * 100;
    for (const d of [25, 50, 75, 100]) if (seen >= d - 1) reached.add(d);
  }
  function report() {
    if (!current) return; tick();
    const seconds = Math.round(active / 1000); const fresh = [...reached].filter((d) => !reported.has(d));
    if (seconds || fresh.length) send({ type: 'engage', path: current, seconds: Math.min(seconds, 1800), reached: fresh });
    active = 0; fresh.forEach((d) => reported.add(d));
  }
  let lastPath = '';
  function visit() {
    const path = window.location.pathname;
    if (document.visibilityState !== 'visible' || lastPath === path || !page.data.meta) return;
    report();
    const entry = !lastPath && arrive();
    lastPath = path; current = path; active = 0; since = Date.now(); input = Date.now(); reached = new Set(); reported = new Set();
    send({ type: 'view', path, entry, ...from(), campaign: arrival?.campaign });
    requestAnimationFrame(depth);
  }
  afterNavigate(visit);
  onMount(() => {
    // The site's download links carry the visit's source to the server's count.
    const tagDownload = (anchor: HTMLAnchorElement) => { const url = new URL(anchor.href); url.searchParams.set('s', sourceOf(from())); anchor.href = url.href; };
    const pointed = (event: Event) => {
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (anchor?.href && new URL(anchor.href).pathname.startsWith('/download/')) tagDownload(anchor);
    };
    const click = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor?.href || !current) return;
      const url = new URL(anchor.href);
      if (url.protocol === 'mailto:') send({ type: 'out', path: current, host: 'email' });
      else if (url.origin === window.location.origin && url.pathname === RESUME_URL) send({ type: 'resume', path: current, ...from() });
      else if (/^https?:$/.test(url.protocol) && url.host !== window.location.host && !HOSTS.includes(url.hostname)) send({ type: 'out', path: current, host: url.hostname });
    };
    // a middle click opens the link in a new tab without a click event
    const middle = (event: MouseEvent) => { if (event.button === 1) click(event); };
    const hidden = () => { if (document.visibilityState === 'hidden') report(); else { since = Date.now(); input = Date.now(); visit(); } };
    const moved = () => { tick(); input = Date.now(); };
    const scrolled = () => { moved(); depth(); };
    const timer = setInterval(tick, 5000);
    const listeners: [EventTarget, string, EventListener][] = [[document, 'visibilitychange', hidden], [window, 'pagehide', report], [document, 'pointerdown', pointed], [document, 'keydown', pointed], [document, 'click', click as EventListener], [document, 'auxclick', middle as EventListener], [window, 'scroll', scrolled], [document, 'pointermove', moved], [document, 'keydown', moved]];
    for (const [target, type, fn] of listeners) target.addEventListener(type, fn, { passive: true, capture: true });
    return () => { clearInterval(timer); for (const [target, type, fn] of listeners) target.removeEventListener(type, fn, { capture: true }); };
  });
</script>
