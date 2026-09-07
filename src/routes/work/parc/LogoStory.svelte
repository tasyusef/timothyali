<script lang="ts">
	// Before and after as two paper cards: the 2021 cartoon marks on white, the 2026
	// pixel marks on the sky. Each card shows its primary and secondary mark with one
	// caption on the card body.
	import Img from '$lib/components/Img.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { PARC, PARC_SKY } from './parcBrand';
	import ParcMark from './ParcMark.svelte';
	import PxCard from './PxCard.svelte';
</script>

<div use:reveal class="mb-section grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
	<PxCard color="orange">
		<figure class="m-0 flex h-full flex-col">
			<div
				class="flex aspect-[4/3] flex-col items-center justify-center gap-6 overflow-hidden p-8 md:p-12"
				style:background={PARC.white}
			>
				<Img
					src="/images/parc/old-mascot.png"
					alt="The old PARC logo: a cartoon ape head with a wide grin and thick black outlines, a bubbly yellow PARC wordmark across the top"
					sizes="(min-width: 768px) 30vw, 60vw"
					class="h-auto w-[32%]"
				/>
				<Img
					src="/images/parc/old-wordmark.png"
					alt="The old PARC secondary logo: the bubbly outlined wordmark in black"
					sizes="(min-width: 768px) 20vw, 40vw"
					class="h-auto w-[36%] shrink-0"
				/>
			</div>
			<figcaption class="grid gap-2 p-5 md:p-6">
				<span class="label-swiss data-swiss who">Before · 2021</span>
				<span class="leading-body">
					A cartoon ape with thick outlines and a bubbly wordmark. Fine on its own, and nothing like
					the pixel art it sat next to.
				</span>
			</figcaption>
		</figure>
	</PxCard>
	<PxCard color="green">
		<figure class="m-0 flex h-full flex-col">
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
			<figcaption class="grid gap-2 p-5 md:p-6">
				<span class="label-swiss data-swiss who">After · 2026</span>
				<span class="leading-body">
					The four letters drawn on the same 5&times;5 grid as the apes, on a white sign with
					notched corners. The brand and the art finally match.
				</span>
			</figcaption>
		</figure>
	</PxCard>
</div>

<style>
	.sky {
		background:
			url('/parc/clouds-tile.png') 0 0 / 576px 384px,
			var(--parc-sky);
	}
	.who {
		color: var(--card);
	}
</style>
