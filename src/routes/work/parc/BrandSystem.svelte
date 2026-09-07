<script lang="ts">
	// The PARC brand sheet, rebuilt on the page in the system it describes: the real
	// PARC Pixel fonts, the real marks as SVG, and the real palette. Site chrome
	// (labels, borders, body copy) uses site tokens; everything inside a panel uses
	// PARC's own colors on purpose — see parcBrand.ts.
	import { reveal } from '$lib/actions/reveal';
	import { PARC, PARC_SKY, PARC_SWATCHES } from './parcBrand';
	import BrandRule from './BrandRule.svelte';
	import ParcMark from './ParcMark.svelte';
	import SkyClouds from './SkyClouds.svelte';
	import LivingTexture from './LivingTexture.svelte';
	import SignalTexture from './SignalTexture.svelte';
	import ChatTexture from './ChatTexture.svelte';

	const headingId = $props.id();
</script>

<section use:reveal aria-labelledby={headingId} class="parc-sheet mb-section">
	<div
		class="grid grid-cols-1 gap-4 border-t border-[var(--color-border)] py-8 md:grid-cols-12 md:gap-0 md:py-10"
	>
		<h2 id={headingId} class="label-swiss md:col-span-3">Brand System</h2>
		<div class="md:col-span-9 md:col-start-4 lg:col-span-8">
			<p class="px px-xl">
				Same <span style:color={PARC.orange}>people</span>. Better
				<span style:color={PARC.blue}>brand</span>.
			</p>
			<p class="label-swiss data-swiss mt-4">
				Pixel Ape Rowboat Club · Brand System · v1.0 · Aug 2026
			</p>
		</div>
	</div>

	<BrandRule n="01" title="The Marks" color={PARC.green}>
		<p>
			Three marks, one construction: the box logo wide and square, and the oar badge. Same cell
			grid, same notched corners. The masters are merged paths, never loose squares. Clear space is
			two cells on every side.
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

	<BrandRule n="02" title="Color" color={PARC.orange}>
		<p>
			Five colors, no tints, no gradients. Each element gets one of them; the four-color cycling
			stays in the logo. Yellow never sets type on white. Web uses the hex values, print the CMYK
			builds.
		</p>
		<dl class="grid grid-cols-2 gap-x-1 gap-y-6 sm:grid-cols-5">
			{#each PARC_SWATCHES as s (s.name)}
				<div>
					<div
						class="panel aspect-[4/3] p-0"
						class:ring={s.name === 'White'}
						style:background={s.hex}
					></div>
					<dt class="mt-3 text-caption-size">{s.name}</dt>
					<dd class="data-swiss text-caption-size mt-1 whitespace-nowrap text-[var(--color-muted)]">
						{s.hex.toUpperCase()}<br />{s.cmyk}
					</dd>
				</div>
			{/each}
		</dl>
	</BrandRule>

	<BrandRule n="03" title="Type" color={PARC.green}>
		<p>
			PARC Pixel in three weights, Light, Regular and Bold, each in proportional and mono cuts.
			Light for supporting copy and captions, Regular for display, Bold for headlines. A plain
			grotesk only where long reading wins: documents, terms, body text in the UI.
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

	<BrandRule n="04" title="The Oar" color={PARC.blue}>
		<p>
			The secondary mark is one horizontal oar: the favicon, the badge, and the equals key in the
			fonts, so it drops into any line of pixel type as a divider.
		</p>
		<div class="panel" style:background={PARC.white} style:color={PARC.green}>
			<p class="panel-label">Live text. The equals key between the words draws the oar.</p>
			<p class="px px-xl" style:font-weight="700">PARC = CLUB</p>
		</div>
	</BrandRule>

	<BrandRule n="05" title="Backgrounds" color={PARC.orange}>
		<p>
			This was the part that took the longest. Plain type carried the specimens, but a graphic needs
			more than a layout grid to look alive. So every surface got a generated background: clouds
			drifting in hard steps, the hero scatter that twinkles and sparks under the cursor, CRT static
			for After Darc, chat bubbles for Discord. They add some life, nothing more. Reduced motion
			gets the still versions.
		</p>
		<div class="grid gap-4">
			<div>
				<p class="label-swiss data-swiss mb-2">Sky · the default ground</p>
				<div class="panel p-0"><SkyClouds /></div>
			</div>
			<div>
				<p class="label-swiss data-swiss mb-2">Hero · move, click</p>
				<div class="panel p-0"><LivingTexture /></div>
			</div>
			<div>
				<p class="label-swiss data-swiss mb-2">After Darc · move, click</p>
				<div class="panel p-0"><SignalTexture /></div>
			</div>
			<div>
				<p class="label-swiss data-swiss mb-2">Discord · move, click</p>
				<div class="panel p-0"><ChatTexture /></div>
			</div>
		</div>
	</BrandRule>
</section>

<style>
	/* PARC Pixel is declared once in parc-theme.css */
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
