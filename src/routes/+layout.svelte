<script lang="ts">
  import '@fontsource/jacquard-24/400.css';
  import '@fontsource/jersey-15/400.css';
  import '@fontsource/press-start-2p/400.css';
  import '../app.css';
  import jacquardUrl from '@fontsource/jacquard-24/files/jacquard-24-latin-400-normal.woff2?url';
  import jerseyUrl from '@fontsource/jersey-15/files/jersey-15-latin-400-normal.woff2?url';
  import pressStartUrl from '@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff2?url';
  // Every face the chrome and the first fold use, 68KB together, so the first paint is set in them.
  const preload = [jacquardUrl, pressStartUrl, '/fonts/parc-pixel.woff2', '/fonts/parc-pixel-bold.woff2', jerseyUrl];
  import { page } from '$app/state';
  import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { motion, grid, theme } from '$lib/motion.svelte';
  import SocialMeta from '$lib/components/SocialMeta.svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import { INK, WHITE, STEP_FAST } from '$lib/tokens';
  let { children } = $props();
  let explicit = false;
  let clock = $state('');
  let scrolled = $state('0000'); // the page offset in cells of the unit (0105)
  const readScroll = () => { scrolled = String(Math.min(9999, Math.floor(Math.max(0, window.scrollY) / 8))).padStart(4, '0'); };
  let navCollapsed = $state(false);
  let headerHeight = $state(64);
  let headerElement: HTMLElement;
  let lastScroll = 0;
  // In-page jumps ease (base.css, 0098); a route change must not, or the new page slides up
  // from wherever the old one was scrolled. The root's behaviour is switched off for the
  // navigation and back on once the kit has placed the new page.
  beforeNavigate((nav) => { if (nav.to?.url.pathname !== nav.from?.url.pathname) document.documentElement.style.scrollBehavior = 'auto'; });
  afterNavigate(() => { navCollapsed = false; lastScroll = Math.max(0, window.scrollY); readScroll(); requestAnimationFrame(() => { document.documentElement.style.scrollBehavior = ''; }); });
  // A state change arrives through the dither (base.css, 0100 / 0104): the update runs
  // inside a view transition with a class on <html> that picks the wipe. Without the API,
  // or with motion off, it is the plain update — a hard cut.
  function wipe(kind: 'vt-theme' | 'vt-route', update: () => void | Promise<void>) {
    const root = document.documentElement;
    if (!motion.on || typeof document.startViewTransition !== 'function') return update();
    root.classList.add(kind);
    const t = document.startViewTransition(update);
    t.finished.finally(() => root.classList.remove(kind));
    return t;
  }
  // Route change through the field (0104): the old page dithers out to the checker, the new
  // page dithers in. Hash jumps on the same path are not a change of page.
  onNavigate((nav) => {
    if (!motion.on || typeof document.startViewTransition !== 'function' || nav.to?.url.pathname === nav.from?.url.pathname) return;
    return new Promise<void>((resolve) => { wipe('vt-route', async () => { resolve(); await nav.complete; }); });
  });
  // The visitor's own time and zone, not Denver's: the generic short name where English has
  // one (MT, PT), otherwise the offset (GMT+9); long names are skipped so the strip keeps its width.
  const fmt = new Intl.DateTimeFormat('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  function zoneName() {
    for (const timeZoneName of ['shortGeneric', 'short'] as const) {
      const part = new Intl.DateTimeFormat('en-US', { timeZoneName }).formatToParts(new Date()).find((p) => p.type === 'timeZoneName');
      if (part && part.value.length <= 5) return part.value;
    }
    return '';
  }
  function skipToContent(event: MouseEvent) {
    const main = document.getElementById('main'); if (!main) return;
    event.preventDefault(); main.focus({ preventScroll: true }); main.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  function toggleMotion() { motion.on = !motion.on; explicit = true; try { localStorage.setItem('tim-motion', motion.on ? 'on' : 'off'); } catch {} }
  function applyTheme() { document.documentElement.dataset.theme = theme.light ? 'light' : 'dark'; document.querySelector('meta[name=theme-color]')?.setAttribute('content', theme.light ? WHITE : INK); }
  // The flip itself runs inside the wipe so the canvases (which redraw on `theme.light`)
  // read the new colours after `data-theme` has changed, as they do without a transition.
  function toggleTheme() { wipe('vt-theme', () => { theme.light = !theme.light; try { localStorage.setItem('tim-theme', theme.light ? 'light' : 'dark'); } catch {} applyTheme(); }); }
  function toggleGrid() { grid.on = !grid.on; try { localStorage.setItem('tim-grid', grid.on ? 'on' : 'off'); } catch {} }
  onMount(() => {
    lastScroll = Math.max(0, window.scrollY); readScroll();
    const measureHeader = () => { headerHeight = headerElement.offsetHeight; };
    measureHeader();
    const headerObserver = new ResizeObserver(measureHeader);
    headerObserver.observe(headerElement);
    const onScroll = () => {
      const y = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight));
      if (y <= headerHeight || y < lastScroll) navCollapsed = false;
      else if (y > lastScroll && !headerElement.contains(document.activeElement)) navCollapsed = true;
      lastScroll = y; readScroll();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let saved: string | null = null; let g: string | null = null;
    try { saved = localStorage.getItem('tim-motion'); g = localStorage.getItem('tim-grid'); } catch {}
    explicit = saved === 'on' || saved === 'off';
    motion.on = explicit ? saved === 'on' : !media.matches;
    grid.on = g === 'on';
    theme.light = document.documentElement.dataset.theme === 'light';
    motion.ready = true;
    const update = () => { if (!explicit) motion.on = !media.matches; };
    media.addEventListener('change', update);
    let zone = zoneName();
    const tickClock = () => { const now = new Date(); if (now.getSeconds() === 0) zone = zoneName(); clock = `${zone} ${fmt.format(now)}`.trim(); };
    tickClock(); const id = setInterval(tickClock, 1000);
    return () => { window.removeEventListener('scroll', onScroll); headerObserver.disconnect(); media.removeEventListener('change', update); clearInterval(id); };
  });
  // A page may declare the path its chrome should reflect (the dev-only /og/ route renders as another page).
  const pathname = $derived((page.data.chromePath as string | undefined) ?? page.url.pathname);
  const segments = $derived(pathname.split('/').filter(Boolean));
  const route = $derived(segments.length ? segments.join('/') : 'index');
  // Below 900px the strip shows only the last segment, so a long study slug does not clip mid-word (decision 0072).
  // The path decodes into place on a route change (0102): the prefix is fixed, the route
  // part is a Decode, so only what changed scrambles.
  const shortPrefix = $derived(segments.length > 1 ? '~/…/' : '~/tim/');
  const shortTail = $derived(segments.length > 1 ? segments[segments.length - 1] : route);
