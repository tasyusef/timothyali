<script lang="ts">
	import { artAspect, type ArtPiece } from '$lib/art';
	import { reveal } from '$lib/actions/reveal';
	import Img from './Img.svelte';
	import Lightbox from './Lightbox.svelte';

	let { pieces, limit }: { pieces: ArtPiece[]; limit?: number } = $props();

	interface Tile {
		piece: ArtPiece;
		index: number;
		aspect: number;
	}

	const GAP = 12;
	const TARGET = 3.4; // aspect-ratio sum that fills one desktop row

	// Auto-justified packing: tiles fill a row until their aspect sum reaches
	// TARGET, then wrap. Within a row, fr tracks ∝ aspect give every tile the
	// same height with zero cropping at any container width (row height =
	// available width / aspect sum, identical for all tiles in the row).
	const rows = $derived.by(() => {
		const tiles: Tile[] = pieces.map((piece, index) => ({
			piece,
			index,
			aspect: artAspect(piece.src)
		}));
		const packed: Tile[][] = [];
		let row: Tile[] = [];
		let sum = 0;
		for (const tile of tiles) {
			// Close the row early when adding this tile overshoots TARGET by
			// more than stopping undershoots it — rows land closest to TARGET.
			if (row.length > 0 && sum + tile.aspect - TARGET > TARGET - sum) {
				packed.push(row);
				row = [];
				sum = 0;
			}
			row.push(tile);
			sum += tile.aspect;
			if (sum >= TARGET) {
				packed.push(row);
				row = [];
				sum = 0;
			}
		}
		if (row.length > 0) packed.push(row);
		// An underfilled trailing row must not stretch (its tiles would render
		// oversized) — a phantom `pad` track holds the remaining width so its
		// tiles keep full-row height, left-aligned.
		const withPad = packed.map((tiles, i) => {
			const sum = tiles.reduce((s, t) => s + t.aspect, 0);
			const isLast = i === packed.length - 1;
			return { tiles, pad: isLast && sum < TARGET ? TARGET - sum : 0 };
		});
		return limit !== undefined ? withPad.slice(0, limit) : withPad;
	});

	// Mobile: 2-col masonry, round-robin (the Gallery pattern)
	const mobileColumns = $derived.by(() => {
		const cols: Tile[][] = [[], []];
		const visible = rows.flatMap((r) => r.tiles);
		visible.forEach((tile, i) => {
			cols[i % 2].push(tile);
		});
		return cols;
	});

	let activeIndex = $state<number | null>(null);
	const lightboxItems = $derived(
		pieces.map((p) => ({ type: 'image' as const, src: p.src, alt: p.alt }))
	);
</script>

{#snippet tileButton(tile: Tile, sizes: string)}
	<button
		type="button"
		onclick={() => (activeIndex = tile.index)}
		aria-label="Open image: {tile.piece.alt}"
		class="tile group relative block w-full min-w-0 cursor-pointer overflow-hidden border-0 bg-transparent p-0"
		style:aspect-ratio={tile.aspect}
	>
		<Img src={tile.piece.src} alt={tile.piece.alt} {sizes} />
		{#if tile.piece.title}
			<span
				class="chin absolute inset-x-0 bottom-0 flex items-center gap-3 border-t border-[var(--color-border)] bg-[var(--color-background)]/90 px-4 py-3 whitespace-nowrap"
			>
				<span class="heading-swiss min-w-0 truncate text-[var(--color-foreground)]"
					>{tile.piece.title}</span
				>
				{#if tile.piece.year}
					<span class="label-swiss data-swiss ml-auto shrink-0">{tile.piece.year}</span>
				{/if}
			</span>
		{/if}
	</button>
{/snippet}

<!-- Desktop: auto-justified rows -->
<div use:reveal class="hidden md:flex md:flex-col" style:gap="{GAP}px">
	{#each rows as row, rowIdx (rowIdx)}
		<div
			class="grid"
			style:gap="{GAP}px"
			style:grid-template-columns={row.tiles
				.map((t) => `${t.aspect}fr`)
				.concat(row.pad > 0 ? [`${row.pad}fr`] : [])
				.join(' ')}
		>
			{#each row.tiles as tile (tile.piece.src)}
				{@render tileButton(tile, `${Math.min(100, Math.round((tile.aspect / TARGET) * 100))}vw`)}
			{/each}
		</div>
	{/each}
</div>

<!-- Mobile: 2-col masonry -->
<div use:reveal class="gap-gallery grid grid-cols-2 md:hidden">
	{#each mobileColumns as col, colIdx (colIdx)}
		<div class="gap-gallery flex flex-col">
			{#each col as tile (tile.piece.src)}
				{@render tileButton(tile, '50vw')}
			{/each}
		</div>
	{/each}
</div>

<Lightbox items={lightboxItems} bind:activeIndex />

<style>
	/* enhanced:img renders <picture> (display: contents) — style the img
	   through :global. Tiles match their source aspect, so cover crops nothing. */
	.tile :global(img) {
		height: 100%;
		width: 100%;
		object-fit: cover;
		transition: transform var(--duration-fast) var(--ease-swiss);
	}

	.tile:hover :global(img) {
		transform: scale(1.02);
	}

	.chin {
		opacity: 0;
		transform: translateY(0.5rem);
		transition:
			opacity var(--duration-fast) var(--ease-swiss),
			transform var(--duration-fast) var(--ease-swiss);
	}

	.tile:hover .chin,
	.tile:focus-visible .chin {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.tile :global(img),
		.chin {
			transition: none;
		}
		.tile:hover :global(img) {
			transform: none;
		}
		.chin {
			transform: none;
		}
	}
</style>
