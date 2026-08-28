<script lang="ts">
	import ProjectIndex from '$lib/components/ProjectIndex.svelte';
	import ProjectBento from '$lib/components/ProjectBento.svelte';
	import Img from '$lib/components/Img.svelte';
	import HomeContactSheet from './HomeContactSheet.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { brandProjects, webProjects, passionProjects, type Project } from '$lib/projects';
	import type { HomeLayout } from './homeLayout';
	import type { BentoOverrides } from '$lib/components/ProjectBento.svelte';

	let { layout }: { layout: HomeLayout } = $props();

	// Dense-bento curation — more cards per band = shorter bands (band height
	// = width ÷ sum of aspects). An override replaces a project's own
	// bentoRow/bentoCol wholesale; Jade's solo card gets a wider (cropped) box
	// so it doesn't run ~875px tall.
	const DENSE: Record<string, BentoOverrides> = {
		brand: {
			firststrike: { row: 1 },
			xrpcafe: { row: 1 },
			firstledger: { row: 1 },
			'do-androids-dream': { row: 1 },
			gridform: { row: 1 }
		},
		web: { 'jade-aesthetics': { aspect: 2.5 } },
		passion: { pocketwatch: { row: 1 }, sonde: { row: 1 }, 'gridform-studio': { row: 1 } }
	};
</script>

{#snippet workSection(
	ariaLabel: string,
	label: string,
	projects: Project[],
	startIndex: number,
	dense: BentoOverrides
)}
	<section aria-label={ariaLabel} class="px-swiss" class:mt-section={startIndex > 0}>
		<div use:reveal>
			<p class="label-swiss mb-8">{label}</p>
		</div>

		{#if layout === 'hybrid'}
			{@const feature = projects[0]}
			<!-- One small aspect-true feature image so the section isn't type-only
			     before hover; the index row below repeats the project on purpose. -->
			<div use:reveal class="mb-8 hidden md:block">
				<a href="/work/{feature.slug}" class="hover-swiss inline-block">
					<div class="h-64 overflow-hidden lg:h-72">
						{#if feature.heroVideo}
							<video
								src={feature.heroVideo}
								autoplay
								loop
								muted
								playsinline
								aria-label={feature.title}
								class="h-full w-auto"
							></video>
						{:else}
							<Img
								src={feature.bentoImage ?? feature.heroImage}
								alt={feature.title}
								sizes="512px"
								class="h-full w-auto"
							/>
						{/if}
					</div>
				</a>
			</div>
		{:else if layout === 'bento' || layout === 'dense'}
			<div use:reveal class="hidden md:block">
				<ProjectBento {projects} {startIndex} overrides={layout === 'dense' ? dense : undefined} />
			</div>
		{:else if layout === 'sheet' || layout === 'combo'}
			<!-- 'combo' pairs the strip with the index rows below, so the strip
			     drops its captions — the rows carry the meta. -->
			<div use:reveal class="hidden md:block" class:mb-8={layout === 'combo'}>
				<HomeContactSheet {projects} {startIndex} captions={layout === 'sheet'} />
			</div>
		{/if}

		<!-- Index rows are part of the layout for 'index'/'hybrid'/'combo';
		     mobile fallback otherwise -->
		<div
			use:reveal
			class={layout === 'index' || layout === 'hybrid' || layout === 'combo' ? '' : 'md:hidden'}
		>
			<ProjectIndex {projects} {startIndex} />
		</div>
	</section>
{/snippet}

{@render workSection('Brand and motion work', 'Brand & Motion', brandProjects, 0, DENSE.brand)}
{@render workSection(
	'Web and product design work',
	'Web & Product Design',
	webProjects,
	brandProjects.length,
	DENSE.web
)}
{@render workSection(
	'Passion projects and open source',
	'Passion Projects & Open Source',
	passionProjects,
	brandProjects.length + webProjects.length,
	DENSE.passion
)}
