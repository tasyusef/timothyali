<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import PillsDemo from './PillsDemo.svelte';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'Brand identity, design system, and front-end for Pocketwatch, a personal-finance app that puts budgeting, net worth, and investments in one place.';
</script>

<Seo
	title="Pocketwatch — Product & Brand Design"
	{description}
	ogKey="pocketwatch"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'Pocketwatch — Product & Brand Design',
		description,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		dateCreated: '2026-01-01',
		url: `${SITE_URL}/work/pocketwatch`,
		image: imageUrl('/images/pocketwatch/hero.png', SITE_URL)
	}}
/>

<CaseStudy
	title="Pocketwatch"
	category="Product, Brand & Art Direction"
	year="2026"
	role="Brand, Product Design & Front-End"
	timeline="Ongoing"
	tools="Figma, SvelteKit, Svelte 5, TypeScript, Tailwind CSS, Bits UI"
	heroImage="/images/pocketwatch/hero.png"
	heroAlt="Pocketwatch: all your money in one place. Dashboard with net worth, investments, and money agenda on electric lime"
	heroImage2="/images/pocketwatch/hero-invest.png"
	heroAlt2="Pocketwatch campaign: watch your investments move, live position tickers on violet"
	nextProject={getNextProject('pocketwatch')}
>
	{#snippet overview()}
		<p class="mb-4">
			Pocketwatch is a personal-finance app that puts budgeting, net worth, and investments in one
			place: &ldquo;Personal finance, one ledger.&rdquo; I led the brand, the design system, and the
			product design, and built the front end. My collaborator Chris owns the backend and business
			side. It&rsquo;s live at pocketwatch.io.
		</p>
		<ul class="space-y-2">
			<li>— Brand identity and a full design system</li>
			<li>— Product design across budgeting, net worth, and investments</li>
			<li>— Front end built in SvelteKit 2 / Svelte 5</li>
			<li>— A subscription product on the web, with a desktop app on the way</li>
		</ul>
	{/snippet}

	<TextSection title="Brand Identity">
		<p>
			Pocketwatch had to feel trustworthy enough to hold someone&rsquo;s whole financial life and
			warm enough that they open it every day. Most finance apps pick one side. The mark does both:
			a friendly, slightly odd little eyeball peeking out of a hemispherical pocket, drawn as a
			single confident shape. An eye on your money, in a pocket. It reads as approachable at
			app-icon size and serious in a nav bar. The wordmark is Satoshi: geometric, modern, no
			flourishes.
		</p>
		<p>
			The brand runs near-black ink on white with one accent, a citron green, and the mark carries
			the personality. It&rsquo;s a character you can live with in a tool you open every morning,
			not a logo that shouts.
		</p>
	</TextSection>

	<TextSection title="A Design System With No Brand Color">
		<p>
			The core decision was to give the app no brand color at all. The chrome is quiet, a cool
			neutral palette in the Linear / Stripe / Vercel register, because a finance app that colors
			its own interface competes with the one thing that matters: your money. So color comes from
			content. Every category is a pill, an emoji plus one of ten hues the user picks, and that is
			the only color a user adds to the interface. The few other accents mark meaning: gains,
			losses, warnings. The interface stays calm by default and turns colorful exactly where the
			user made it so.
		</p>
		<p>
			Everything routes through one tokens file for type, color, spacing, and motion, consumed by
			Tailwind and exposed as CSS variables, with a live design-system page that re-skins the whole
			app from one attribute. Type is a three-font system: Satoshi for display, Inter for UI and
			body, JetBrains Mono for every figure, because financial numbers must be tabular and
			monospaced to scan. Motion works the same way: one main ease-out, two springs for physical
			moves, six named durations, and a global reduced-motion override, so the whole product moves
			the same way everywhere instead of drifting component to component.
		</p>
	</TextSection>

	<PillsDemo />

	<TextSection title="Loud Outside, Quiet Inside">
		<p>
			The marketing layer inverts the app&rsquo;s restraint on purpose. The landing page, ads, and
			social campaign run loud: one saturated color per feature story, lime to violet to pink, with
			chunky condensed display type shouting &ldquo;Keep an eye on every dollar&rdquo;. An ad has to
			grab attention; the product never should. The same mascot and wordmark carry both registers,
			so the brand reads the same on a loud ad and in a quiet nav bar. Once you&rsquo;re inside, the
			color drops away and your money is the loudest thing on screen.
		</p>
	</TextSection>

	<TextSection title="One Ledger for Everything">
		<p>
			Most people run their financial life across three or four separate tools: a budgeting app, a
			banking app, a brokerage, a spreadsheet for net worth. Pocketwatch treats those as one
			picture, not four. It unifies a zero-based budget (every dollar assigned, with a
			Ready-to-Assign figure), a transaction ledger across cash and credit accounts, lots-based
			investment tracking, manual assets, and a net-worth view derived from all of it. The hard part
			was to make that much financial data feel browsable rather than like a tax form.
		</p>
		<p>
			The interface is as strict as YNAB but covers far more ground, and it&rsquo;s built to a
			production standard from the first screen: every list and table designed mobile-first, every
			loading, empty, and error state handled, every destructive action confirmed. I designed and
			built the front end in SvelteKit 2 and Svelte 5, using runes reactivity on a component system
			tuned to keep dense data calm. Chris built the backend in Express, Drizzle, and Postgres, and
			owns the business and legal side, so each of us could focus on his own half.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/pocketwatch/app-dashboard.png',
				alt: 'Pocketwatch dashboard: money agenda, composition, investments, wealth velocity, and cash flow'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/app-budget.png',
				alt: 'Pocketwatch budget: zero-based categories with Ready to Assign and monthly summary'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/app-accounts.png',
				alt: 'Pocketwatch accounts: one register for checking, cards, and brokerage trades'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/app-investments.png',
				alt: 'Pocketwatch investments: total return, portfolio value, allocation, and dividend income'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/app-networth.png',
				alt: 'Pocketwatch net worth: chart over time, goal pacing, and what moved it'
			}
		]}
	/>

	<TextSection title="Live">
		<p class="leading-body">
			Pocketwatch is live in production as a real subscription product: a 14-day free trial, then
			paid plans from $3.50 to $8 a month through Stripe, with two months free on annual billing. A
			desktop app is on the way.
		</p>
		<a
			href="https://pocketwatch.io/"
			target="_blank"
			rel="noopener noreferrer"
			class="label-swiss hover-swiss mt-4 inline-block underline underline-offset-4"
		>
			Visit pocketwatch.io &rarr;
		</a>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/pocketwatch/ad-both.png',
				alt: 'Pocketwatch campaign: budgeting and investing in one place, on electric lime'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/ad-networth.png',
				alt: 'Pocketwatch campaign: know exactly what you are worth, net worth tracking on sky blue'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/ad-invest.png',
				alt: 'Pocketwatch campaign: your portfolio, priced live, investments on violet'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/ad-budget.png',
				alt: 'Pocketwatch campaign: every dollar, accounted for, zero-based budget on orange'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/ad-ledger.png',
				alt: 'Pocketwatch campaign: every account in one place, unified ledger on mint green'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/ad-analytics.png',
				alt: 'Pocketwatch campaign: see where it all goes, category breakdown on pink'
			}
		]}
	/>

	<TextSection title="Outcome">
		<p>
			Pocketwatch is the rare personal project that shipped as real software. The product is built
			security-first: every route scoped to its owner, inputs validated, sessions revocable
			server-side, the standard a tool that handles real money demands. Privacy is a product
			feature, not a policy page. Bank connections are read-only, there are no passwords (sign-in
			uses passkeys, one-time email codes, or Google and Apple), and the business model is
			subscriptions, never data. What I&rsquo;m proudest of is the restraint: an all-in-one finance
			app is the kind of product that bloats into noise, and Pocketwatch stays quiet the deeper you
			go.
		</p>
	</TextSection>
</CaseStudy>
