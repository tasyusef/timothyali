<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { publicPaths, downloadFiles } from '$lib/analytics';
  let lastPath = '';
  function send(value: object) {
    void fetch('/api/analytics/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value), keepalive: true }).catch(() => {});
  }
  function visit() {
    const path = window.location.pathname;
    if (document.visibilityState !== 'visible' || lastPath === path || !publicPaths.includes(path)) return;
    const referrer = lastPath ? window.location.origin + lastPath : document.referrer;
    lastPath = path; send({ type: 'view', path, referrer });
  }
  afterNavigate(visit);
  onMount(() => {
    const click = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      const file = downloadFiles.find((file) => file.href === anchor?.href);
      if (file) send({ type: 'download', path: window.location.pathname, file: file.name });
    };
    document.addEventListener('visibilitychange', visit);
    document.addEventListener('click', click);
    return () => { document.removeEventListener('visibilitychange', visit); document.removeEventListener('click', click); };
  });
</script>
