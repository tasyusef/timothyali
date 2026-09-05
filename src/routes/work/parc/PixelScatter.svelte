<script lang="ts">
	// Seeded pixel scatter on club green — the only texture the PARC system permits.
	// Density is the volume knob: ~4% for everyday calm, 40% for drop days.
	import { PARC, PARC_CYCLE } from './parcBrand';

	interface Props {
		density: number;
		cols?: number;
		rows?: number;
		seed?: number;
	}

	let { density, cols = 72, rows = 12, seed = 7 }: Props = $props();

	// mulberry32: tiny, deterministic, good enough for confetti
	function rng(s: number) {
		return () => {
			s = (s + 0x6d2b79f5) | 0;
			let t = Math.imul(s ^ (s >>> 15), 1 | s);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	const palette = [...PARC_CYCLE.filter((c) => c !== PARC.green), PARC.white];

	const cells = $derived.by(() => {
		const next = rng(seed + Math.round(density * 1000));
		const out: { x: number; y: number; fill: string }[] = [];
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (next() < density)
					out.push({ x, y, fill: palette[Math.floor(next() * palette.length)] });
			}
		}
		return out;
	});
</script>

<svg
	viewBox="0 0 {cols} {rows}"
	class="block h-auto w-full"
	shape-rendering="crispEdges"
	aria-hidden="true"
>
	<rect width={cols} height={rows} fill={PARC.green} />
	{#each cells as c (c.y * cols + c.x)}
		<rect x={c.x} y={c.y} width="1" height="1" fill={c.fill} />
	{/each}
</svg>
