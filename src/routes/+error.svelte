<script lang="ts">
  import { page } from '$app/state';
  import NotFound from './not-found/+page.svelte';
</script>
<svelte:head>{#if page.status !== 404}<title>Something went wrong — Timothy Ali</title><meta name="robots" content="noindex" />{/if}</svelte:head>
{#if page.status === 404}<NotFound />{:else}
  <main id="main" tabindex="-1" class="inner-page body" style="padding:var(--s8) var(--gutter);min-height:65vh"><h1 class="display">Something went wrong.</h1><p>Please try again in a moment.</p><a href="/">Back to home</a></main>
{/if}
