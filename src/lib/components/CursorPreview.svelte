<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import type { Project } from '$lib/projects';
	import { duration, easeSwiss, prefersReducedMotion } from '$lib/motion';
	import { portal } from '$lib/actions/portal';
	import { getImage } from '$lib/images';
	import Img from './Img.svelte';

	interface Props {
		project: Project | null;
		x: number;
		y: number;
		/** Bound by the parent so it can measure the card before positioning. */
		card?: HTMLDivElement;
	}

	let { project, x, y, card = $bindable() }: Props = $props();

	const appear = (node: Element) =>
		prefersReducedMotion()
			? fade(node, { duration: duration.fast, easing: easeSwiss })
			: scale(node, { start: 0.92, duration: duration.fast, easing: easeSwiss });
</script>

<!-- Positioning transform lives on the outer wrapper; the enter/exit scale
     transition animates an inner element so the two never fight over
     style.transform. -->
{#if project}
	<div
		use:portal
		bind:this={card}
		aria-hidden="true"
		class="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
		style:transform="translate({x}px, {y}px)"
	>
		<div
			transition:appear
			class="relative h-56 overflow-hidden border border-[var(--color-border)] bg-[var(--color-background)] shadow-2xl lg:h-72"
			style:aspect-ratio={project.heroAspect}
		>
			{#key project.slug}
				<div
					class="absolute inset-0"
					in:fade={{ duration: duration.fast, easing: easeSwiss }}
					out:fade={{ duration: duration.fast, easing: easeSwiss }}
				>
					{#if project.heroVideo}
						<video
							src={project.heroVideo}
							poster={getImage(project.heroImage).img.src}
							autoplay
							loop
							muted
							playsinline
							preload="auto"
							class="h-full w-full object-cover"
						></video>
					{:else}
						<Img
							src={project.heroImage}
							alt=""
							sizes="512px"
							eager
							class="h-full w-full object-cover"
						/>
					{/if}
				</div>
			{/key}
		</div>
	</div>
{/if}
