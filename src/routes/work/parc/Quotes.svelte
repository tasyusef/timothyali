<script lang="ts">
	// What the community said when the rebrand went live, September 2026. Verbatim from
	// the PARC Discord and X, including the spelling. One paper card per person.
	import { reveal } from '$lib/actions/reveal';
	import PxCard from './PxCard.svelte';

	type Quote = {
		text: string;
		who: string;
		where: string;
		color: 'green' | 'orange' | 'blue' | 'yellow';
	};
	const BRAND_QUOTES: Quote[] = [
		{
			text: 'I know I like the new banner and logo',
			who: 'RedHotDankMoist',
			where: 'Discord',
			color: 'green'
		},
		{
			text: '@twocakeS these graphics is gas',
			who: 'DreamballerXRP',
			where: 'Discord',
			color: 'orange'
		},
		{
			text: 'Love it, great website update, looks amazing',
			who: '@BrandoWoodz',
			where: 'X',
			color: 'blue'
		},
		{ text: 'loOkn goOd', who: '@Uga589', where: 'X', color: 'yellow' }
	];

	let { title = 'The Reaction', quotes = BRAND_QUOTES }: { title?: string; quotes?: Quote[] } =
		$props();
	const headingId = $props.id();
</script>

<section use:reveal aria-labelledby={headingId} class="mb-section">
	<h2 id={headingId} class="parc-tag label-swiss">{title}</h2>
	<ul class="mt-6 grid gap-4 sm:grid-cols-2 md:gap-6" class:lg:grid-cols-4={quotes.length > 2}>
		{#each quotes as q (q.who)}
			<li>
				<PxCard color={q.color}>
					<figure class="flex h-full flex-col p-5 md:p-6">
						<blockquote class="quote heading-swiss flex-1 leading-tight">
							&ldquo;{q.text}&rdquo;
						</blockquote>
						<figcaption class="label-swiss mt-6 grid gap-1">
							<span class="who">{q.who}</span>
							<span class="data-swiss">{q.where} · Sep 3, 2026</span>
						</figcaption>
					</figure>
				</PxCard>
			</li>
		{/each}
	</ul>
</section>

<style>
	.quote {
		font-size: clamp(1.125rem, 1.5vw, 1.375rem);
	}
	.who {
		color: var(--card);
	}
</style>
