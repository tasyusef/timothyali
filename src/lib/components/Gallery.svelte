<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import Img from './Img.svelte';
	import Lightbox from './Lightbox.svelte';

	export interface GalleryItem {
		type: 'image' | 'video';
		src: string;
		alt: string;
	}

	let { items }: { items: GalleryItem[] } = $props();

	const DESKTOP_COLS = 4;

	let activeIndex = $state<number | null>(null);

	// Distribute items round-robin into columns for desktop masonry
	const columns = $derived.by(() => {
		const cols: { item: GalleryItem; index: number }[][] = Array.from(
			{ length: DESKTOP_COLS },
			() => []
		);
		items.forEach((item, i) => {
			cols[i % DESKTOP_COLS].push({ item, index: i });
		});
		return cols;
	});
</script>

{#snippet thumb(item: GalleryItem, index: number)}
	<button
		type="button"
		onclick={() => (activeIndex = index)}
		aria-label={item.alt
			? `Open ${item.type} ${index + 1}: ${item.alt}`
			: `Open ${item.type} ${index + 1}`}
		class="relative block w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0"
	>
		{#if item.type === 'image'}
			<Img
				src={item.src}
				alt={item.alt ?? ''}
				sizes="(max-width: 768px) 50vw, 25vw"
				class="block h-auto w-full"
			/>
		{:else}
			<video
				src={item.src}
				autoplay
				loop
				muted
				playsinline
				tabindex="-1"
				class="block h-auto w-full"
			></video>
		{/if}
	</button>
{/snippet}

<section aria-labelledby="gallery-heading" class="mb-section">
	<h2 id="gallery-heading" class="sr-only">Gallery</h2>

	<!-- Thumbnail grid — mobile: 2-col flat grid -->
	<div use:reveal class="gap-gallery grid grid-cols-2 md:hidden">
		{#each items as item, i (item.src)}
			{@render thumb(item, i)}
		{/each}
	</div>

	<!-- Thumbnail grid — desktop: distributed masonry columns -->
	<div use:reveal class="gap-gallery hidden items-start md:grid md:grid-cols-4">
		{#each columns as col, colIdx (colIdx)}
			<div class="gap-gallery flex flex-col">
				{#each col as { item, index } (item.src)}
					{@render thumb(item, index)}
				{/each}
			</div>
		{/each}
	</div>

	<Lightbox {items} bind:activeIndex />
</section>
