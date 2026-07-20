<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Img from '$lib/components/Img.svelte';
	import ProjectIndex from '$lib/components/ProjectIndex.svelte';
	import ProjectBento from '$lib/components/ProjectBento.svelte';
	import LocalTime from '$lib/components/LocalTime.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { designProjects, codeProjects } from '$lib/projects';
	import { posts } from '$lib/posts';
	import { SOCIAL_LINKS } from '$lib/site';
</script>

<Seo ogKey="home" />

<!-- Hero Section -->
<section aria-label="Introduction" class="px-swiss pt-[4vh] pb-[8vh] md:pt-[6vh] md:pb-[14vh]">
	<h1 class="sr-only">Timothy Ali: Product, Brand & Motion Designer</h1>
	<div class="entrance border-t border-[var(--color-border)] pt-6">
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

<!-- Selected Work — Design & Brand -->
<section aria-label="Design and brand work" class="px-swiss">
	<div use:reveal>
		<p class="label-swiss mb-8">Design &amp; Brand</p>
	</div>
	<div use:reveal class="hidden md:block">
		<ProjectBento projects={designProjects} />
	</div>
	<div use:reveal class="md:hidden">
		<ProjectIndex projects={designProjects} />
	</div>
</section>

<!-- Selected Work — Code & Product -->
<section aria-label="Code and product work" class="px-swiss mt-section">
	<div use:reveal>
		<p class="label-swiss mb-8">Code &amp; Product</p>
	</div>
	<div use:reveal class="hidden md:block">
		<ProjectBento projects={codeProjects} startIndex={designProjects.length} />
	</div>
	<div use:reveal class="md:hidden">
		<ProjectIndex projects={codeProjects} startIndex={designProjects.length} />
	</div>
</section>

<!-- About / Writing / Contact -->
<section aria-label="Quick Links" class="px-swiss border-t border-[var(--color-border)]">
	<div use:reveal>
		<div class="grid grid-cols-1 gap-px bg-[var(--color-border)] md:grid-cols-3">
			<a
				href="/about"
				class="group py-row flex flex-col gap-4 bg-[var(--color-background)] md:pr-8"
			>
				<p class="label-swiss">About</p>
				<p class="leading-body">
					I design product, brand, and motion for startups and tech companies, with a modernist,
					&ldquo;less noise&rdquo; approach to everything I make.
				</p>
				<span class="label-swiss hover-swiss mt-auto overflow-hidden">
					<span class="arrow-reveal arrow-reveal-lg">&rarr;</span>
				</span>
			</a>

			<a
				href="/blog/{posts[0].slug}"
				class="group py-row flex flex-col gap-4 border-t border-[var(--color-border)] bg-[var(--color-background)] md:border-t-0 md:px-8"
			>
				<p class="label-swiss">Latest Writing</p>
				<p class="leading-body">{posts[0].title}</p>
				<span class="label-swiss hover-swiss mt-auto overflow-hidden">
					<span class="arrow-reveal arrow-reveal-lg">Read full article &rarr;</span>
				</span>
			</a>

			<a
				href="/contact"
				class="group py-row flex flex-col gap-4 border-t border-[var(--color-border)] bg-[var(--color-background)] md:border-t-0 md:pl-8"
			>
				<p class="label-swiss">Contact</p>
				<p class="leading-body">
					I&rsquo;m open to full-time product design roles and select freelance projects.
					Let&rsquo;s talk.
				</p>
				<span class="label-swiss hover-swiss mt-auto overflow-hidden">
					<span class="arrow-reveal arrow-reveal-lg">Reach out &rarr;</span>
				</span>
			</a>
		</div>
	</div>
</section>
