<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Img from '$lib/components/Img.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { SOCIAL_LINKS, PERSON_ENTITY, SITE_URL } from '$lib/site';

	const capabilities = [
		'Product Design',
		'Brand Design',
		'Motion Design',
		'Interaction Design',
		'Web Design',
		'Front-End Development'
	];

	const tools = [
		'Figma',
		'Adobe Creative Suite',
		'Framer',
		'Claude Code',
		'Codex',
		'Svelte',
		'React',
		'TypeScript'
	];

	const experience = [
		{
			period: '2019 — Now',
			org: 'Freelance',
			role: 'Graphic Designer',
			summary:
				'Built brand identities, graphics, apps, and websites for startups and local businesses, including med-spas, gyms, and online communities.'
		},
		{
			period: '2021 — 2024',
			org: 'xrp.cafe',
			role: 'Cofounder & Founding Designer',
			summary:
				"Cofounded xrp.cafe and built its brand identity and design system: website wireframes, event collateral, motion graphics, and 10+ social campaigns that grew the community to 29,000+ members, helped raise $32K for St. Jude's, and brought in over $5 million USD in revenue."
		},
		{
			period: '2024 — 2025',
			org: 'firstledger.net',
			role: 'Senior Brand Designer',
			summary:
				'Designed and led the visual identity system for First Ledger. Animated campaigns and social content grew the audience to 42,000+ followers while the platform passed $1B in trading volume.'
		},
		{
			period: '2025 — Now',
			org: 'FirstStrike Research',
			role: 'Brand Designer',
			summary:
				'Built a high-contrast, retro-inspired brand identity for FirstStrike Research, a veteran-owned financial research company: wordmark, color system, typography, and brand guidelines applied across web, social, and print.'
		},
		{
			period: '2025 — 2026',
			org: 'Jade Aesthetics',
			role: 'Designer & Developer',
			summary:
				'Designed and built two complete websites for a premium medical spa: a first launch in Framer, then a 30+ page SEO-architected Next.js application with 100 Lighthouse accessibility scores and server-side rendering.'
		},
		{
			period: '2025 — 2026',
			org: 'Sonde',
			role: 'Personal Project: Designer & Developer',
			summary:
				'Designed and built a real-time XRPL block explorer, from brand identity through full-stack development: live WebSocket data streaming, account and transaction exploration, and a typographically driven dark-mode interface.'
		},
		{
			period: '2026 — Now',
			org: 'Pocketwatch',
			role: 'Cofounder & Chief Design Officer',
			summary:
				'Cofounded Pocketwatch, a subscription personal-finance app, with one engineering partner. Designed the brand, design system, and product, and built the front end in SvelteKit. Live at pocketwatch.io with paying subscribers.'
		},
		{
			period: '2026 — Now',
			org: 'DOMOTO',
			role: 'Digital Designer (Contract)',
			summary:
				'Designing and building a multi-brand design-system platform, coded in JavaScript, that gives client companies one home for their living design systems, components, and tokens. Built AI-native, so agents can read design tokens, components, and brand assets programmatically. Serving publicly traded and Fortune 500 clients.'
		}
	];

	// Alternating cell padding for the 3-column experience grid
	const cellPad = ['md:pr-6', 'md:px-6', 'md:pl-6'];
</script>

<Seo
	title="About"
	description="Timothy Ali is a designer and builder: brand, product, and motion design carried through to production code. Based in Denver, open to product design roles."
	ogKey="about"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		url: `${SITE_URL}/about`,
		mainEntity: PERSON_ENTITY
	}}
/>

<div class="page-wrapper">
	<h1 class="sr-only">About Timothy Ali, UX & Product Designer in Denver</h1>
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
					I&rsquo;m a designer and a builder. I take work from first sketch to production code:
					brand, product, motion, front end. Nothing I design stays a mockup: a finance app with
					paying subscribers, a real-time block explorer, a 30-page Next.js site, this portfolio.
				</p>
				<p>
					I learned that way of working early. In 2021 I cofounded xrp.cafe, an NFT marketplace, and
					ran its brand through design school while it grew past 29,000 members and $5 million in
					sales. Today I&rsquo;m building Pocketwatch, a personal-finance app where I own the brand,
					the product design, and the front end.
				</p>
				<p>
					My foundations are Swiss modernist: clarity, structure, purpose. That training shapes how
					I work, not how everything I make looks. Each project gets the voice it calls for, quiet
					restraint or loud color.
				</p>
				<p>
					I use Claude Code every day. It shortens the path from idea to working product, so I test
					design decisions in real code instead of static mockups.
				</p>
				<p>
					Based in Denver, Colorado. Open to full-time product design roles and select freelance
					projects.
				</p>
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

	<!-- Education -->
	<div use:reveal>
		<div class="py-row grid grid-cols-1 border-t border-[var(--color-border)] md:grid-cols-12">
			<p class="label-swiss mb-4 md:col-span-3 md:mb-0">Education</p>
			<div class="md:col-span-5 md:col-start-7">
				<p class="leading-body">BFA, Graphic Design</p>
				<p class="leading-body">Rocky Mountain College of Art + Design, 2022–2025</p>
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
				{#if experience.length % 3 !== 0}
					<div
						class="hidden bg-[var(--color-background)] md:block {experience.length % 3 === 1
							? 'md:col-span-2'
							: ''}"
						aria-hidden="true"
					></div>
				{/if}
			</dl>
		</div>
	</div>
</div>
