<script lang="ts">
  // The error page (0210): the 404's one screen, its field and its action, with the error's own words.
  import { page } from '$app/state';
  import Band from '$lib/components/Band.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import NotFound from './not-found/+page.svelte';
</script>
<svelte:head>{#if page.status !== 404}<title>Something went wrong / Timothy Ali</title><meta name="robots" content="noindex" />{/if}</svelte:head>
{#if page.status === 404}<NotFound />{:else}
  <main id="main" tabindex="-1" class="inner-page fill-main">
    <Band class="failed" mode="scene" shot="moon" seed={4} avoid=".failed h1" clear=".failed p">
      <h1 class="display">Something went wrong.</h1>
      <p class="body">Please try again in a moment.</p>
      <Cta href="/">Back to home <Arrow /></Cta>
    </Band>
  </main>
{/if}
<style>
main :global(.failed){display:flex;flex-direction:column;align-items:flex-start;gap:var(--s4);padding-top:var(--s6);padding-bottom:var(--s8)}
</style>
