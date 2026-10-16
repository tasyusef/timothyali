<script lang="ts">
  // Home as a page that scrolls (PX-61, on Timothy's direction after the pinned stages of
  // PX-54): the terminal hero, the four selected projects as rows and the invitation, then the
  // footer. The statement was cut on Timothy’s word (0161). One field runs behind the whole
  // page, hero included (0162): the hero's sky, its fall-off measured over one screen so the
  // first screen is the hero it was, then easing back and forth, one dense bank every two screens.
  // It starts under the chrome so it runs up behind the header. Its knockouts match the studies'
  // (0190): big type thins the field in a tight rounded cutout, small type clears it.
  import Band from '$lib/components/Band.svelte';
  import Hero from '$lib/components/home/Hero.svelte';
  import WorkList from '$lib/components/home/WorkList.svelte';
  import Invite from '$lib/components/home/Invite.svelte';
</script>
<main id="main" tabindex="-1">
  <Band as="div" class="page-sky" mode="scene" seed={3} lightAs="dither" mountains="a" feather={12} depth={0.85} clearFeather={3} avoid=".hero-name .ghost, .hero-name:not(:has(.decode)) > :not(.sr-only), .invitation h2 > span" clear=".hero-actions > *, .hero-role .ghost, .hero-role:not(:has(.decode)), .list .all, .invitation .cta-row">
    <Hero />
    <WorkList />
    <Invite />
  </Band>
</main>
<style>
main :global(.page-sky){--chrome:96px;position:relative;isolation:isolate;overflow:hidden;margin-top:calc(-1 * var(--chrome))}
@media(max-width:700px){main :global(.page-sky){--chrome:104px}}
</style>
