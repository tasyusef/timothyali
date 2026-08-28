<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Img from '$lib/components/Img.svelte';
	import LocalTime from '$lib/components/LocalTime.svelte';
	import HomeWorkSections from './HomeWorkSections.svelte';
	import HomeLayoutSwitcher from './HomeLayoutSwitcher.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { posts } from '$lib/posts';
	import { SOCIAL_LINKS } from '$lib/site';
	import type { HomeLayout } from './homeLayout';

	// Homepage layout exploration — the dev-only switcher (bottom-left) flips
	// between candidate work-section layouts. The default here is what
	// production builds render.
	let layout = $state<HomeLayout>('combo');
</script>

<Seo ogKey="home" />

<!-- Hero Section -->
<!-- Top padding matches .page-wrapper (1.5rem / 2.5rem) so the hairline sits the
     same distance below the nav as every other page, and does not grow with
     viewport height the way the old vh value did. -->
<section aria-label="Introduction" class="px-swiss pb-section">
	<h1 class="sr-only">Timothy Ali: Product, Brand & Motion Designer</h1>
	<div class="entrance pt-6">
		<div class="grid grid-cols-2 gap-y-6 md:grid-cols-12">
			<div class="hidden md:col-span-3 md:block">
				<div class="aspect-[3/4] w-1/2 overflow-hidden">
					<Img
						src="/images/about/headshot.jpg"
						alt="Timothy Ali"
						sizes="8vw"
						eager
						class="h-full w-full object-cover object-[center_80%]"
					/>
				</div>
			</div>
			<div class="md:col-span-2 md:col-start-5">
				<p class="label-swiss mb-2">Discipline</p>
				<p class="leading-body">Product</p>
				<p class="leading-body">Brand</p>
				<p class="leading-body">Motion</p>
				<p class="leading-body">Front-End</p>
			</div>
			<div class="md:col-span-2 md:col-start-7">
				<p class="label-swiss mb-2">Experience</p>
				<p class="leading-body">Since 2019</p>
			</div>
			<div class="md:col-span-2 md:col-start-9">
				<p class="label-swiss mb-2">Location / Time</p>
				<p class="leading-body">Denver, CO</p>
				<p class="leading-body text-caption-size"><LocalTime /></p>
			</div>
			<div class="md:col-span-2 md:col-start-11">
				<p class="label-swiss mb-2">Connect</p>
				<div class="flex flex-col gap-1">
					{#each SOCIAL_LINKS as link (link.label)}
						<a
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							class="group/link leading-body hover-swiss flex items-center gap-2"
						>
							{link.label}
							<span class="arrow-reveal arrow-reveal-sm">&rarr;</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Work sections — layout picked by the dev switcher below -->
<HomeWorkSections {layout} />

{#if import.meta.env.DEV}
	<HomeLayoutSwitcher bind:layout />
{/if}

<!-- About / Writing -->
<section aria-label="Quick Links" class="px-swiss border-t border-[var(--color-border)]">
	<div use:reveal>
		<div class="grid grid-cols-1 gap-px bg-[var(--color-border)] md:grid-cols-2">
			<a
				href="/about"
				class="group py-row flex flex-col gap-4 bg-[var(--color-background)] md:pr-8"
			>
				<p class="label-swiss">About</p>
				<p class="leading-body">
					I&rsquo;m a designer and a builder, taking work from ideation to production: brand,
					product, motion, and front end.
				</p>
				<span class="label-swiss hover-swiss mt-auto overflow-hidden">
					<span class="arrow-reveal arrow-reveal-lg">&rarr;</span>
				</span>
			</a>

			<a
				href="/blog/{posts[0].slug}"
				class="group py-row flex flex-col gap-4 border-t border-[var(--color-border)] bg-[var(--color-background)] md:border-t-0 md:pl-8"
			>
				<p class="label-swiss">Latest Writing</p>
				<p class="leading-body">{posts[0].title}</p>
				<span class="label-swiss hover-swiss mt-auto overflow-hidden">
					<span class="arrow-reveal arrow-reveal-lg">Read full article &rarr;</span>
				</span>
			</a>
		</div>
	</div>
</section>
