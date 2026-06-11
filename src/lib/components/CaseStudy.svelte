<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '$lib/actions/reveal';
	import Img from './Img.svelte';

	interface Props {
		title: string;
		category: string;
		year: string;
		role: string;
		timeline?: string;
		tools?: string;
		heroImage?: string;
		heroVideo?: string;
		heroAlt?: string;
		nextProject?: { title: string; slug: string };
		overview: Snippet;
		children: Snippet;
	}

	let {
		title,
		category,
		year,
		role,
		timeline,
		tools,
		heroImage,
		heroVideo,
		heroAlt,
		nextProject,
		overview,
		children
	}: Props = $props();

	const metaItems = $derived(
		[
			{ label: 'Category', value: category },
			{ label: 'Year', value: year },
			{ label: 'Role', value: role },
			...(timeline ? [{ label: 'Timeline', value: timeline }] : []),
			...(tools ? [{ label: 'Tools', value: tools }] : [])
		].filter(Boolean)
	);
</script>

<article>
	<!-- Header -->
	<div class="px-swiss pt-6 md:pt-10">
		<div class="entrance">
			<!-- Back link row -->
			<div
				class="pb-row mb-section grid grid-cols-1 border-b border-[var(--color-border)] md:grid-cols-12"
			>
				<a href="/" class="label-swiss hover-swiss md:col-span-3">Back to work</a>
			</div>

			<!-- Title + Overview -->
			<div class="mb-section grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-0">
				<div class="md:col-span-5 md:col-start-1">
					<h1 class="heading-swiss text-headline">{title}</h1>
				</div>
				<div class="leading-body md:col-span-5 md:col-start-7">
					{@render overview()}
				</div>
			</div>

			<!-- Metadata rows -->
			{#each metaItems as item (item.label)}
				<div
					class="grid grid-cols-1 gap-1 border-t border-[var(--color-border)] py-4 md:grid-cols-12 md:gap-0 md:py-5"
				>
					<p class="label-swiss md:col-span-3">{item.label}</p>
					<p class="md:col-span-5 md:col-start-7">{item.value}</p>
				</div>
			{/each}
			<div class="border-b border-[var(--color-border)]"></div>
		</div>
	</div>

	<!-- Hero -->
	{#if heroImage || heroVideo}
		<div class="px-swiss py-section entrance" style:--entrance-delay="250ms">
			{#if heroVideo && heroImage}
				<div class="gap-gallery-tight grid w-full grid-cols-12">
					<video
						src={heroVideo}
						autoplay
						loop
						muted
						playsinline
						aria-label={heroAlt ?? title}
						class="col-span-3 h-full w-full object-cover"
					></video>
					<Img
						src={heroImage}
						alt={heroAlt ?? title}
						sizes="75vw"
						eager
						class="col-span-9 h-full w-full object-cover"
					/>
				</div>
			{:else if heroImage}
				<Img src={heroImage} alt={heroAlt ?? title} sizes="100vw" eager class="h-auto w-full" />
			{/if}
		</div>
	{/if}

	<!-- Body Content -->
	<div class="px-swiss{!heroImage && !heroVideo ? ' mt-section' : ''}">
		{@render children()}
	</div>

	<!-- Next Project -->
	{#if nextProject}
		<section aria-label="Next project" class="px-swiss mt-section pb-row">
			<div use:reveal>
				<a
					href="/work/{nextProject.slug}"
					class="py-row hover-swiss grid grid-cols-1 gap-4 border-t border-[var(--color-border)] md:grid-cols-12 md:gap-0"
				>
					<p class="label-swiss md:col-span-3">Next Project</p>
					<span class="heading-swiss text-subhead md:col-span-5 md:col-start-7">
						{nextProject.title}
					</span>
				</a>
			</div>
		</section>
	{/if}
</article>
