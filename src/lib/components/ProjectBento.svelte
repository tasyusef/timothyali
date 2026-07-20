<script lang="ts">
	import type { Project } from '$lib/projects';
	import Img from './Img.svelte';

	let { projects, startIndex = 0 }: { projects: Project[]; startIndex?: number } = $props();

	interface Tile {
		project: Project;
		num: string;
		aspect: number;
	}

	// Aspect-justified bento: consecutive projects sharing a bentoRow form one
	// band. Column widths are proportional to each card's media aspect (Nfr),
	// so every card in the band renders at the same height with zero cropping.
	const rows = $derived.by(() => {
		const out: Tile[][] = [];
		let prevRow: number | undefined;
		projects.forEach((project, index) => {
			const tile: Tile = {
				project,
				num: String(startIndex + index + 1).padStart(2, '0'),
				aspect: project.bentoAspect ?? project.heroAspect
			};
			const sameBand =
				out.length > 0 && project.bentoRow !== undefined && project.bentoRow === prevRow;
			if (sameBand) out[out.length - 1].push(tile);
			else out.push([tile]);
			prevRow = project.bentoRow;
		});
		return out;
	});
</script>

<div class="flex flex-col gap-3">
	{#each rows as row, rowIdx (rowIdx)}
		<div class="grid gap-3" style:grid-template-columns={row.map((t) => `${t.aspect}fr`).join(' ')}>
			{#each row as { project, num, aspect } (project.slug)}
				<a
					href="/work/{project.slug}"
					class="card group/link panel-swiss flex flex-col overflow-hidden"
				>
					<div class="bento-media w-full overflow-hidden" style:aspect-ratio={aspect}>
						{#if project.heroVideo}
							<video
								src={project.heroVideo}
								autoplay
								loop
								muted
								playsinline
								aria-label={project.title}
							></video>
						{:else}
							<Img
								src={project.bentoImage ?? project.heroImage}
								alt={project.title}
								sizes={aspect > 1.5 ? '66vw' : '33vw'}
							/>
						{/if}
					</div>
					<div
						class="flex items-center gap-3 border-t border-[var(--color-border)] px-4 py-3 whitespace-nowrap"
					>
						<span class="label-swiss data-swiss">{num}</span>
						<span
							class="heading-swiss flex min-w-0 items-center gap-2 text-[var(--color-foreground)]"
						>
							<span class="truncate">{project.title}</span>
							<span class="arrow-reveal arrow-reveal-sm">&rarr;</span>
						</span>
						<span class="label-swiss ml-auto hidden truncate xl:block">{project.category}</span>
						<span class="label-swiss data-swiss max-xl:ml-auto shrink-0">{project.year}</span>
					</div>
				</a>
			{/each}
		</div>
	{/each}
</div>

<style>
	/* enhanced:img renders <picture> (display: contents) — style the img
	   through :global; the video is component-local. The media box already
	   matches the source aspect, so object-fit never crops. */
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
