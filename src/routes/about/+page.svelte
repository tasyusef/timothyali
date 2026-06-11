<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Img from '$lib/components/Img.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { SOCIAL_LINKS, PERSON_ENTITY, SITE_URL } from '$lib/site';

	const capabilities = [
		'Product Design',
		'Brand Design',
		'Layout Design',
		'Motion Design',
		'Web Design',
		'User Experience',
		'Interaction Design'
	];

	const tools = ['Figma', 'Adobe Creative Suite', 'Framer', 'Claude Code'];

	const experience = [
		{
			period: '2019 — Now',
			org: 'Freelance',
			role: 'Graphic Designer',
			summary:
				'Created brand identities, miscellaneous graphics, and designed apps and websites for startups and local businesses including med-spas, gyms, and online communities.'
		},
		{
			period: '2021 — Now',
			org: 'xrp.cafe',
			role: 'Founding Graphic Designer',
			summary:
				"Led the development of xrp.cafe's brand identity and design system, producing website wireframes, event collateral, motion graphics, and 10+ social campaigns that grew the community to 29,000+ members, helped raise $32K for St. Jude's, and over $5 million USD in revenue."
		},
		{
			period: '2024 — 2025',
			org: 'firstledger.net',
			role: 'Senior Brand Designer',
			summary:
				'Designed and led the visual identity system for First Ledger, delivering animated promotional campaigns and social content that grew the audience to 42,000+ followers while supporting a platform that has surpassed $1B in trading volume.'
		},
		{
			period: '2025 — Now',
			org: 'firststrike research',
			role: 'Brand Designer',
			summary:
				'Developed a high-contrast brand identity and product design for FirstStrike Research, a veteran-owned financial platform. Designed a responsive web application featuring real-time market dashboards, AI-driven analysis, portfolio tracking with P&L visualization, and prediction market trading — empowering everyday investors with institutional-grade research tools.'
		},
		{
			period: '2025 — 2026',
			org: 'Jade Aesthetics',
			role: 'Designer & Developer',
			summary:
				'Designed and developed two complete websites for a premium medical spa — an initial Framer launch followed by a 30+ page SEO-architected Next.js application with perfect Lighthouse accessibility scores and server-side rendering.'
		},
		{
			period: '2026 — Now',
			org: 'Sonde',
			role: 'Designer & Developer',
			summary:
				'Designed and built a real-time XRPL block explorer with live WebSocket data streaming, account and transaction exploration, and a typographically driven dark-mode interface — from brand identity through full-stack development.'
		}
	];

	// Alternating cell padding for the 3-column experience grid
	const cellPad = ['md:pr-6', 'md:px-6', 'md:pl-6'];
</script>

<Seo
	title="About"
	description="Timothy Ali is a designer working across product, brand, and motion — designing and building products, brand systems, and websites for startups and tech companies."
	ogKey="about"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		url: `${SITE_URL}/about`,
		mainEntity: PERSON_ENTITY
	}}
/>

