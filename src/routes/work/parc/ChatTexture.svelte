<script lang="ts">
	// The Discord band's background, ported from parcxrpl.com's chatTexture: pixel chat
	// bubbles drift up like messages landing, a typing indicator trails the cursor, and a
	// click posts a bubble with a pop of sparks. One cell = 3px, hard-step timing.
	import { prefersReducedMotion } from '$lib/motion';

	// Discord's blurple and the texture's own near-background tints (product colors)
	const BG = '#5865f2';
	const FILL = ['#6672f5', '#6a76f6', '#5f6cf3'];
	const PALE = '#a9b1ff',
		WHITE = '#e8ebff',
		SPARK = '#c9ceff',
		INK = '#5865f2';
	const CELL = 3;

	interface Bubble {
		c: number;
		r: number;
		w: number;
		h: number;
		left: boolean;
		color: string;
		v: number;
		ttl: number;
		arrived: boolean;
		lines: number;
	}

	function texture(cv: HTMLCanvasElement) {
		const reduce = prefersReducedMotion();
		const ctx = cv.getContext('2d')!;
		let W = 0,
			H = 0,
			cols = 0,
			rows = 0;
		const bubbles: Bubble[] = [];
		// plain Map on purpose: canvas state inside an attachment, nothing renders from it
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const sparks = new Map<string, { ttl: number }>();
		let typing: { c: number; r: number; ttl: number } | null = null;
		const rnd = (n: number) => Math.floor(Math.random() * n);
		const target = () => Math.max(5, Math.round((W * H) / 70000));

		function spawn(c: number, r: number, sent: boolean, color?: string): Bubble {
			const lines = 1 + rnd(2);
			const b: Bubble = {
				c,
				r,
				w: 14 + rnd(14),
				h: 5 + lines * 4,
				left: !sent,
				color: color ?? (Math.random() < 0.18 ? PALE : FILL[rnd(FILL.length)]),
				v: 0.6 + Math.random() * 0.7,
				ttl: 50 + rnd(50),
				arrived: false,
				lines
			};
			bubbles.push(b);
			return b;
		}
		function seed() {
			bubbles.length = 0;
			for (let i = 0; i < target(); i++) {
				const b = spawn(
					rnd(Math.max(1, cols - 28)),
					rnd(Math.max(1, rows - 14)),
					Math.random() < 0.5
				);
				b.arrived = reduce;
				b.ttl = 50 + rnd(100);
			}
		}
		const px = (c: number, r: number, w = 1, h = 1) =>
			ctx.fillRect(c * CELL, r * CELL, w * CELL, h * CELL);
		function drawBubble(b: Bubble) {
			const c = b.c,
				r = Math.floor(b.r),
				w = b.w,
				h = b.h;
			ctx.fillStyle = b.color;
			px(c + 2, r, w - 4, h);
			px(c + 1, r + 1, w - 2, h - 2);
			px(c, r + 2, w, h - 4);
			if (b.left) {
				px(c + 2, r + h, 3, 1);
				px(c + 1, r + h + 1, 2, 1);
			} else {
				px(c + w - 5, r + h, 3, 1);
				px(c + w - 3, r + h + 1, 2, 1);
			}
			ctx.fillStyle = b.color === PALE || b.color === WHITE ? INK : SPARK;
			for (let i = 0; i < b.lines; i++) {
				const len = i === b.lines - 1 ? Math.max(4, Math.floor((w - 6) * 0.55)) : w - 6;
				px(c + 3, r + 3 + i * 4, len, 2);
			}
		}
		function draw() {
			ctx.clearRect(0, 0, W, H);
			for (const b of bubbles) drawBubble(b);
			ctx.fillStyle = SPARK;
			for (const [k] of sparks) {
				const [c, r] = k.split(',').map(Number);
				px(c, r, 2, 2);
			}
			if (typing) {
				const up = typing.ttl & 1;
				ctx.fillStyle = WHITE;
				px(typing.c, typing.r, 2, 2);
				px(typing.c + 4, typing.r - up * 2, 2, 2);
				px(typing.c + 8, typing.r, 2, 2);
			}
		}
		function resize() {
			W = cv.clientWidth;
			H = cv.clientHeight;
			cv.width = W * devicePixelRatio;
			cv.height = H * devicePixelRatio;
			ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
			ctx.imageSmoothingEnabled = false;
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
			const [c, r] = cellOf(e);
			typing = { c: c - 5, r: r + 4, ttl: 10 };
			draw();
		};
		const onLeave = () => {
			typing = null;
			draw();
		};
		const onDown = (e: PointerEvent) => {
			if (reduce) return;
			const [c, r] = cellOf(e);
			const b = spawn(Math.max(0, Math.min(cols - 30, c - 10)), r - 8, true, WHITE);
			b.arrived = true;
			b.ttl = 70;
			for (let i = 0; i < 10; i++) {
				const sc = c + Math.round((Math.random() - 0.5) * 24),
					sr = r + Math.round((Math.random() - 0.5) * 16);
				if (sc >= 0 && sr >= 0 && sc < cols && sr < rows)
					sparks.set(sc + ',' + sr, { ttl: 2 + rnd(3) });
			}
			typing = null;
			draw();
		};
		cv.addEventListener('pointermove', onMove);
		cv.addEventListener('pointerleave', onLeave);
		cv.addEventListener('pointerdown', onDown);

		let tick: ReturnType<typeof setInterval> | undefined;
		if (!reduce) {
			tick = setInterval(() => {
				for (let i = bubbles.length - 1; i >= 0; i--) {
					const b = bubbles[i];
					if (!b.arrived) {
						b.r -= b.v;
						if (b.r <= 2 || Math.random() < 0.02) b.arrived = true;
					} else if (--b.ttl <= 0) bubbles.splice(i, 1);
				}
				if (bubbles.length < target() + 2 && Math.random() < 0.4)
					spawn(rnd(Math.max(1, cols - 28)), rows + 2, Math.random() < 0.4);
				for (const [k, s] of sparks) if (--s.ttl <= 0) sparks.delete(k);
				if (typing && --typing.ttl <= 0) typing = null;
				draw();
			}, 160);
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
