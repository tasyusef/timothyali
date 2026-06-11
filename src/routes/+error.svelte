<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';

	const heading = $derived(page.status === 404 ? 'Page not found' : 'Something went wrong');
</script>

<Seo title={page.status === 404 ? 'Page Not Found' : 'Error'} ogKey="home" />

<div class="page-wrapper">
	<!-- Header row -->
	<div
		class="entrance pb-row mb-section grid grid-cols-1 border-b border-[var(--color-border)] md:grid-cols-12"
	>
		<p class="label-swiss md:col-span-3">Error {page.status}</p>
	</div>

	<div
		class="entrance grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-0"
		style:--entrance-delay="100ms"
	>
		<div class="md:col-span-5 md:col-start-1">
			<h1 class="heading-swiss text-headline">{heading}</h1>
		</div>
		<div class="md:col-span-5 md:col-start-7">
			<p class="leading-body">
				{#if page.status === 404}
					The page you&rsquo;re looking for doesn&rsquo;t exist — it may have moved, or the URL may
					have a typo.
				{:else}
					{page.error?.message ?? 'An unexpected error occurred.'}
				{/if}
			</p>
			<a href="/" class="label-swiss hover-swiss mt-8 inline-block underline underline-offset-4">
				Back to work &rarr;
			</a>
		</div>
	</div>
</div>
