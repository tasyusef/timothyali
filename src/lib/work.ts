// The whole work index: eight visible projects in two tiers plus two hidden entries (decision 0077).
// One source for Home (the selected four), Work (rows + index list) and /work/<slug>/ (all eight).
// Images live in static/work/<slug>/ at 1600px on the long side (plus `@2x.jpg` at 2800px where
// the source allowed); `w`/`h` are the 1x file's pixel dimensions so every figure holds its aspect.

export interface Media { src: string; w: number; h: number; alt: string; video?: boolean; x2?: string }
export type Row = Media[];
export type Block =
  | { type: 'text'; title: string; paras: string[] }
  | { type: 'gallery'; rows: Row[]; note?: string }
  | { type: 'list'; title: string; items: string[] };

/** The fields the Work list needs. Every visible project is a full `Project`;
 *  a `hidden` entry (0077: “keep them in code but just not shown”) carries these
 *  alone, has no page and appears nowhere. */
export interface Entry {
  /** position in the visible set, 01–08 — derived, never hand-written; hidden entries carry `--` */
  n: string;
  slug: string;
  title: string;
  year: string;
  scope: string;
  /** index line on Home and Work */
  description: string;
  /** `selected` is a card on Home and a wide row on Work; `index` is a line in the Work list (0077) */
  tier: 'selected' | 'index';
  /** kept in the data, shown nowhere, given no page and no assets (0077) */
  hidden?: boolean;
}

export interface Project extends Entry {
  /** the study title as written; rendered uppercase in PARC Pixel Bold (0079) */
  word: string;
  role: string;
  timeline?: string;
  tools: string;
  live?: { href: string; label: string };
  cover: Media;
  lead: string[];
  hero: Row;
  blocks: Block[];
}

/** one row of the index: a project with a study, or a hidden entry without one */
export type Item = Project | Entry;

// files that also exist as `<name>@2x.jpg` (2800px on the long side) for dense screens
const X2 = new Set(['firstledger/guide-01', 'firstledger/guide-02', 'firstledger/guide-03', 'firstledger/guide-04', 'firstledger/guide-05', 'firstledger/guide-07', 'firstledger/guide-08', 'firstledger/guide-10', 'firstledger/hero', 'parc/club-masthead-sky', 'parc/phone-arcade', 'parc/phone-hero', 'parc/sign-sky', 'parc/site-arcade', 'parc/site-bands', 'parc/site-collections', 'parc/site-crew', 'parc/site-hero', 'xrpcafe/backdrop', 'xrpcafe/banner', 'xrpcafe/booth-setup', 'xrpcafe/booth-table', 'xrpcafe/booth-tablet', 'xrpcafe/booth-team', 'xrpcafe/jeopardy', 'xrpcafe/just-mint', 'xrpcafe/logo', 'xrpcafe/marketplace', 'xrpcafe/mug-bbq', 'xrpcafe/mug-pumpkin', 'xrpcafe/mug-saiyan', 'xrpcafe/vesea-charity', 'xrpcafe/xrpl-group', 'firststrike/billboard', 'firststrike/business-card', 'firststrike/color', 'firststrike/construction', 'firststrike/hero', 'firststrike/logo-primary', 'firststrike/logo-secondary', 'firststrike/mission', 'firststrike/pillars', 'firststrike/type']);
const media = (slug: string) => (f: string, w: number, h: number, alt: string): Media => {
  const base = f.replace(/\.[a-z]+$/, '');
  return { src: `/work/${slug}/${f}`, w, h, alt, x2: X2.has(`${slug}/${base}`) ? `/work/${slug}/${base}@2x.jpg` : undefined };
};
const pa = media('parc'), xc = media('xrpcafe'), fl = media('firstledger'), dad = media('do-androids-dream');
const fst = media('firststrike'), so = media('sonde'), ps = media('parc-site'), ja = media('jade-aesthetics'), pw = media('pocketwatch');

/** Every project in display order: the selected four, the index five, then the hidden two.
 *  `n` is assigned from the position in the visible set at the bottom of this file. */
