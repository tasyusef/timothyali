<script lang="ts">
	import type { Project } from '$lib/projects';
	import Img from './Img.svelte';
	import ProjectStatsCard from './ProjectStatsCard.svelte';

	let { project }: { project: Project } = $props();

	let strip: HTMLDivElement | undefined = $state();
	let canScrollLeft = $state(false);
	let canScrollRight = $state(false);

	function updateScrollState() {
		if (!strip) return;
		canScrollLeft = strip.scrollLeft > 0;
		canScrollRight = strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 1;
	}

	function scroll(direction: 'left' | 'right') {
		if (!strip) return;
		const amount = strip.clientWidth * 0.6;
		strip.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
	}

	$effect(() => {
		if (!strip) return;

		// Re-check scroll state after images load and layout settles
		const observer = new ResizeObserver(updateScrollState);
		observer.observe(strip);
		strip.addEventListener('load', updateScrollState, true);
		const timer = setTimeout(updateScrollState, 100);

		return () => {
			observer.disconnect();
			strip?.removeEventListener('load', updateScrollState, true);
			clearTimeout(timer);
		};
	});
</script>

<div
	bind:this={strip}
	onscroll={updateScrollState}
	class="gap-gallery-tight scrollbar-hide flex h-[30vh] min-h-[180px] overflow-x-auto pb-4 md:h-[40vh] md:pb-5"
>
	{#if project.stats}
		<ProjectStatsCard stats={project.stats} />
	{/if}
	{#each project.videos ?? [] as src (src)}
		<div class="h-full shrink-0">
			<video {src} autoplay loop muted playsinline aria-hidden="true" class="h-full w-auto"></video>
		</div>
	{/each}
	{#each project.images as img, i (img.src)}
		<div class="h-full shrink-0">
			<Img
				src={img.src}
				alt={img.alt ?? `${project.title} – image ${i + 1}`}
				class="block h-full w-auto"
				sizes="(max-width: 768px) 80vw, 40vw"
			/>
		</div>
	{/each}
</div>

<!-- Scroll arrows — always mounted, visibility controlled via opacity/pointer-events -->
<button
	type="button"
	aria-label="Scroll left"
	disabled={!canScrollLeft}
	onclick={(e) => {
		e.preventDefault();
		e.stopPropagation();
		scroll('left');
	}}
	class="z-dropdown duration-fast ease-swiss absolute left-2 top-1/2 flex h-11 w-11 cursor-pointer items-center justify-center border-0 bg-[var(--color-background)]/60 text-sm text-[var(--color-foreground)] transition-all hover:bg-[var(--color-background)]/80"
	style:opacity={canScrollLeft ? 1 : 0}
	style:transform="translateY(-50%) translateX({canScrollLeft ? '0px' : '20px'})"
	style:pointer-events={canScrollLeft ? 'auto' : 'none'}
>
	<span aria-hidden="true">&larr;</span>
</button>
<button
	type="button"
	aria-label="Scroll right"
	disabled={!canScrollRight}
	onclick={(e) => {
		e.preventDefault();
		e.stopPropagation();
		scroll('right');
	}}
	class="z-dropdown duration-fast ease-swiss absolute right-2 top-1/2 flex h-11 w-11 cursor-pointer items-center justify-center border-0 bg-[var(--color-background)]/60 text-sm text-[var(--color-foreground)] transition-all hover:bg-[var(--color-background)]/80"
	style:opacity={canScrollRight ? 1 : 0}
	style:transform="translateY(-50%) translateX({canScrollRight ? '0px' : '-20px'})"
	style:pointer-events={canScrollRight ? 'auto' : 'none'}
>
	<span aria-hidden="true">&rarr;</span>
</button>
