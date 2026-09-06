<script lang="ts">
	// The After Darc band's background, ported from parcxrpl.com's signalTexture: sparse
	// static flickering over Twitch purple, interference bars rolling down like an old CRT,
	// a band that locks onto the cursor's row, and a click that switches the set off — a
	// bright line collapsing into a dot. One cell = 3px, hard-step timing.
	import { prefersReducedMotion } from '$lib/motion';

	// PARC's muted Twitch purple and the texture's own near-background purples (product colors)
	const BG = '#693aaf';
	const STATIC = ['#7245b8', '#7b50bd', '#5f34a2'];
	const BAR = '#7649bd',
		BAR_EDGE = '#8459c9',
		LOCK = '#8f68d0',
		WHITE = '#f1e9ff',
		GLOW = '#b79df0';
	const CELL = 3;

	function texture(cv: HTMLCanvasElement) {
		const reduce = prefersReducedMotion();
		const ctx = cv.getContext('2d')!;
		let W = 0,
			H = 0,
			cols = 0,
			rows = 0;
		const rnd = (n: number) => Math.floor(Math.random() * n);
		// plain Map on purpose: canvas state inside an attachment, nothing renders from it
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const flecks = new Map<number, string>();
		const bars: { y: number; h: number; v: number }[] = [];
		let lock: { r: number; ttl: number } | null = null;
		const collapses: { r: number; c: number; half: number; ttl: number }[] = [];

		function seed() {
			flecks.clear();
			const n = Math.round(cols * rows * 0.004);
			for (let i = 0; i < n; i++)
				flecks.set(rnd(rows) * cols + rnd(cols), STATIC[rnd(STATIC.length)]);
			bars.length = 0;
			const nb = Math.max(2, Math.round(rows / 45));
			for (let i = 0; i < nb; i++)
				bars.push({ y: rnd(rows), h: 3 + rnd(6), v: 0.25 + Math.random() * 0.45 });
		}
		const px = (c: number, r: number, w = 1, h = 1) =>
			ctx.fillRect(c * CELL, r * CELL, w * CELL, h * CELL);
		function draw() {
			ctx.clearRect(0, 0, W, H);
			for (const b of bars) {
				const y = Math.floor(b.y);
				ctx.fillStyle = BAR;
				px(0, y, cols, b.h);
				ctx.fillStyle = BAR_EDGE;
				for (let c = y & 1; c < cols; c += 2) {
					px(c, y - 1);
					px(c + 1, y + b.h);
				}
			}
			for (const [k, col] of flecks) {
				ctx.fillStyle = col;
				px(k % cols, Math.floor(k / cols));
			}
			if (lock) {
				ctx.fillStyle = LOCK;
				px(0, lock.r, cols, 2);
				ctx.fillStyle = BAR_EDGE;
				for (let c = lock.r & 1; c < cols; c += 2) {
					px(c, lock.r - 1);
					px(c + 1, lock.r + 2);
				}
			}
			for (const k of collapses) {
				ctx.fillStyle = WHITE;
				if (k.half >= 1) {
					const w = Math.round(k.half);
					px(k.c - w, k.r, w * 2, k.half > 8 ? 1 : 2);
					if (k.half > 12) {
						ctx.fillStyle = GLOW;
						px(k.c - w, k.r - 1, w * 2, 1);
						px(k.c - w, k.r + 1, w * 2, 1);
					}
				} else px(k.c - 1, k.r - 1, 2, 2);
			}
		}
		function resize() {
			W = cv.clientWidth;
			H = cv.clientHeight;
			cv.width = W * devicePixelRatio;
			cv.height = H * devicePixelRatio;
			ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
			cols = Math.ceil(W / CELL);
			rows = Math.ceil(H / CELL);
			seed();
			draw();
		}
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(cv);

		const cellOf = (e: PointerEvent): [number, number] => {
			const b = cv.getBoundingClientRect();
			return [Math.floor((e.clientX - b.left) / CELL), Math.floor((e.clientY - b.top) / CELL)];
		};
		const onMove = (e: PointerEvent) => {
			if (reduce) return;
			lock = { r: cellOf(e)[1], ttl: 8 };
			draw();
		};
		const onLeave = () => {
			lock = null;
			draw();
		};
		const onDown = (e: PointerEvent) => {
			if (reduce) return;
			const [c, r] = cellOf(e);
			collapses.push({ c, r, half: Math.max(c, cols - c), ttl: 4 });
			for (const b of bars) b.y = (b.y + 3 + rnd(6)) % rows;
			lock = null;
			draw();
		};
		cv.addEventListener('pointermove', onMove);
		cv.addEventListener('pointerleave', onLeave);
		cv.addEventListener('pointerdown', onDown);

		let tick: ReturnType<typeof setInterval> | undefined;
		if (!reduce) {
			tick = setInterval(() => {
				for (const b of bars) {
					b.y += b.v;
					if (b.y > rows + 2) b.y = -b.h - 2;
				}
				const keys = [...flecks.keys()];
				for (let i = 0; i < 3 && keys.length; i++) flecks.delete(keys[rnd(keys.length)]);
				for (let i = 0; i < 3; i++)
					flecks.set(rnd(rows) * cols + rnd(cols), STATIC[rnd(STATIC.length)]);
				if (lock && --lock.ttl <= 0) lock = null;
				for (let i = collapses.length - 1; i >= 0; i--) {
					const k = collapses[i];
					if (k.half >= 1) k.half = k.half > 6 ? k.half * 0.5 : k.half - 1.5;
					else if (--k.ttl <= 0) collapses.splice(i, 1);
				}
				draw();
			}, 120);
		}
		return () => {
			if (tick !== undefined) clearInterval(tick);
			ro.disconnect();
			cv.removeEventListener('pointermove', onMove);
			cv.removeEventListener('pointerleave', onLeave);
			cv.removeEventListener('pointerdown', onDown);
		};
	}
</script>

<canvas
	{@attach texture}
	class="block h-52 w-full cursor-crosshair md:h-64"
	style:background={BG}
	aria-hidden="true"
></canvas>
