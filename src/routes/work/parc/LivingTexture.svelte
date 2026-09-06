<script lang="ts">
	// The PARC site's hero background, ported: a sparse scatter of brand-color cells on
	// white that twinkles, sparks around the cursor, and splashes on click. Same numbers
	// as parcxrpl.com's pixelTexture (cell = width/120, density 1.4%, 400ms tick).
	import { PARC, PARC_CYCLE, PARC_HI } from './parcBrand';
	import { prefersReducedMotion } from '$lib/motion';

	const COLORS = PARC_CYCLE;
	const DENSITY = 0.014;
	const rc = () => COLORS[Math.floor(Math.random() * COLORS.length)];

	function texture(cv: HTMLCanvasElement) {
		const reduce = prefersReducedMotion();
		const ctx = cv.getContext('2d')!;
		// plain Maps on purpose: this is canvas state inside an attachment, nothing renders from it
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const cells = new Map<string, string>();
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const sparks = new Map<string, { color: string; ttl: number }>();
		let W = 0,
			H = 0,
			cell = 8,
			cols = 0,
			rows = 0;

		function seed() {
			cells.clear();
			for (let r = 0; r < rows; r++)
				for (let c = 0; c < cols; c++) if (Math.random() < DENSITY) cells.set(c + ',' + r, rc());
		}
		function draw() {
			ctx.clearRect(0, 0, W, H);
			for (const [k, col] of cells) {
				const [c, r] = k.split(',').map(Number);
				ctx.fillStyle = col;
				ctx.fillRect(c * cell, r * cell, cell, cell);
			}
			for (const [k, sp] of sparks) {
				const [c, r] = k.split(',').map(Number);
				ctx.fillStyle = sp.ttl <= 2 ? PARC_HI[sp.color] : sp.color;
				ctx.fillRect(c * cell, r * cell, cell, cell);
			}
		}
		function resize() {
			W = cv.clientWidth;
			H = cv.clientHeight;
			cv.width = W * devicePixelRatio;
			cv.height = H * devicePixelRatio;
			ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
			cell = Math.max(8, Math.round(W / 120));
			cols = Math.ceil(W / cell);
			rows = Math.ceil(H / cell);
			seed();
			draw();
		}
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(cv);

		const at = (e: PointerEvent) => {
			const b = cv.getBoundingClientRect();
			return [Math.floor((e.clientX - b.left) / cell), Math.floor((e.clientY - b.top) / cell)];
		};
		function onMove(e: PointerEvent) {
			if (reduce) return;
			const [pc, pr] = at(e);
			for (let i = 0; i < 2; i++) {
				const c = pc + Math.round((Math.random() - 0.5) * 6);
				const r = pr + Math.round((Math.random() - 0.5) * 6);
				if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
				sparks.set(c + ',' + r, { color: rc(), ttl: 3 + Math.floor(Math.random() * 5) });
			}
			draw();
		}
		// click splash: a ragged ring expanding from the pointer; quick repeat clicks grow it
		const SECTORS = 12;
		const ripples: { pc: number; pr: number; radius: number; maxR: number; wob: number[] }[] = [];
		let rippleTimer: ReturnType<typeof setInterval> | undefined;
		let combo = 0,
			lastClick = 0;
		function stepRipples() {
			for (const rp of ripples) {
				rp.radius += 1;
				const reach = rp.radius + 3;
				for (let dc = -reach; dc <= reach; dc++)
					for (let dr = -reach; dr <= reach; dr++) {
						const dist = Math.hypot(dc, dr);
						if (dist < rp.radius - 2 || dist > rp.radius + 2) continue;
						const sector =
							Math.floor(((Math.atan2(dr, dc) + Math.PI) / (2 * Math.PI)) * SECTORS) % SECTORS;
						if (Math.abs(dist - (rp.radius + rp.wob[sector])) > 0.8 || Math.random() < 0.3)
							continue;
						const c = rp.pc + dc,
							r = rp.pr + dr;
						if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
						sparks.set(c + ',' + r, { color: rc(), ttl: 2 + Math.floor(Math.random() * 3) });
					}
				for (let s = 0; s < SECTORS; s++)
					rp.wob[s] = Math.max(-2.2, Math.min(2.2, rp.wob[s] + (Math.random() - 0.5)));
			}
			for (let i = ripples.length - 1; i >= 0; i--)
				if (ripples[i].radius >= ripples[i].maxR) ripples.splice(i, 1);
			if (!ripples.length && rippleTimer !== undefined) {
				clearInterval(rippleTimer);
				rippleTimer = undefined;
			}
			draw();
		}
		function onDown(e: PointerEvent) {
			if (reduce) return;
			const now = performance.now();
			combo = now - lastClick < 900 ? Math.min(combo + 1, 6) : 0;
			lastClick = now;
			const [pc, pr] = at(e);
			ripples.push({
				pc,
				pr,
				radius: 0,
				maxR: 7 + combo * 2 + Math.floor(Math.random() * 3),
				wob: Array.from({ length: SECTORS }, () => (Math.random() - 0.5) * 2.4)
			});
			const pop = 4 + combo * 3;
			for (let i = 0; i < pop; i++) {
				const c = pc + Math.round((Math.random() - 0.5) * (2 + combo));
				const r = pr + Math.round((Math.random() - 0.5) * (2 + combo));
				if (c >= 0 && r >= 0 && c < cols && r < rows)
					sparks.set(c + ',' + r, { color: rc(), ttl: 3 + Math.floor(Math.random() * 3) });
			}
			if (rippleTimer === undefined) rippleTimer = setInterval(stepRipples, 45);
			draw();
		}
		cv.addEventListener('pointermove', onMove);
		cv.addEventListener('pointerdown', onDown);

		let twinkle: ReturnType<typeof setInterval> | undefined;
		if (!reduce) {
			twinkle = setInterval(() => {
				const keys = [...cells.keys()];
				for (let i = 0; i < 4 && keys.length; i++)
					cells.delete(keys[Math.floor(Math.random() * keys.length)]);
				for (let i = 0; i < 3 && keys.length; i++)
					cells.set(keys[Math.floor(Math.random() * keys.length)], rc());
				for (let i = 0; i < 4; i++)
					cells.set(
						Math.floor(Math.random() * cols) + ',' + Math.floor(Math.random() * rows),
						rc()
					);
				for (const [k, sp] of sparks) {
					sp.ttl -= 1;
					if (sp.ttl <= 0) sparks.delete(k);
				}
				draw();
			}, 400);
		}
		return () => {
			if (twinkle !== undefined) clearInterval(twinkle);
			if (rippleTimer !== undefined) clearInterval(rippleTimer);
			ro.disconnect();
			cv.removeEventListener('pointermove', onMove);
			cv.removeEventListener('pointerdown', onDown);
		};
	}
</script>

<canvas
	{@attach texture}
	class="block h-52 w-full cursor-crosshair md:h-64"
	style:background={PARC.white}
	aria-hidden="true"
></canvas>
