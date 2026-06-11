<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { SOCIAL_LINKS } from '$lib/site';
</script>

<Seo
	title="Contact"
	description="Get in touch with Timothy Ali — open to full-time product and brand design roles, as well as freelance projects."
	ogKey="contact"
/>

<div class="page-wrapper">
	<!-- Header row -->
	<div
		class="entrance pb-row mb-section grid grid-cols-1 border-b border-[var(--color-border)] md:grid-cols-12"
	>
		<p class="label-swiss md:col-span-3">Contact</p>
	</div>

	<!-- Intro -->
	<div
		class="entrance mb-section grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-0"
		style:--entrance-delay="100ms"
	>
		<div class="md:col-span-5 md:col-start-1">
			<h1 class="heading-swiss text-headline">
				Get in touch<span class="sr-only">
					with Timothy Ali — designer for product, brand & motion</span
				>
			</h1>
		</div>
		<div class="md:col-span-5 md:col-start-7">
			<p class="leading-body">
				I&rsquo;m open to full-time product and brand design roles, as well as freelance projects.
				Let&rsquo;s talk.
			</p>
		</div>
	</div>

	<!-- Social links -->
	{#each SOCIAL_LINKS as link, i (link.label)}
		<div class="entrance" style:--entrance-delay="{250 + i * 100}ms">
			<a
				href={link.href}
				target="_blank"
				rel="noopener noreferrer"
				class="py-row hover-swiss grid grid-cols-1 gap-2 border-t border-[var(--color-border)] md:grid-cols-12 md:gap-0"
			>
				<p class="label-swiss md:col-span-3">{link.label}</p>
				<p class="md:col-span-5 md:col-start-7">{link.handle}</p>
			</a>
		</div>
	{/each}

	<!-- Availability -->
	<div class="entrance" style:--entrance-delay="{250 + SOCIAL_LINKS.length * 100}ms">
		<div
			class="py-row grid grid-cols-1 gap-2 border-t border-b border-[var(--color-border)] md:grid-cols-12 md:gap-0"
		>
			<p class="label-swiss md:col-span-3">Availability</p>
			<p class="md:col-span-5 md:col-start-7">Open to new projects</p>
		</div>
	</div>
</div>
