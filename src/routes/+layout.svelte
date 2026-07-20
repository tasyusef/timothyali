<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CommandMenu from '$lib/components/CommandMenu.svelte';
	import { PERSON_JSON_LD, WEBSITE_JSON_LD } from '$lib/site';

	let { children } = $props();

	// Cross-page fade via the View Transitions API — progressive enhancement,
	// styled in app.css (::view-transition-*), disabled by reduced motion.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	const siteLd = `<script type="application/ld+json">${JSON.stringify([PERSON_JSON_LD, WEBSITE_JSON_LD])}<${''}/script>`;
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags — JSON.stringify of our own data -->
	{@html siteLd}
</svelte:head>

<a
	href="#main"
	class="label-swiss sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[var(--color-background)] focus:px-4 focus:py-3"
>
	Skip to content
</a>
<Navigation />
<main id="main" class="min-h-screen">
	{@render children()}
</main>
<Footer />
<CommandMenu />
