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
  category: string;
  year: string;
  heroImage: string;
  heroVideo?: string;
  videos?: string[];
  images: ProjectImage[];
  stats?: ProjectStat[];
  description: string;
}

export const projects: Project[] = [
  {
    slug: "sonde",
    title: "Sonde",
    category: "Product Design & Development",
    year: "2026",
    heroImage: "/images/sonde/hero.png",
    images: [
      { src: "/images/sonde/hero.png", aspect: 16 / 9, alt: "Sonde dashboard with real-time XRP price chart and network stats" },
      { src: "/images/sonde/landing.png", aspect: 16 / 9, alt: "Sonde landing page" },
      { src: "/images/sonde/account.png", aspect: 16 / 9, alt: "Account explorer with balance and transaction history" },
      { src: "/images/sonde/tokens.png", aspect: 16 / 9, alt: "Token explorer with market cap rankings" },
      { src: "/images/sonde/nfts.png", aspect: 16 / 9, alt: "NFT explorer with collections and recent mints" },
      { src: "/images/sonde/network.png", aspect: 16 / 9, alt: "Network health dashboard with fee monitoring" },
    ],
    stats: [
      { label: "Pages", value: "10+" },
      { label: "Data", value: "Real-time" },
      { label: "Stack", value: "Next.js 16" },
      { label: "Role", value: "Sole Creator" },
    ],
    description:
      "A real-time XRPL block explorer with live WebSocket data, account exploration, and a typographically driven dark-mode interface.",
  },
  {
    slug: "firststrike",
    title: "FirstStrike Research",
    category: "Product Design & Brand Identity",
    year: "2025",
    heroImage: "/images/firststrike/hero.png",
    images: [
      { src: "/images/firststrike/hero.png", aspect: 16 / 9, alt: "FirstStrike Research brand identity" },
      { src: "/images/firststrike/app-portfolio.png", aspect: 1919 / 911, alt: "Research platform portfolio dashboard" },
      { src: "/images/firststrike/app-company.png", aspect: 1919 / 912, alt: "Company analysis view" },
      { src: "/images/firststrike/firststrike_pres-02.png", aspect: 16 / 9, alt: "Mission statement" },
      { src: "/images/firststrike/firststrike_pres-03.png", aspect: 3376 / 2250, alt: "Billboard mockup" },
      { src: "/images/firststrike/firststrike_pres-04.png", aspect: 16 / 9, alt: "Brand pillars" },
      { src: "/images/firststrike/firststrike_pres-05.png", aspect: 16 / 9, alt: "Primary logo lockup" },
      { src: "/images/firststrike/firststrike_pres-06.png", aspect: 16 / 9, alt: "Secondary logo lockup" },
      { src: "/images/firststrike/firststrike_pres-07.png", aspect: 16 / 9, alt: "Logo construction grid" },
      { src: "/images/firststrike/firststrike_pres-08.png", aspect: 16 / 9, alt: "Color system" },
      { src: "/images/firststrike/firststrike_pres-09.png", aspect: 4 / 3, alt: "Business card mockup" },
      { src: "/images/firststrike/firststrike_pres-10.png", aspect: 16 / 9, alt: "Typography system" },
    ],
    stats: [
      { label: "Timeline", value: "~3 Mo" },
      { label: "Scope", value: "Brand + Product" },
      { label: "Platform", value: "Live Prototype" },
      { label: "Role", value: "Sole Designer" },
    ],
    description:
      "Brand identity, website design, and development for a veteran-owned financial research publication.",
  },
  {
    slug: "jade-aesthetics",
    title: "Jade Aesthetics",
    category: "Web Design & Development",
    year: "2025–2026",
    heroImage: "/images/jade-aesthetics/desktop-homepage-fold.jpg",
    images: [
      { src: "/images/jade-aesthetics/desktop-homepage-fold.jpg", aspect: 1920 / 1200, alt: "Jade Aesthetics homepage design" },
    ],
    stats: [
      { label: "Pages", value: "30+" },
      { label: "Lighthouse A11y", value: "100" },
      { label: "Architecture", value: "SEO-First" },
      { label: "Rendering", value: "Server-Side" },
    ],
    description:
      "Two complete websites designed and built from scratch for a premium medical spa — from Framer launch to SEO-architected Next.js application.",
  },
  {
    slug: "xrpcafe",
    title: "xrp.cafe",
    category: "Brand Identity & Motion Design",
    year: "2021",
    heroImage: "/images/xrpcafe/logo_16x9.png",
    heroVideo: "/videos/CAFE_EXPLORE_CREATE_TRADE.mp4",
    videos: ["/videos/CAFE_EXPLORE_CREATE_TRADE.mp4"],
    images: [
      { src: "/images/xrpcafe/0.png", aspect: 3024 / 4032, alt: "xrp.cafe mobile interface" },
      { src: "/images/xrpcafe/1.png", aspect: 16 / 9, alt: "NFT marketplace explore page" },
      { src: "/images/xrpcafe/2.png", aspect: 16 / 9, alt: "Collection detail page" },
      { src: "/images/xrpcafe/3.png", aspect: 16 / 9, alt: "NFT listing interface" },
      { src: "/images/xrpcafe/4.png", aspect: 16 / 9, alt: "Trading dashboard" },
      { src: "/images/xrpcafe/5.png", aspect: 16 / 9, alt: "Motion graphics frame" },
      { src: "/images/xrpcafe/6.png", aspect: 16 / 9, alt: "Brand application" },
      { src: "/images/xrpcafe/7.png", aspect: 16 / 9, alt: "Marketing campaign" },
      { src: "/images/xrpcafe/logo_16x9.png", aspect: 16 / 9, alt: "xrp.cafe logo" },
      { src: "/images/xrpcafe/XLS20_1Y-04.png", aspect: 1, alt: "XLS-20 anniversary artwork" },
      { src: "/images/xrpcafe/booth_team.jpg", aspect: 1536 / 2048, alt: "Team at conference booth" },
      { src: "/images/xrpcafe/booth_setup.jpg", aspect: 4032 / 3024, alt: "Conference booth setup" },
      { src: "/images/xrpcafe/booth_table.jpg", aspect: 3024 / 4032, alt: "Booth display table" },
      { src: "/images/xrpcafe/booth_tablet.jpg", aspect: 3024 / 4032, alt: "Tablet showing xrp.cafe" },
      { src: "/images/xrpcafe/event_nft_display.jpg", aspect: 2197 / 3905, alt: "NFT display at event" },
      { src: "/images/xrpcafe/xrpl_group.jpg", aspect: 1, alt: "XRPL community group photo" },
    ],
    stats: [
      { label: "Community", value: "29K+" },
      { label: "Revenue", value: "$5M+" },
      { label: "Campaigns", value: "10+" },
      { label: "Role", value: "Cofounder" },
    ],
    description:
      "Visual identity, motion design, and marketing for the #1 NFT marketplace on the XRP Ledger.",
  },
  {
    slug: "firstledger",
    title: "First Ledger",
    category: "Brand Identity System",
    year: "2024",
    heroImage: "/images/firstledger/FL2_FOLIO_HERO.png",
    images: [
      { src: "/images/firstledger/FL2_FOLIO_HERO.png", aspect: 4 / 3, alt: "First Ledger brand identity hero" },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-01.png", aspect: 16 / 9, alt: "Brand guidelines cover" },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-02.png", aspect: 16 / 9, alt: "Logo system" },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-03.png", aspect: 16 / 9, alt: "Color palette" },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-04.png", aspect: 16 / 9, alt: "Typography" },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-05.png", aspect: 16 / 9, alt: "Icon system" },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-06.png", aspect: 16 / 9, alt: "Social media templates" },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-07.png", aspect: 16 / 9, alt: "Motion guidelines" },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-08.png", aspect: 16 / 9, alt: "Brand applications" },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-10.png", aspect: 16 / 9, alt: "Guidelines summary" },
    ],
    stats: [
      { label: "Followers", value: "42K+" },
      { label: "Volume", value: "$1B+" },
      { label: "Scope", value: "Full Identity" },
      { label: "Role", value: "Senior Designer" },
    ],
    description:
      "Complete visual identity system for a token trading platform on the XRP Ledger.",
  },
  {
    slug: "do-androids-dream",
    title: "Do Androids Dream",
    category: "Motion Design",
    year: "2023",
    heroImage: "/images/do-androids-dream/hero.jpg",
    videos: ["/videos/DO_ANDROIDS_DREAM_-_Title_Sequence.mp4"],
    images: [
      { src: "/images/do-androids-dream/hero.jpg", aspect: 16 / 9, alt: "Do Androids Dream title sequence frame" },
    ],
    stats: [
      { label: "Duration", value: "~2 Min" },
      { label: "Palette", value: "Two-Color" },
      { label: "Medium", value: "Title Sequence" },
      { label: "Role", value: "Solo Project" },
    ],
    description:
      "A bold, two-color title sequence for Philip K. Dick's sci-fi landmark — Saul Bass meets Blade Runner.",
  },
  {
    slug: "gridform",
    title: "Studio Gridform",
    category: "Brand Design & Philosophy",
    year: "2023",
    heroImage: "/images/gridform/Poster_Frame_Mockup_2.png",
    images: [
      { src: "/images/gridform/Poster_Frame_Mockup_2.png", aspect: 4 / 3, alt: "Studio Gridform poster in frame" },
      { src: "/images/gridform/GRIDFORM_BOOK_1.png", aspect: 4 / 3, alt: "Design philosophy book cover" },
      { src: "/images/gridform/GRIDFORM_BOOK_2.png", aspect: 4 / 3, alt: "Book interior spread" },
      { src: "/images/gridform/GRIDFORM_BOOK_3.png", aspect: 4 / 3, alt: "Typography spread" },
      { src: "/images/gridform/GRIDFORM_BOOK_4.png", aspect: 4 / 3, alt: "Grid system page" },
      { src: "/images/gridform/GRIDFORM_PRINT.png", aspect: 4 / 3, alt: "Print collateral" },
      { src: "/images/gridform/GRIDFORM_SIGNBOARD.png", aspect: 4 / 3, alt: "Signboard mockup" },
    ],
    stats: [
      { label: "Book", value: "28 Pages" },
      { label: "Series", value: "Poster + Print" },
      { label: "Philosophy", value: "Less Noise" },
      { label: "Role", value: "Sole Creator" },
    ],
    description:
      "A complete brand system, poster series, and 28-page design philosophy book built around one idea: less noise.",
  },
];

export type ProjectSlug = (typeof projects)[number]["slug"];

export function getNextProject(currentSlug: ProjectSlug) {
  const idx = projects.findIndex((p) => p.slug === currentSlug);
  const next = projects[(idx + 1) % projects.length];
  return { title: next.title, slug: next.slug };
}
