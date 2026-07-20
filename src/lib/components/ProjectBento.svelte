<script lang="ts">
	import type { Project } from '$lib/projects';
	import Img from './Img.svelte';

	let { projects, startIndex = 0 }: { projects: Project[]; startIndex?: number } = $props();

	// Tile spans on the 12-col bento grid — curated per project via the
	// `bento` field in $lib/projects (defaults to standard).
	const SPANS: Record<NonNullable<Project['bento']>, string> = {
		feature: 'col-span-8 row-span-2',
		tall: 'col-span-4 row-span-2',
		half: 'col-span-6',
		standard: 'col-span-4'
	};
</script>

<div class="bento grid grid-cols-12 gap-3">
	{#each projects as project, index (project.slug)}
		{@const num = String(startIndex + index + 1).padStart(2, '0')}
		<a
			href="/work/{project.slug}"
			class="card group/link panel-swiss flex flex-col overflow-hidden {SPANS[
				project.bento ?? 'standard'
			]}"
		>
			<div class="bento-media flex-1 overflow-hidden">
				{#if project.heroVideo}
					<video src={project.heroVideo} autoplay loop muted playsinline aria-label={project.title}
					></video>
				{:else}
					<Img
						src={project.heroImage}
						alt={project.title}
						sizes={project.bento === 'feature' ? '66vw' : '33vw'}
					/>
				{/if}
			</div>
			<div class="flex items-center gap-3 border-t border-[var(--color-border)] px-4 py-3">
				<span class="label-swiss data-swiss">{num}</span>
				<span class="heading-swiss flex items-center gap-2 text-[var(--color-foreground)]">
					{project.title}
					<span class="arrow-reveal arrow-reveal-sm">&rarr;</span>
				</span>
				<span class="label-swiss ml-auto hidden truncate lg:block">{project.category}</span>
				<span class="label-swiss data-swiss shrink-0 max-lg:ml-auto">{project.year}</span>
			</div>
		</a>
	{/each}
</div>

<style>
	.bento {
		grid-auto-rows: 13rem;
	}

	/* enhanced:img renders <picture> (display: contents) — style the img
	   through :global; the video is component-local. */
	.bento-media :global(img),
	.bento-media video {
		height: 100%;
		width: 100%;
		object-fit: cover;
		transition: transform var(--duration-fast) var(--ease-swiss);
	}

	.card:hover .bento-media :global(img),
	.card:hover .bento-media video {
		transform: scale(1.02);
	}

	@media (prefers-reduced-motion: reduce) {
		.bento-media :global(img),
		.bento-media video {
			transition: none;
		}
		.card:hover .bento-media :global(img),
		.card:hover .bento-media video {
			transform: none;
		}
	}
</style>
