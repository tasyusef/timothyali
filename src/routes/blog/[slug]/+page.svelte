<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL } from '$lib/site';
	import { formatDate } from '$lib/posts';

	let { data } = $props();

	const post = $derived(data.post);
	const Content = $derived(data.post.component);
</script>

<Seo
	title={post.title}
	description={post.excerpt}
	ogKey={post.slug}
	type="article"
	publishedTime={post.date}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: post.title,
		description: post.excerpt,
		image: `${SITE_URL}/og/${post.slug}.png`,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		datePublished: post.date,
		dateModified: post.date,
		url: `${SITE_URL}/blog/${post.slug}`,
		publisher: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL }
	}}
/>

<article class="page-wrapper">
	<!-- Header row -->
	<div
		class="pb-row mb-section grid grid-cols-1 border-b border-[var(--color-border)] md:grid-cols-12"
	>
		<div class="md:col-span-3">
			<a href="/blog" class="label-swiss hover-swiss">Back to Writing</a>
		</div>
		<div class="mt-2 md:col-span-3 md:col-start-10 md:mt-0 md:text-right">
			<p class="label-swiss">{formatDate(post.date)}</p>
		</div>
	</div>

	<!-- Title + Body grid -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-0">
		<div class="md:col-span-5 md:col-start-1">
			<h1 class="heading-swiss text-headline leading-tight">{post.title}</h1>
		</div>
		<div class="md:col-span-5 md:col-start-7">
			<div class="prose-swiss">
				<Content />
			</div>
		</div>
	</div>
</article>
