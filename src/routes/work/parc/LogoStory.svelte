<script lang="ts">
	// Before and after, side by side: the 2021 cartoon marks on white, the 2026 pixel marks
	// on the sky. Each side shows its primary and secondary mark with one caption.
	import Img from '$lib/components/Img.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { PARC, PARC_SKY } from './parcBrand';
	import ParcMark from './ParcMark.svelte';
</script>

<div use:reveal class="mb-section">
	<div class="gap-gallery grid grid-cols-1 md:grid-cols-2">
		<figure class="m-0">
			<div
				class="flex aspect-[4/3] flex-col items-center justify-center gap-6 overflow-hidden p-8 md:p-12"
				style:background={PARC.white}
			>
				<Img
					src="/images/parc/old-mascot.png"
					alt="The old PARC logo: a cartoon ape head with a wide grin and thick black outlines, a bubbly yellow PARC wordmark across the top"
					sizes="(min-width: 768px) 30vw, 60vw"
					class="min-h-0 w-auto flex-1 object-contain"
				/>
				<Img
					src="/images/parc/old-wordmark.png"
					alt="The old PARC secondary logo: the bubbly outlined wordmark in black"
					sizes="(min-width: 768px) 15vw, 30vw"
					class="h-[14%] w-auto shrink-0"
				/>
			</div>
			<figcaption class="grid grid-cols-1 gap-2 pt-4 sm:grid-cols-[auto_1fr] sm:gap-6">
				<span class="label-swiss data-swiss">Before · 2021</span>
				<span class="leading-body">
					A cartoon ape with thick outlines and a bubbly wordmark. Fine on its own, and nothing like
					the pixel art it sat next to.
				</span>
			</figcaption>
		</figure>
		<figure class="m-0">
			<div
				class="sky flex aspect-[4/3] flex-col items-center justify-center gap-8 p-8 md:p-12"
				style:--parc-sky={PARC_SKY}
			>
				<ParcMark variant="wide" label="The new PARC box logo" class="w-[78%]" />
				<div class="flex w-[78%] items-center justify-center gap-6">
					<ParcMark variant="square" label="The new PARC square lockup" class="w-[18%]" />
					<ParcMark variant="oar" label="The new PARC oar badge" class="w-[46%]" />
				</div>
			</div>
			<figcaption class="grid grid-cols-1 gap-2 pt-4 sm:grid-cols-[auto_1fr] sm:gap-6">
				<span class="label-swiss data-swiss">After · 2026</span>
				<span class="leading-body">
					The four letters drawn on the same 5&times;5 grid as the apes, on a white sign with
					notched corners. The brand and the art finally match.
				</span>
			</figcaption>
		</figure>
	</div>
</div>

<style>
	.sky {
		background:
			url('/parc/clouds-tile.png') 0 0 / 576px 384px,
			var(--parc-sky);
	}
</style>
