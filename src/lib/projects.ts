export interface ProjectImage {
  src: string;
  aspect: number; // width / height
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
  description: string;
}

export const projects: Project[] = [
  {
    slug: "xrpcafe",
    title: "xrp.cafe",
    category: "Brand Identity & Motion Design",
    year: "2022",
    heroImage: "/images/xrpcafe/logo_16x9.png",
    heroVideo: "/videos/CAFE_EXPLORE_CREATE_TRADE.mp4",
    videos: ["/videos/CAFE_EXPLORE_CREATE_TRADE.mp4"],
    images: [
      { src: "/images/xrpcafe/0.png", aspect: 3024 / 4032 },
      { src: "/images/xrpcafe/1.png", aspect: 16 / 9 },
      { src: "/images/xrpcafe/2.png", aspect: 16 / 9 },
      { src: "/images/xrpcafe/3.png", aspect: 16 / 9 },
      { src: "/images/xrpcafe/4.png", aspect: 16 / 9 },
      { src: "/images/xrpcafe/5.png", aspect: 16 / 9 },
      { src: "/images/xrpcafe/6.png", aspect: 16 / 9 },
      { src: "/images/xrpcafe/7.png", aspect: 16 / 9 },
      { src: "/images/xrpcafe/logo_16x9.png", aspect: 16 / 9 },
      { src: "/images/xrpcafe/XLS20_1Y-04.png", aspect: 1 },
      { src: "/images/xrpcafe/booth_team.jpg", aspect: 1536 / 2048 },
      { src: "/images/xrpcafe/booth_setup.jpg", aspect: 4032 / 3024 },
      { src: "/images/xrpcafe/booth_table.jpg", aspect: 3024 / 4032 },
      { src: "/images/xrpcafe/booth_tablet.jpg", aspect: 3024 / 4032 },
      { src: "/images/xrpcafe/event_nft_display.jpg", aspect: 2197 / 3905 },
      { src: "/images/xrpcafe/xrpl_group.jpg", aspect: 1 },
    ],
    description:
      "Visual identity, motion design, and marketing for the #1 NFT marketplace on the XRP Ledger.",
  },
  {
    slug: "firststrike",
    title: "FirstStrike Research",
    category: "Product Design & Brand Identity",
    year: "2025",
    heroImage: "/images/firststrike/hero.png",
    images: [
      { src: "/images/firststrike/hero.png", aspect: 16 / 9 },
      { src: "/images/firststrike/firststrike_pres-02.png", aspect: 16 / 9 },
      { src: "/images/firststrike/firststrike_pres-03.png", aspect: 3376 / 2250 },
      { src: "/images/firststrike/firststrike_pres-04.png", aspect: 16 / 9 },
      { src: "/images/firststrike/firststrike_pres-05.png", aspect: 16 / 9 },
      { src: "/images/firststrike/firststrike_pres-06.png", aspect: 16 / 9 },
      { src: "/images/firststrike/firststrike_pres-07.png", aspect: 16 / 9 },
      { src: "/images/firststrike/firststrike_pres-08.png", aspect: 16 / 9 },
      { src: "/images/firststrike/firststrike_pres-09.png", aspect: 4 / 3 },
      { src: "/images/firststrike/firststrike_pres-10.png", aspect: 16 / 9 },
    ],
    description:
      "Brand identity, website design, and development for a veteran-owned financial research publication.",
  },
  {
    slug: "firstledger",
    title: "First Ledger",
    category: "Brand Identity System",
    year: "2024",
    heroImage: "/images/firstledger/FL2_FOLIO_HERO.png",
    images: [
      { src: "/images/firstledger/FL2_FOLIO_HERO.png", aspect: 4 / 3 },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-01.png", aspect: 16 / 9 },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-02.png", aspect: 16 / 9 },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-03.png", aspect: 16 / 9 },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-04.png", aspect: 16 / 9 },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-05.png", aspect: 16 / 9 },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-06.png", aspect: 16 / 9 },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-07.png", aspect: 16 / 9 },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-08.png", aspect: 16 / 9 },
      { src: "/images/firstledger/FL2_BRAND_GUIDELINES-10.png", aspect: 16 / 9 },
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
      { src: "/images/do-androids-dream/hero.jpg", aspect: 16 / 9 },
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
      { src: "/images/gridform/Poster_Frame_Mockup_2.png", aspect: 4 / 3 },
      { src: "/images/gridform/GRIDFORM_BOOK_1.png", aspect: 4 / 3 },
      { src: "/images/gridform/GRIDFORM_BOOK_2.png", aspect: 4 / 3 },
      { src: "/images/gridform/GRIDFORM_BOOK_3.png", aspect: 4 / 3 },
      { src: "/images/gridform/GRIDFORM_BOOK_4.png", aspect: 4 / 3 },
      { src: "/images/gridform/GRIDFORM_PRINT.png", aspect: 4 / 3 },
      { src: "/images/gridform/GRIDFORM_SIGNBOARD.png", aspect: 4 / 3 },
    ],
    description:
      "A complete brand system, poster series, and 28-page design philosophy book built around one idea: less noise.",
  },
  {
    slug: "jade-aesthetics",
    title: "Jade Aesthetics",
    category: "Web Design & Development",
    year: "2025–2026",
    heroImage: "/images/jade-aesthetics/desktop-homepage-fold.jpg",
    images: [
      { src: "/images/jade-aesthetics/desktop-homepage-fold.jpg", aspect: 1920 / 1200 },
      { src: "/images/jade-aesthetics/desktop-services-face-fold.jpg", aspect: 1920 / 1200 },
      { src: "/images/jade-aesthetics/desktop-service-botox-fold.jpg", aspect: 1920 / 1200 },
      { src: "/images/jade-aesthetics/desktop-about-fold.jpg", aspect: 1920 / 1200 },
      { src: "/images/jade-aesthetics/desktop-products-fold.jpg", aspect: 1920 / 1200 },
      { src: "/images/jade-aesthetics/desktop-faq-fold.jpg", aspect: 1920 / 1200 },
      { src: "/images/jade-aesthetics/desktop-nav-services-dropdown.jpg", aspect: 1920 / 1080 },
      { src: "/images/jade-aesthetics/mobile-homepage-fold.jpg", aspect: 780 / 1688 },
      { src: "/images/jade-aesthetics/mobile-services-face-fold.jpg", aspect: 780 / 1688 },
      { src: "/images/jade-aesthetics/mobile-service-botox-fold.jpg", aspect: 780 / 1688 },
      { src: "/images/jade-aesthetics/mobile-about-fold.jpg", aspect: 780 / 1688 },
      { src: "/images/jade-aesthetics/mobile-nav-open.jpg", aspect: 780 / 1688 },
    ],
    description:
      "Two complete websites designed and built from scratch for a premium medical spa — from Framer launch to SEO-architected Next.js application.",
  },
];