<div class="page-wrapper">
	<h1 class="sr-only">About Timothy Ali — Product, Brand & Motion Designer in Denver</h1>
	<!-- Header row -->
	<div
		class="entrance pb-row grid grid-cols-1 border-b border-[var(--color-border)] md:grid-cols-12"
	>
		<p class="label-swiss md:col-span-3" aria-hidden="true">About</p>
	</div>

	<!-- Bio + Photo -->
	<div
		class="entrance grid grid-cols-1 gap-8 pt-[4vh] pb-[8vh] md:grid-cols-12 md:gap-0 md:pt-[6vh] md:pb-[14vh]"
		style:--entrance-delay="100ms"
	>
		<div class="md:col-span-5 md:col-start-1">
			<div class="aspect-[3/4] w-2/3 overflow-hidden sm:w-1/2">
				<Img
					src="/images/about/headshot.jpg"
					alt="Timothy Ali"
					sizes="(max-width: 768px) 50vw, 20vw"
					eager
					class="h-full w-full object-cover object-[center_80%]"
				/>
			</div>
		</div>
		<div class="md:col-span-5 md:col-start-7">
			<div class="leading-body space-y-6">
				<p>
					I&rsquo;m a designer working across product, brand, and motion. I design and build
					products, brand systems, and websites for startups and tech companies — from early-stage
					to growth.
				</p>
				<p>
					Most recently I designed and built Sonde, a real-time XRPL block explorer — handling
					everything from brand identity through full-stack development. Before that I worked with
					FirstStrike Research, crypto projects like xrp.cafe and First Ledger, and freelance work
					spanning luxury med spas, gyms, online communities, and esports teams.
				</p>
				<p>
					I bring a modernist, &ldquo;less noise&rdquo; approach to everything I make — rooted in
					Swiss design principles: clarity, structure, and purpose.
				</p>
				<p>
					I&rsquo;m fascinated by AI and how it&rsquo;s reshaping creative work. I use Claude Code
					every day — not as a shortcut, but as a way to close the gap between idea and execution.
					Whether it&rsquo;s accelerating a prototype, writing production code, or pressure-testing
					a design decision, I&rsquo;m always exploring new ways to integrate AI into my process.
				</p>
				<p>Based in Denver, Colorado. Open to full-time opportunities and freelance projects.</p>
			</div>
			<div class="mt-8 flex flex-wrap gap-6">
				{#each SOCIAL_LINKS as link (link.label)}
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						class="label-swiss duration-fast ease-swiss underline underline-offset-4 transition-colors hover:text-[var(--color-foreground)]"
					>
						{link.label}
					</a>
				{/each}
			</div>
		</div>
	</div>

	<!-- Capabilities -->
	<div use:reveal>
		<div class="py-row grid grid-cols-1 border-t border-[var(--color-border)] md:grid-cols-12">
			<p class="label-swiss mb-4 md:col-span-3 md:mb-0">Capabilities</p>
			<div class="md:col-span-5 md:col-start-7">
				{#each capabilities as skill (skill)}
					<p class="leading-body">{skill}</p>
				{/each}
			</div>
		</div>
	</div>

	<!-- Tools -->
	<div use:reveal>
		<div class="py-row grid grid-cols-1 border-t border-[var(--color-border)] md:grid-cols-12">
			<p class="label-swiss mb-4 md:col-span-3 md:mb-0">Tools</p>
			<div class="md:col-span-5 md:col-start-7">
				{#each tools as tool (tool)}
					<p class="leading-body">{tool}</p>
				{/each}
			</div>
		</div>
	</div>

	<!-- Location -->
	<div use:reveal>
		<div class="py-row grid grid-cols-1 border-t border-[var(--color-border)] md:grid-cols-12">
			<p class="label-swiss mb-4 md:col-span-3 md:mb-0">Location</p>
			<div class="md:col-span-5 md:col-start-7">
				<p class="leading-body">Denver, Colorado</p>
			</div>
		</div>
	</div>

	<!-- Status -->
	<div use:reveal>
		<div
			class="py-row grid grid-cols-1 border-t border-b border-[var(--color-border)] md:grid-cols-12"
		>
			<p class="label-swiss mb-4 md:col-span-3 md:mb-0">Status</p>
			<div class="md:col-span-5 md:col-start-7">
				<p class="leading-body">Available for new projects</p>
			</div>
		</div>
	</div>

	<!-- Timeline -->
	<div use:reveal>
		<div class="py-row border-t border-[var(--color-border)]">
			<h2 id="experience-heading" class="label-swiss mb-8">Experience</h2>
			<dl
				aria-labelledby="experience-heading"
				class="grid grid-cols-1 gap-px bg-[var(--color-border)] md:grid-cols-3"
			>
				{#each experience as job, i (job.org)}
					<div
						class="flex flex-col gap-3 bg-[var(--color-background)] py-4 md:py-6 {cellPad[i % 3]}"
					>
						<dt class="label-swiss">{job.period}</dt>
						<dd class="leading-body text-subhead">{job.org}</dd>
						<dd class="label-swiss">{job.role}</dd>
						<dd class="leading-body text-caption-size mt-auto">{job.summary}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</div>
