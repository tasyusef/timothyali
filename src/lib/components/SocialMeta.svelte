<script lang="ts">
  import { page } from '$app/state';
  import { SITE_URL, socialFor } from '$lib/social';
  import { jsonLdFor } from '$lib/seo';
  const meta = $derived(socialFor(page.url.pathname));
  const jsonLd = $derived(meta ? jsonLdFor(meta.path) : '');
</script>
<svelte:head>
  {#if meta}
    <link rel="canonical" href={`${SITE_URL}${meta.path}`} />
    <meta name="author" content="Timothy Ali" />
    <meta property="og:site_name" content="Timothy Ali" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content={meta.title} />
    <meta property="og:description" content={meta.description} />
    <meta property="og:url" content={`${SITE_URL}${meta.path}`} />
    <meta property="og:image" content={`${SITE_URL}/og/${meta.image}.png`} />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={meta.alt} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={meta.title} />
    <meta name="twitter:description" content={meta.description} />
    <meta name="twitter:image" content={`${SITE_URL}/og/${meta.image}.png`} />
    <meta name="twitter:image:alt" content={meta.alt} />
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON.stringify of our own data, `</` escaped in seo.ts -->
    {@html jsonLd}
  {/if}
</svelte:head>