</script>
<svelte:head>{#each preload as href}<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" {href} />{/each}</svelte:head>
<SocialMeta />
<div class="site" class:motion={motion.on} class:show-grid={grid.on} data-motion={motion.on ? 'on' : 'off'}>
  <a class="skip-link lbl" href="#main" onclick={skipToContent}>Skip to content</a>
  <div class="nav-chrome" class:collapsed={navCollapsed} style={`--header-height:${headerHeight}px`}>
  <header class="site-header" bind:this={headerElement}>
    <a class="wordmark blackletter" href="/" aria-label="Timothy Ali — home">timothy ali</a>
    <nav class="lbl" aria-label="Main navigation">
      <a href="/" aria-current={pathname === '/' ? 'page' : undefined}><b>01</b>Index</a>
      <a href="/work/" aria-current={pathname.startsWith('/work') ? 'page' : undefined}><b>02</b>Work</a>
      <a href="/contact/" aria-current={pathname.startsWith('/contact') ? 'page' : undefined}><b>03</b>Contact</a>
      <a href="/toolbox/" aria-current={pathname.startsWith('/toolbox') ? 'page' : undefined}><b>04</b>Toolbox</a>
    </nav>
  </header>
  <div class="readout mono" aria-label="Status">
    <span class="path mono" aria-hidden="true"><span class="path-text"><span class="path-full">~/tim/<Decode text={route} step={STEP_FAST} /></span><span class="path-short">{shortPrefix}<Decode text={shortTail} step={STEP_FAST} /></span></span><Cursor /></span><span class="st-scroll">+{scrolled}</span><span class="st-city">Denver, CO</span><span class="st-coords">39.7392N 104.9903W</span><span class="st-clock">{clock || '--:--:--'}</span><span class="st-sys">SYS.OK</span>
  </div>
  </div>
  {@render children()}
  <footer class="global-footer lbl" class:home-footer={page.url.pathname === '/'}>
    <span class="dim">(C) {new Date().getFullYear()} Timothy Ali <span class="hide-m">// A little human. A little machine.</span> // EOF</span>
    {#if motion.ready}<span class="controls"><button type="button" onclick={toggleMotion} aria-pressed={motion.on}>Motion <span class="state">[{motion.on ? 'on' : 'off'}]</span></button><button type="button" onclick={toggleGrid} aria-pressed={grid.on}>Grid <span class="state">[{grid.on ? 'on' : 'off'}]</span></button><button type="button" onclick={toggleTheme} aria-pressed={theme.light}>Theme <span class="state">[{theme.light ? 'light' : 'dark'}]</span></button></span>{/if}
  </footer>
</div>