type Source = Omit<Project, 'n'> | Omit<Entry, 'n'>;
const source: Source[] = [
  {
    tier: 'selected',
    slug: 'parc',
    title: 'PARC',
    word: 'parc',
    year: '2021–2026',
    scope: 'Cofounder · brand & art direction',
    role: 'Cofounder · brand & art direction',
    timeline: 'Ongoing',
    tools: 'Illustrator, Python (fontTools)',
    live: { href: 'https://parcxrpl.com', label: 'parcxrpl.com' },
    description: 'Rebranding the NFT club I cofounded in 2021: logo, palette, pixel world, and a typeface, all from one 5×5 grid.',
    cover: { src: '/work/parc.png', w: 1600, h: 900, alt: 'PARC’s four-color pixel letters on a white sign floating in a pixel-cloud sky' },
    lead: [
      'Pixel Ape Rowboat Club started in November 2021 as a joke. People were treating pixel apes as status symbols, and we thought that was ridiculous. Bored Apes had yachts. Ours had rowboats. 10,000 pixel apes on the XRP Ledger, no clout included.',
      'People stayed anyway. Four years later PARC is four collections, a Twitch show, an arcade, merch, its own lore, and about 196,000 XRP traded. I cofounded it with xrpl_adam on the build, sloppy on marketing, and stove drawing the apes with me. Branding and art direction have been mine throughout. The 2026 rebrand is the brand catching up to the community, the world, and the story.'
    ],
    hero: [pa('sign-sky.png', 1600, 900, 'The new PARC box logo: four-color pixel letters on a white sign with notched corners, floating in a pixel-cloud sky')],
    blocks: [
      { type: 'text', title: 'The world', paras: [
        'The apes were retro from day one. The reference was the Game Boy Advance Pokémon games: the pixel size, the flat color, a sprite that reads at a glance. The world grew from there: islands, rowboats, volcanoes, wooden huts, tropical and unserious. That world is what the community actually cares about, and it is what the rebrand had to serve.'
      ] },
      { type: 'text', title: 'Same people, better brand', paras: [
        'The art was always retro. The logo never was: a cartoon ape with thick outlines and a bubbly wordmark, fine on its own and from a different product. In 2026 it was time. The new logo is drawn on the same 5×5 grid as the apes, on a white sign with notched corners.',
        'The hard part wasn’t drawing it. The team was attached to the old brand and worried people would hate a change, which is what people do with rebrands at first. I asked them to trust that this is what I do for a living. It shipped, and the response was the opposite of what they feared.'
      ] },
      { type: 'gallery', note: 'Before, 2021 / after, 2026', rows: [
        [pa('old-mascot.png', 1600, 1600, 'The old PARC logo: a cartoon ape head with a wide grin and thick black outlines, a bubbly yellow PARC wordmark across the top'), pa('old-wordmark.png', 1600, 900, 'The old PARC secondary logo: the bubbly outlined wordmark in black')],
        [pa('mark-stacked.png', 1600, 1600, 'The new PARC square lockup: the box logo stacked over the oar'), pa('twitter-banner.png', 1600, 533, 'PARC X header: the box logo on the pixel-cloud sky')]
      ] },
      { type: 'list', title: 'The reaction', items: [
        '“I know I like the new banner and logo” — RedHotDankMoist, Discord',
        '“@twocakeS these graphics is gas” — DreamballerXRP, Discord',
        '“Love it, great website update, looks amazing” — @BrandoWoodz, X',
        '“loOkn goOd” — @Uga589, X'
      ] },
      { type: 'text', title: 'The system', paras: [
        'Three marks, one construction: the box logo wide and square, and the oar badge. Same cell grid, same notched corners. The masters are merged paths, never loose squares. Clear space is two cells on every side.',
        'Five colors, no tints, no gradients. Each element gets one of them; the four-color cycling stays in the logo. Yellow never sets type on white. Web uses the hex values, print the CMYK builds.',
        'The secondary mark is one horizontal oar: the favicon, the badge, and the equals key in the fonts, so it drops into any line of pixel type as a divider.'
      ] },
      { type: 'text', title: 'The typeface', paras: [
        'PARC Pixel was the first thing made after the logo. The four letters became the style guide for an alphabet: one-cell strokes, hollow counters, stepped diagonals, every letter five cells wide. Three weights, each in square pixels, plus a mono cut for scores and prices. Twenty-nine glyphs were finished by hand, the 2 and the at-sign among them, judged in real words at reading size. The oar lives on the equals key.'
      ] },
      { type: 'gallery', rows: [
        [pa('club-masthead-sky.png', 1600, 900, 'PARC Pixel specimen on the sky colorway: Pixel Ape Rowboat Club set across the three weights')],
        [pa('three-weights-a.png', 1600, 1200, 'PARC Pixel specimen on white: the letter A in Bold 700, Regular 400, and Light 300'), pa('anatomy-sheet.png', 1600, 1200, 'PARC Pixel specimen on white: the Bold R on its 11 by 11 cell grid'), pa('mono-numerals-sky.png', 1600, 1200, 'PARC Pixel Mono numerals 0 to 9 on the sky colorway')],
        [pa('glyph-grid-green.png', 1600, 1200, 'PARC Pixel Bold: 40 glyphs in a grid, one color per glyph, on the green colorway'), pa('square-ampersand-sky.png', 1600, 1600, 'PARC Pixel Bold ampersand at giant size on the sky colorway')]
      ] },
      { type: 'text', title: 'In the wild', paras: [
        'Everything PARC puts out now runs on the system: the site, Discord, X, the Twitch show every other Friday, merch, and the arcade. The site is the main event. The hero sign hangs in the sky, the collections float on the island, the arcade band is the game’s own island with live high scores, and After Darc and Discord get their own bands. The stream opens on its own starting-soon loop.',
        'Plain type carried the specimens, but a graphic needs more than a layout grid to look alive. So every surface got a generated background: clouds drifting in hard steps, the hero scatter that twinkles and sparks under the cursor, CRT static for After Darc, chat bubbles for Discord. They add some life, nothing more. Reduced motion gets the still versions.'
      ] },
      { type: 'gallery', rows: [
        [pa('site-hero.png', 1600, 1000, 'parcxrpl.com hero: Pixel Ape Rowboat Club on the notched sign over the scatter texture, with the green nav bar')],
        [pa('site-collections.png', 1600, 1000, 'parcxrpl.com collections: PARC, Monkey Phunks, and PARC Customs cards floating on the pixel-cloud sky'), pa('phone-hero.png', 739, 1600, 'parcxrpl.com hero on a phone')],
        [pa('site-arcade.jpg', 1600, 1000, 'parcxrpl.com arcade band: the Rowboat Racer cover on a CRT and live high scores over the island'), pa('site-bands.png', 1600, 1000, 'parcxrpl.com After Darc band in Twitch purple and Discord band in blurple')],
        [pa('site-crew.png', 1600, 1000, 'parcxrpl.com crew row and green footer with the stacked mark'), pa('phone-arcade.jpg', 739, 1600, 'parcxrpl.com arcade band on a phone: the Rowboat Racer cover over the island')],
        [{ src: '/work/video/parc-after-darc-intro.mp4', w: 1920, h: 1080, video: true, alt: 'PARC After Darc starting-soon screen: a pixel sun over the sea with a rowboat drifting past, looped before the stream' }],
        [pa('after-darc-announce.png', 1600, 1600, 'PARC After Darc new-stream graphic: the wordmark over a pixel sunset, Saturday 9pm UTC on Twitch'), pa('after-darc-live.png', 1600, 1600, 'PARC After Darc live-now graphic: the wordmark over a pixel night sky and moon'), pa('after-darc-today.png', 1600, 1600, 'PARC After Darc tonight graphic'), pa('after-darc-reminder.png', 1600, 1600, 'PARC After Darc tomorrow graphic')],
        [pa('larc-teaser.jpg', 1600, 1600, 'LARC teaser: glitched terminal text on black announcing the next collection'), pa('parcade-scores.jpg', 1600, 1600, 'PARCade high-score board in PARC Pixel Mono')]
      ] },
      { type: 'list', title: 'Outcome', items: [
        'One logo library for both lockups and the oar: black, CMYK, Pantone, and white for print; black, RGB, and white for web.',
        'Five colors and one typeface on every surface: site, Discord, X, Twitch, merch, and the arcade.',
        'PARC Pixel: 57 characters per weight, three weights, proportional and mono.',
        'Four generated backgrounds, one per band of the site, and the game island drawn from its own sprites.',
        'Live since September 2026, to a community that is active and growing.'
      ] }
    ]
  },
  {
    tier: 'selected',
    slug: 'xrpcafe',
    title: 'xrp.cafe',
    word: 'xrp.cafe',
    year: '2021–2024',
    scope: 'Cofounder · brand & motion',
    role: 'Cofounder & founding designer',
    tools: 'Illustrator, After Effects',
    live: { href: 'https://xrp.cafe/', label: 'xrp.cafe' },
    description: 'Visual identity, motion design, and marketing for an NFT marketplace on the XRP Ledger.',
    cover: { src: '/work/xrpcafe.png', w: 1600, h: 900, alt: 'xrp.cafe coffee-mug logo lockup' },
    lead: [
      'xrp.cafe is the #1 NFT marketplace on the XRP Ledger. As cofounder and founding designer, I built the brand from nothing and led its rollout across marketing, events, and content: 10+ social campaigns, motion graphics, event booths, and community touchpoints.',
      'The positioning ran against the whole field. Crypto branding in 2021 was dark, aggressive, and self-serious. We went warm, friendly, and approachable: a cozy place for NFTs. That warmth set us apart and kept people with us.'
    ],
    hero: [
      { src: '/work/video/xrpcafe-explore-create-trade.mp4', w: 1080, h: 1920, video: true, alt: 'xrp.cafe Explore Create Trade motion graphic' },
      xc('logo.png', 1600, 900, 'xrp.cafe coffee-mug logo lockup on the brand blue')
    ],
    blocks: [
      { type: 'text', title: 'The mascot system', paras: [
        'The brand centers on its mascot: a simple, expressive coffee mug with stick-figure limbs and a warm smile. It began as a logo mark and grew into a full cast of characters, each with its own personality and accessories, that fronted the brand on every touchpoint.',
        'A mascot system works when it can vary without drifting. I drew new characters and scenes for campaigns, seasonal moments, and community milestones: a Halloween pumpkin mug, a beach-BBQ mug, a Super Saiyan mug. Each read as xrp.cafe at a glance, and none needed a brand guideline to feel right.'
      ] },
      { type: 'gallery', rows: [
        [xc('mug-saiyan.png', 1600, 900, 'xrp.cafe Super Saiyan mug mascot character'), xc('mug-bbq.png', 1600, 900, 'xrp.cafe beach-BBQ mug mascot character'), xc('mug-pumpkin.png', 1600, 900, 'xrp.cafe Halloween pumpkin mug mascot')],
        [xc('marketplace.png', 1600, 900, 'xrp.cafe marketplace UI with mascot characters')]
      ] },
      { type: 'text', title: 'Motion graphics', paras: [
        'The “Explore, Create, Trade” promo compresses the whole pitch into one fast animated piece: kinetic typography, smooth character animation, and the brand’s signature blue throughout. I made it for the feed, not the film festival: vertical format, legible on a phone mid-scroll, message delivered in seconds.',
        'Around the hero promo I built a library of motion assets for product launches, feature announcements, and event recaps, which gave the brand a steady, energetic presence in feeds. Each piece had one job: show one platform feature, fast, in character.'
      ] },
      { type: 'text', title: 'Community as a channel', paras: [
        'An NFT marketplace depends on its community, so the brand’s main medium was the daily feed. I produced a steady stream of content for Twitter/X, Instagram, and Discord: product announcements, feature launches, community events, seasonal posts, partnerships, milestone celebrations. The pace never let up: several posts a week, each needing custom graphics, copy, and a read on what the community cared about that day.',
        'The same system carried into the physical world, with booth designs, backdrops, banners, and merch for Consensus, Permissionless, and ETH Denver. On a conference floor full of black-and-neon, a warm, recognizable brand stood out.'
      ] },
      { type: 'gallery', rows: [
        [xc('just-mint.png', 1600, 900, 'xrp.cafe JUST MINT NFTs campaign graphic'), xc('jeopardy.png', 1600, 900, 'xrp.cafe community Jeopardy event graphic'), xc('vesea-charity.png', 1600, 900, 'xrp.cafe and VeSea charity event graphic')],
        [xc('xls20.png', 1600, 1600, 'xrp.cafe XLS-20 one year anniversary artwork'), xc('booth-team.jpg', 1200, 1600, 'xrp.cafe team at the Consensus booth'), xc('xrpl-group.jpg', 1600, 1600, 'XRP Ledger community group photo at Consensus')],
        [xc('booth-setup.jpg', 1600, 1200, 'xrp.cafe booth setup at Permissionless'), xc('booth-table.jpg', 1200, 1600, 'xrp.cafe booth table with stickers and merch'), xc('booth-tablet.jpg', 1200, 1600, 'xrp.cafe website demo at Consensus 2023')],
        [xc('backdrop.jpg', 1600, 1200, 'xrp.cafe event backdrop mockup'), xc('banner.jpg', 1600, 1200, 'xrp.cafe retractable banner mockups')]
      ] },
      { type: 'list', title: 'Outcome', items: [
        '#1 NFT marketplace on the XRP Ledger by secondary sales volume.',
        '$5M+ in marketplace revenue.',
        'Community grown to 32,000+ members.',
        '11,800+ secondary sales in a single 30-day period at peak (Nov 2023).',
        'Helped raise $32K for St. Jude’s with VeSea.',
        'Profiled by Messari as one of the most established touchpoints on XRPL, featured on the official XRPL developer blog, and backed by the XRPL Accelerator.',
        'Booth and brand presence at Consensus (2023, 2024), Permissionless 2024 in the Ripple X section, and ETH Denver (2022–2024).'
      ] }
    ]
  },
  {
    tier: 'selected',
    slug: 'firstledger',
    title: 'First Ledger',
    word: 'first ledger',
    year: '2024–2025',
    scope: 'Senior brand designer',
    role: 'Senior brand designer',
    timeline: 'About a year',
    tools: 'Illustrator',
    live: { href: 'https://firstledger.net/', label: 'firstledger.net' },
    description: 'Complete visual identity system for a token trading platform on the XRP Ledger.',
    cover: { src: '/work/firstledger.jpg', w: 1600, h: 900, alt: 'First Ledger billboard mockup: The fastest way to trade' },
    lead: [
      'First Ledger is a token trading platform on the XRP Ledger: a Telegram bot and a full web interface at firstledger.net for fast, self-custody access to the XRPL’s native DEX and AMM pools. The team behind xrp.cafe built it, and it has grown into one of the top DEX gateways on the network by trading volume.',
      'I designed the complete visual identity over a year-long engagement, from logo concept through full brand guidelines with co-branding rules: a system built to grow with the product.'
    ],
    hero: [fl('hero.jpg', 1600, 1200, 'First Ledger billboard mockup: The fastest way to trade')],
    blocks: [
      { type: 'text', title: 'Pencil + paper = ledger', paras: [
        'Two elemental shapes make the mark. A diagonal form is the pencil: the act of recording. A rounded square is the paper: the surface that holds the record. Together they read as a single icon: a ledger, a record of transactions.',
        'Two shapes, one idea, no decoration. The mark survives any scale, 16px favicon to billboard, because there’s nothing extra to lose at small sizes. For a product that lives in Telegram chats, a web trading interface, and small mobile screens, that scalability was the core requirement. I designed the whole identity around it.'
      ] },
      { type: 'gallery', rows: [
        [fl('guide-01.png', 1600, 900, 'First Ledger logo white on black'), fl('guide-04.png', 1600, 900, 'First Ledger logo construction: Pencil + Paper = Ledger diagram')]
      ] },
      { type: 'text', title: 'Lockups & typography', paras: [
        'The primary lockup pairs the icon with “FIRST LEDGER” in a heavy extended grotesque; the secondary shortens it to “FL” for compact contexts. Both carry clear-space rules measured in multiples of the icon’s own width, so spacing never depends on anyone’s eye.',
        'I chose extended letterforms to counter the condensed, aggressive type that dominates crypto. Width signals confidence and stability, and both matter when you ask people to route real money through your platform. The type system runs three weights of the same extended family: Heavy for headlines, Medium for subheads, Roman for body.'
      ] },
      { type: 'gallery', rows: [
        [fl('guide-03.png', 1600, 900, 'First Ledger primary and secondary logo lockups'), fl('guide-05.png', 1600, 900, 'First Ledger primary logo clear-space rules')],
        [fl('guide-10.png', 1600, 900, 'First Ledger typography system spread')]
      ] },
      { type: 'text', title: 'Brand pillars', paras: [
        'Fun: “a lil meme never hurt anyone.” Reliable: “passion and years of experience.” Fast: “we’re first for a reason.”',
        'Those three words governed every visual call. The playful register kept the brand human in a field of self-serious competitors. The stress on speed and reliability let the same identity work in professional contexts, exchange listings, partnership decks, ecosystem reports, without a redesign.'
      ] },
      { type: 'text', title: 'Co-branding guidelines', paras: [
        'First Ledger shares an ecosystem (and a team) with xrp.cafe, so the guidelines set exact co-branding rules: spacing for how the two logos sit together. With the rules written in advance, every collaboration looks planned, not improvised.',
        'As the platform grew into partnerships and integrations, those rules got the heaviest use. They kept the brand consistent across CoinGecko listings, DappRadar profiles, Messari reports, and co-marketing with other XRPL projects.'
      ] },
      { type: 'gallery', rows: [
        [fl('guide-02.png', 1600, 900, 'First Ledger brand pillars: Fun, Reliable, Fast')],
        [fl('guide-07.png', 1600, 900, 'First Ledger and xrp.cafe co-branding guidelines, primary lockup'), fl('guide-08.png', 1600, 900, 'First Ledger and xrp.cafe co-branding guidelines, secondary lockup')]
      ] },
      { type: 'list', title: 'Outcome', items: [
        'The identity held unchanged across every exchange listing, ecosystem report, and co-branded surface as the platform grew.',
        'First Telegram-based trading bot on the XRP Ledger.',
        'Consistently ranked top 2–3 DEX gateway on XRPL by trading volume (Messari).',
        'Ripple credited it with driving Q4 2024 XRPL growth: daily CLOB volume rose 1,140% quarter on quarter.',
        'Listed on CoinGecko, DappRadar, and GeckoTerminal as a tracked exchange.',
        'Featured in every Messari “State of XRP Ledger” report since Q2 2024.'
      ] }
    ]
  },
  {
    tier: 'selected',
    slug: 'do-androids-dream',
    title: 'Do Androids Dream?',
    word: 'do androids dream?',
    year: '2023',
    scope: 'Motion & art direction',
    role: 'Director, designer, animator',
    tools: 'After Effects, Illustrator',
    description: 'A two-color title sequence for Philip K. Dick’s “Do Androids Dream of Electric Sheep?”: Saul Bass instead of Blade Runner.',
    cover: { src: '/work/do-androids-dream.jpg', w: 1600, h: 900, alt: 'Do Androids Dream title sequence: the sun with beams radiating out behind a lone figure, black on yellow' },
    lead: [
      'A title sequence for Philip K. Dick’s Do Androids Dream of Electric Sheep?, the novel that inspired Blade Runner. Everyone expects the dark, rain-soaked look. I went the other way: a stark, high-contrast yellow-and-black graphic style closer to Saul Bass than Ridley Scott.'
    ],
    hero: [{ src: '/work/video/do-androids-dream-title-sequence.mp4', w: 1280, h: 720, video: true, alt: 'Do Androids Dream title sequence, forty-five seconds, black on yellow' }],
    blocks: [
      { type: 'text', title: 'The concept', paras: [
        'What does this story look like with the atmosphere stripped away, cut down to its plainest graphic elements? That question drove every decision in the sequence.',
        'The answer was a two-color world: bright yellow and deep black, nothing else. The yellow is the artificial, the synthetic, the electric; the black is the void. Together they make a world at once stark and overwhelming, and the narrow palette forces the eye onto what’s left: shape, movement, composition.'
      ] },
      { type: 'gallery', rows: [
        [dad('hero.jpg', 1600, 900, 'Do Androids Dream title sequence: the sun with beams radiating out behind a lone figure, black on yellow')]
      ] },
      { type: 'text', title: 'Visual language', paras: [
        'The sequence centers on a dystopian skyline: a jagged silhouette of towers and industrial structures drawn as flat black vector shapes against the yellow sky. Against that mass stands a lone silhouetted figure, the emotional core of the piece: one person dwarfed by the built environment.',
        'Subtle chromatic aberration flickers at the edges of the vector shapes throughout: a hint of electronic interference that leaves the world slightly misaligned, as if seen through a synthetic lens. It’s the only effect in the piece, which is why it registers.'
      ] },
      { type: 'text', title: 'Motion & pacing', paras: [
        'Three acts in forty-five seconds. Act one: the title builds word by word on a flat yellow field. Act two: the cityscape enters and the credits play against it. Act three: the perspective breaks, and the camera pulls into the city along a converging road as the sun rises and beams radiate outward.',
        'The anti–Blade Runner look is itself the statement: source material this rich deserves more than one visual reading.'
      ] },
      { type: 'gallery', rows: [
        [dad('still-title.jpg', 1280, 720, 'Act one: the title in heavy black type on a flat yellow field'), dad('still-cityscape.jpg', 1280, 720, 'Act two: a black city skyline against yellow with a lone figure at right, edges fringed by chromatic aberration')],
        [dad('still-road.jpg', 1280, 720, 'Act three: the perspective breaks and a black road converges between yellow city blocks'), dad('still-sunrise.jpg', 1280, 720, 'Act three: a yellow sun rising into a black sky')]
      ] }
    ]
  },
  {
    tier: 'index',
    slug: 'firststrike',
    title: 'FirstStrike Research',
    word: 'firststrike research',
    year: '2025',
    scope: 'Brand & art direction',
    role: 'Sole brand designer',
    timeline: 'About a month',
    tools: 'Illustrator, Figma',
    description: 'Brand identity for a veteran-owned financial research company: wordmark, color system, typography, and guidelines.',
    cover: { src: '/work/firststrike.jpg', w: 1600, h: 900, alt: 'The FirstStrike Research wordmark in white italic type on the blue gradient-and-grain field' },
    lead: [
      'FirstStrike Research is a veteran-owned financial research company covering American markets. A one-month brand commission: logo, color, typography, and guidelines, delivered as one documented system.'
    ],
    hero: [fst('hero.jpg', 1600, 900, 'The FirstStrike Research wordmark in white italic type on the brand’s blue gradient-and-grain field')],
    blocks: [
      { type: 'list', title: 'The commission', items: [
        'Full identity: wordmark, lockups, color system, type, guidelines',
        'Signature gradient-plus-grain treatment for digital surfaces',
        'Collateral from business cards to billboards'
      ] },
      { type: 'text', title: 'The brief', paras: [
        'In financial media, trust is the product. The brand had to stand next to legacy research outlets while signaling everything they aren’t: independent, direct, and fast. The client’s military background set the tone: first strike, first mover. A rough mood board pointed at retro print media. My job was to turn that instinct into a system serious enough for finance.'
      ] },
      { type: 'gallery', rows: [
        [fst('mission.png', 1600, 900, 'The FirstStrike Research mission statement set in heavy blue capitals: a veteran-owned financial research blog for service members and civilians')]
      ] },
      { type: 'text', title: 'Logo & wordmark', paras: [
        'I set the wordmark in heavy italic type. The forward lean gives it motion; the weight keeps it serious. The defining element is the halftone dot-matrix pattern trailing off the “F”. It recalls newsprint and reads as impact spreading from the name.',
        'The logo comes in three forms: horizontal for headers, stacked for tight spaces, and a standalone icon for favicons and avatars. I specified each for light and dark backgrounds, so placement is a lookup, not a judgment call.'
      ] },
      { type: 'gallery', rows: [
        [fst('logo-primary.png', 1600, 900, 'The primary FirstStrike lockup: the horizontal wordmark in blue on ice white'), fst('logo-secondary.png', 1600, 900, 'The secondary FirstStrike lockup: the wordmark stacked over two lines')],
        [fst('construction.png', 1600, 900, 'The wordmark on its construction grid, white on electric blue')]
      ] },
      { type: 'text', title: 'Color & type', paras: [
        'Electric Blue (#003DFF) anchors the brand: bold enough to stand out in financial media, heavy enough to carry authority. Midnight Black handles text, Ice White the secondary surfaces. Three accents, Soft Mint, Signal Coral, and Amber Pulse, cover data visualization and digital surfaces. Typography is Helvetica in two weights: Heavy for headlines, Medium for everything meant to be read.'
      ] },
      { type: 'gallery', rows: [
        [fst('color.png', 1600, 900, 'The color system as swatches: Soft Mint, Signal Coral, Amber Pulse, Electric Blue, Ice White, and Midnight Black with their hex values'), fst('type.png', 1600, 900, 'The type system: the Helvetica Heavy and Helvetica Medium alphabets and numerals in blue')]
      ] },
      { type: 'text', title: 'The signature look', paras: [
        'The brand’s most recognizable treatment is gradient-plus-grain: a deep blue-to-cyan gradient overlaid with subtle noise. It gives digital surfaces a printed, tactile quality without slipping into pastiche. One treatment, three surfaces on day one: social cards, billboards, editorial layouts.'
      ] },
      { type: 'gallery', rows: [
        [fst('pillars.jpg', 1600, 900, 'The brand pillars, Retro. Strong. Versatile., in white capitals on the blue gradient-and-grain field')],
        [fst('billboard.jpg', 1600, 1066, 'A billboard mockup reading Real News. Real Research. Real Insights. in blue and white above a city street'), fst('business-card.jpg', 1600, 1200, 'Two blue business cards on concrete, the wordmark on one and the contact details on the other')]
      ] },
      { type: 'text', title: 'Outcome', paras: [
        'FirstStrike launched with the full system in hand: wordmark, color, type, the gradient-plus-grain signature, and guidelines detailed enough that no one has to improvise the brand. The rules run from business card to billboard: every surface the company touches draws from the same set.'
      ] }
    ]
  },
  {
    tier: 'index',
    slug: 'sonde',
    title: 'Sonde',
    word: 'sonde',
    year: '2025–2026',
    scope: 'Product, code & art direction',
    role: 'Designer & developer, sole creator',
    tools: 'Figma, Next.js, TypeScript, Tailwind CSS, Recharts, PostgreSQL, ClickHouse, Neo4j, WebSockets, SSE',
    description: 'A real-time XRPL analytics platform: network insights, DEX analytics, portfolio tracking, price charts, and on-chain ingestion. Designed, built, and run solo.',
    cover: { src: '/work/sonde.png', w: 1600, h: 900, alt: 'Sonde: Decode the XRPL — real-time intelligence, analytics, and portfolio tracking' },
    lead: [
      'A real-time block explorer, analytics platform, and on-chain intelligence suite for the XRP Ledger: a self-initiated product I designed, built, and ran solo, end to end.'
    ],
    hero: [so('hero.png', 1600, 900, 'Sonde: Decode the XRPL. Real-time intelligence, analytics, and portfolio tracking for the XRP Ledger')],
    blocks: [
      { type: 'list', title: 'What it is', items: [
        'Block explorer, network analytics, and a trading portfolio dashboard',
        'Intelligence layer: smart money scoring, fund tracing, AI investigations',
        'Three databases fed by three parallel XRPL WebSocket connections',
        'Wallet-based auth and a commercial subscription product'
      ] },
      { type: 'text', title: 'Design philosophy', paras: [
        'Sonde started from a frustration: most blockchain explorers are grids of raw hex with nothing prioritized, as if opacity were a feature. A new user should land on an address and understand it without feeling they wandered into a terminal. So type carried the hierarchy, and the page had to read before any color arrived.',
        'Three users had to be served at once. The newcomer wanted plain English: what does this account hold, is any of it unusual. The trader wanted a dashboard: PnL, cost basis, allocation, performance versus XRP. The analyst wanted depth: raw blobs, six-hop fund tracing, risk scoring. Every screen answered the newcomer at the surface and unfolded for the specialist in deeper tabs. Motion followed the same restraint as color: eased transitions, slow pulses on live indicators, numbers that faded rather than snapped. Most people never noticed it. They noticed the product felt calm.'
      ] },
      { type: 'text', title: 'Brand identity', paras: [
        'The name came first. Sonde, French for probe, is an instrument you send into something to measure what’s happening inside and report back. The color system was narrow: a cool slate foundation of near-black surfaces and muted neutrals, so the interface read as calm even while showing ten thousand transactions a minute. Against that, one warm accent: salmon #E8856C, the only saturated color in the core chrome. That scarcity was the point. When salmon appeared on a live indicator or a key metric, you knew it mattered.',
        'Three fonts had three jobs: Satoshi for display, DM Sans for product UI and body, IBM Plex Mono for every address, hash, and amount, because financial identifiers must be monospaced to stay scannable. Transaction types carried a quiet semantic color system: payments blue, DEX fills gold, NFT operations purple, trust lines green, AMM actions pink, always as small dots or single-word tags, never full colored rows. A trained eye could scan a thousand-row feed and spot the pattern without reading every line.'
      ] },
      { type: 'text', title: 'The product', paras: [
        'The XRP Ledger closes a ledger every 3–5 seconds, each carrying hundreds of transactions across dozens of types. A universal search bar took any input (an address, a transaction hash, a CTID, a ledger index, or a token name), detected the type, and routed accordingly. Account pages ran twelve tabs ordered by depth, from transactions and holdings out to trust lines, NFTs, AMM pools, offers, and escrows, with React Suspense streaming each section so the page was usable before all the data arrived.',
        'The explorer covered network analytics (live price and market cap, candlestick charts, a fee monitor, amendment voting), the DEX with AMM liquidity across 60+ pools, a wallet-connected portfolio tracker, and a directory of 1,000+ XRPL assets. On top sat the intelligence layer, which turned an explorer into an analytical product: smart money scoring ranked wallets by profitability and consistency, Neo4j pathfinding traced value across up to six hops, account labels classified addresses with cited evidence, and a risk module flagged wash trading. A Claude Sonnet agent with scoped tool access ran multi-turn investigations across all of it in a single thread.'
      ] },
      { type: 'gallery', rows: [
        [so('network.png', 1600, 900, 'Sonde network insights: live XRP price, market cap, a candlestick chart, and the latest ledgers')],
        [so('markets.png', 1600, 900, 'Sonde markets: XRPL token rankings by price, market cap, volume, and holders'), so('account.png', 1600, 900, 'Sonde account page: balance, smart money score, risk profile, and counterparty graph')]
      ] },
      { type: 'list', title: 'Architecture', items: [
        'Postgres for OLTP: app data, sessions, subscriptions, wallet portfolios, smart money scores, account labels, and rollup tables',
        'ClickHouse for OLAP: the raw stream of transactions, DEX fills, and trust line events, with materialized views so dashboards hit pre-aggregated data',
        'Neo4j for the graph: accounts as nodes, payments and trades as edges, which made six-hop fund tracing cheap in a way SQL cannot match',
        'Three separate XRPL WebSocket connections for user requests, ingestion, and background intel jobs, so a slow ingest never blocked an account page',
        'Real-time events fanned out over Server-Sent Events behind an LRU cache, so pages never flashed empty',
        'No passwords and no emails: users proved wallet ownership with a single-use nonce in a dummy transaction and got a JWT back',
        'Two tiers, Free and Pro: Pro unlocked the portfolio suite and the full intelligence layer, with per-user AI limits and bring-your-own-key for power users'
      ] },
      { type: 'gallery', rows: [
        [so('portfolio.png', 1600, 900, 'Sonde portfolio: total value, performance chart, allocation, and watchlist')],
        [so('smart-money.png', 1600, 900, 'Sonde Smart Money leaderboard: scored wallets ranked by PnL, win rate, and Sharpe'), so('smart-money-detail.png', 1600, 900, 'Sonde Smart Money detail: score factors, score history, and tokens traded')],
        [so('transaction.png', 1600, 900, 'Sonde transaction detail: identifiers, outcome, balance changes, and affected ledger nodes'), so('ask-the-ledger.png', 1600, 900, 'Ask the Ledger: natural-language queries over the XRP Ledger')]
      ] },
      { type: 'text', title: 'Outcome', paras: [
        'Sonde shipped to production as a three-part product: a public block explorer, a network analytics suite, and an intelligence layer, with wallet-based auth and a subscription that took payment in both fiat and crypto. What began as a design exercise in information density became a commercial product that gave on-chain data the clarity of a well-made financial tool. I ran it end to end, design, engineering, and operations, until I shut down the hosted instance.'
      ] }
    ]
  },
  {
    tier: 'index',
    slug: 'parc-site',
    title: 'PARC Website',
    word: 'parc website',
    year: '2026',
    scope: 'Web & code',
    role: 'Design & code',
    timeline: 'Live since September 2026',
    tools: 'SvelteKit, Svelte 5, TypeScript, Canvas, Vercel, Neon, Claude Code',
    live: { href: 'https://parcxrpl.com', label: 'parcxrpl.com' },
    description: 'The club’s home, built as an island you walk down: hanging signs, pixel buttons, live stats, a gallery on clotheslines, and an arcade with its own game.',
    cover: { src: '/work/parc-site.png', w: 1440, h: 810, alt: 'parcxrpl.com home: the Pixel Ape Rowboat Club sign on a notched paper card under the green nav' },
    lead: [
      'The rebrand needed somewhere to live. The old site was a default Squarespace template, and it could not hold what the club had become: four collections, a token, a Twitch show, an arcade, and merch.',
      'I built the new one alone. Claude Code wrote most of the code; I could not have typed it by hand. I designed it, judged every screen by eye, and tweaked by hand until it was right.',
      'Two rules from the start. The site is the brand in use, so everything comes out of the same grid as the logo. And it is a place, not a page: you arrive on an island and walk down it.'
    ],
    hero: [ps('home-hero.png', 1440, 900, 'parcxrpl.com home: the Pixel Ape Rowboat Club sign on a notched paper card over the scatter texture, under the green nav')],
    blocks: [
      { type: 'list', title: 'What it is', items: [
        'Home, Gallery, Clubhouse, PARCade, Merch, Stats, LARC, and the error pages',
        'One typeface, PARC Pixel, in three weights',
        'Every number on it is live'
      ] },
      { type: 'text', title: 'A place, not a page', paras: [
        'Every page opens on the same sky: a gradient from azure to seafoam, two layers of pixel clouds drifting at different speeds, a jungle canopy across the top. The title hangs from it on a wooden sign with the lead and the buttons on the same plank, so each page has one object to look at first. Pages are named as places. The Clubhouse, the Gallery, the PARCade. Every tile in the world is generated, and every cell rolls a little grain of its own, so nothing is a flat fill and nothing reads as a repeat.'
      ] },
      { type: 'gallery', rows: [
        [ps('home-collections.png', 1440, 900, 'parcxrpl.com collections: PARC, Monkey Phunks, and PARC Customs as paper cards on the sky'), ps('phone-home.png', 390, 844, 'parcxrpl.com home on a phone: the hero card with stacked pixel buttons')],
        [ps('home-oar.png', 1440, 900, 'parcxrpl.com: the Buy $OAR and Set Trustline cards at the foot of the sky'), ps('home-crew.png', 1440, 900, 'parcxrpl.com crew row: five ape avatars, each under its own color bar, above the green footer')],
        [ps('not-found.png', 1440, 900, 'parcxrpl.com 404: a hanging sign reading Rowed off the map'), ps('phone-collections.png', 390, 844, 'parcxrpl.com collection cards on a phone')]
      ] },
      { type: 'text', title: 'The notch', paras: [
        'One primitive is under everything: a corner cut by a single square cell, drawn as a stepped polygon that reads each element’s own cell size. Buttons notch at 6px, cards at 10px, panels at 12px. A button is a notched face floating over a darker slab. Hover lifts it, press drops it flush, and nothing on the site eases: buttons move in two steps, water ticks one cell at a time, dropdowns unroll a line at a time. The same parts build every page on the site.'
      ] },
      { type: 'text', title: 'Stats first', paras: [
        'Stats is the first link in the nav. After the landing page, it is what holders come for: how the collections are doing. Floor, all-time volume, holders, and listings for all four collections, and the $OAR token’s price, market cap, holders, and liquidity, read live from the ledger, xrp.cafe, and the AMM. A daily snapshot feeds pixel bar charts whose history starts the day the site launched. I did not backfill.'
      ] },
      { type: 'gallery', rows: [
        [ps('stats-top.png', 1440, 900, 'parcxrpl.com Club Stats: the $OAR card with price, volume, market cap, holders, and two pixel bar charts'), ps('phone-stats.png', 390, 844, 'parcxrpl.com Club Stats on a phone')],
        [ps('stats-cards.png', 1440, 900, 'parcxrpl.com Club Stats: four collection cards with floor, volume, holders, listed, and a 30-day floor chart')]
      ] },
      { type: 'text', title: 'The two that took longest', paras: [
        'The Gallery and the Clubhouse took more hands-on adjustment than the rest of the site put together. The Gallery hangs every ape on slack clotheslines strung between two tall trees, with generated foliage that never repeats a silhouette, over a shoreline whose water cycles through twenty-four palette frames the way a SNES did it. Tap a frame and a plaque names the ape. The first version scrolled sideways and hijacked the wheel. It looked good and felt wrong, so it was rebuilt on plain vertical scroll at half the code.',
        'The Clubhouse is where the club hangs out, so it is a scene: a grey TV with the Twitch stream in it, a trophy shelf, and a cork notice board with the club’s events pinned to it, all swinging from generated branches. It took three layouts to find that. The ropes are clamped to the branches so they cannot detach at any width.'
      ] },
      { type: 'gallery', rows: [
        [ps('gallery-top.png', 1440, 900, 'parcxrpl.com Gallery: the hanging sign with collection chips, and the generative apes on clotheslines between two trees'), ps('phone-gallery.png', 390, 844, 'parcxrpl.com Gallery on a phone: one portrait per clothesline')],
        [ps('gallery-customs.png', 1440, 900, 'parcxrpl.com Gallery: the PARC Customs one-of-ones on clotheslines')],
        [ps('community-top.png', 1440, 900, 'parcxrpl.com Clubhouse: the hanging sign, the TV on its branch, and the cork notice board'), ps('phone-community.png', 390, 844, 'parcxrpl.com Clubhouse on a phone: the sign, the On Air plaque, and the branches')],
        [ps('community-mid.png', 1440, 900, 'parcxrpl.com Clubhouse: the trophy shelf and event cards beside the notice board'), ps('community-low.png', 1440, 900, 'parcxrpl.com Clubhouse: the last event cards above the grass and sand at the foot of the page')]
      ] },
      { type: 'text', title: 'PARCade', paras: [
        'The arcade is a cabinet. The content lives inside a phosphor-green CRT with scanlines, and the joystick and buttons on the deck drive the screen. It boots when you arrive, badge first. On the landing page PARCade gets its own band: the game’s island painted from its own sprites, the cover on a small CRT, live high scores from the leaderboard, and a river along the bottom drawn exactly the way the game draws water.',
        'The game in it is Rowboat Racer. An ape rows down an endless river, five lanes wide, dodging ziggurats, logs, and reefs. I drew the sprites on a 3px grid in the brand’s own pixel language, the banks generate their own beach, jungle, rock, and village biomes from each run’s seed, and the leaderboard replays every run on the server before a score counts. It is the brand as a toy, and the community plays it.'
      ] },
      { type: 'gallery', rows: [
        [ps('home-arcade.png', 1440, 900, 'parcxrpl.com PARCade band: the Rowboat Racer cover on a CRT and live high scores over the game’s island'), ps('phone-arcade.png', 390, 844, 'parcxrpl.com PARCade band on a phone')],
        [ps('parcade-library.png', 1440, 900, 'parcxrpl.com PARCade booted: the game library with Rowboat Racer live and two cabinets coming soon'), ps('phone-parcade.png', 390, 844, 'parcxrpl.com PARCade on a phone: the game library on the CRT')],
        [ps('parcade-boot.png', 1440, 900, 'parcxrpl.com PARCade booting: the PARC badge assembling on the green CRT above the deck')],
        [ps('game-run.png', 1280, 900, 'Rowboat Racer mid-run: the boat between a beach bank and a jungle bank, coins ahead, obstacles in their lanes'), ps('game-sprites.png', 832, 1000, 'Rowboat Racer sprite sheet: the boat, obstacles, pickups, and bank props on the 3px grid')],
        [ps('game-banks.png', 1292, 812, 'Rowboat Racer banks: rocky, village, jungle, and beach biomes with clustered props and a wandering shoreline')]
      ] },
      { type: 'text', title: 'Everything else is also somewhere', paras: [
        'Merch was going to be a link out. The storefront had an API, so the catalog renders as pixel product cards with a photo carousel and unrolling dropdowns, and checkout is the only step that leaves the brand. After Darc and Discord each get a band in their own color with a living background: broadcast static for the show, drifting chat bubbles for the server. LARC, the teaser for the next collection, is a boathouse terminal that boots, corrupts, loses signal, and lets you type. The 404 is a sign that says you rowed off the map.'
      ] },
      { type: 'gallery', rows: [
        [ps('merch.png', 1440, 900, 'parcxrpl.com Merch: the PARC Vibes tee and hoodie as pixel product cards with carousels and dropdowns'), ps('phone-merch.png', 390, 844, 'parcxrpl.com Merch on a phone')],
        [ps('larc.png', 1440, 900, 'parcxrpl.com LARC teaser: the boathouse terminal mid-corruption, an unknown vessel detected'), ps('home-bands.png', 1440, 900, 'parcxrpl.com After Darc band in Twitch purple and Discord band in blurple')]
      ] },
      { type: 'text', title: 'How it was built', paras: [
        'Claude Code wrote the code and I directed it, screen by screen. Every unit of work ended the same way: a screenshot diff against the deployed site, a pass at phone width, and a type check at zero errors. Color, type, and spacing are all custom properties, so the audits at the end ran over one file. Fonts ship as WOFF2, the animated art became WebP, and the domain moved from Squarespace DNS to Vercel the night the old site kept reappearing.'
      ] },
      { type: 'list', title: 'The reaction', items: [
        '“Love it, great website update, looks amazing” — @BrandoWoodz, X',
        '“loOkn goOd” — @Uga589, X'
      ] },
      { type: 'list', title: 'Outcome', items: [
        'Seven pages plus the error pages, live at parcxrpl.com since September 2026',
        'Designed and built alone, with Claude Code',
        'About 11,000 lines of Svelte and TypeScript, 13 shared components, one stylesheet of tokens',
        'Live data throughout: the ledger, xrp.cafe, the AMM, the Fourthwall storefront, and the game leaderboard',
        'PARC Pixel is the only typeface on the site'
      ] }
    ]
  },
  {
    tier: 'index',
    slug: 'jade-aesthetics',
    title: 'Jade Aesthetics',
    word: 'jade aesthetics',
    year: '2025–2026',
    scope: 'Web & code',
    role: 'Designer & developer',
    timeline: 'About four months, two phases',
    tools: 'Framer (V1), Next.js, Tailwind CSS, Vercel, Claude Code (V2)',
    live: { href: 'https://www.jadeaesthetics.co/', label: 'jadeaesthetics.co' },
    description: 'Two complete websites for a premium medical spa: a Framer launch, then an SEO-architected Next.js application.',
    cover: { src: '/work/jade-aesthetics.jpg', w: 1600, h: 900, alt: 'The Jade Aesthetics homepage: Naturally Elevated, Timeless Beauty over a photograph of the treatment lounge' },
    lead: [
      'Jade Aesthetics is a premium medical spa in Wheaton, Illinois: facials, injectables, body contouring, and wellness treatments. I built their whole web presence twice. The first version was a Framer site that put the brand online. When the business outgrew the platform, I rebuilt everything as a server-rendered Next.js application, with structured data on every route and a content architecture built for long-term SEO growth.'
    ],
    hero: [ja('home.jpg', 1600, 1000, 'The Jade Aesthetics homepage: Naturally Elevated, Timeless Beauty in white serif type over the treatment lounge, with Explore Services and Book Now')],
    blocks: [
      { type: 'list', title: 'What it is', items: [
        'Full digital design language, built from a single logo mark',
        'V1: Framer launch site',
        'V2: 30+ page Next.js application, SEO-first architecture'
      ] },
      { type: 'text', title: 'Version one — launch', paras: [
        'The practice came to me with a logo and nothing else. I built the whole digital design language around it: jade greens, warm golds, cream backgrounds, and the Dream Avenue serif. The aim was to carry the warmth and clinical trust of the physical space onto a screen, so a visitor could feel the quality of the treatment rooms before reading a word.',
        'V1, built in Framer, did what a launch site should: it gave the brand a polished home, a clear picture of the services and philosophy, and a fast path from zero to live.'
      ] },
      { type: 'text', title: 'The ceiling', paras: [
        'Framer was the right tool to launch on and the wrong one to grow on. Without semantic HTML, screen readers and search engines struggled to parse the content; without structured data, sitemap control, or much indexable copy, Google had almost nothing to rank. For a local med spa competing in DuPage County on high-intent searches like “Botox Wheaton IL,” that invisibility cost bookings.',
        'The content model was the other limit. Jade offers dozens of treatments, and each one needs its own optimized page, its own entry point from search. A visual editor isn’t built for that scale. The business needed an architecture where one service means one page, indefinitely.'
      ] },
      { type: 'text', title: 'Version two — built to be found', paras: [
        'I rebuilt the site as a Next.js application: App Router, Tailwind CSS, server-side rendering throughout, so every page delivers full HTML. The architecture is SEO-first, with unique metadata on every route, JSON-LD structured data (MedicalBusiness, MedicalProcedure, FAQPage), auto-generated sitemaps, and breadcrumb navigation with schema markup.',
        'The site ships over 30 pages: a content-rich homepage, four service category pages, 16 individual treatment pages, product pages for two skincare lines, team bios, FAQ, financing, blog infrastructure, and contact. Every treatment page follows one template: what it is, who it’s for, what to expect, results and recovery, localized FAQs. Each procedure gives Google rich, indexable content and gives a nervous first-time patient real answers.'
      ] },
      { type: 'gallery', rows: [
        [ja('nav-services.jpg', 1600, 900, 'The services menu open over the homepage: Face, Body, Injectables, and Wellness with their treatment counts')],
        [ja('services-face.jpg', 1600, 1000, 'The Face Treatments category page: the headline over a facial photograph, with the breadcrumb and the introduction below'), ja('phone-services-face.jpg', 739, 1600, 'Face Treatments on a phone')],
        [ja('service-botox.jpg', 1600, 1000, 'The Botox Cosmetic treatment page: the injectables eyebrow, the headline, and the Overview section'), ja('phone-service-botox.jpg', 739, 1600, 'The Botox Cosmetic page on a phone')]
      ] },
      { type: 'text', title: 'One language, two systems', paras: [
        'The rebuild threw away nothing visual: the design language outlived the platform. What changed is how it’s enforced. Page-level decisions made by hand in Framer became a component system in Next.js: service cards, FAQ accordions, testimonial carousels, and CTA blocks built once and reused everywhere, with consistent spacing and hierarchy built in. The identity I created at the start now lives in an architecture that keeps it consistent across the whole site and whatever the practice adds next.'
      ] },
      { type: 'gallery', rows: [
        [ja('products.jpg', 1600, 1000, 'The Biologique Recherche product page: the brand story and a row of exfoliants, moisturizers, serums, and cleansers'), ja('phone-products.jpg', 739, 1600, 'The Biologique Recherche page on a phone')],
        [ja('about.jpg', 1600, 1000, 'The About page: About Jade Aesthetics over the treatment room, with Our Philosophy and What to Expect below'), ja('phone-about.jpg', 739, 1600, 'The About page on a phone: Our Philosophy')],
        [ja('faq.jpg', 1600, 1000, 'The FAQ page: Frequently Asked Questions over eucalyptus, with the General Questions accordion below'), ja('phone-faq.jpg', 739, 1600, 'The FAQ page on a phone: the General Questions accordion')],
        [ja('phone-home.jpg', 739, 1600, 'The homepage on a phone: the wordmark, the hamburger, and the hero headline over the lounge'), ja('phone-nav.jpg', 739, 1600, 'The mobile menu open: Services expanded to Face, Body, Injectables, and Wellness')]
      ] },
      { type: 'text', title: 'Process', paras: [
        'I built V2 with Claude Code. I designed the component system, the SEO architecture, and the structured-data strategy, and directed the AI through the repetitive implementation. Every design decision, review, and architectural call stayed mine. The 16 treatment-page builds took days instead of weeks.'
      ] },
      { type: 'list', title: 'Results', items: [
        '30+ pages of SEO-optimized content across services, products, and blog infrastructure',
        '100 Lighthouse accessibility score',
        'Structured data (JSON-LD) on every route: MedicalBusiness, MedicalProcedure, FAQPage, and BreadcrumbList schemas',
        'Server-rendered Next.js application with no client-side content dependencies',
        'URL redirect strategy preserving all search equity through the V1-to-V2 migration',
        'V2 planned, built, and launched in about 2 months, directing AI-assisted development with Claude Code'
      ] },
      { type: 'text', title: 'Outcome', paras: [
        'Jade Aesthetics now has a website built to the same standard as the experience inside the treatment rooms. Every procedure has its own optimized page, its own front door from Google, and the server-rendered architecture is fast, accessible, and built to compound organic traffic.'
      ] }
    ]
  },
  // Kept in the data, shown nowhere and given no page or assets (0077).
  {
    tier: 'index',
    slug: 'pocketwatch',
    title: 'Pocketwatch',
    word: 'pocketwatch',
    year: '2026',
    scope: 'Product, brand & art direction',
    role: 'Brand, product & front end',
    tools: 'SvelteKit 2, Svelte 5, Illustrator',
    live: { href: 'https://pocketwatch.io', label: 'pocketwatch.io' },
    description: 'Brand identity, design system, and front end for an all-in-one personal finance app: budgeting, net worth, and investments in one clean view.',
    cover: pw('hero-invest.png', 1200, 628, 'Pocketwatch campaign: watch your investments move, live position tickers on violet'),
    lead: [
      'Pocketwatch is a personal-finance app that puts budgeting, net worth, and investments in one place: “Personal finance, one ledger.” I led the brand, the design system, and the product design, and built the front end. My collaborator Chris owns the backend and business side. It’s live at pocketwatch.io.'
    ],
    hero: [pw('hero.png', 1200, 1200, 'Pocketwatch: all your money in one place. Dashboard with net worth, investments, and money agenda on electric lime'), pw('hero-invest.png', 1200, 628, 'Pocketwatch campaign: watch your investments move, live position tickers on violet')],
    blocks: [
      { type: 'list', title: 'What it is', items: [
        'Brand identity and a full design system',
        'Product design across budgeting, net worth, and investments',
        'Front end built in SvelteKit 2 / Svelte 5',
        'A subscription product on the web, with a desktop app on the way'
      ] },
      { type: 'text', title: 'Brand identity', paras: [
        'Pocketwatch had to feel trustworthy enough to hold someone’s whole financial life and warm enough that they open it every day. Most finance apps pick one side. The mark does both: a friendly, slightly odd little eyeball peeking out of a hemispherical pocket, drawn as a single shape. An eye on your money, in a pocket. It reads as approachable at app-icon size and serious in a nav bar. The wordmark is Satoshi: geometric, modern, no flourishes.',
        'The brand runs near-black ink on white with one accent, a citron green, and the mark carries the personality. It’s a character you can live with in a tool you open every morning, not a logo that shouts.'
      ] },
      { type: 'text', title: 'The app keeps no color for itself', paras: [
        'The brand has a color; the app refuses to use it. The citron lives on the marketing side only. Inside the product the chrome stays neutral, a cool gray palette in the Linear / Stripe / Vercel register, and the mark is the one colored thing the app itself brings. A finance app that colors its own interface competes with the one thing that matters: your money. So color comes from content. Every category is a pill, an emoji plus one of ten hues the user picks, and that is the only color a user adds. The few other accents mark meaning: gains, losses, warnings. The interface stays calm by default and turns colorful exactly where the user made it so.',
        'Everything routes through one tokens file for type, color, spacing, and motion, with a live design-system page that re-skins the whole app from one attribute. Type is three fonts: Satoshi for display, Inter for UI and body, JetBrains Mono for every figure, because financial numbers must be tabular to scan. Motion is one main ease-out, two springs for physical moves, six named durations, and a global reduced-motion override, so the product moves the same way everywhere.'
      ] },
      { type: 'text', title: 'Loud outside, quiet inside', paras: [
        'The marketing layer inverts the app’s restraint on purpose. The landing page, ads, and social campaign run loud: one saturated color per feature story, lime to violet to pink, with chunky condensed type shouting “Keep an eye on every dollar”. An ad has to grab attention; the product never should. The same mark carries both registers, so once you’re inside, the color drops away and your money is the loudest thing on screen.'
      ] },
      { type: 'text', title: 'One ledger for everything', paras: [
        'Most people run their financial life across three or four tools: a budgeting app, a banking app, a brokerage, a spreadsheet. Pocketwatch treats those as one picture, not four. It unifies a zero-based budget (every dollar assigned, with a Ready-to-Assign figure), a transaction ledger across cash and credit accounts, lots-based investment tracking, manual assets, and a net-worth view derived from all of it. The hard part was making that much financial data feel browsable rather than like a tax form.',
        'The interface is as strict as YNAB but covers far more ground, built to a production standard from the first screen: every list and table mobile-first, every loading, empty, and error state handled, every destructive action confirmed. I designed and built the front end in SvelteKit 2 and Svelte 5. Chris built the backend in Express, Drizzle, and Postgres and owns the business side, so each of us could focus on his own half.'
      ] },
      { type: 'gallery', note: 'The product', rows: [
        [pw('app-dashboard.png', 1600, 1121, 'Pocketwatch dashboard: money agenda, composition, investments, wealth velocity, and cash flow')],
        [pw('app-budget.png', 1600, 1000, 'Pocketwatch budget: every dollar assigned, with a Ready-to-Assign figure'), pw('app-accounts.png', 1600, 1000, 'Pocketwatch accounts: one transaction ledger across cash and credit accounts')],
        [pw('app-investments.png', 1600, 1230, 'Pocketwatch investments: total return, portfolio value, allocation, and dividend income'), pw('app-networth.png', 1600, 1198, 'Pocketwatch net worth, derived from every account, holding, and manual asset')]
      ] },
      { type: 'text', title: 'Live', paras: [
        'Pocketwatch is live in production as a real subscription product: a 14-day free trial, then paid plans from $3.50 to $8 a month through Stripe, with two months free on annual billing. A desktop app is on the way.'
      ] },
      { type: 'gallery', note: 'The campaign', rows: [
        [pw('ad-both.png', 1200, 628, 'Pocketwatch campaign: budgeting and investing in one place, on electric lime'), pw('ad-analytics.png', 1200, 628, 'Pocketwatch campaign: see where it all goes, category breakdown on pink')],
        [pw('ad-networth.png', 1200, 1200, 'Pocketwatch campaign: know exactly what you are worth, net worth tracking on sky blue'), pw('ad-invest.png', 960, 1200, 'Pocketwatch campaign: your portfolio, priced live, investments on violet'), pw('ad-budget.png', 1200, 1200, 'Pocketwatch campaign: every dollar, accounted for, zero-based budget on orange'), pw('ad-ledger.png', 1200, 1200, 'Pocketwatch campaign: every account in one place, unified ledger on mint green')]
      ] },
      { type: 'list', title: 'Outcome', items: [
        'Built security-first: every route scoped to its owner, inputs validated, sessions revocable server-side.',
        'Privacy as a product feature: read-only bank connections, no passwords (passkeys, one-time email codes, or Google and Apple sign-in), subscriptions and never data.',
        'The hardest part was restraint: an all-in-one finance app is the kind of product that bloats into noise, and Pocketwatch stays quiet the deeper you go.'
      ] }
    ]
  },
  { tier: 'index', hidden: true, slug: 'gridform-studio', title: 'Gridform Studio', year: '2026', scope: 'Product, code & tooling', description: 'A desktop studio for the last step of brand work: logo SVGs in, a complete print and web deliverable package out. Offline, no accounts.' },
  { tier: 'index', hidden: true, slug: 'gridform', title: 'Studio Gridform', year: '2023–2024', scope: 'Brand & art direction', description: 'A complete brand system, poster series, and 28-page design philosophy book built around one idea: less noise.' }
];

