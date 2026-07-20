<script lang="ts">
	import type { Project } from '$lib/projects';
	import Img from './Img.svelte';

	let { projects, startIndex = 0 }: { projects: Project[]; startIndex?: number } = $props();

	interface Tile {
		project: Project;
		num: string;
		aspect: number;
	}

	interface Column {
		tiles: Tile[];
		weight: number;
	}

	// Height a card adds beyond its media (meta bar) and the grid gap — used
	// by the solver so stacked columns line up with feature cards.
	const META = 58;
	const GAP = 12;
	const NOMINAL = 1400; // container width the solve is exact at

	// Aspect-justified bento with column stacks. Consecutive projects sharing a
	// bentoRow form one band; within a band, consecutive projects sharing a
	// bentoCol stack vertically in one column. Column widths solve so every
	// column of a band has equal total height (media + meta bars + gaps) at the
	// nominal width. Stacked cards keep exact aspect ratios; a feature card
	// beside a stack absorbs the few-pixel residual at other widths via cover.
	const bands = $derived.by(() => {
		const rows: Tile[][] = [];
		let prevRow: number | undefined;
		projects.forEach((project, index) => {
			const tile: Tile = {
				project,
				num: String(startIndex + index + 1).padStart(2, '0'),
				aspect: project.bentoAspect ?? project.heroAspect
			};
			const sameBand =
				rows.length > 0 && project.bentoRow !== undefined && project.bentoRow === prevRow;
			if (sameBand) rows[rows.length - 1].push(tile);
			else rows.push([tile]);
			prevRow = project.bentoRow;
		});

		return rows.map((tiles) => {
			// Group into columns (consecutive shared bentoCol)
			const cols: Tile[][] = [];
			let prevCol: number | undefined;
			tiles.forEach((tile) => {
				const sameCol =
					cols.length > 0 &&
					tile.project.bentoCol !== undefined &&
					tile.project.bentoCol === prevCol;
				if (sameCol) cols[cols.length - 1].push(tile);
				else cols.push([tile]);
				prevCol = tile.project.bentoCol;
			});

			// Solve column widths for equal column heights at the nominal width:
			// height_j = width_j * k_j + c_j, sum(width_j) = available.
			const k = cols.map((c) => c.reduce((s, t) => s + 1 / t.aspect, 0));
			const c = cols.map((col) => col.length * META + (col.length - 1) * GAP);
			const available = NOMINAL - (cols.length - 1) * GAP;
			const H =
				(available + c.reduce((s, cj, j) => s + cj / k[j], 0)) / k.reduce((s, kj) => s + 1 / kj, 0);
			const columns: Column[] = cols.map((col, j) => ({
				tiles: col,
				weight: (H - c[j]) / k[j]
			}));
			return { columns, hasStack: cols.some((col) => col.length > 1) };
		});
	});
</script>

{#snippet card(tile: Tile, exact: boolean, stackGrow?: number)}
	<!-- Stacked cards split the column height via flex-grow ∝ 1/aspect with the
	     meta bar as flex-basis — algebra that keeps each media box aspect-true
	     at every width, not just the nominal one. -->
	<a
		href="/work/{tile.project.slug}"
		class="card group/link panel-swiss flex min-h-0 min-w-0 flex-col overflow-hidden"
		style:flex-grow={stackGrow}
		style:flex-basis={stackGrow !== undefined ? `${META}px` : undefined}
	>
		<div
			class="bento-media w-full min-h-0 flex-1 overflow-hidden"
			style:aspect-ratio={exact ? tile.aspect : undefined}
		>
			{#if tile.project.heroVideo}
				<video
					src={tile.project.heroVideo}
					autoplay
					loop
					muted
					playsinline
					aria-label={tile.project.title}
				></video>
			{:else}
				<Img
					src={tile.project.bentoImage ?? tile.project.heroImage}
					alt={tile.project.title}
					sizes={tile.aspect > 1.5 ? '66vw' : '33vw'}
				/>
			{/if}
		</div>
		<div
			class="flex shrink-0 items-center gap-3 border-t border-[var(--color-border)] px-4 py-3 whitespace-nowrap"
		>
			<span class="label-swiss data-swiss">{tile.num}</span>
			<span class="heading-swiss flex min-w-0 items-center gap-2 text-[var(--color-foreground)]">
				<span class="truncate">{tile.project.title}</span>
				<span class="arrow-reveal arrow-reveal-sm">&rarr;</span>
			</span>
			<span class="label-swiss ml-auto hidden min-w-0 truncate xl:block">{tile.project.category}</span>
			<span class="label-swiss data-swiss shrink-0 max-xl:ml-auto">{tile.project.year}</span>
		</div>
	</a>
{/snippet}

<div class="flex flex-col gap-3">
	{#each bands as band, bandIdx (bandIdx)}
		<div
			class="grid items-stretch gap-3"
			style:grid-template-columns={band.columns.map((col) => `${col.weight}fr`).join(' ')}
		>
			{#each band.columns as column, colIdx (colIdx)}
				{#if column.tiles.length === 1}
					<!-- Feature beside a stack absorbs residual height via cover -->
					{@render card(column.tiles[0], !band.hasStack)}
				{:else}
					<div class="flex min-h-0 min-w-0 flex-col gap-3">
						{#each column.tiles as tile (tile.project.slug)}
							{@render card(tile, false, 1 / tile.aspect)}
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style>
	/* enhanced:img renders <picture> (display: contents) — style the img
	   through :global; the video is component-local. Media boxes match their
	   source aspect, so object-fit crops nothing (a feature card beside a
	   stack absorbs at most a few residual pixels). */
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
