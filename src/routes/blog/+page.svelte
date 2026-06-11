<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { posts, formatDate } from '$lib/posts';
</script>

<Seo
	title="Writing"
	description="Writing by Timothy Ali on design systems, AI-assisted workflows, and modernist design principles."
	ogKey="blog"
/>

<section class="page-wrapper">
	<h1 class="sr-only">Writing by Timothy Ali — Design Systems, Brand & AI-Assisted Work</h1>
	<!-- Header row -->
	<div
		class="entrance pb-row grid grid-cols-1 border-b border-[var(--color-border)] md:grid-cols-12"
	>
		<p class="label-swiss md:col-span-3" aria-hidden="true">Writing</p>
	</div>

	<!-- Posts -->
	{#each posts as post, index (post.slug)}
		<div class="entrance" style:--entrance-delay="{(index + 1) * 100}ms">
			<a
				href="/blog/{post.slug}"
				class="group hover-swiss block border-b border-[var(--color-border)]"
			>
				<div class="py-row grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-0">
					<div class="md:col-span-3">
						<p class="label-swiss">{formatDate(post.date)}</p>
					</div>
					<div class="md:col-span-5 md:col-start-7">
						<h2 class="heading-swiss text-subhead">{post.title}</h2>
						<p class="leading-body text-caption-size mt-3">{post.excerpt}</p>
					</div>
				</div>
			</a>
		</div>
	{/each}
</section>