/** grid-template-columns for a gallery row: widths proportional to aspect, snapped to the 2px image cell (galleries hold no text, so the 8px text grid does not apply), the last column taking the small remainder so every image in the row is within a few pixels of the same height */
export function rowColumns(row: Row, gap = 16): string {
  if (row.length === 1) return '100%';
  const aspects = row.map((m) => m.w / m.h);
  const total = aspects.reduce((a, b) => a + b, 0);
  const inner = `(100% - ${gap * (row.length - 1)}px)`;
  return aspects.slice(0, -1).map((a) => `round(nearest, calc(${inner} * ${(a / total).toFixed(6)}), 2px)`).join(' ') + ' 1fr';
}

/** the number a project prints in the chrome, `01`, and the counts, `004` / `008` */
const pad = (i: number, width = 2) => String(i).padStart(width, '0');
let seq = 0;
/** every project in display order, hidden entries included; `n` counts the visible ones only */
export const all: Item[] = source.map((e) => ({ ...e, n: e.hidden ? '--' : pad(++seq) })) as Item[];
/** the eight visible projects in order: the route entries, and the Next chain 01 → 08 → 01 */
export const studies: Project[] = all.filter((e): e is Project => !e.hidden && 'blocks' in e);
/** the selected tier: Home cards and the wide Work rows (0074) */
export const projects: Project[] = studies.filter((p) => p.tier === 'selected');
/** the index tier: the typographic list below the rows on Work (0077) */
export const index: Project[] = studies.filter((p) => p.tier === 'index');
/** count of the selected studies (Home) */
export const count = pad(projects.length, 3);
/** count of every visible study (Work footer, study footers) */
export const total = pad(studies.length, 3);
/** the last visible number, for the `01–08` ranges */
export const last = studies[studies.length - 1].n;
