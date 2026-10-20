<script lang="ts">
  // Public pages are the ones with share tags (the layout's `meta`), and a download is a link to a
  // release file; the endpoint checks both against its own lists. Without `$lib/analytics` here the
  // page bundle no longer carries the work index and the Toolbox tables (0207). No trailing slash:
  // an endpoint's URL has none, and /api/analytics/ answered every beacon with a redirect first.
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { VIA } from '$lib/site';
  let lastPath = '';
  // A tagged link (`?via=acme`) marks the rest of the tab's visit: every page it views counts under
  // that tag. VIA is $lib/site's, which imports nothing (the bundle stays without the work index, 0207).
  function tag() {
    let via = new URLSearchParams(window.location.search).get('via')?.toLowerCase() ?? '';
    try { if (VIA.test(via)) sessionStorage.setItem('tim-via', via); else via = sessionStorage.getItem('tim-via') ?? ''; } catch {}
    return via || undefined;
  }
  function send(value: object) {
    void fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value), keepalive: true }).catch(() => {});
  }
  function visit() {
    const path = window.location.pathname;
    if (document.visibilityState !== 'visible' || lastPath === path || !page.data.meta) return;
    const referrer = lastPath ? window.location.origin + lastPath : document.referrer;
    lastPath = path; send({ type: 'view', path, referrer, via: tag() });
  }
  afterNavigate(visit);
  onMount(() => {
    const click = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      const href = anchor?.href ?? '';
      if (href.includes('/releases/download/')) send({ type: 'download', path: window.location.pathname, file: new URL(href).pathname.split('/').at(-1) });
    };
    document.addEventListener('visibilitychange', visit);
    document.addEventListener('click', click);
    return () => { document.removeEventListener('visibilitychange', visit); document.removeEventListener('click', click); };
  });
</script>
