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
  /** who else was on it, shown as a Team row in the study head when known */
  team?: string;
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

/** Every project in display order: the selected four (PARC, Jade, xrp.cafe, Do Androids Dream, decision 0119), the index five, then the hidden two.
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
    team: 'Cofounders xrpl_adam, sloppy, and stove',
    timeline: 'Ongoing',
    tools: 'Illustrator, Python (fontTools)',
    live: { href: 'https://parcxrpl.com', label: 'parcxrpl.com' },
    description: 'Rebranding the NFT club I cofounded in 2021: logo, palette, pixel world, and a typeface, all from one 5×5 grid.',
    cover: { src: '/work/parc.png', w: 1600, h: 900, alt: 'PARC’s four-color pixel letters on a white sign floating in a pixel-cloud sky' },
    lead: [
      "I cofounded Pixel Ape Rowboat Club in 2021 and have led its branding and art direction since. For the 2026 rebrand I drew a new logo on the apes’ 5×5 grid, built PARC Pixel, a three-weight typeface, and carried both across the website, Discord, X, Twitch, merch, and the arcade."
    ],
    hero: [pa('sign-sky.png', 1600, 900, 'The new PARC box logo: four-color pixel letters on a white sign with notched corners, floating in a pixel-cloud sky')],
    blocks: [
      { type: 'text', title: 'Where it started', paras: [
        'PARC started in November 2021 as a joke. People were treating pixel apes as status symbols, and we thought that was ridiculous. Bored Apes had yachts. Ours had rowboats. 10,000 pixel apes on the XRP Ledger, no clout included.',
        "People stayed anyway. By 2026, PARC had four collections, a Twitch show, an arcade, merch, and its own lore. I run it with xrpl_adam on development, sloppy on marketing, and stove drawing the apes with me. The old identity no longer matched what we were making."
      ] },
      { type: 'text', title: 'The world', paras: [
        "The apes started with the Game Boy Advance Pokémon games as a reference: flat color, chunky pixels, sprites you could recognize at a glance. We built a world around them with islands, rowboats, volcanoes, and wooden huts. The rebrand needed to belong in that world."
      ] },
      { type: 'text', title: 'Same people, better brand', paras: [
        "The old logo was a cartoon ape with thick outlines and a bubbly wordmark. It didn’t look much like the pixel art around it. I drew the new logo on the apes’ 5×5 grid and put it on a white sign with notched corners.",
        "The team was attached to the old identity and worried about how the community would react. An earlier rebrand direction I had worked up didn’t win them over, and we set it aside. This time I showed them the finished logo on its sign and asked them to trust me. The comments after launch were encouraging."
      ] },
      { type: 'gallery', note: 'Before, 2021 / after, 2026', rows: [
        [pa('old-mascot.png', 1600, 1600, 'The old PARC logo: a cartoon ape head with a wide grin and thick black outlines, a bubbly yellow PARC wordmark across the top'), pa('old-wordmark.png', 1600, 900, 'The old PARC secondary logo: the bubbly outlined wordmark in black')],
        [pa('mark-stacked.png', 1600, 1600, 'The new PARC square lockup: the box logo stacked over the oar'), pa('mark-wide.png', 1600, 533, 'The new PARC wide logo: four-color pixel letters on the white sign, on the pixel-cloud sky')]
      ] },
      { type: 'list', title: 'The reaction', items: [
        '“I know I like the new banner and logo” / RedHotDankMoist, Discord',
        '“Love it, great website update, looks amazing” / @BrandoWoodz, X'
      ] },
      { type: 'text', title: 'The system', paras: [
        "I made a wide logo, a square lockup, and an oar badge. They share a cell grid and notched corners, with two cells of clear space on every side. The final artwork uses merged paths so it can go straight into print and web files.",
        "The palette has five colors. Individual elements use a single color; the logo uses four. I specified hex values for web and CMYK for print, and ruled out yellow type on white because it’s hard to read.",
        "The oar works as a favicon, a badge, and a divider. I also put it on the typeface’s equals key so it’s easy to use in a line of text."
      ] },
      { type: 'text', title: 'The typeface', paras: [
        "I built PARC Pixel from the four letters in the logo: one-cell strokes, open counters, and stepped diagonals. It has three weights, plus a monospaced version for scores and prices. I finished 29 glyphs by hand, including the 2 and the at-sign, checking them in words at reading size."
      ] },
      { type: 'gallery', rows: [
        [pa('club-masthead-sky.png', 1600, 900, 'PARC Pixel specimen on the sky colorway: Pixel Ape Rowboat Club set across the three weights')],
        [pa('three-weights-a.png', 1600, 1200, 'PARC Pixel specimen on white: the letter A in Bold 700, Regular 400, and Light 300'), pa('anatomy-sheet.png', 1600, 1200, 'PARC Pixel specimen on white: the Bold R on its 11 by 11 cell grid'), pa('mono-numerals-sky.png', 1600, 1200, 'PARC Pixel Mono numerals 0 to 9 on the sky colorway')],
        [pa('glyph-grid-green.png', 1600, 1200, 'PARC Pixel Bold: 40 glyphs in a grid, one color per glyph, on the green colorway'), pa('square-ampersand-sky.png', 1600, 1600, 'PARC Pixel Bold ampersand at giant size on the sky colorway')]
      ] },
      { type: 'text', title: 'In the wild', paras: [
        "The identity appears across the website, Discord, X, Twitch, merch, and arcade. On the site, the logo hangs in the sky and the collection cards float above an island. After Darc has its own graphics and a starting-soon animation for the stream.",
        "I made animated backgrounds for each part of the site: drifting clouds, a scatter of pixels that responds to the cursor, broadcast static for After Darc, and chat bubbles for Discord. They switch to still versions with reduced motion."
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
      { type: 'text', title: 'Outcome', paras: [
        "The rebrand launched in September 2026 with a print and web logo library, the PARC Pixel typeface, and updated artwork for the site, community channels, merch, and arcade."
      ] }
    ]
  },
  {
    tier: 'selected',
    slug: 'jade-aesthetics',
    title: 'Jade Aesthetics',
    word: 'jade aesthetics',
    year: '2025–present',
    scope: 'Web & code',
    role: 'Designer & developer',
    timeline: 'Ongoing · project-based freelance',
    tools: 'Framer (V1), Next.js, Tailwind CSS, Vercel, Claude Code (V2)',
    live: { href: 'https://www.jadeaesthetics.co/', label: 'jadeaesthetics.co' },
    description: 'Two websites for a medical spa: a Framer launch, followed by a Next.js rebuild with dedicated treatment pages.',
    cover: { src: '/work/jade-aesthetics.jpg', w: 1600, h: 900, alt: 'The Jade Aesthetics homepage: Naturally Elevated, Timeless Beauty over a photograph of the treatment lounge' },
    lead: [
      "I designed and built two websites for Jade Aesthetics, a medical spa in Wheaton, Illinois. The first launched in Framer. When the practice needed individual treatment pages, I rebuilt it in Next.js, keeping the visual style I’d developed for the first site."
    ],
    hero: [ja('home.jpg', 1600, 1000, 'The Jade Aesthetics homepage: Naturally Elevated, Timeless Beauty in white serif type over the treatment lounge, with Explore Services and Book Now')],
    blocks: [
      { type: 'list', title: 'What it is', items: [
        'Website colors, typography, and layout developed from the existing logo',
        'V1: Framer launch site',
        'V2: more than 30 pages in Next.js, including 16 treatment pages',
        'Ongoing project work with the practice as needs come up'
      ] },
      { type: 'text', title: 'Version one: the launch site', paras: [
        "The practice came to me with a logo. I built the site’s visual style around it: jade green, warm gold, cream backgrounds, and the Dream Avenue serif. Photographs of the treatment rooms helped visitors get a feel for the place.",
        "The Framer site introduced the practice, its services, and its approach to care. It gave the team a first website while the business was getting started."
      ] },
      { type: 'text', title: 'Why I rebuilt it', paras: [
        "The next version needed a dedicated page for each treatment, with control over its content, metadata, and structured data. I built a shared treatment-page template in Next.js.",
        "With dozens of treatments to cover, I wanted to make it straightforward to add a service without redesigning the page. Each treatment would have its own URL and a consistent set of questions to answer."
      ] },
      { type: 'text', title: 'Version two: treatment pages', paras: [
        "I rebuilt the site with Next.js and Tailwind CSS. Pages include server-rendered content, individual metadata, structured data, breadcrumbs, and a generated sitemap.",
        "The rebuild includes more than 30 pages, with service categories, 16 treatment pages, two skincare lines, team bios, FAQs, financing, and contact information. Treatment pages explain what the procedure is, who it’s for, what to expect, and recovery. Visitors can find those details before deciding to book."
      ] },
      { type: 'gallery', rows: [
        [ja('nav-services.jpg', 1600, 900, 'The services menu open over the homepage: Face, Body, Injectables, and Wellness with their treatment counts')],
        [ja('services-face.jpg', 1600, 1000, 'The Face Treatments category page: the headline over a facial photograph, with the breadcrumb and the introduction below'), ja('phone-services-face.jpg', 739, 1600, 'Face Treatments on a phone')],
        [ja('service-botox.jpg', 1600, 1000, 'The Botox Cosmetic treatment page: the injectables eyebrow, the headline, and the Overview section'), ja('phone-service-botox.jpg', 739, 1600, 'The Botox Cosmetic page on a phone')]
      ] },
      { type: 'text', title: 'Keeping the visual identity', paras: [
        "I kept the colors, type, and visual style from the first site. In the rebuild, service cards, FAQ accordions, testimonial carousels, and contact blocks became reusable components. That made it easier to keep the growing set of pages consistent."
      ] },
      { type: 'gallery', rows: [
        [ja('products.jpg', 1600, 1000, 'The Biologique Recherche product page: the brand story and a row of exfoliants, moisturizers, serums, and cleansers'), ja('phone-products.jpg', 739, 1600, 'The Biologique Recherche page on a phone')],
        [ja('about.jpg', 1600, 1000, 'The About page: About Jade Aesthetics over the treatment room, with Our Philosophy and What to Expect below'), ja('phone-about.jpg', 739, 1600, 'The About page on a phone: Our Philosophy')],
        [ja('faq.jpg', 1600, 1000, 'The FAQ page: Frequently Asked Questions over eucalyptus, with the General Questions accordion below'), ja('phone-faq.jpg', 739, 1600, 'The FAQ page on a phone: the General Questions accordion')],
        [ja('phone-home.jpg', 739, 1600, 'The homepage on a phone: the wordmark, the hamburger, and the hero headline over the lounge'), ja('phone-nav.jpg', 739, 1600, 'The mobile menu open: Services expanded to Face, Body, Injectables, and Wellness')]
      ] },
      { type: 'text', title: 'Process', paras: [
        "I used Claude Code for the rebuild, directing the page structure and components and reviewing the implementation. Once the treatment template was in place, I used it across the 16 service pages."
      ] },
      { type: 'text', title: 'Outcome', paras: [
        "The rebuilt site launched in about two months, with more than 30 pages and redirects from the first site. The practice now has 16 treatment pages on a shared template, with the original colors and typography carried through."
      ] }
    ]
  },
  {
    tier: 'selected',
    slug: 'xrpcafe',
    title: 'xrp.cafe',
    word: 'xrp.cafe',
    year: '2021–2024',
    scope: 'Founding designer · brand & motion',
    role: 'Founding designer',
    tools: 'Illustrator, After Effects',
    live: { href: 'https://xrp.cafe/', label: 'xrp.cafe' },
    description: 'Visual identity, motion design, and marketing for an NFT marketplace on the XRP Ledger.',
    cover: { src: '/work/xrpcafe.png', w: 1600, h: 900, alt: 'xrp.cafe coffee-mug logo lockup' },
    lead: [
      "I cofounded xrp.cafe, an NFT marketplace on the XRP Ledger, and was its founding designer. From 2021 to 2024, I developed the identity and made the campaign graphics, animations, event booths, and community content."
    ],
    hero: [
      { src: '/work/video/xrpcafe-explore-create-trade.mp4', w: 1080, h: 1920, video: true, alt: 'xrp.cafe Explore Create Trade motion graphic' },
      xc('logo.png', 1600, 900, 'xrp.cafe coffee-mug logo lockup on the brand blue')
    ],
    blocks: [
      { type: 'text', title: 'The mascot system', paras: [
        "We wanted it to feel like a cozy place for NFTs. The coffee mug gave us a friendly starting point for a brand that people would see every day in their feeds and chats.",
        "The mascot is a coffee mug with stick-figure limbs and a smile. I started with the logo, then drew a cast of mugs with different outfits and accessories for campaigns and community events.",
        "The basic shape stayed the same while the character changed: a Halloween pumpkin, a beach-BBQ mug, a Super Saiyan. That gave me room to respond to whatever was happening without starting from scratch each time."
      ] },
      { type: 'gallery', rows: [
        [xc('mug-saiyan.png', 1600, 900, 'xrp.cafe Super Saiyan mug mascot character'), xc('mug-bbq.png', 1600, 900, 'xrp.cafe beach-BBQ mug mascot character'), xc('mug-pumpkin.png', 1600, 900, 'xrp.cafe Halloween pumpkin mug mascot')],
        [xc('marketplace.png', 1600, 900, 'xrp.cafe marketplace UI with mascot characters')]
      ] },
      { type: 'text', title: 'Motion graphics', paras: [
        "I made “Explore, Create, Trade” for social feeds: a short vertical animation with large type, moving characters, and the brand’s blue background. It needed to read on a phone while someone was scrolling.",
        "I also made motion assets for product launches, feature announcements, and event recaps. Each focused on one feature or announcement."
      ] },
      { type: 'text', title: 'Social & events', paras: [
        "Most of the work went to Twitter/X, Instagram, and Discord. Several posts a week meant a steady mix of custom graphics and copy for launches, partnerships, seasonal posts, and community milestones.",
        "For Consensus, Permissionless, and ETH Denver, I adapted the identity into booth designs, backdrops, banners, and merch. The mug connected the online brand to a place people could meet the team."
      ] },
      { type: 'gallery', rows: [
        [xc('just-mint.png', 1600, 900, 'xrp.cafe JUST MINT NFTs campaign graphic'), xc('jeopardy.png', 1600, 900, 'xrp.cafe community Jeopardy event graphic'), xc('vesea-charity.png', 1600, 900, 'xrp.cafe and VeSea charity event graphic')],
        [xc('xls20.png', 1600, 1600, 'xrp.cafe XLS-20 one year anniversary artwork'), xc('booth-team.jpg', 1200, 1600, 'xrp.cafe team at the Consensus booth'), xc('xrpl-group.jpg', 1600, 1600, 'XRP Ledger community group photo at Consensus')],
        [xc('booth-setup.jpg', 1600, 1200, 'xrp.cafe booth setup at Permissionless'), xc('booth-table.jpg', 1200, 1600, 'xrp.cafe booth table with stickers and merch'), xc('booth-tablet.jpg', 1200, 1600, 'xrp.cafe website demo at Consensus 2023')],
        [xc('backdrop.jpg', 1600, 1200, 'xrp.cafe event backdrop mockup'), xc('banner.jpg', 1600, 1200, 'xrp.cafe retractable banner mockups')]
      ] },
      { type: 'text', title: 'Outcome', paras: [
        "The identity carried through more than ten social campaigns, motion graphics, and event booths. I also made campaign work for a VeSea charity event benefiting St. Jude’s."
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
    description: 'A yellow-and-black title sequence for Philip K. Dick’s “Do Androids Dream of Electric Sheep?”, inspired by Saul Bass.',
    cover: { src: '/work/do-androids-dream.jpg', w: 1600, h: 900, alt: 'Do Androids Dream title sequence: the sun with beams radiating out behind a lone figure, black on yellow' },
    lead: [
      "I designed and animated a title sequence for Philip K. Dick’s Do Androids Dream of Electric Sheep?, the novel that inspired Blade Runner. I wanted to try a graphic approach: yellow, black, and flat shapes, with Saul Bass as a reference."
    ],
    hero: [{ src: '/work/video/do-androids-dream-title-sequence.mp4', w: 1280, h: 720, video: true, alt: 'Do Androids Dream title sequence, forty-five seconds, black on yellow' }],
    blocks: [
      { type: 'text', title: 'The concept', paras: [
        "I started by reducing the city to silhouettes. Towers, roads, a sun, and a lone figure gave me enough to build the sequence around.",
        "The yellow sky makes the black buildings feel heavier. With so little color, changes in scale and composition do most of the work."
      ] },
      { type: 'gallery', rows: [
        [dad('hero.jpg', 1600, 900, 'Do Androids Dream title sequence: the sun with beams radiating out behind a lone figure, black on yellow')]
      ] },
      { type: 'text', title: 'Visual language', paras: [
        "I drew the skyline in Illustrator as flat vector shapes, then animated it in After Effects. The buildings dwarf the figure, giving the city a sense of scale without adding much detail.",
        "A small amount of chromatic aberration adds colored fringes to the edges, like electronic interference. It makes the otherwise clean shapes feel slightly unstable."
      ] },
      { type: 'text', title: 'Motion & pacing', paras: [
        "The 45-second sequence moves from the title into the skyline, then breaks the perspective with an inverted city and road. The final shots bring in the sun and a figure surrounded by radiating architecture.",
        "I used the changes in perspective to connect the scenes and make the city feel disorienting."
      ] },
      { type: 'gallery', rows: [
        [dad('still-title.jpg', 1280, 720, 'Act one: the title in heavy black type on a flat yellow field'), dad('still-cityscape.jpg', 1280, 720, 'Act two: a black city skyline against yellow with a lone figure at right, edges fringed by chromatic aberration')],
        [dad('still-road.jpg', 1280, 720, 'Act three: the perspective breaks and a black road converges between yellow city blocks'), dad('still-sunrise.jpg', 1280, 720, 'Act three: a yellow sun rising into a black sky')]
      ] }
    ]
  },
  {
    tier: 'index',
    slug: 'firstledger',
    title: 'First Ledger',
    word: 'first ledger',
    year: '2024–2025',
    scope: 'Brand designer',
    role: 'Brand designer',
    timeline: 'About a year',
    tools: 'Illustrator',
    live: { href: 'https://firstledger.net/', label: 'firstledger.net' },
    description: 'Logo, typography, and brand guidelines for an XRP Ledger trading platform.',
    cover: { src: '/work/firstledger.jpg', w: 1600, h: 900, alt: 'First Ledger billboard mockup: The fastest way to trade' },
    lead: [
      "For First Ledger, a token trading platform from the team behind xrp.cafe, I designed the logo, typography, and brand guidelines over about a year, including rules for using the mark beside xrp.cafe and partner logos."
    ],
    hero: [fl('hero.jpg', 1600, 1200, 'First Ledger billboard mockup: The fastest way to trade')],
    blocks: [
      { type: 'text', title: 'Pencil + paper = ledger', paras: [
        "First Ledger gives people access to the XRP Ledger’s decentralized exchange through a Telegram bot and a web app. The mark combines a diagonal pencil with a rounded square of paper. Together they suggest a ledger: a place to record transactions.",
        "It had to read in a Telegram chat, a browser tab, and a small mobile header. I kept the shape simple enough to recognize at those sizes, then used it across the rest of the identity."
      ] },
      { type: 'gallery', rows: [
        [fl('guide-01.png', 1600, 900, 'First Ledger logo white on black'), fl('guide-04.png', 1600, 900, 'First Ledger logo construction: Pencil + Paper = Ledger diagram')]
      ] },
      { type: 'text', title: 'Lockups & typography', paras: [
        "The primary lockup pairs the icon with “FIRST LEDGER” in heavy, extended type. A shorter “FL” version fits smaller spaces. Both have clear-space rules measured from the icon.",
        "The wide letterforms give the name a solid, unhurried feel. The type family carries through the guidelines in three weights: Heavy for headlines, Medium for subheads, and Roman for body copy."
      ] },
      { type: 'gallery', rows: [
        [fl('guide-03.png', 1600, 900, 'First Ledger primary and secondary logo lockups'), fl('guide-05.png', 1600, 900, 'First Ledger primary logo clear-space rules')],
        [fl('guide-10.png', 1600, 900, 'First Ledger typography system spread')]
      ] },
      { type: 'text', title: 'Brand pillars', paras: [
        'Fun: “a lil meme never hurt anyone.” Reliable: “passion and years of experience.” Fast: “we’re first for a reason.”',
        "The brand needed room for jokes and memes as well as product announcements and partnership decks. Those three traits helped me keep the tone consistent across both."
      ] },
      { type: 'text', title: 'Co-branding guidelines', paras: [
        "First Ledger and xrp.cafe often appear together. I documented the logo sizes and spacing for those layouts so the team could reuse them.",
        "The guidelines also cover partner logos, giving the team a reference for listings, reports, and joint campaigns."
      ] },
      { type: 'gallery', rows: [
        [fl('guide-02.png', 1600, 900, 'First Ledger brand pillars: Fun, Reliable, Fast')],
        [fl('guide-07.png', 1600, 900, 'First Ledger and xrp.cafe co-branding guidelines, primary lockup'), fl('guide-08.png', 1600, 900, 'First Ledger and xrp.cafe co-branding guidelines, secondary lockup')]
      ] },
      { type: 'list', title: 'Outcome', items: [
        "Logo and lockups for the Telegram bot, web app, and marketing.",
        "Typography and clear-space rules documented in the brand guidelines.",
        "Co-branding layouts for xrp.cafe and other partners."
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
    tools: 'Illustrator, Figma',
    description: 'Brand identity for a veteran-owned financial research company: wordmark, color system, typography, and guidelines.',
    cover: { src: '/work/firststrike.jpg', w: 1600, h: 900, alt: 'The FirstStrike Research wordmark in white italic type on the blue gradient-and-grain field' },
    lead: [
      "FirstStrike Research is a veteran-owned financial research company covering American markets. I designed its logo, color palette, typography, and guidelines."
    ],
    hero: [fst('hero.jpg', 1600, 900, 'The FirstStrike Research wordmark in white italic type on the brand’s blue gradient-and-grain field')],
    blocks: [
      { type: 'list', title: 'The commission', items: [
        'Full identity: wordmark, lockups, color system, type, guidelines',
        'Blue gradient and grain backgrounds for web and social graphics',
        'Business card designs and billboard mockups'
      ] },
      { type: 'text', title: 'The brief', paras: [
        "The client wanted an identity that felt direct and credible, with a rough mood board pointing toward retro print media. I used that reference to develop a heavy wordmark, halftone details, and a blue palette."
      ] },
      { type: 'gallery', rows: [
        [fst('mission.png', 1600, 900, 'The FirstStrike Research mission statement set in heavy blue capitals: a veteran-owned financial research blog for service members and civilians')]
      ] },
      { type: 'text', title: 'Logo & wordmark', paras: [
        "The wordmark uses heavy italic type with a halftone pattern trailing off the F. The forward lean suits the name, and the dots bring in the newsprint reference from the brief.",
        "I made horizontal and stacked lockups, plus an icon for favicons and avatars. Each has versions for light and dark backgrounds."
      ] },
      { type: 'gallery', rows: [
        [fst('logo-primary.png', 1600, 900, 'The primary FirstStrike lockup: the horizontal wordmark in blue on ice white'), fst('logo-secondary.png', 1600, 900, 'The secondary FirstStrike lockup: the wordmark stacked over two lines')],
        [fst('construction.png', 1600, 900, 'The wordmark on its construction grid, white on electric blue')]
      ] },
      { type: 'text', title: 'Color & type', paras: [
        "Electric Blue (#003DFF) is the main brand color, paired with Midnight Black and Ice White. Soft Mint, Signal Coral, and Amber Pulse give charts and graphics a wider palette. Helvetica Heavy handles headlines; Helvetica Medium handles body copy."
      ] },
      { type: 'gallery', rows: [
        [fst('color.png', 1600, 900, 'The color system as swatches: Soft Mint, Signal Coral, Amber Pulse, Electric Blue, Ice White, and Midnight Black with their hex values'), fst('type.png', 1600, 900, 'The type system: the Helvetica Heavy and Helvetica Medium alphabets and numerals in blue')]
      ] },
      { type: 'text', title: 'The signature look', paras: [
        "A blue-to-cyan gradient with a layer of grain gives the backgrounds some of the texture of print. I used it in social cards, editorial layouts, and billboard mockups."
      ] },
      { type: 'gallery', rows: [
        [fst('pillars.jpg', 1600, 900, 'The brand pillars, Retro. Strong. Versatile., in white capitals on the blue gradient-and-grain field')],
        [fst('billboard.jpg', 1600, 1066, 'A billboard mockup reading Real News. Real Research. Real Insights. in blue and white above a city street'), fst('business-card.jpg', 1600, 1200, 'Two blue business cards on concrete, the wordmark on one and the contact details on the other')]
      ] },
      { type: 'text', title: 'Outcome', paras: [
        "I delivered the logo files and guidelines for color, typography, and backgrounds, with examples showing how to use them on business cards, social graphics, and billboards."
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
    description: 'An XRP Ledger explorer with analytics, portfolio tracking, and fund tracing. I designed, built, and ran it myself; the hosted app is now closed.',
    cover: { src: '/work/sonde.png', w: 1600, h: 900, alt: 'Sonde: Decode the XRPL. Real-time intelligence, analytics, and portfolio tracking' },
    lead: [
      "Sonde was an XRP Ledger explorer with network analytics, portfolio tracking, and tools for investigating account activity. I designed, built, and ran it myself. The hosted app is now closed."
    ],
    hero: [so('hero.png', 1600, 900, 'Sonde: Decode the XRPL. Real-time intelligence, analytics, and portfolio tracking for the XRP Ledger')],
    blocks: [
      { type: 'list', title: 'What it is', items: [
        'Block explorer, network analytics, and a trading portfolio dashboard',
        'Wallet scoring, fund tracing, and an AI research assistant',
        'Three databases fed by three parallel XRPL WebSocket connections',
        'Wallet sign-in with Free and Pro plans'
      ] },
      { type: 'text', title: 'Making the data readable', paras: [
        "I wanted an account page that made sense before you knew the ledger’s terminology. I used type and spacing to put the balance, holdings, and recent activity first, with the technical detail farther down.",
        "Different readers needed different levels of detail. A newcomer might want to see what an account holds. A trader might need profit and loss, cost basis, and allocation. An analyst might want raw transaction data or fund tracing. I organized the account tabs around that progression and kept the live updates visually quiet."
      ] },
      { type: 'text', title: 'Brand identity', paras: [
        "A sonde is a probe used to take measurements. The name suited a tool for looking into ledger activity. I used dark slate surfaces and muted neutrals, with salmon (#E8856C) for key metrics and live indicators.",
        "Satoshi handles display type, DM Sans the interface and body copy, and IBM Plex Mono the addresses, hashes, and amounts. Small colored tags distinguish payments, trades, NFT operations, trust lines, and liquidity-pool activity without coloring entire rows."
      ] },
      { type: 'text', title: 'The product', paras: [
        "Search accepts an address, transaction identifier, ledger number, or token name and opens the matching view. Account pages have twelve tabs, from transactions and holdings to NFTs, liquidity pools, offers, and escrows. Sections load independently so you can start reading before every request finishes.",
        "The app includes network metrics, price charts, trading data, a wallet-connected portfolio, and a token directory. Investigation tools score wallets by profitability and consistency, trace funds through up to six transfers, and flag possible wash trading. An AI assistant can query those tools in a conversation."
      ] },
      { type: 'gallery', rows: [
        [so('network.png', 1600, 900, 'Sonde network insights: live XRP price, market cap, a candlestick chart, and the latest ledgers')],
        [so('markets.png', 1600, 900, 'Sonde markets: XRPL token rankings by price, market cap, volume, and holders'), so('account.png', 1600, 900, 'Sonde account page: balance, smart money score, risk profile, and counterparty graph')]
      ] },
      { type: 'text', title: 'How it works', paras: [
        "Account sections loaded independently, so readers could start with the balance and holdings while other requests finished. Live updates kept the previous results visible until new data arrived. Separate databases supported the app, analytics, and fund tracing."
      ] },
      { type: 'gallery', rows: [
        [so('portfolio.png', 1600, 900, 'Sonde portfolio: total value, performance chart, allocation, and watchlist')],
        [so('smart-money.png', 1600, 900, 'Sonde Smart Money leaderboard: scored wallets ranked by PnL, win rate, and Sharpe'), so('smart-money-detail.png', 1600, 900, 'Sonde Smart Money detail: score factors, score history, and tokens traded')],
        [so('transaction.png', 1600, 900, 'Sonde transaction detail: identifiers, outcome, balance changes, and affected ledger nodes'), so('ask-the-ledger.png', 1600, 900, 'Ask the Ledger: natural-language queries over the XRP Ledger')]
      ] },
      { type: 'text', title: 'Outcome', paras: [
        "I launched Sonde with a public explorer, analytics, and paid portfolio and investigation tools. Subscriptions accepted fiat and crypto. I handled design, development, and operations until I closed the hosted app."
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
    description: 'A website for the club, with live stats, a gallery on clotheslines, and a playable rowing game.',
    cover: { src: '/work/parc-site.png', w: 1440, h: 810, alt: 'parcxrpl.com home: the Pixel Ape Rowboat Club sign on a notched paper card under the green nav' },
    lead: [
      "PARC had outgrown its Squarespace site. The club now had four collections, a token, a Twitch show, an arcade, and merch. I designed a new site to bring them together and built it with Claude Code, directing the implementation and reviewing each screen."
    ],
    hero: [ps('home-hero.png', 1440, 900, 'parcxrpl.com home: the Pixel Ape Rowboat Club sign on a notched paper card over the scatter texture, under the green nav')],
    blocks: [
      { type: 'list', title: 'What it is', items: [
        'Home, Gallery, Clubhouse, PARCade, Merch, Stats, LARC, and the error pages',
        'One typeface, PARC Pixel, in three weights',
        "Live collection stats, token data, and game scores"
      ] },
      { type: 'text', title: 'The island', paras: [
        "The logo’s pixel grid became the basis for the site. I wanted it to feel like arriving on the club’s island, with different places to explore as you scroll.",
        "Each page opens under a jungle canopy with two layers of drifting pixel clouds. A wooden sign holds the title, introduction, and buttons. The pages are places in the club’s world: the Clubhouse, Gallery, and PARCade. Generated textures give the scenery some variation."
      ] },
      { type: 'gallery', rows: [
        [ps('home-collections.png', 1440, 900, 'parcxrpl.com collections: PARC, Monkey Phunks, and PARC Customs as paper cards on the sky'), ps('phone-home.png', 390, 844, 'parcxrpl.com home on a phone: the hero card with stacked pixel buttons')],
        [ps('home-oar.png', 1440, 900, 'parcxrpl.com: the Buy $OAR and Set Trustline cards at the foot of the sky'), ps('home-crew.png', 1440, 900, 'parcxrpl.com crew row: five ape avatars, each under its own color bar, above the green footer')],
        [ps('not-found.png', 1440, 900, 'parcxrpl.com 404: a hanging sign reading Rowed off the map'), ps('phone-collections.png', 390, 844, 'parcxrpl.com collection cards on a phone')]
      ] },
      { type: 'text', title: 'The notch', paras: [
        "The notched corner appears throughout the site: 6px on buttons, 10px on cards, and 12px on panels. Buttons sit above a darker base, lift on hover, and drop when pressed. Movement follows the pixels too: buttons move in steps, water shifts one cell at a time, and dropdowns open line by line."
      ] },
      { type: 'text', title: 'Stats first', paras: [
        "I put Stats first in the navigation so holders could get to it quickly. It shows floor prices, trading volume, holders, and listings for the collections, alongside $OAR token data. The numbers come from the ledger and marketplace APIs. Daily snapshots feed the charts, with history starting at launch."
      ] },
      { type: 'gallery', rows: [
        [ps('stats-top.png', 1440, 900, 'parcxrpl.com Club Stats: the $OAR card with price, volume, market cap, holders, and two pixel bar charts'), ps('phone-stats.png', 390, 844, 'parcxrpl.com Club Stats on a phone')],
        [ps('stats-cards.png', 1440, 900, 'parcxrpl.com Club Stats: four collection cards with floor, volume, holders, listed, and a 30-day floor chart')]
      ] },
      { type: 'text', title: 'Gallery & Clubhouse', paras: [
        "The Gallery hangs the apes on clotheslines between two trees. Selecting a frame brings up a plaque with the ape’s name. The first version scrolled sideways and hijacked the wheel. It looked good and felt wrong, so I rebuilt it with ordinary vertical scrolling.",
        "The Clubhouse took three layouts to get right. It ended up with a TV playing the Twitch stream, a trophy shelf, and a corkboard for events, suspended from branches. I checked the ropes at different screen widths to keep them attached."
      ] },
      { type: 'gallery', rows: [
        [ps('gallery-top.png', 1440, 900, 'parcxrpl.com Gallery: the hanging sign with collection chips, and the generative apes on clotheslines between two trees'), ps('phone-gallery.png', 390, 844, 'parcxrpl.com Gallery on a phone: one portrait per clothesline')],
        [ps('gallery-customs.png', 1440, 900, 'parcxrpl.com Gallery: the PARC Customs one-of-ones on clotheslines')],
        [ps('community-top.png', 1440, 900, 'parcxrpl.com Clubhouse: the hanging sign, the TV on its branch, and the cork notice board'), ps('phone-community.png', 390, 844, 'parcxrpl.com Clubhouse on a phone: the sign, the On Air plaque, and the branches')],
        [ps('community-mid.png', 1440, 900, 'parcxrpl.com Clubhouse: the trophy shelf and event cards beside the notice board'), ps('community-low.png', 1440, 900, 'parcxrpl.com Clubhouse: the last event cards above the grass and sand at the foot of the page')]
      ] },
      { type: 'text', title: 'PARCade', paras: [
        "PARCade is an arcade cabinet with a green CRT screen, scanlines, a joystick, and buttons that control the menu. On the homepage, a smaller screen shows the game cover beside live high scores, surrounded by scenery built from the game’s sprites.",
        "I also made Rowboat Racer: an ape rowing down a five-lane river, dodging logs, reefs, and ziggurats. I drew the sprites on a 3px grid. The riverbanks change between beach, jungle, rock, and village scenery on each run. The server replays a run before accepting its score on the leaderboard."
      ] },
      { type: 'gallery', rows: [
        [ps('home-arcade.png', 1440, 900, 'parcxrpl.com PARCade band: the Rowboat Racer cover on a CRT and live high scores over the game’s island'), ps('phone-arcade.png', 390, 844, 'parcxrpl.com PARCade band on a phone')],
        [ps('parcade-library.png', 1440, 900, 'parcxrpl.com PARCade booted: the game library with Rowboat Racer live and two cabinets coming soon'), ps('phone-parcade.png', 390, 844, 'parcxrpl.com PARCade on a phone: the game library on the CRT')],
        [ps('parcade-boot.png', 1440, 900, 'parcxrpl.com PARCade booting: the PARC badge assembling on the green CRT above the deck')],
        [ps('game-run.png', 1280, 900, 'Rowboat Racer mid-run: the boat between a beach bank and a jungle bank, coins ahead, obstacles in their lanes'), ps('game-sprites.png', 832, 1000, 'Rowboat Racer sprite sheet: the boat, obstacles, pickups, and bank props on the 3px grid')],
        [ps('game-banks.png', 1292, 812, 'Rowboat Racer banks: rocky, village, jungle, and beach biomes with clustered props and a wandering shoreline')]
      ] },
      { type: 'text', title: 'Merch & community', paras: [
        "Merch was going to be an external link, but the storefront’s API let me bring the catalog onto the site. Only checkout leaves it. After Darc has a static-filled background, Discord has drifting chat bubbles, and the LARC teaser is a boathouse terminal that boots, glitches, and accepts typed input. The 404 sign says you rowed off the map."
      ] },
      { type: 'gallery', rows: [
        [ps('merch.png', 1440, 900, 'parcxrpl.com Merch: the PARC Vibes tee and hoodie as pixel product cards with carousels and dropdowns'), ps('phone-merch.png', 390, 844, 'parcxrpl.com Merch on a phone')],
        [ps('larc.png', 1440, 900, 'parcxrpl.com LARC teaser: the boathouse terminal mid-corruption, an unknown vessel detected'), ps('home-bands.png', 1440, 900, 'parcxrpl.com After Darc band in Twitch purple and Discord band in blurple')]
      ] },
      { type: 'text', title: 'How it was built', paras: [
        "I worked screen by screen with Claude Code, checking screenshots, phone layouts, and type errors as I went. Shared color, type, and spacing settings kept the pages consistent. I compressed the fonts and animated artwork before deploying to Vercel."
      ] },
      { type: 'list', title: 'The reaction', items: [
        '“Love it, great website update, looks amazing” / @BrandoWoodz, X'
      ] },
      { type: 'list', title: 'Outcome', items: [
        'Seven pages plus the error pages, live at parcxrpl.com since September 2026',
        'Designed and built alone, with Claude Code',
        'Shared components for the page headers, buttons, cards, and navigation',
        'Live data throughout: the ledger, xrp.cafe, the AMM, the Fourthwall storefront, and the game leaderboard',
        'PARC Pixel is the only typeface on the site'
      ] }
    ]
  },
  {
    tier: 'index',
    slug: 'pocketwatch',
    title: 'Pocketwatch',
    word: 'pocketwatch',
    year: '2026',
    scope: 'Product, brand & art direction',
    role: 'Brand, product & front end',
    team: 'Chris on the backend and business side',
    tools: 'SvelteKit 2, Svelte 5, Illustrator',
    live: { href: 'https://pocketwatch.io', label: 'pocketwatch.io' },
    description: 'Brand, product design, and front end for a personal finance app covering budgets, accounts, and investments.',
    cover: pw('hero-invest.png', 1200, 628, 'Pocketwatch campaign: watch your investments move, live position tickers on violet'),
    lead: [
      "Pocketwatch brings budgeting, net worth, and investments into one app. I designed the brand and product and built the front end. My collaborator Chris handles the backend and business side."
    ],
    hero: [pw('hero.png', 1200, 1200, 'Pocketwatch: all your money in one place. Dashboard with net worth, investments, and money agenda on electric lime'), pw('hero-invest.png', 1200, 628, 'Pocketwatch campaign: watch your investments move, live position tickers on violet')],
    blocks: [
      { type: 'list', title: 'What it is', items: [
        'Brand identity and a full design system',
        'Product design across budgeting, net worth, and investments',
        'Front end built in SvelteKit 2 / Svelte 5',
        'A subscription web app'
      ] },
      { type: 'text', title: 'Brand identity', paras: [
        "I drew the mark as an eye peeking out of a pocket: a small, slightly odd character to go with the name. Its simple shape works as an app icon and beside the Satoshi wordmark.",
        "The main palette is near-black and white with a citron-green accent. I kept the rest of the identity simple so the mark could carry the personality."
      ] },
      { type: 'text', title: 'Color in the app', paras: [
        "Inside the app, I kept the interface neutral so category colors, gains, losses, and warnings are easy to pick out. People choose an emoji and one of ten colors for each category. The citron green is mostly reserved for marketing.",
        "Shared settings control type, color, spacing, and motion. Satoshi handles display type, Inter the interface, and JetBrains Mono the figures. Consistent number widths help balances line up in tables. The same motion rules apply throughout, including reduced motion."
      ] },
      { type: 'text', title: 'The campaign', paras: [
        "The campaign uses saturated lime, violet, and pink backgrounds with large condensed type. Each ad focuses on one feature, such as budgeting or investments. The eye-in-a-pocket mark connects those brighter graphics to the app."
      ] },
      { type: 'text', title: 'One ledger for everything', paras: [
        "The product combines a zero-based budget, a transaction ledger for cash and credit accounts, investment tracking, manual assets, and a net-worth view. The design challenge was helping people move between those views without losing track of which accounts and figures they were looking at.",
        "I designed and built the front end in SvelteKit 2 and Svelte 5, including mobile layouts and loading, empty, and error states. Chris built the backend with Express, Drizzle, and Postgres."
      ] },
      { type: 'gallery', note: 'The product', rows: [
        [pw('app-dashboard.png', 1600, 1121, 'Pocketwatch dashboard: money agenda, composition, investments, wealth velocity, and cash flow')],
        [pw('app-budget.png', 1600, 1000, 'Pocketwatch budget: every dollar assigned, with a Ready-to-Assign figure'), pw('app-accounts.png', 1600, 1000, 'Pocketwatch accounts: one transaction ledger across cash and credit accounts')],
        [pw('app-investments.png', 1600, 1230, 'Pocketwatch investments: total return, portfolio value, allocation, and dividend income'), pw('app-networth.png', 1600, 1198, 'Pocketwatch net worth, derived from every account, holding, and manual asset')]
      ] },
      { type: 'text', title: 'Launch', paras: [
        "Pocketwatch launched as a subscription web app with a free trial and billing through Stripe."
      ] },
      { type: 'gallery', note: 'The campaign', rows: [
        [pw('ad-both.png', 1200, 628, 'Pocketwatch campaign: budgeting and investing in one place, on electric lime'), pw('ad-analytics.png', 1200, 628, 'Pocketwatch campaign: see where it all goes, category breakdown on pink')],
        [pw('ad-networth.png', 1200, 1200, 'Pocketwatch campaign: know exactly what you are worth, net worth tracking on sky blue'), pw('ad-invest.png', 960, 1200, 'Pocketwatch campaign: your portfolio, priced live, investments on violet'), pw('ad-budget.png', 1200, 1200, 'Pocketwatch campaign: every dollar, accounted for, zero-based budget on orange'), pw('ad-ledger.png', 1200, 1200, 'Pocketwatch campaign: every account in one place, unified ledger on mint green')]
      ] },
      { type: 'list', title: 'Outcome', items: [
        "Brand identity, product design, and a working SvelteKit front end.",
        "Budgeting, accounts, investments, and net worth brought into one interface.",
        "A campaign built around individual features, with the same mark across the app and marketing."
      ] }
    ]
  },
  // Kept in the data, shown nowhere and given no page or assets (0077).
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
