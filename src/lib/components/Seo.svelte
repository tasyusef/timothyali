<script lang="ts">
	import { page } from '$app/state';
	import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '$lib/site';

	interface Props {
		/** Page title — suffixed with "— Timothy Ali". Omit for the homepage default. */
		title?: string;
		description?: string;
		/** Key into the generated OG image set (see src/lib/og.ts). */
		ogKey?: string;
		type?: 'website' | 'article';
		publishedTime?: string;
		/** Override the OG image with an absolute URL. */
		image?: string;
		jsonLd?: Record<string, unknown>;
	}

	let {
		title,
		description = SITE_DESCRIPTION,
		ogKey = 'home',
		type = 'website',
		publishedTime,
		image,
		jsonLd
	}: Props = $props();

	const fullTitle = $derived(title ? `${title} — ${SITE_NAME}` : SITE_TITLE);
	const canonical = $derived(new URL(page.url.pathname, SITE_URL).href);
	const ogImage = $derived(image ?? `${SITE_URL}/og/${ogKey}.png`);
	const jsonLdScript = $derived(
		jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}<${''}/script>` : ''
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="author" content={SITE_NAME} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content={type} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={fullTitle} />
	{#if publishedTime}
		<meta property="article:published_time" content={publishedTime} />
		<meta property="article:author" content={SITE_NAME} />
	{/if}
	<!-- Card format only: no account is named here (no twitter:site/creator). -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	{#if jsonLd}
		<!-- eslint-disable-next-line svelte/no-at-html-tags — JSON.stringify of our own data -->
		{@html jsonLdScript}
	{/if}
</svelte:head>
