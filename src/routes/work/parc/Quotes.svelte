<script lang="ts">
	// What the community said when the rebrand went live, September 2026. Verbatim from
	// the PARC Discord and X, including the spelling.
	import { reveal } from '$lib/actions/reveal';

	const headingId = $props.id();
	const quotes = [
		{ text: 'I know I like the new banner and logo', who: 'RedHotDankMoist', where: 'Discord' },
		{ text: '@twocakeS these graphics is gas', who: 'DreamballerXRP', where: 'Discord' },
		{ text: 'Love it, great website update, looks amazing', who: '@BrandoWoodz', where: 'X' },
		{ text: 'loOkn goOd', who: '@Uga589', where: 'X' }
	];
</script>

<section
	use:reveal
	aria-labelledby={headingId}
	class="grid grid-cols-1 gap-4 border-t border-[var(--color-border)] py-8 md:grid-cols-12 md:gap-0 md:py-10"
>
	<h2 id={headingId} class="label-swiss md:col-span-3">The Reaction</h2>
	<ul class="grid gap-6 sm:grid-cols-2 md:col-span-9 md:col-start-4 lg:col-span-8">
		{#each quotes as q (q.who)}
			<li>
				<figure>
					<blockquote class="text-subhead heading-swiss leading-tight">
						&ldquo;{q.text}&rdquo;
					</blockquote>
					<figcaption class="label-swiss mt-3">
						{q.who} <span class="data-swiss">· {q.where} · Sep 3, 2026</span>
					</figcaption>
				</figure>
			</li>
		{/each}
	</ul>
</section>
