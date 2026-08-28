<script lang="ts">
	import type { Project } from '$lib/projects';
	import Img from '$lib/components/Img.svelte';
	import { prefersReducedMotion } from '$lib/motion';

	let {
		projects,
		startIndex = 0,
		captions = true
	}: { projects: Project[]; startIndex?: number; captions?: boolean } = $props();

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
		strip.scrollBy({
			left: direction === 'left' ? -amount : amount,
			behavior: prefersReducedMotion() ? 'auto' : 'smooth'
		});
	}

	$effect(() => {
		if (!strip) return;
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

<!-- Contact-sheet row — fixed height, aspect-true widths, scrolls sideways -->
<div class="relative">
	<div
		bind:this={strip}
		onscroll={updateScrollState}
		class="scrollbar-hide flex gap-3 overflow-x-auto"
	>
		{#each projects as project, index (project.slug)}
			{@const num = String(startIndex + index + 1).padStart(2, '0')}
			<a href="/work/{project.slug}" class="group block shrink-0">
				<div class="h-64 overflow-hidden lg:h-72">
					{#if project.heroVideo}
						<video
							src={project.heroVideo}
							autoplay
							loop
							muted
							playsinline
							aria-label={project.title}
							class="h-full w-auto"
						></video>
					{:else}
						<Img
							src={project.bentoImage ?? project.heroImage}
							alt={project.title}
							sizes="512px"
							class="h-full w-auto"
						/>
					{/if}
				</div>
				{#if captions}
					<div class="flex items-baseline gap-3 overflow-hidden py-3 whitespace-nowrap">
						<span class="label-swiss data-swiss">{num}</span>
						<span class="heading-swiss flex min-w-0 items-center gap-2">
							<span class="truncate">{project.title}</span>
							<span class="arrow-reveal arrow-reveal-sm">&rarr;</span>
						</span>
						<span class="label-swiss data-swiss ml-auto shrink-0">{project.year}</span>
					</div>
				{/if}
			</a>
		{/each}
	</div>

	<!-- Scroll arrows — always mounted, visibility via opacity/pointer-events -->
	<button
		type="button"
		aria-label="Scroll left"
		disabled={!canScrollLeft}
		onclick={() => scroll('left')}
		class="z-dropdown duration-fast ease-swiss absolute top-32 left-2 flex h-11 w-11 cursor-pointer items-center justify-center border-0 bg-[var(--color-background)]/60 text-sm text-[var(--color-foreground)] transition-all hover:bg-[var(--color-background)]/80 lg:top-36"
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
		onclick={() => scroll('right')}
		class="z-dropdown duration-fast ease-swiss absolute top-32 right-2 flex h-11 w-11 cursor-pointer items-center justify-center border-0 bg-[var(--color-background)]/60 text-sm text-[var(--color-foreground)] transition-all hover:bg-[var(--color-background)]/80 lg:top-36"
		style:opacity={canScrollRight ? 1 : 0}
		style:transform="translateY(-50%) translateX({canScrollRight ? '0px' : '-20px'})"
		style:pointer-events={canScrollRight ? 'auto' : 'none'}
	>
		<span aria-hidden="true">&rarr;</span>
	</button>
</div>
