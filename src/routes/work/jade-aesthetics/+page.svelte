<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import LiveEmbed from '$lib/components/LiveEmbed.svelte';
	import ResultsList from '$lib/components/ResultsList.svelte';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'Two complete websites for a premium medical spa in Wheaton, IL — a Framer launch site, then a 30+ page SEO-architected Next.js application. One design language, two builds.';
</script>

<Seo
	title="Jade Aesthetics — Web Design & Development"
	{description}
	ogKey="jade-aesthetics"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'Jade Aesthetics — Web Design & Development',
		description,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		dateCreated: '2025-01-01',
		url: `${SITE_URL}/work/jade-aesthetics`,
		image: imageUrl('/images/jade-aesthetics/desktop-homepage-fold.jpg', SITE_URL)
	}}
/>

<CaseStudy
	title="Jade Aesthetics"
	category="Web Design & Development"
	year="2025–2026"
	role="Designer & Developer"
	timeline="~4 months (two phases)"
	tools="Framer (V1), Next.js, Tailwind CSS, Vercel, Claude Code (V2)"
	nextProject={getNextProject('jade-aesthetics')}
>
	{#snippet overview()}
		<p class="mb-4">
			Jade Aesthetics is a premium medical spa in Wheaton, Illinois — facials, injectables, body
			contouring, and wellness treatments. I built their entire web presence twice. The first
			version was a Framer site that launched the brand online, with a visual identity I developed
			from nothing but an existing logo. When the business outgrew the platform, I rebuilt
			everything as a server-rendered Next.js application: 30+ pages, structured data on every
			route, and a content architecture designed for long-term SEO growth.
		</p>
		<ul class="space-y-2">
			<li>— Full digital design language, developed from a single logo mark</li>
			<li>— V1: Framer launch site</li>
			<li>— V2: 30+ page Next.js application, SEO-first architecture</li>
		</ul>
	{/snippet}

	<TextSection title="Version One — Launch">
		<p>
			The practice came to me with a logo and nothing else. I developed the entire digital design
			language around it — jade greens, warm golds, cream backgrounds, and the Dream Avenue serif —
			to carry the warmth and clinical trust of the physical space onto a screen. The goal was for a
			visitor to feel the quality of the treatment rooms before reading a single word.
		</p>
		<p>
			Built in Framer, V1 did exactly what a launch site should: it gave the brand a polished home,
			a clear picture of the services and philosophy, and a fast path from zero to live.
		</p>
	</TextSection>

	<TextSection title="The Ceiling">
		<p>
			Framer was the right tool to launch on and the wrong one to grow on. No semantic HTML meant
			screen readers and search engines struggled to parse the content; no structured data, no
			sitemap control, and minimal indexable copy left Google almost nothing to rank. For a local
			med spa competing in DuPage County on high-intent searches like &ldquo;Botox Wheaton
			IL,&rdquo; that invisibility had a price measured in bookings.
		</p>
		<p>
			The content model was the other wall. Jade offers dozens of individual treatments, and each
			one deserves its own optimized page — its own entry point from search. A visual editor
			isn&rsquo;t built for that kind of scale. The business needed an architecture where one
			service means one page, indefinitely.
		</p>
	</TextSection>

	<TextSection title="Version Two — Built to Be Found">
		<p>
			I rebuilt the site as a Next.js application — App Router, Tailwind CSS, server-side rendering
			throughout, so every page delivers full HTML with no client-side dependency for content. The
			architecture is SEO-first: unique metadata on every route, JSON-LD structured data
			(MedicalBusiness, MedicalProcedure, FAQPage), auto-generated sitemaps, and breadcrumb
			navigation with schema markup.
		</p>
		<p>
			The site ships over 30 pages: a content-rich homepage, four service category pages, 16
			individual treatment pages, product pages for two skincare lines, team bios, FAQ, financing,
			blog infrastructure, and contact. Every treatment page follows one template — what it is, who
			it&rsquo;s for, what to expect, results and recovery, localized FAQs — so each procedure gives
			Google rich, indexable content and gives a nervous first-time patient real answers.
		</p>
	</TextSection>

	<TextSection title="One Language, Two Systems">
		<p>
			Nothing visual was thrown away in the rebuild — the design language survived the platform.
			What changed is how it&rsquo;s enforced. Page-level decisions made by hand in Framer became a
			component system in Next.js: service cards, FAQ accordions, testimonial carousels, and CTA
			blocks built once and reused everywhere, with consistent spacing and hierarchy baked in. The
			identity I created on day one now lives in an architecture that keeps it consistent across 30+
			pages and whatever the practice adds next.
		</p>
	</TextSection>

	<TextSection title="Process">
		<p>
			V2 was built almost entirely with Claude Code. I directed the design decisions, content
			strategy, and architecture; Claude handled implementation at speed — scaffolding the
			application, generating the SEO infrastructure, writing schemas, and templating content across
			30+ pages. Work that reads like weeks of templating compressed into days, without ceding a
			single design decision.
		</p>
	</TextSection>

	<LiveEmbed
		label="Live Site"
		description="The current Jade Aesthetics website — V2, built on Next.js. Browse the full service catalog, team page, and SEO-optimized content architecture."
		href="https://www.jadeaesthetics.co/"
		src="https://www.jadeaesthetics.co/"
		title="Jade Aesthetics Website — Version Two"
	/>

	<ResultsList
		items={[
			'Two complete websites designed and built from scratch for a single client',
			'30+ pages of SEO-optimized content across services, products, and blog infrastructure',
			'Perfect 100 Lighthouse accessibility score',
			'Structured data (JSON-LD) on every route — MedicalBusiness, MedicalProcedure, FAQPage, and BreadcrumbList schemas',
			'Server-rendered Next.js application with zero client-side content dependencies',
			'URL redirect strategy preserving all search equity through the V1-to-V2 migration',
			'V2 built and launched in approximately 2 months using Claude Code'
		]}
	/>

	<TextSection title="Outcome">
		<p>
			Jade Aesthetics now has a website built to the same standard as the experience inside the
			treatment rooms. Every procedure has its own optimized page — its own front door from Google —
			and the server-rendered infrastructure means the site is fast, accessible, and compounding
			organic traffic over time. Two builds, one vision.
		</p>
	</TextSection>
</CaseStudy>
