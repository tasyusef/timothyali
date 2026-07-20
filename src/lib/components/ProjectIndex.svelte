<script lang="ts">
	import { goto } from '$app/navigation';
	import { slide, fly } from 'svelte/transition';
	import { Spring } from 'svelte/motion';
	import type { Project } from '$lib/projects';
	import { duration, easeSwiss, spring, prefersReducedMotion } from '$lib/motion';
	import { getImage } from '$lib/images';
	import ProjectImageStrip from './ProjectImageStrip.svelte';
	import CursorPreview from './CursorPreview.svelte';

	let { projects, startIndex = 0 }: { projects: Project[]; startIndex?: number } = $props();

	let hoveredIndex = $state<number | null>(null); // desktop mouse
	let expandedIndex = $state<number | null>(null); // mobile touch
	let wasTouch = false;
	let card: HTMLDivElement | undefined = $state();

	// Cursor-following preview position (desktop)
	const pos = new Spring({ x: 0, y: 0 }, spring.cursor);

	// Warm the optimized hero media during idle so the first hover is instant.
	let preloadReady = $state(false);
	$effect(() => {
		if (typeof requestIdleCallback === 'function') {
			const id = requestIdleCallback(() => (preloadReady = true), { timeout: 2000 });
			return () => cancelIdleCallback(id);
		}
		const t = setTimeout(() => (preloadReady = true), 1200);
		return () => clearTimeout(t);
	});

	// Place the preview to the side of the cursor, clamped to the viewport.
	function positionPreview(clientX: number, clientY: number, jump: boolean) {
		const cardW = card?.offsetWidth ?? 360;
		const cardH = card?.offsetHeight ?? 225;
		const gap = 28;
		let tx = clientX + gap;
		if (tx + cardW > window.innerWidth - 12) tx = clientX - gap - cardW;
		const ty = Math.max(12, Math.min(clientY - cardH / 2, window.innerHeight - cardH - 12));
		pos.set({ x: tx, y: ty }, jump || prefersReducedMotion() ? { instant: true } : undefined);
	}

	function handleRowClick(e: MouseEvent, index: number, slug: string) {
		// Read and reset the touch flag — set by ontouchend on the same element
		const isTouch = wasTouch;
		wasTouch = false;

		// Desktop: always navigate (cursor preview already handled the hover)
		if (!isTouch) return;

		// Mobile: first tap expands, second tap navigates
		if (expandedIndex === index) {
			e.preventDefault();
			goto(`/work/${slug}`);
		} else {
			e.preventDefault();
			expandedIndex = index;
		}
	}

	const activeRow = $derived(hoveredIndex !== null ? hoveredIndex : expandedIndex);
	const previewProject = $derived(hoveredIndex !== null ? projects[hoveredIndex] : null);
</script>

<!-- Idle image preloading — warms each hero's optimized AVIF (the format the
     cursor preview will request) so the first hover of any row paints
     instantly. Injected after idle so it never competes with page load. -->
<svelte:head>
	{#if preloadReady}
		{#each projects as p (p.slug)}
			<link
				rel="preload"
				as="image"
				type="image/avif"
				imagesrcset={getImage(p.heroImage).sources.avif}
				imagesizes="512px"
			/>
		{/each}
	{/if}
</svelte:head>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="border-t border-[var(--color-border)]"
	onpointermove={(e) => {
		if (e.pointerType !== 'mouse' || hoveredIndex === null) return;
		positionPreview(e.clientX, e.clientY, false);
	}}
	onpointerleave={(e) => {
		if (e.pointerType === 'mouse') hoveredIndex = null;
	}}
>
	{#each projects as project, index (project.slug)}
		{@const num = String(startIndex + index + 1).padStart(2, '0')}
		{@const isActive = activeRow === index}

		<a
			href="/work/{project.slug}"
			class="group block border-b border-[var(--color-border)]"
			onpointerenter={(e) => {
				if (e.pointerType !== 'mouse') return;
				positionPreview(e.clientX, e.clientY, hoveredIndex === null);
				hoveredIndex = index;
			}}
			ontouchend={() => {
				wasTouch = true;
			}}
			onclick={(e) => handleRowClick(e, index, project.slug)}
		>
			<div
				class="duration-fast ease-swiss grid grid-cols-12 items-center py-4 transition-opacity md:py-5"
				style:opacity={activeRow !== null && !isActive ? 'var(--opacity-dim)' : undefined}
			>
				<span class="label-swiss data-swiss col-span-1">{num}</span>
				<span class="heading-swiss text-subhead col-span-5">{project.title}</span>
				<span
					class="label-swiss relative hidden overflow-hidden md:col-span-3 md:col-start-7 md:block"
				>
					<span
						class="duration-fast ease-swiss block transition-all"
						style:transform={isActive ? 'translateY(-100%)' : 'translateY(0)'}
						style:opacity={isActive ? 0 : 1}
					>
						{project.category}
					</span>
					<span
						class="duration-fast ease-swiss absolute inset-0 block transition-all"
						style:transform={isActive ? 'translateY(0)' : 'translateY(100%)'}
						style:opacity={isActive ? 1 : 0}
					>
						View case study &rarr;
					</span>
				</span>
				<span class="label-swiss data-swiss col-span-6 text-right md:col-span-2 md:col-start-11">
					{project.year}
				</span>
			</div>

			<!-- Mobile-only inline image strip — tap to expand, tap again to open -->
			{#if expandedIndex === index}
				<div
					transition:slide={{ duration: duration.page, easing: easeSwiss }}
					class="relative overflow-hidden md:hidden"
				>
					<ProjectImageStrip {project} />
					<span
						in:fly={{ x: -12, duration: duration.fast, delay: 200, easing: easeSwiss }}
						class="label-swiss absolute bottom-5 right-0 flex items-center gap-1.5 bg-[var(--color-background)]/60 px-3 py-2 text-[var(--color-foreground)]"
					>
						View case study &rarr;
					</span>
				</div>
			{/if}
		</a>
	{/each}

	<CursorPreview project={previewProject} x={pos.current.x} y={pos.current.y} bind:card />

	<!-- Idle preloader — video metadata warms via a hidden element (there is no
	     reliable preload-link equivalent for video). Image preloading happens
	     through the <link rel="preload"> hints in <svelte:head> above. -->
	{#if preloadReady}
		<div aria-hidden="true" class="sr-only">
			{#each projects.filter((p) => p.heroVideo) as p (p.slug)}
				<video src={p.heroVideo} preload="metadata" muted></video>
			{/each}
		</div>
	{/if}
</div>
