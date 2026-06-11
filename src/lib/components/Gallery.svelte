<script lang="ts">
	import { fade } from 'svelte/transition';
	import { reveal } from '$lib/actions/reveal';
	import { focusTrap } from '$lib/actions/focusTrap';
	import { duration, easeSwiss, prefersReducedMotion } from '$lib/motion';
	import Img from './Img.svelte';

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

	const close = () => (activeIndex = null);
	const prev = () => {
		if (activeIndex !== null && activeIndex > 0) activeIndex -= 1;
	};
	const next = () => {
		if (activeIndex !== null && activeIndex < items.length - 1) activeIndex += 1;
	};

	// Scroll lock while the lightbox is open
	$effect(() => {
		if (activeIndex === null) return;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	});

	function onKeydown(e: KeyboardEvent) {
		if (activeIndex === null) return;
		if (e.key === 'ArrowLeft') prev();
		if (e.key === 'ArrowRight') next();
	}

	const lightboxLabel = $derived(
		activeIndex !== null
			? `${items[activeIndex].type === 'video' ? 'Video' : 'Image'} lightbox${items[activeIndex].alt ? `: ${items[activeIndex].alt}` : ''}`
			: 'Lightbox'
	);
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

<svelte:window onkeydown={onKeydown} />

<section aria-labelledby="gallery-heading">
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

	<!-- Lightbox overlay -->
	{#if activeIndex !== null}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			aria-label={lightboxLabel}
			transition:fade={{
				duration: prefersReducedMotion() ? 0 : duration.fast,
				easing: easeSwiss
			}}
			use:focusTrap={{ onEscape: close }}
			class="z-lightbox fixed inset-0 flex items-center justify-center bg-black/90"
			onclick={close}
		>
			<!-- Screen reader position -->
			<span class="sr-only" aria-live="polite">
				{`${items[activeIndex].type === 'video' ? 'Video' : 'Image'} ${activeIndex + 1} of ${items.length}${items[activeIndex].alt ? `: ${items[activeIndex].alt}` : ''}`}
			</span>

			<!-- Close button -->
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					close();
				}}
				aria-label="Close lightbox"
				class="label-swiss hover-swiss absolute right-4 top-4 z-[1] cursor-pointer border-0 bg-transparent p-2 text-[var(--color-foreground)] active:opacity-50 md:right-6 md:top-6"
			>
				Close
			</button>

			<!-- Previous arrow -->
			{#if activeIndex > 0}
				<button
					type="button"
					onclick={(e) => {
						e.stopPropagation();
						prev();
					}}
					aria-label="Previous image"
					class="label-swiss hover-swiss absolute left-4 top-1/2 z-[1] -translate-y-1/2 cursor-pointer border-0 bg-transparent p-2 text-[var(--color-foreground)] active:opacity-50 md:left-6"
				>
					&larr;
				</button>
			{/if}

			<!-- Next arrow -->
			{#if activeIndex < items.length - 1}
				<button
					type="button"
					onclick={(e) => {
						e.stopPropagation();
						next();
					}}
					aria-label="Next image"
					class="label-swiss hover-swiss absolute right-4 top-1/2 z-[1] -translate-y-1/2 cursor-pointer border-0 bg-transparent p-2 text-[var(--color-foreground)] active:opacity-50 md:right-6"
				>
					&rarr;
				</button>
			{/if}

			<!-- Media -->
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div
				class="flex h-full w-full items-center justify-center p-4 md:p-10 lg:p-20"
				onclick={(e) => e.stopPropagation()}
			>
				{#if items[activeIndex].type === 'image'}
					<Img
						src={items[activeIndex].src}
						alt={items[activeIndex].alt ?? ''}
						sizes="100vw"
						eager
						class="max-h-full max-w-full object-contain"
					/>
				{:else}
					{#key items[activeIndex].src}
						<!-- svelte-ignore a11y_media_has_caption -->
						<video
							src={items[activeIndex].src}
							controls
							autoplay
							playsinline
							aria-label={items[activeIndex].alt ?? `Video ${activeIndex + 1}`}
							class="max-h-full max-w-full object-contain"
						></video>
					{/key}
				{/if}
			</div>
		</div>
	{/if}
</section>
