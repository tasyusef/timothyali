<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import LiveEmbed from '$lib/components/LiveEmbed.svelte';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'A real-time XRPL block explorer, analytics platform, and on-chain intelligence suite — designed and built from scratch, live at sondelab.com.';
</script>

<Seo
	title="Sonde — Product Design & Development"
	{description}
	ogKey="sonde"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'Sonde — Product Design & Development',
		description,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		dateCreated: '2026-01-01',
		url: `${SITE_URL}/work/sonde`,
		image: imageUrl('/images/sonde/hero.png', SITE_URL)
	}}
/>

<CaseStudy
	title="Sonde"
	category="Product Design & Development"
	year="2026"
	role="Designer & Developer (sole creator)"
	timeline="Ongoing"
	tools="Figma, Next.js, TypeScript, Tailwind CSS, Recharts, PostgreSQL, ClickHouse, Neo4j, WebSockets, SSE, Claude Haiku 4.5"
	nextProject={getNextProject('sonde')}
>
	{#snippet overview()}
		<p class="mb-4">
			A real-time block explorer, analytics platform, and on-chain intelligence suite for the XRP
			Ledger — self-initiated, designed and built from scratch. Running live at sondelab.com.
		</p>
		<ul class="space-y-2">
			<li>— Block explorer, network analytics, and a trading portfolio dashboard</li>
			<li>— Intelligence layer: smart money scoring, fund tracing, AI investigations</li>
			<li>— Polyglot data stack across three live XRPL WebSocket connections</li>
			<li>— Wallet-based auth and a live subscription product</li>
		</ul>
	{/snippet}

	<TextSection title="Design Philosophy">
		<p>
			Sonde started from a frustration: almost every blockchain explorer I used was dense, hostile,
			and ugly — grids of raw hex with nothing prioritized, as if opacity were a feature. A new user
			should land on an address and understand what they&rsquo;re looking at without feeling like
			they wandered into a terminal. The fix was to let type do the work. Blockchain data is
			inherently dense, so the hierarchy has to be rigorous — display type for context, body for
			narrative, monospace for every on-chain identifier, muted uppercase labels — and the page has
			to read before color is ever introduced. Color then works as reinforcement: one warm accent
			for what matters, never the primary signal.
		</p>
		<p>
			The product serves three users without compromising for any of them. The newcomer wants plain
			English — what does this account hold, is any of it unusual. The trader wants a real
			dashboard: P&amp;L, cost basis, allocation, performance versus XRP. The analyst wants depth —
			raw blobs, six-hop fund tracing, risk scoring. Every screen serves the newcomer at the surface
			while deeper tabs unfold for the specialist — progressive disclosure, not two different
			products — and the natural-language query layer is the bridge between them. Motion follows the
			same rule as color: eased transitions, slow pulses on live indicators, numbers that fade
			rather than snap. Most users never notice it; they just notice the product feels calm.
			That&rsquo;s the principle — less noise.
		</p>
	</TextSection>

	<TextSection title="Brand Identity">
		<p>
			The name comes first. Sonde — French for probe — is an instrument you send into something to
			measure what&rsquo;s happening inside and report back. The product does the same for the XRP
			Ledger: it goes in, takes measurements, and reports back in a way a human can act on. The
			color system is deliberately narrow — a cool slate foundation of near-black surfaces and muted
			neutrals, so the interface reads as calm even while showing ten thousand transactions a
			minute. Against that, one warm accent: salmon #E8856C, the only saturated color in the core
			chrome. That scarcity is the point. When salmon appears on a live indicator or a key metric,
			you know it matters.
		</p>
		<p>
			The type system runs three fonts with non-overlapping roles — Satoshi for display and
			headings, DM Sans for product UI and body, IBM Plex Mono for every address, hash, and amount,
			because financial identifiers have to be monospaced or they stop being scannable. Within that
			restrained palette, transaction types carry a quiet semantic color system: payments blue, DEX
			fills gold, NFT operations purple, trust lines green, AMM actions pink — always as small dots
			or single-word tags, never full colored rows. It lets a trained eye scan a thousand-row
			activity feed and spot the pattern without reading every line.
		</p>
	</TextSection>

	<TextSection title="The Product">
		<p>
			The XRP Ledger closes a ledger every 3–5 seconds, each carrying hundreds of transactions
			across dozens of types. The challenge was organizing that into pages that feel browsable
			rather than overwhelming. A universal search bar takes any input — an address, a transaction
			hash, a CTID, a ledger index, or a token name — detects the type, and routes accordingly.
			Account pages use progressive disclosure across twelve tabs (transactions, holdings, trust
			lines, NFTs, AMM pools, offers, escrows, and more), with React Suspense streaming each section
			independently so the page is usable before all data loads.
		</p>
		<p>
			The explorer spans network analytics — OHLCV candlesticks, live price and market cap, a fee
			monitor, transaction-type distribution, and amendment voting — the DEX with AMM liquidity
			across 60+ pools, a wallet-connected portfolio tracker (cost basis, realized PnL, performance
			versus XRP), and a directory of 1,000+ XRPL assets. On top sits the intelligence layer, which
			is what turns Sonde from an explorer into an analytical product. Smart money scoring ranks
			wallets by profitability and consistency; Neo4j pathfinding traces how value moved across up
			to six hops; account labels classify addresses with cited evidence; a risk module flags wash
			trading. A Claude Haiku 4.5 agent with scoped tool access runs multi-turn investigations
			across all of it — pulling trades, tracing flows, and generating structured risk reports in a
			single thread.
		</p>
	</TextSection>

	<TextSection title="Architecture">
		<p>
			Sonde is a polyglot persistence system — three databases, each chosen for what it&rsquo;s
			actually good at. Postgres handles OLTP: app data, sessions, subscriptions, wallet portfolios,
			smart money scores, account labels, and the hourly and daily aggregation tables. ClickHouse
			handles OLAP: the raw firehose of transactions, DEX fills, and trust line events, with
			materialized views rolling up volume and active accounts so dashboards hit pre-aggregated data
			instead of cold partitions. Neo4j handles graph: accounts as nodes, payments and trades as
			edges, making fund-tracing queries cheap in a way SQL can&rsquo;t match. Each data type has
			exactly one authoritative store, and cross-store queries resolve IDs in Postgres first, then
			filter the others.
		</p>
		<p>
			Three separate XRPL WebSocket connections keep the workloads isolated — one for user-facing
			requests, one for the ingestion pipeline&rsquo;s heavy fetches, one for background intel jobs
			— so a slow ingest can never block someone loading an account page. A server-side Live Data
			Manager fans real-time events out to clients over Server-Sent Events, layered behind an LRU
			cache and SWR on the client so pages never flash empty. Auth has no passwords and no emails:
			users sign in by proving they own a wallet — the client embeds a single-use nonce in a dummy
			transaction, and the server verifies the signature and issues a JWT. The commercial model is
			two tiers, Free and Pro ($9/mo or $79/yr), with Pro unlocking the portfolio suite and the full
			intelligence layer; managed AI runs on per-user limits, and power users can bring their own
			API key to bypass them.
		</p>
	</TextSection>

	<LiveEmbed
		label="Live Explorer"
		description="Explore the live Sonde block explorer and intelligence suite. Browse accounts, trace fund flows, run investigations, and see real-time on-chain data directly."
		href="https://sondelab.com/"
		src="https://sondelab.com/"
		title="Sonde XRPL Block Explorer"
	/>

	<TextSection title="Outcome">
		<p>
			Sonde runs in production at sondelab.com as a three-part product — a public block explorer, a
			network analytics suite, and an intelligence layer — on a polyglot data architecture with
			wallet-based auth and a subscription model that&rsquo;s live and taking payments in both fiat
			and crypto. What began as a design exercise in information density became a complete,
			commercially operating product: a real-time window into the XRP Ledger that treats on-chain
			data with the same clarity and structure as any well-designed financial tool.
		</p>
	</TextSection>
</CaseStudy>
