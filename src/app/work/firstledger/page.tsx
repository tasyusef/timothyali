import { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import { TextSection } from "@/components/CaseStudySection";
import CaseStudyGallery from "@/components/CaseStudyGallery";

export const metadata: Metadata = {
  title: "First Ledger — Brand Identity System",
  description:
    "Complete visual identity system for a token trading platform on the XRP Ledger.",
};

export default function FirstLedgerPage() {
  return (
    <CaseStudyLayout
      header={{
        title: "First Ledger",
        category: "Brand Identity System",
        year: "2024",
        role: "Brand Designer",
        timeline: "~1 year",
        tools: "Illustrator",
        overview:
          "First Ledger is a token trading platform on the XRP Ledger. I designed the complete visual identity over a year-long engagement — from logo concept through full brand guidelines with co-branding specifications. The result is a comprehensive brand system the team can apply independently across every touchpoint.",
        heroImage: "/images/firstledger/FL2_FOLIO_HERO.png",
        heroAlt: "First Ledger billboard mockup — The fastest way to trade",
      }}
      nextProject={{ title: "Do Androids Dream", slug: "do-androids-dream" }}
    >
      {/* Copy */}
      <TextSection title="Pencil + Paper = Ledger">
        <p>
          The First Ledger mark is built from two elemental shapes. A diagonal
          form represents a pencil — the act of recording. A rounded square
          represents paper — the surface that holds the record. Combined, they
          create a single icon that reads as a ledger: a record of transactions.
        </p>
        <p>
          Two shapes, one idea, no decoration. The mark works at any scale — from
          a 16px favicon to a billboard — because there&apos;s nothing extraneous
          to lose at small sizes.
        </p>
      </TextSection>

      <TextSection title="Logo Lockups">
        <p>
          The primary logo pairs the icon with &ldquo;FIRST LEDGER&rdquo; in a
          heavy extended typeface — confident, wide, and engineered to feel fast.
          The secondary lockup abbreviates to &ldquo;FL&rdquo; for compact
          contexts. Both are specified with clear-space rules measured in multiples
          of the icon&apos;s own width.
        </p>
      </TextSection>

      <TextSection title="Brand Pillars">
        <p>
          Fun — &ldquo;a lil meme never hurt anyone.&rdquo; Reliable — &ldquo;passion
          and years of experience.&rdquo; Fast — &ldquo;we&apos;re first for a
          reason.&rdquo; The identity threads the needle between trader credibility
          and community personality.
        </p>
      </TextSection>

      <TextSection title="Typography">
        <p>
          Three weights of an extended grotesque: Heavy Extended for headlines,
          Medium Extended for subheads, and Roman for body text. The extended
          widths give the brand a wide, confident stance that reinforces the
          &ldquo;fast&rdquo; positioning.
        </p>
      </TextSection>

      <TextSection title="Collaboration Guidelines">
        <p>
          Because First Ledger emerged from the same ecosystem as xrp.cafe, the
          brand guidelines include specific co-branding rules — exact spacing
          relationships for how the two logos sit together. Pre-built co-branding
          rules mean every collaboration looks intentional rather than improvised.
        </p>
      </TextSection>

      {/* Gallery */}
      <CaseStudyGallery
        items={[
          { type: "image", src: "/images/firstledger/FL2_FOLIO_HERO.png", alt: "First Ledger billboard mockup — The fastest way to trade" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-01.png", alt: "First Ledger logo white on black" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-04.png", alt: "Logo construction — Pencil + Paper = Ledger diagram" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-03.png", alt: "Primary and secondary logo lockups" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-05.png", alt: "Primary logo spacing" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-02.png", alt: "Brand pillars — Fun, Reliable, Fast" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-10.png", alt: "Typography system spread" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-07.png", alt: "Co-branding guidelines primary" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-08.png", alt: "Co-branding guidelines secondary" },
        ]}
      />
    </CaseStudyLayout>
  );
}
