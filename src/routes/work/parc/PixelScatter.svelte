<script lang="ts">
	// PARC's one texture: pixel scatter, single cells in the brand colors on club green,
	// generated from a grid, a density and a seed. `live` makes it behave like the site's
	// band textures — a few cells twinkle, and the cursor leaves a short trail of sparks.
	import { untrack } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { PARC, PARC_CYCLE } from './parcBrand';
	import { prefersReducedMotion } from '$lib/motion';

	interface Props {
		density: number;
		cols?: number;
		rows?: number;
		seed?: number;
		live?: boolean;
	}

	let { density, cols = 72, rows = 12, seed = 7, live = false }: Props = $props();

	// mulberry32: tiny, deterministic, good enough for confetti
	function rng(s: number) {
		return () => {
			s = (s + 0x6d2b79f5) | 0;
			let t = Math.imul(s ^ (s >>> 15), 1 | s);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	type Cell = { x: number; y: number; fill: string };
	const palette = [...PARC_CYCLE.filter((c) => c !== PARC.green), PARC.white];
	const key = (x: number, y: number) => y * cols + x;
	const pick = () => palette[Math.floor(Math.random() * palette.length)];

	const cells = new SvelteMap<number, Cell>();
	const sparks = new SvelteMap<number, Cell & { ttl: number }>();
	let svg: SVGSVGElement | undefined = $state();

	// the seeded scatter: same seed, same texture, every time. Seeded once on mount on
	// purpose — the props are a recipe, not live controls.
	untrack(() => {
		const next = rng(seed + Math.round(density * 1000));
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (next() < density)
					cells.set(key(x, y), { x, y, fill: palette[Math.floor(next() * palette.length)] });
			}
		}
	});

	$effect(() => {
		if (!live || prefersReducedMotion()) return;
		const id = setInterval(() => {
			// twinkle: one cell goes out, one lights up somewhere else
			const keys = [...cells.keys()];
			if (keys.length) cells.delete(keys[Math.floor(Math.random() * keys.length)]);
			const x = Math.floor(Math.random() * cols);
			const y = Math.floor(Math.random() * rows);
			cells.set(key(x, y), { x, y, fill: pick() });
			// sparks fade out a step at a time
			for (const [k, c] of sparks) {
				if (c.ttl > 1) sparks.set(k, { ...c, ttl: c.ttl - 1 });
				else sparks.delete(k);
			}
		}, 140);
		return () => clearInterval(id);
	});

	function spark(e: PointerEvent) {
		if (!live || !svg || prefersReducedMotion()) return;
		const b = svg.getBoundingClientRect();
		const cx = Math.floor(((e.clientX - b.left) / b.width) * cols);
		const cy = Math.floor(((e.clientY - b.top) / b.height) * rows);
		for (let i = 0; i < 3; i++) {
			const x = Math.min(cols - 1, Math.max(0, cx + Math.floor(Math.random() * 3) - 1));
			const y = Math.min(rows - 1, Math.max(0, cy + Math.floor(Math.random() * 3) - 1));
			sparks.set(key(x, y), { x, y, fill: PARC.white, ttl: 5 });
		}
	}
</script>

<svg
	bind:this={svg}
	viewBox="0 0 {cols} {rows}"
	class="block h-auto w-full"
	class:cursor-crosshair={live}
	shape-rendering="crispEdges"
	aria-hidden="true"
	onpointermove={spark}
>
	<rect width={cols} height={rows} fill={PARC.green} />
	{#each cells.values() as c (key(c.x, c.y))}
		<rect x={c.x} y={c.y} width="1" height="1" fill={c.fill} />
	{/each}
	{#each sparks.values() as c (`s${key(c.x, c.y)}`)}
		<rect x={c.x} y={c.y} width="1" height="1" fill={c.fill} opacity={c.ttl / 5} />
	{/each}
</svg>
