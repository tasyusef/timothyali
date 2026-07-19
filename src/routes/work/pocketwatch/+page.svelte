<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'Brand identity, design system, and front-end for Pocketwatch — an all-in-one personal finance app that unifies budgeting, net worth, and investments in one clean view.';
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
	category="Product & Brand Design"
	year="2026"
	role="Brand, Product Design & Front-End"
	timeline="Ongoing"
	tools="Figma, SvelteKit, Svelte 5, TypeScript, Tailwind CSS, Bits UI"
	heroImage="/images/pocketwatch/hero.png"
	heroAlt="Pocketwatch — all your money in one place. Dashboard with net worth, investments, and money agenda on electric lime"
	heroImage2="/images/pocketwatch/hero-invest.png"
	heroAlt2="Pocketwatch campaign — watch your investments move, live position tickers on violet"
	nextProject={getNextProject('pocketwatch')}
>
	{#snippet overview()}
		<p class="mb-4">
			Pocketwatch is a personal-finance app that puts budgeting, net worth, and investments in one
			place — &ldquo;everything that moves your money, in one ledger.&rdquo; I led the brand, the
			design system, and the product design, and built the front end; my collaborator Chris built
			the backend and runs the business side. It&rsquo;s live in production at pocketwatch.io.
		</p>
		<ul class="space-y-2">
			<li>— Brand identity and a full design system</li>
			<li>— Product design across budgeting, net worth, and investments</li>
			<li>— Front end built in SvelteKit 2 / Svelte 5</li>
			<li>— A live subscription product with a desktop app</li>
		</ul>
	{/snippet}

	<TextSection title="Brand Identity">
		<p>
			Pocketwatch had to feel trustworthy enough to hold someone&rsquo;s entire financial life and
			warm enough that they&rsquo;d actually open it every day — most finance apps land on one side
			or the other. The mark threads that needle: a friendly, slightly odd little creature built
			from a pocket-watch silhouette, drawn as a single confident shape and set in a soft dark
			squircle. It reads as approachable at app-icon size and serious in a nav bar. The wordmark is
			Satoshi — geometric, modern, no flourishes.
		</p>
		<p>
			The palette is deliberately warm-neutral and nearly monochrome — near-black ink on cream —
			with the mark doing the heavy lifting. It&rsquo;s a personality you can live with in a tool
			you check every morning, not a logo built to shout from a billboard.
		</p>
	</TextSection>

	<TextSection title="A Design System With No Brand Color">
		<p>
			The core design decision was to give the app no brand color at all. The chrome is
			intentionally quiet — a cool, neutral palette in the Linear / Stripe / Vercel register —
			because the moment a finance app starts coloring its own interface, it competes with the only
			thing that actually matters: your money. So color comes entirely from content. Every category
			is a pill — an emoji plus one of ten saturated hues the user picks — and those pills are the
			only saturated color anywhere in the UI. The interface stays calm by default and turns
			colorful exactly where the user made it so.
		</p>
		<p>
			Everything routes through a single source of truth: one tokens file for type, color, spacing,
			and motion, consumed by Tailwind and exposed as CSS variables, with a live design-system page
			that re-skins the entire app from one attribute. Type is a three-font system — Satoshi for
			display, Inter for UI and body, JetBrains Mono for every figure, because financial numbers
			have to be tabular and monospaced to scan. Motion is tokenized the same way: one workhorse
			ease-out, a small set of named durations, and a global reduced-motion override, so the whole
			product moves with one restrained vocabulary instead of drifting component to component.
		</p>
	</TextSection>

	<TextSection title="Loud Outside, Quiet Inside">
		<p>
			The marketing layer inverts the app&rsquo;s restraint on purpose. The landing page, ads, and
			social campaign run loud — one saturated color per feature story, lime to violet to pink, with
			chunky condensed display type shouting &ldquo;Keep an eye on every dollar&rdquo; — because
			acquisition needs stopping power the product itself should never have. The same mascot and
			wordmark carry both registers, so the brand stays recognizable whether it&rsquo;s a
			billboard-loud ad or a quiet nav bar. Once you&rsquo;re inside, the color disappears and your
			money is the loudest thing on screen.
		</p>
	</TextSection>

	<TextSection title="One Ledger for Everything">
		<p>
			Most people run their financial life across three or four disconnected tools — a budgeting
			app, a banking app, a brokerage, a spreadsheet for net worth. Pocketwatch&rsquo;s product
			thesis is that those are one picture, not four. It unifies a zero-based budget (every dollar
			assigned, with a Ready-to-Assign figure), a transaction ledger across cash and credit
			accounts, lots-based investment tracking, manual assets, and a net-worth view derived from all
			of it. The hard part was density without dread: it&rsquo;s a lot of financial data, and it has
			to feel browsable, not like a tax form.
		</p>
		<p>
			The interface borrows YNAB&rsquo;s rigor but covers far more ground, and it&rsquo;s built to a
			production standard from the first screen — every list and table designed mobile-first, every
			loading, empty, and error state handled, every destructive action confirmed. I designed and
			built the front end in SvelteKit 2 and Svelte 5, using its runes reactivity on a component
			system tuned to keep dense data calm. Chris built the backend — Express, Drizzle, Postgres —
			and owns the business and legal side, which let each of us go deep on our half.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/pocketwatch/app-dashboard.png',
				alt: 'Pocketwatch dashboard — money agenda, composition, investments, wealth velocity, and cash flow'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/app-budget.png',
				alt: 'Pocketwatch budget — zero-based categories with Ready to Assign and monthly summary'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/app-accounts.png',
				alt: 'Pocketwatch accounts — one register for checking, cards, and brokerage trades'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/app-investments.png',
				alt: 'Pocketwatch investments — total return, portfolio value, allocation, and dividend income'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/app-networth.png',
				alt: 'Pocketwatch net worth — over-time chart, goal pacing, and what moved it'
			}
		]}
	/>

	<TextSection title="Live">
		<p class="leading-body">
			Pocketwatch is live in production as a real subscription product — a 14-day free trial, then
			$5/month or $50/year through Stripe, with a desktop app alongside the web app.
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
				alt: 'Pocketwatch campaign — budgeting and investing in one place, electric lime'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/ad-networth.png',
				alt: 'Pocketwatch campaign — know exactly what you are worth, net worth tracking on sky blue'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/ad-invest.png',
				alt: 'Pocketwatch campaign — your portfolio, priced live, investments on violet'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/ad-budget.png',
				alt: 'Pocketwatch campaign — every dollar, accounted for, zero-based budget on orange'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/ad-ledger.png',
				alt: 'Pocketwatch campaign — every account in one place, unified ledger on mint green'
			},
			{
				type: 'image',
				src: '/images/pocketwatch/ad-analytics.png',
				alt: 'Pocketwatch campaign — see where it all goes, category breakdown on pink'
			}
		]}
	/>

	<TextSection title="Outcome">
		<p>
			Pocketwatch is the rare personal project that&rsquo;s genuinely shippable software: built
			security-first — every route scoped to its owner, inputs validated, sessions revocable
			server-side — to the standard a tool handling real money demands. Privacy is a product
			feature, not a policy page: financial data lives encrypted on the user&rsquo;s own device,
			bank connections are read-only, sign-in is passkey-based, and the business model is
			subscriptions — never data. What I&rsquo;m proudest of is the restraint. An all-in-one finance
			app is exactly the kind of product that bloats into noise; Pocketwatch stays quiet and lets
			your own money be the only thing on screen with any color.
		</p>
	</TextSection>
</CaseStudy>
