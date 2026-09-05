<script lang="ts">
	// The PARC brand sheet, rebuilt on the page in the system it describes: the real
	// PARC Pixel fonts, the real marks as SVG, and the real palette. Site chrome
	// (labels, borders, body copy) uses site tokens; everything inside a panel uses
	// PARC's own colors on purpose — see parcBrand.ts.
	import { reveal } from '$lib/actions/reveal';
	import { PARC, PARC_SKY, PARC_SWATCHES, PARC_CYCLE } from './parcBrand';
	import BrandRule from './BrandRule.svelte';
	import ParcMark from './ParcMark.svelte';
	import PixelScatter from './PixelScatter.svelte';

	const headingId = $props.id();
	const cycled = [...'SUMMER REGATTA'].map((ch, i) => ({ ch, color: PARC_CYCLE[i % 4] }));
</script>

<section use:reveal aria-labelledby={headingId} class="mb-section">
	<div
		class="grid grid-cols-1 gap-4 border-t border-[var(--color-border)] py-8 md:grid-cols-12 md:gap-0 md:py-10"
	>
		<h2 id={headingId} class="label-swiss md:col-span-3">Brand System</h2>
		<div class="md:col-span-9 md:col-start-4 lg:col-span-8">
			<p class="px px-xl">
				The pixel is the <span style:color={PARC.orange}>heritage</span>. Restraint is the
				<span style:color={PARC.blue}>maturity</span>.
			</p>
			<p class="label-swiss data-swiss mt-4">
				Pixel Ape Rowboat Club · Brand System · v1.0 · Aug 2026
			</p>
		</div>
	</div>

	<BrandRule n="01" title="The Marks" color={PARC.green}>
		<p>
			Three marks, one construction: the box logo in wide and square, and the oar badge. All three
			live on the same cell grid with the same notched corners. Nobody rebuilds them from squares;
			each master is a handful of merged paths. Clear space is two cells on every side, measured in
			the mark&rsquo;s own cells.
		</p>
		<div
			class="panel sky flex flex-wrap items-center justify-center gap-8 px-8 py-12"
			style:--parc-sky={PARC_SKY}
		>
			<ParcMark variant="wide" label="PARC box logo, wide" class="w-full max-w-md" />
			<ParcMark variant="square" label="PARC square lockup" class="w-28" />
			<ParcMark variant="oar" label="PARC oar badge" class="w-64" />
		</div>
	</BrandRule>

	<BrandRule n="02" title="One Color per Element" color={PARC.blue}>
		<p>
			Every element, a text block, an icon, a texture, gets exactly one flat brand color. The
			four-color letter cycling belongs to the logo alone. That scarcity is what makes the logo read
			as a crest instead of a sticker. Yellow never sets type on white; it works reversed on green,
			or as a swatch, a texture pixel, an accent.
		</p>
		<div class="grid gap-1 sm:grid-cols-2">
			<div class="panel" style:background={PARC.green}>
				<p class="panel-label" style:color={PARC.skyBottom}>Do · one color per block</p>
				<p class="px px-lg" style:color={PARC.white}>Summer Regatta</p>
			</div>
			<div class="panel" style:background={PARC.green}>
				<p class="panel-label" style:color={PARC.orange}>Don&rsquo;t · cycling outside the logo</p>
				<p class="px px-lg" aria-label="Summer Regatta">
					{#each cycled as { ch, color }, i (i)}<span style:color aria-hidden="true">{ch}</span
						>{/each}
				</p>
			</div>
			<div class="panel sm:col-span-2" style:background={PARC.white}>
				<p class="panel-label" style:color={PARC.orange}>Don&rsquo;t · yellow type on white</p>
				<p class="px px-xl" style:color={PARC.yellow}>Summer Regatta</p>
			</div>
		</div>
	</BrandRule>

	<BrandRule n="03" title="Color" color={PARC.orange}>
		<p>
			Five colors. No tints, no gradients, no additions. Web uses the hex values; print uses the
			CMYK builds.
		</p>
		<dl class="grid grid-cols-3 gap-x-1 gap-y-6 sm:grid-cols-5">
			{#each PARC_SWATCHES as s (s.name)}
				<div>
					<div
						class="panel aspect-[4/3] p-0"
						class:ring={s.name === 'White'}
						style:background={s.hex}
					></div>
					<dt class="mt-3 text-caption-size">{s.name}</dt>
					<dd class="label-swiss data-swiss mt-1 normal-case">
						{s.hex.toUpperCase()}<br />{s.cmyk}
					</dd>
				</div>
			{/each}
		</dl>
	</BrandRule>

	<BrandRule n="04" title="Type" color={PARC.green}>
		<p>
			The brand speaks pixel first. PARC Pixel ships in three weights, Light, Regular and Bold, each
			in proportional and mono cuts drawn from the same letterforms. Light carries supporting copy
			and captions, Regular is the display voice, Bold is for headlines that shout. A plain system
			grotesk is allowed only where reading endurance wins: long documents, terms, body text in the
			UI.
		</p>
		<div class="panel space-y-2" style:background={PARC.green} style:color={PARC.white}>
			<p class="px px-lg" style:font-weight="300">Light for supporting copy</p>
			<p class="px px-lg" style:font-weight="400">Regular for display</p>
			<p class="px px-lg" style:font-weight="700">Bold for emphasis</p>
		</div>
		<div class="grid gap-1 sm:grid-cols-2">
			<div class="panel" style:background={PARC.white} style:color={PARC.green}>
				<p class="panel-label">Display · proportional</p>
				<p class="px px-lg">Summer Regatta</p>
			</div>
			<div class="panel" style:background={PARC.white} style:color={PARC.green}>
				<p class="panel-label">Data · mono aligns</p>
				<p class="px-mono px-lg">10.30-18.00<br />Sat + Sun!</p>
			</div>
		</div>
	</BrandRule>

	<BrandRule n="05" title="The Oar" color={PARC.blue}>
		<p>
			The secondary mark is a single horizontal oar. In the fonts it lives on the equals key, so it
			drops into any line of pixel type as an ornament or a divider. The mark travels wherever the
			type goes. Badged for avatars, patches and app icons; boxless when inline; any single brand
			color.
		</p>
		<div class="panel" style:background={PARC.white} style:color={PARC.green}>
			<p class="panel-label">Live text. The equals key between the words draws the oar.</p>
			<p class="px px-xl" style:font-weight="700">PARC = CLUB</p>
		</div>
	</BrandRule>

	<BrandRule n="06" title="Texture &amp; Whitespace" color={PARC.orange}>
		<p>
			Whitespace is the luxury signal: small marks on big empty fields. Pixel scatter is the only
			permitted texture, and density is the volume knob. Three to six percent for everyday calm, up
			to forty percent only for drop-day celebration. Every scatter is seeded, so it can be
			reproduced.
		</p>
		<div class="grid gap-4">
			<div>
				<p class="label-swiss data-swiss mb-2">Everyday · 4%</p>
				<div class="panel p-0"><PixelScatter density={0.04} seed={11} /></div>
			</div>
			<div>
				<p class="label-swiss data-swiss mb-2">Drop day · 40%</p>
				<div class="panel p-0"><PixelScatter density={0.4} seed={23} /></div>
			</div>
		</div>
	</BrandRule>

	<BrandRule n="07" title="The Grid Is Law" color={PARC.green}>
		<p>
			Margins, crops, spacing and type sizes land on multiples of the pixel cell. Letter tracking is
			one cell in running display type and two cells in the logo. The badge margin is two cells, and
			every corner notches exactly one cell. Nobody has to see the grid to feel it.
		</p>
		<div class="panel px-8 py-10" style:background={PARC.white}>
			<ParcMark
				variant="wide"
				grid
				label="PARC box logo over its own pixel grid"
				class="mx-auto w-full max-w-xl"
			/>
		</div>
	</BrandRule>
</section>

<style>
	/* PARC Pixel: the product's typeface, served from static/parc. Only this demo uses it. */
	@font-face {
		font-family: 'PARC Pixel';
		font-weight: 300;
		src: url('/parc/PARC_Pixel-Light.woff2') format('woff2');
		font-display: swap;
	}
	@font-face {
		font-family: 'PARC Pixel';
		font-weight: 400;
		src: url('/parc/PARC_Pixel.woff2') format('woff2');
		font-display: swap;
	}
	@font-face {
		font-family: 'PARC Pixel';
		font-weight: 700;
		src: url('/parc/PARC_Pixel-Bold.woff2') format('woff2');
		font-display: swap;
	}
	@font-face {
		font-family: 'PARC Pixel Mono';
		font-weight: 400;
		src: url('/parc/PARC_Pixel-Mono.woff2') format('woff2');
		font-display: swap;
	}

	.px {
		font-family: 'PARC Pixel', ui-monospace, monospace;
		text-transform: uppercase;
		line-height: 1.35;
	}
	.px-mono {
		font-family: 'PARC Pixel Mono', ui-monospace, monospace;
		text-transform: uppercase;
		line-height: 1.35;
	}
	.px-xl {
		font-size: clamp(1.375rem, 3vw, 2.25rem);
		letter-spacing: 0.02em;
	}
	.px-lg {
		font-size: clamp(1.125rem, 2.2vw, 1.625rem);
		letter-spacing: 0.03em;
	}

	/* PARC panel: one flat brand color, square corners */
	.panel {
		padding: 1.5rem;
	}
	.panel.sky {
		background:
			url('/parc/clouds-tile.png') 0 0 / 576px 384px,
			var(--parc-sky);
	}
	.panel.ring {
		box-shadow: inset 0 0 0 1px var(--color-border);
	}
	.panel-label {
		font-family: 'PARC Pixel', ui-monospace, monospace;
		font-weight: 300;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-bottom: 0.75rem;
		opacity: 0.85;
	}
</style>
