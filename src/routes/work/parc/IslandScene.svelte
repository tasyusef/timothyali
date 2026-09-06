<script lang="ts">
	// The PARC site's arcade backdrop, ported: Rowboat Racer's island drawn from the game's
	// own sprite sheet. Jungle ground dithered over sand, palms, huts and a dock, a beach
	// with a wandering wet edge and foam, and the river below with the game's ripples and
	// obstacles. Drawn on a tiny canvas at 3x so every cell is a crisp block; the land is
	// painted once, only the water moves. Colors are the game renderer's, which are the
	// game's own and deliberately not the brand palette. Sprites live in static/parc/game.
	import { prefersReducedMotion } from '$lib/motion';
	import { BANK_RECTS, BK } from './bankAtlas';

	const ZOOM = 3;
	const WATER_ROWS = 64;
	const BEACH_ROWS = 14;
	const SAND_SCALE = 6;
	const GRAIN = 0.02;
	const RIPPLE_DENSITY = 0.0022;
	const RIPPLE_CYCLE = 9;
	const RIPPLE_STEP = 1 / 8;
	const FLOW = 26;
	const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

	// game renderer colors (product values, not site tokens)
	const WATER_BASE = '#14758c';
	const WATER_SHALLOW = '#1b829a';
	const WATER_DEEP = '#126e84';
	const RIPPLE_LIGHT = '#2f96ad';
	const RIPPLE_DARK = '#0e6379';
	const FOAM = '#9fd8e4';
	const SHORE = '#e4d4a6';
	const WET_SAND = '#c3b184';
	const PEBBLE = '#8c938d';
	const PEBBLE_LO = '#6b716c';

	const SRC: Record<string, string> = {
		bank: '/parc/game/bank.png',
		sand: '/parc/game/sand-tile.png',
		rock0: '/parc/game/rock-0.png',
		rock2: '/parc/game/rock-2.png',
		log: '/parc/game/log-1.png',
		zig: '/parc/game/ziggurat-0.png',
		coin: '/parc/game/coin.png',
		star: '/parc/game/star.png',
		gem: '/parc/game/gem.png'
	};

	interface Floater {
		key: string;
		y: number;
		v: number;
		x: number;
		bob: boolean;
		phase: number;
	}
	interface Ripple {
		x: number;
		y: number;
		phase: number;
		big: boolean;
	}
	interface Prop {
		kind: number;
		x: number;
		y: number;
	}

	const hex = (c: string): [number, number, number] => [
		parseInt(c.slice(1, 3), 16),
		parseInt(c.slice(3, 5), 16),
		parseInt(c.slice(5, 7), 16)
	];
	const C_BASE = hex(WATER_BASE);
	const C_SHALLOW = hex(WATER_SHALLOW);
	const C_DEEP = hex(WATER_DEEP);
	const C_DARK = hex(RIPPLE_DARK);
	const C_WET = hex(WET_SAND);
	const C_SHORE = hex(SHORE);

	function scene(el: HTMLDivElement) {
		const still = prefersReducedMotion();
		const cv = document.createElement('canvas');
		cv.style.display = 'block';
		cv.style.imageRendering = 'pixelated';
		el.appendChild(cv);
		const ctx = cv.getContext('2d')!;
		ctx.imageSmoothingEnabled = false;

		const img: Record<string, HTMLImageElement | undefined> = {};
		let W = 0,
			H = 0,
			waterTop = 0;
		let ripples: Ripple[] = [];
		let land: HTMLCanvasElement | null = null;
		let water: HTMLCanvasElement | null = null;
		let props: Prop[] = [];
		let shore = new Int16Array(0);
		const floaters: Floater[] = [
			{ key: 'rock0', y: 30, v: 0, x: 0.12, bob: false, phase: 0 },
			{ key: 'zig', y: 18, v: 0, x: 0.47, bob: false, phase: 1 },
			{ key: 'rock2', y: 36, v: 0, x: 0.78, bob: false, phase: 2 },
			{ key: 'log', y: 12, v: 14, x: 180, bob: false, phase: 3 },
			{ key: 'coin', y: 44, v: 0, x: 0.3, bob: true, phase: 4 },
			{ key: 'star', y: 22, v: 0, x: 0.63, bob: true, phase: 5 },
			{ key: 'gem', y: 48, v: 0, x: 0.9, bob: true, phase: 6 }
		];

		let seed = 12345;
		const rand = () => {
			seed = (seed * 1664525 + 1013904223) >>> 0;
			return seed / 4294967296;
		};
		function hash(a: number, b: number, c: number): number {
			let h = (a * 374761393 + b * 668265263 + c * 2246822519) >>> 0;
			h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
			return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
		}
		function noise(x: number, y: number, cell: number, salt: number): number {
			const gx = x / cell,
				gy = y / cell;
			const x0 = Math.floor(gx),
				y0 = Math.floor(gy);
			let fx = gx - x0,
				fy = gy - y0;
			fx = fx * fx * (3 - 2 * fx);
			fy = fy * fy * (3 - 2 * fy);
			const a = hash(x0, y0, salt),
				b = hash(x0 + 1, y0, salt),
				c = hash(x0, y0 + 1, salt),
				d = hash(x0 + 1, y0 + 1, salt);
			return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
		}
		function pixels(
			im: HTMLImageElement,
			sx: number,
			sy: number,
			sw: number,
			sh: number,
			scale: number
		): ImageData | null {
			const w = Math.round(sw / scale),
				h = Math.round(sh / scale);
			const c = document.createElement('canvas');
			c.width = w;
			c.height = h;
			const g = c.getContext('2d', { willReadFrequently: true });
			if (!g) return null;
			g.imageSmoothingEnabled = false;
			g.drawImage(im, sx, sy, sw, sh, 0, 0, w, h);
			return g.getImageData(0, 0, w, h);
		}
		const shoreOffset = (x: number) =>
			Math.round(Math.sin(x / 23) * 2 + Math.sin(x / 7.3 + 1) * 1 + Math.sin(x / 51 + 2) * 2);

		function buildLand(): void {
			const sandImg = img.sand,
				bank = img.bank;
			if (!sandImg || !bank) return;
			const sand = pixels(sandImg, 0, 0, sandImg.naturalWidth, sandImg.naturalHeight, SAND_SCALE);
			const g0 = BK.GRASS * 4;
			const grass = pixels(
				bank,
				BANK_RECTS[g0],
				BANK_RECTS[g0 + 1],
				BANK_RECTS[g0 + 2],
				BANK_RECTS[g0 + 3],
				1
			);
			if (!sand || !grass) return;
			const c = document.createElement('canvas');
			c.width = W;
			c.height = waterTop;
			const g = c.getContext('2d');
			if (!g) return;
			const id = g.createImageData(W, waterTop);
			const d = id.data;
			const beachTop = waterTop - BEACH_ROWS;
			shore = new Int16Array(W);
			for (let x = 0; x < W; x++) shore[x] = waterTop + shoreOffset(x);
			let i = 0;
			for (let y = 0; y < waterTop; y++) {
				for (let x = 0; x < W; x++) {
					const so = ((y % sand.height) * sand.width + (x % sand.width)) * 4;
					let r = sand.data[so],
						gg = sand.data[so + 1],
						b = sand.data[so + 2];
					const dth = BAYER[((y & 3) << 2) | (x & 3)] / 16;
					let a = (beachTop - 6 - y + (noise(x, 0, 28, 2) - 0.5) * 12) / 9;
					if (a > 0) {
						if (a > 1) a = 1;
						const p = noise(x, y, 26, 3) * 0.7 + noise(x, y, 7, 4) * 0.3;
						a *= Math.min(1, Math.max(0, (p - 0.18) / 0.16));
						if (a > dth) {
							const go = ((y & 15) * 16 + (x & 15)) * 4;
							r = grass.data[go];
							gg = grass.data[go + 1];
							b = grass.data[go + 2];
						}
					}
					const edge = shore[x];
					if (y >= edge) [r, gg, b] = C_BASE;
					else if (y === edge - 1) [r, gg, b] = C_SHORE;
					else if (y >= edge - 4) [r, gg, b] = C_WET;
					const f = 1 + (rand() * 2 - 1) * GRAIN;
					d[i++] = Math.min(255, Math.round(r * f));
					d[i++] = Math.min(255, Math.round(gg * f));
					d[i++] = Math.min(255, Math.round(b * f));
					d[i++] = 255;
				}
			}
			g.putImageData(id, 0, 0);
			for (let k = 0; k < Math.round(W / 30); k++) {
				const x = (rand() * (W - 4)) | 0;
				const y = beachTop + 1 + ((rand() * (BEACH_ROWS - 8)) | 0);
				g.fillStyle = PEBBLE;
				g.fillRect(x, y, 3, 2);
				g.fillStyle = PEBBLE_LO;
				g.fillRect(x, y + 2, 3, 1);
			}
			land = c;
			placeProps(beachTop);
		}

		function placeProps(beachTop: number): void {
			props = [];
			const put = (kind: number, x: number, y: number) =>
				props.push({ kind, x: Math.round(x), y: Math.round(y) });
			const canopy = [BK.TREE0, BK.TREE1, BK.PALM, BK.TREE0, BK.PALM];
			const under = [
				BK.BUSH0,
				BK.BUSH1,
				BK.BUSH2,
				BK.BUSH_FLOWER,
				BK.FERN,
				BK.BANANA_PLANT,
				BK.FERN
			];
			const beach = [BK.SHELL, BK.STARFISH, BK.DRIFTWOOD, BK.BOULDER0, BK.CRATE, BK.BARREL];
			for (let x = 8; x < W; x += 48) {
				const jx = x + (rand() - 0.5) * 30;
				put(canopy[(rand() * canopy.length) | 0], jx, 4 + rand() * 18);
				if (rand() < 0.7)
					put(
						under[(rand() * under.length) | 0],
						jx + (rand() - 0.5) * 40,
						30 + rand() * (beachTop - 62)
					);
				if (rand() < 0.5)
					put(
						under[(rand() * under.length) | 0],
						jx + (rand() - 0.5) * 40,
						30 + rand() * (beachTop - 62)
					);
			}
			const vx = W * (0.15 + rand() * 0.7);
			put(BK.HUT, vx - 30, beachTop - 40);
			put(BK.HUT_ROUND, vx + 6, beachTop - 34);
			put(BK.CANOE_RACK, vx - 12, beachTop - 12);
			put(BK.DOCK, vx + 24, beachTop + 2);
			for (let k = 0; k < Math.round(W / 70); k++)
				put(beach[(rand() * beach.length) | 0], rand() * (W - 20), beachTop + 2 + rand() * 5);
			props.sort((a, b) => a.y + BANK_RECTS[a.kind * 4 + 3] - (b.y + BANK_RECTS[b.kind * 4 + 3]));
		}

		function blit(kind: number, x: number, y: number): void {
			const bank = img.bank;
			if (!bank) return;
			const r = kind * 4;
			ctx.drawImage(
				bank,
				BANK_RECTS[r],
				BANK_RECTS[r + 1],
				BANK_RECTS[r + 2],
				BANK_RECTS[r + 3],
				x,
				y,
				BANK_RECTS[r + 2],
				BANK_RECTS[r + 3]
			);
		}

		function buildWater(): void {
			const c = document.createElement('canvas');
			c.width = W;
			c.height = WATER_ROWS + 8;
			const g = c.getContext('2d');
			if (!g) return;
			const id = g.createImageData(c.width, c.height);
			const d = id.data;
			let i = 0;
			for (let y = 0; y < c.height; y++) {
				const dd = Math.min(y, c.height - 1 - y);
				for (let x = 0; x < W; x++) {
					let col = C_BASE;
					if (dd < 4 && rand() < 0.55 - dd * 0.12) col = C_SHALLOW;
					else if (dd > 12 && rand() < 0.3) col = C_DEEP;
					const f = 1 + (rand() * 2 - 1) * GRAIN;
					d[i++] = Math.min(255, Math.round(col[0] * f));
					d[i++] = Math.min(255, Math.round(col[1] * f));
					d[i++] = Math.min(255, Math.round(col[2] * f));
					d[i++] = 255;
				}
			}
			const streaks = Math.max(3, Math.round(W / 60));
			for (let s = 0; s < streaks; s++) {
				let y = 3 + ((rand() * (c.height - 6)) | 0);
				const x0 = (rand() * W) | 0;
				const len = 14 + ((rand() * 16) | 0);
				for (let k = 0; k < len; k++) {
					if (k % 6 === 5) y += rand() < 0.5 ? -1 : 1;
					if (y < 0 || y >= c.height) break;
					const p = (y * W + ((x0 + k) % W)) * 4;
					d[p] = C_DARK[0];
					d[p + 1] = C_DARK[1];
					d[p + 2] = C_DARK[2];
				}
			}
			g.putImageData(id, 0, 0);
			water = c;
		}

		function layout(): void {
			const w = Math.max(64, Math.ceil(el.clientWidth / ZOOM));
			const h = Math.max(WATER_ROWS + BEACH_ROWS + 40, Math.ceil(el.clientHeight / ZOOM));
			if (w === W && h === H) return;
			W = w;
			H = h;
			waterTop = H - WATER_ROWS;
			cv.width = W;
			cv.height = H;
			cv.style.width = `${W * ZOOM}px`;
			cv.style.height = `${H * ZOOM}px`;
			ctx.imageSmoothingEnabled = false;
			seed = 12345;
			const n = Math.round(RIPPLE_DENSITY * W * WATER_ROWS);
			ripples = [];
			for (let i = 0; i < n; i++)
				ripples.push({
					x: rand() * W,
					y: 2 + ((rand() * (WATER_ROWS - 5)) | 0),
					phase: (rand() * RIPPLE_CYCLE) | 0,
					big: rand() < 0.5
				});
			buildWater();
			buildLand();
		}

		function ripple(x: number, y: number, frame: number, big: boolean): void {
			const len = big ? 12 : 8;
			if (frame === 0 || frame === 4) {
				ctx.fillStyle = RIPPLE_LIGHT;
				ctx.fillRect(x + (len >> 2), y, len >> 1, 1);
			} else if (frame === 1 || frame === 3) {
				ctx.fillStyle = RIPPLE_LIGHT;
				ctx.fillRect(x + 1, y, len - 2, 1);
				ctx.fillRect(x, y + 1, 1, 1);
				ctx.fillRect(x + len - 1, y + 1, 1, 1);
				ctx.fillStyle = RIPPLE_DARK;
				ctx.fillRect(x + 2, y + 1, len - 4, 1);
			} else if (frame === 2) {
				ctx.fillStyle = RIPPLE_LIGHT;
				ctx.fillRect(x + 1, y, len - 2, 1);
				ctx.fillRect(x - 1, y + 1, 2, 1);
				ctx.fillRect(x + len - 1, y + 1, 2, 1);
				ctx.fillStyle = RIPPLE_DARK;
				ctx.fillRect(x + 1, y + 1, len - 2, 1);
				ctx.fillRect(x + 3, y + 2, len - 6, 1);
			}
		}

		let scroll = 0,
			step = 0,
			stepAcc = 0,
			bobT = 0;

		function draw(): void {
			if (land) ctx.drawImage(land, 0, 0);
			else {
				ctx.fillStyle = SHORE;
				ctx.fillRect(0, 0, W, waterTop);
			}
			const wy = waterTop - 8;
			if (water) {
				const off = Math.floor(scroll) % W;
				ctx.drawImage(water, -off, wy);
				ctx.drawImage(water, W - off, wy);
			} else {
				ctx.fillStyle = WATER_BASE;
				ctx.fillRect(0, wy, W, WATER_ROWS + 8);
			}
			if (land && shore.length === W) {
				for (let x = 0; x < W; x++) {
					const e = shore[x];
					if (e > wy) ctx.drawImage(land, x, wy, 1, e - wy, x, wy, 1, e - wy);
				}
				ctx.fillStyle = FOAM;
				for (let x = (Math.floor(scroll) % 4) - 4; x < W; x += 4) {
					const s = Math.sin((x - bobT * 18) / 34) + Math.sin((x + bobT * 7) / 13) * 0.5;
					if (s > -0.35) ctx.fillRect(x, shore[Math.max(0, Math.min(W - 1, x))], 4, 1);
				}
				for (let k = 0; k < Math.round(W / 20); k++) {
					const x = (k * 20 + 7) % W;
					const len = Math.round((2 + (k % 3)) * (0.5 + 0.5 * Math.sin(bobT * 1.1 + k * 1.7)));
					if (len > 0) ctx.fillRect(x, shore[x] + 1 + (k & 1), 1, len);
				}
			}
			for (const r of ripples) {
				const x = Math.floor(((((r.x - scroll) % W) + W) % W) - 12);
				if (r.y + waterTop > shore[Math.max(0, Math.min(W - 1, x + 4))] + 1)
					ripple(x, waterTop + r.y, (step + r.phase) % RIPPLE_CYCLE, r.big);
			}
			for (const p of props) blit(p.kind, p.x, p.y);
			for (const f of floaters) {
				const s = img[f.key];
				if (!s) continue;
				const x = f.v === 0 ? Math.floor(f.x * (W - s.naturalWidth)) : Math.floor(f.x);
				const y = waterTop + f.y + (f.bob ? (Math.floor(bobT * 2 + f.phase) & 1) * -1 : 0);
				if (f.v === 0 && !f.bob) {
					ctx.fillStyle = FOAM;
					const h = s.naturalHeight,
						w = s.naturalWidth;
					for (let k = 0; k < 3; k++) {
						if (Math.sin(bobT * 1.3 + f.phase + k * 2.1) <= -0.2) continue;
						const fy = y + h - 4 - k * 3;
						ctx.fillRect(x - 2 - k, fy, 2, 1);
						ctx.fillRect(x + w + k, fy, 2, 1);
					}
				}
				ctx.drawImage(s, x, y);
			}
		}

		function update(dt: number): void {
			scroll += FLOW * dt;
			stepAcc += dt;
			while (stepAcc >= RIPPLE_STEP) {
				stepAcc -= RIPPLE_STEP;
				step = (step + 1) % RIPPLE_CYCLE;
			}
			bobT += dt;
			for (const f of floaters) {
				if (f.v === 0) continue;
				f.x -= f.v * dt;
				if (f.x < -40) f.x = W + 20 + rand() * 80;
			}
		}

		let raf = 0,
			last = 0,
			running = false;
		function frame(t: number): void {
			const dt = Math.min(0.05, (t - last) / 1000);
			last = t;
			update(dt);
			draw();
			raf = requestAnimationFrame(frame);
		}
		function start(): void {
			if (running || still) return;
			running = true;
			last = performance.now();
			raf = requestAnimationFrame(frame);
		}
		function stop(): void {
			if (!running) return;
			running = false;
			cancelAnimationFrame(raf);
		}

		const ro = new ResizeObserver(() => {
			layout();
			draw();
		});
		ro.observe(el);
		const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
		io.observe(el);
		layout();

		let alive = true;
		void Promise.all(
			Object.entries(SRC).map(
				([key, src]) =>
					new Promise<void>((res) => {
						const im = new Image();
						im.onload = () => {
							img[key] = im;
							res();
						};
						im.onerror = () => res();
						im.src = src;
					})
			)
		).then(() => {
			if (!alive) return;
			seed = 12345;
			buildWater();
			buildLand();
			draw();
		});
		draw();

		return () => {
			alive = false;
			stop();
			ro.disconnect();
			io.disconnect();
			cv.remove();
		};
	}
</script>

<div
	{@attach scene}
	class="h-96 w-full overflow-hidden"
	role="img"
	aria-label="Rowboat Racer's island: jungle, huts and a dock above a sandy beach, the river below with rocks, a log and pickups"
></div>
