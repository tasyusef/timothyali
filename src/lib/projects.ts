export interface ProjectImage {
	src: string;
	aspect: number; // width / height
	alt: string;
}

export interface ProjectStat {
	label: string;
	value: string;
}

export interface Project {
	slug: string;
	title: string;
	/** Homepage grouping — design/brand work vs code-focused product work */
	section: 'design' | 'code';
	category: string;
	year: string;
	heroImage: string;
	heroVideo?: string;
	heroAspect: number; // width / height of the hero media shown in preview cards
	/** Bento row grouping (desktop) — consecutive projects sharing a row number
	    render in one aspect-justified band: column widths are proportional to
	    each card's media aspect, so every card in the band is equal height with
	    zero cropping. */
	bentoRow?: number;
	/** Within a band, consecutive projects sharing a bentoCol stack vertically
	    in one column (e.g. Sonde + Jade beside the Pocketwatch feature). */
	bentoCol?: number;
	/** Optional media override for the bento card when the case-study hero
	    doesn't suit the tile (e.g. Pocketwatch's square hero → landscape ad). */
	bentoImage?: string;
	bentoAspect?: number;
	videos?: string[];
	images: ProjectImage[];
	stats?: ProjectStat[];
	description: string;
}

export const projects: Project[] = [
	{
		slug: 'pocketwatch',
		bentoRow: 1,
		bentoImage: '/images/pocketwatch/ad-both.png',
		bentoAspect: 1200 / 628,
		title: 'Pocketwatch',
		section: 'code',
		category: 'Product, Brand & Art Direction',
		year: '2026',
		heroImage: '/images/pocketwatch/hero.png',
		heroAspect: 1,
		images: [
			{
				src: '/images/pocketwatch/hero.png',
				aspect: 1,
				alt: 'Pocketwatch — all your money in one place. Dashboard with net worth, investments, and money agenda on electric lime'
			},
			{
				src: '/images/pocketwatch/app-dashboard.png',
				aspect: 2880 / 2020,
				alt: 'Pocketwatch dashboard: money agenda, composition, investments, wealth velocity, and cash flow'
			},
			{
				src: '/images/pocketwatch/app-investments.png',
				aspect: 2880 / 2214,
				alt: 'Pocketwatch investments: total return, portfolio value, allocation, and dividend income'
			},
			{
				src: '/images/pocketwatch/ad-both.png',
				aspect: 1200 / 628,
				alt: 'Pocketwatch campaign: budgeting and investing in one place, on electric lime'
			},
			{
				src: '/images/pocketwatch/ad-networth.png',
				aspect: 1,
				alt: 'Pocketwatch campaign: know exactly what you are worth, net worth tracking on sky blue'
			},
			{
				src: '/images/pocketwatch/ad-invest.png',
				aspect: 960 / 1200,
				alt: 'Pocketwatch campaign: your portfolio, priced live, investments on violet'
			},
			{
				src: '/images/pocketwatch/ad-budget.png',
				aspect: 1,
				alt: 'Pocketwatch campaign: every dollar, accounted for, zero-based budget on orange'
			},
			{
				src: '/images/pocketwatch/ad-ledger.png',
				aspect: 1,
				alt: 'Pocketwatch campaign: every account in one place, unified ledger on mint green'
			},
			{
				src: '/images/pocketwatch/ad-analytics.png',
				aspect: 1200 / 628,
				alt: 'Pocketwatch campaign: see where it all goes, category breakdown on pink'
			}
		],
		stats: [
			{ label: 'Role', value: 'Brand, Product & Front-End' },
			{ label: 'Stack', value: 'SvelteKit + Svelte 5' },
			{ label: 'Status', value: 'Live Â· Production' },
			{ label: 'Scope', value: 'Identity + Product' }
		],
		description:
			'Brand identity, design system, and front-end for an all-in-one personal finance app: budgeting, net worth, and investments in one clean view.'
	},
	{
		slug: 'sonde',
		bentoRow: 1,
		bentoCol: 2,
		title: 'Sonde',
		section: 'code',
		category: 'Product, Code & Art Direction',
		year: '2025–2026',
		heroImage: '/images/sonde/hero.png',
		heroAspect: 16 / 9,
		images: [
			{
				src: '/images/sonde/hero.png',
				aspect: 16 / 9,
				alt: 'Sonde — Decode the XRPL. Real-time intelligence, analytics, and portfolio tracking'
			},
			{
				src: '/images/sonde/network.png',
				aspect: 16 / 9,
				alt: 'Sonde network insights: live XRP price, market cap, TradingView chart, and latest ledgers'
			},
			{
				src: '/images/sonde/markets.png',
				aspect: 16 / 9,
				alt: 'Sonde markets: XRPL token rankings by price, market cap, volume, and holders'
			},
			{
				src: '/images/sonde/account.png',
				aspect: 16 / 9,
				alt: 'Sonde account page: balance, smart money score, risk profile, and counterparty graph'
			},
			{
				src: '/images/sonde/portfolio.png',
				aspect: 16 / 9,
				alt: 'Sonde portfolio: total value, performance chart, allocation, and watchlist'
			},
			{
				src: '/images/sonde/smart-money.png',
				aspect: 16 / 9,
				alt: 'Sonde Smart Money leaderboard: scored wallets ranked by PnL, win rate, and Sharpe'
			},
			{
				src: '/images/sonde/ask-the-ledger.png',
				aspect: 16 / 9,
				alt: 'Ask the Ledger: natural-language queries over the XRP Ledger'
			}
		],
		stats: [
			{ label: 'Databases', value: '3' },
			{ label: 'Data', value: 'Real-time' },
			{ label: 'Stack', value: 'Next.js + PostgreSQL' },
			{ label: 'Role', value: 'Sole Creator' }
		],
		description:
			'A real-time XRPL analytics platform: network insights, DEX analytics, portfolio tracking, OHLCV price charts, and on-chain ingestion. Designed, built, and run solo.'
	},
	{
		slug: 'jade-aesthetics',
		bentoRow: 1,
		bentoCol: 2,
		title: 'Jade Aesthetics',
		section: 'code',
		category: 'Web & Code',
		year: '2025–2026',
		heroImage: '/images/jade-aesthetics/desktop-homepage-fold.jpg',
		heroAspect: 1920 / 1200,
		images: [
			{
				src: '/images/jade-aesthetics/desktop-homepage-fold.jpg',
				aspect: 1920 / 1200,
				alt: 'Jade Aesthetics homepage design'
			}
		],
		stats: [
			{ label: 'Pages', value: '30+' },
			{ label: 'Lighthouse A11y', value: '100' },
			{ label: 'Architecture', value: 'SEO-First' },
			{ label: 'Rendering', value: 'Server-Side' }
		],
		description:
			'Two complete websites for a premium medical spa: a Framer launch, then an SEO-architected Next.js application.'
	},
	{
		slug: 'firststrike',
		bentoRow: 1,
		title: 'FirstStrike Research',
		section: 'design',
		category: 'Brand & Art Direction',
		year: '2025',
		heroImage: '/images/firststrike/hero.png',
		heroAspect: 16 / 9,
		images: [
			{
				src: '/images/firststrike/hero.png',
				aspect: 16 / 9,
				alt: 'FirstStrike Research brand identity'
			},
			{
				src: '/images/firststrike/firststrike_pres-02.png',
				aspect: 16 / 9,
				alt: 'FirstStrike Research mission statement: veteran-owned financial research company'
			},
			{
				src: '/images/firststrike/firststrike_pres-03.png',
				aspect: 3376 / 2250,
				alt: 'FirstStrike Research billboard mockup: Real News. Real Research. Real Insights.'
			},
			{
				src: '/images/firststrike/firststrike_pres-04.png',
				aspect: 16 / 9,
				alt: 'FirstStrike Research brand pillars: Retro. Strong. Versatile.'
			},
			{
				src: '/images/firststrike/firststrike_pres-05.png',
				aspect: 16 / 9,
				alt: 'FirstStrike Research primary logo lockup, horizontal wordmark'
			},
			{
				src: '/images/firststrike/firststrike_pres-06.png',
				aspect: 16 / 9,
				alt: 'FirstStrike Research secondary logo lockup, stacked wordmark'
			},
			{
				src: '/images/firststrike/firststrike_pres-07.png',
				aspect: 16 / 9,
				alt: 'FirstStrike Research logo construction on blue grid'
			},
			{
				src: '/images/firststrike/firststrike_pres-08.png',
				aspect: 16 / 9,
				alt: 'Color system: Electric Blue, Soft Mint, Signal Coral, Amber Pulse'
			},
			{
				src: '/images/firststrike/firststrike_pres-09.png',
				aspect: 4 / 3,
				alt: 'FirstStrike Research business card mockup on concrete'
			},
			{
				src: '/images/firststrike/firststrike_pres-10.png',
				aspect: 16 / 9,
				alt: 'FirstStrike Research typography system: Helvetica Heavy and Medium'
			}
		],
		stats: [
			{ label: 'Timeline', value: '~1 Mo' },
			{ label: 'Scope', value: 'Full Identity' },
			{ label: 'Collateral', value: 'Print + Digital' },
			{ label: 'Role', value: 'Sole Designer' }
		],
		description:
			'Brand identity for a veteran-owned financial research company: wordmark, color system, typography, and guidelines.'
	},
	{
		slug: 'xrpcafe',
		bentoRow: 1,
		title: 'xrp.cafe',
		section: 'design',
		category: 'Brand & Motion',
		year: '2021–2024',
		heroImage: '/images/xrpcafe/logo_16x9.png',
		heroVideo: '/videos/CAFE_EXPLORE_CREATE_TRADE.mp4',
		heroAspect: 1080 / 1920,
		videos: ['/videos/CAFE_EXPLORE_CREATE_TRADE.mp4'],
		images: [
			{ src: '/images/xrpcafe/0.png', aspect: 3024 / 4032, alt: 'xrp.cafe mobile interface' },
			{
				src: '/images/xrpcafe/1.png',
				aspect: 16 / 9,
				alt: 'xrp.cafe Super Saiyan mug mascot character'
			},
			{
				src: '/images/xrpcafe/2.png',
				aspect: 16 / 9,
				alt: 'xrp.cafe marketplace UI with mascot characters'
			},
			{
				src: '/images/xrpcafe/3.png',
				aspect: 16 / 9,
				alt: 'xrp.cafe beach-BBQ mug mascot character'
			},
			{
				src: '/images/xrpcafe/4.png',
				aspect: 16 / 9,
				alt: 'xrp.cafe community Jeopardy event graphic'
			},
			{
				src: '/images/xrpcafe/5.png',
				aspect: 16 / 9,
				alt: 'xrp.cafe and VeSea charity event graphic'
			},
			{
				src: '/images/xrpcafe/6.png',
				aspect: 16 / 9,
				alt: 'xrp.cafe JUST MINT NFTs campaign graphic'
			},
			{
				src: '/images/xrpcafe/7.png',
				aspect: 16 / 9,
				alt: 'xrp.cafe Halloween pumpkin mug mascot'
			},
			{
				src: '/images/xrpcafe/logo_16x9.png',
				aspect: 16 / 9,
				alt: 'xrp.cafe coffee-mug logo lockup'
			},
			{
				src: '/images/xrpcafe/XLS20_1Y-04.png',
				aspect: 1,
				alt: 'xrp.cafe XLS-20 one year anniversary artwork'
			},
			{
				src: '/images/xrpcafe/booth_team.jpg',
				aspect: 1536 / 2048,
				alt: 'xrp.cafe team at Consensus booth'
			},
			{
				src: '/images/xrpcafe/booth_setup.jpg',
				aspect: 4032 / 3024,
				alt: 'xrp.cafe booth setup at Permissionless'
			},
			{
				src: '/images/xrpcafe/booth_table.jpg',
				aspect: 3024 / 4032,
				alt: 'xrp.cafe booth table with stickers and merch'
			},
			{
				src: '/images/xrpcafe/booth_tablet.jpg',
				aspect: 3024 / 4032,
				alt: 'xrp.cafe website demo at Consensus 2023'
			},
			{
				src: '/images/xrpcafe/event_nft_display.jpg',
				aspect: 2197 / 3905,
				alt: 'xrp.cafe team at NFT event display wall'
			},
			{
				src: '/images/xrpcafe/xrpl_group.jpg',
				aspect: 1,
				alt: 'XRP Ledger community group photo at Consensus'
			}
		],
		stats: [
			{ label: 'Community', value: '32K+' },
			{ label: 'Revenue', value: '$5M+' },
			{ label: 'Campaigns', value: '10+' },
			{ label: 'Role', value: 'Cofounder' }
		],
		description:
			'Visual identity, motion design, and marketing for the #1 NFT marketplace on the XRP Ledger.'
	},
	{
		slug: 'firstledger',
		bentoRow: 2,
		title: 'First Ledger',
		section: 'design',
		category: 'Brand & Art Direction',
		year: '2024–2025',
		heroImage: '/images/firstledger/FL2_FOLIO_HERO.png',
		heroAspect: 4 / 3,
		images: [
			{
				src: '/images/firstledger/FL2_FOLIO_HERO.png',
				aspect: 4 / 3,
				alt: 'First Ledger billboard mockup: The fastest way to trade'
			},
			{
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-01.png',
				aspect: 16 / 9,
				alt: 'First Ledger logo white on black'
			},
			{
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-02.png',
				aspect: 16 / 9,
				alt: 'First Ledger brand pillars: Fun, Reliable, Fast'
			},
			{
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-03.png',
				aspect: 16 / 9,
				alt: 'First Ledger primary and secondary logo lockups'
			},
			{
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-04.png',
				aspect: 16 / 9,
				alt: 'First Ledger logo construction: Pencil + Paper = Ledger diagram'
			},
			{
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-05.png',
				aspect: 16 / 9,
				alt: 'First Ledger primary logo clear-space rules'
			},
			{
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-06.png',
				aspect: 16 / 9,
				alt: 'First Ledger social media templates'
			},
			{
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-07.png',
				aspect: 16 / 9,
				alt: 'First Ledger and xrp.cafe co-branding guidelines, primary lockup'
			},
			{
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-08.png',
				aspect: 16 / 9,
				alt: 'First Ledger and xrp.cafe co-branding guidelines, secondary lockup'
			},
			{
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-10.png',
				aspect: 16 / 9,
				alt: 'First Ledger typography system spread'
			}
		],
		stats: [
			{ label: 'Followers', value: '42K+' },
			{ label: 'Volume', value: '$1B+' },
			{ label: 'Scope', value: 'Full Identity' },
			{ label: 'Role', value: 'Senior Brand Designer' }
		],
		description: 'Complete visual identity system for a token trading platform on the XRP Ledger.'
	},
	{
		slug: 'do-androids-dream',
		bentoRow: 2,
		title: 'Do Androids Dream?',
		section: 'design',
		category: 'Motion & Art Direction',
		year: '2023',
		heroImage: '/images/do-androids-dream/hero.jpg',
		heroAspect: 16 / 9,
		videos: ['/videos/DO_ANDROIDS_DREAM_-_Title_Sequence.mp4'],
		images: [
			{
				src: '/images/do-androids-dream/hero.jpg',
				aspect: 16 / 9,
				alt: 'Do Androids Dream title sequence: the sun with beams radiating out behind a lone figure, black on yellow'
			},
			{
				src: '/images/do-androids-dream/still-title.jpg',
				aspect: 16 / 9,
				alt: 'Do Androids Dream title sequence, act one: the title in heavy black type on a flat yellow field'
			},
			{
				src: '/images/do-androids-dream/still-cityscape.jpg',
				aspect: 16 / 9,
				alt: 'Do Androids Dream title sequence, act two: a black city skyline against yellow with a lone figure at right'
			},
			{
				src: '/images/do-androids-dream/still-road.jpg',
				aspect: 16 / 9,
				alt: 'Do Androids Dream title sequence, act three: the perspective breaks and a black road converges between yellow city blocks'
			},
			{
				src: '/images/do-androids-dream/still-sunrise.jpg',
				aspect: 16 / 9,
				alt: 'Do Androids Dream title sequence, act three: a yellow sun rising into a black sky'
			}
		],
		stats: [
			{ label: 'Duration', value: '~45 Sec' },
			{ label: 'Palette', value: 'Two-Color' },
			{ label: 'Medium', value: 'Title Sequence' },
			{ label: 'Role', value: 'Solo Project' }
		],
		description:
			"A bold, two-color title sequence for Philip K. Dick's sci-fi landmark. Saul Bass instead of Blade Runner."
	},
	{
		slug: 'gridform',
		bentoRow: 2,
		title: 'Studio Gridform',
		section: 'design',
		category: 'Brand & Art Direction',
		year: '2023–2024',
		heroImage: '/images/gridform/Poster_Frame_Mockup_2.png',
		heroAspect: 4 / 3,
		images: [
			{
				src: '/images/gridform/Poster_Frame_Mockup_2.png',
				aspect: 4 / 3,
				alt: 'Studio Gridform Less Noise poster series displayed on outdoor wall'
			},
			{
				src: '/images/gridform/GRIDFORM_BOOK_1.png',
				aspect: 4 / 3,
				alt: 'Studio Gridform book: Design is Problem Solving spread'
			},
			{
				src: '/images/gridform/GRIDFORM_BOOK_2.png',
				aspect: 4 / 3,
				alt: 'Studio Gridform book interior spread'
			},
			{
				src: '/images/gridform/GRIDFORM_BOOK_3.png',
				aspect: 4 / 3,
				alt: 'Studio Gridform Less Noise book stack'
			},
			{
				src: '/images/gridform/GRIDFORM_BOOK_4.png',
				aspect: 4 / 3,
				alt: 'Studio Gridform book: Timeless Over Trendy spread featuring First Ledger'
			},
			{
				src: '/images/gridform/GRIDFORM_PRINT.png',
				aspect: 4 / 3,
				alt: 'Studio Gridform print collateral'
			},
			{
				src: '/images/gridform/GRIDFORM_SIGNBOARD.png',
				aspect: 4 / 3,
				alt: 'Studio Gridform signboard mockup'
			}
		],
		stats: [
			{ label: 'Book', value: '28 Pages' },
			{ label: 'Series', value: 'Poster + Print' },
			{ label: 'Philosophy', value: 'Less Noise' },
			{ label: 'Role', value: 'Sole Creator' }
		],
		description:
			'A complete brand system, poster series, and 28-page design philosophy book built around one idea: less noise.'
	}
];

export const designProjects = projects.filter((p) => p.section === 'design');
export const codeProjects = projects.filter((p) => p.section === 'code');

export type ProjectSlug = (typeof projects)[number]['slug'];

export function getNextProject(currentSlug: ProjectSlug) {
	const idx = projects.findIndex((p) => p.slug === currentSlug);
	const next = projects[(idx + 1) % projects.length];
	return { title: next.title, slug: next.slug };
}
