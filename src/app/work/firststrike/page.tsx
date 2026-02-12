import { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import { TextSection } from "@/components/CaseStudySection";
import CaseStudyGallery from "@/components/CaseStudyGallery";

export const metadata: Metadata = {
  title: "FirstStrike Research — Brand Identity & Web Design",
  description:
    "Brand identity, guidelines, and website for a veteran-owned financial research publication.",
};

export default function FirstStrikePage() {
  return (
    <CaseStudyLayout
      header={{
        title: "FirstStrike Research",
        category: "Brand Identity & Web Design",
        year: "2025",
        role: "Lead Designer (sole designer)",
        timeline: "~1 month",
        tools: "Illustrator, Figma",
        overview:
          "FirstStrike Research is a veteran-owned financial research blog covering American markets. The founders came with a rough vision and mood board — I built the entire brand from scratch in about a month: logo, color system, typography, brand guidelines, and a live website. The core challenge was making the brand credible enough for finance but personal enough to reflect its founders' directness.",
        heroImage: "/images/firststrike/hero.png",
        heroAlt: "FirstStrike Research brand identity",
      }}
      nextProject={{ title: "Studio Gridform", slug: "gridform" }}
    >
      <TextSection title="Logo & Wordmark">
        <p>
          The FirstStrike wordmark is set in heavy italic type — the forward lean
          gives it momentum and urgency matching the speed of financial markets.
          The defining element is the halftone dot-matrix pattern trailing from
          the &ldquo;F,&rdquo; a nod to retro print media that suggests impact
          radiating outward.
        </p>
        <p>
          Multiple configurations: horizontal for headers, stacked vertical for
          tight spaces, and a standalone icon mark for favicons and avatars. Each
          works across both light and dark backgrounds.
        </p>
      </TextSection>

      <TextSection title="Color System">
        <p>
          Electric Blue (#003DFF) anchors the entire brand — bold enough to stand
          out in financial media, serious enough to convey authority. Paired with
          Midnight Black for body text and Ice White for secondary surfaces.
          Three accent colors — Soft Mint, Signal Coral, and Amber Pulse — were
          designed specifically for data visualization and UI states.
        </p>
      </TextSection>

      <TextSection title="The Signature Look">
        <p>
          The brand&apos;s most recognizable visual element is the
          gradient-plus-grain treatment: a deep blue-to-cyan gradient overlaid
          with subtle noise texture. This gives digital surfaces a tactile,
          almost printed quality that reinforces the retro personality without
          feeling dated.
        </p>
      </TextSection>

      <TextSection title="Website">
        <p>
          The website serves casual readers scanning headlines and serious
          investors reading research reports. A content-first layout leads with
          writing, supported by bold category banners using the brand&apos;s
          gradient and halftone patterns for visual hierarchy. Every design
          decision prioritized readability and speed.
        </p>
      </TextSection>

      <TextSection title="Outcome">
        <p>
          FirstStrike launched with a cohesive identity spanning every
          touchpoint — from website to social media to internal documents. The
          brand system gives the founders flexibility to produce content quickly
          while maintaining a professional presence that stands apart from typical
          financial media.
        </p>
      </TextSection>

      {/* Gallery */}
      <CaseStudyGallery
        items={[
          { type: "image", src: "/images/firststrike/hero.png", alt: "FirstStrike Research brand identity" },
          { type: "image", src: "/images/firststrike/firststrike_pres-02.png", alt: "Mission statement — veteran-owned financial research blog" },
          { type: "image", src: "/images/firststrike/firststrike_pres-03.png", alt: "Billboard mockup — Real News. Real Research. Real Insights." },
          { type: "image", src: "/images/firststrike/firststrike_pres-04.png", alt: "Brand pillars — Retro. Strong. Versatile." },
          { type: "image", src: "/images/firststrike/firststrike_pres-05.png", alt: "Primary logo lockup — horizontal wordmark" },
          { type: "image", src: "/images/firststrike/firststrike_pres-06.png", alt: "Secondary logo lockup — stacked wordmark" },
          { type: "image", src: "/images/firststrike/firststrike_pres-07.png", alt: "Logo construction on blue grid" },
          { type: "image", src: "/images/firststrike/firststrike_pres-08.png", alt: "Color system — Electric Blue, Soft Mint, Signal Coral, Amber Pulse" },
          { type: "image", src: "/images/firststrike/firststrike_pres-09.png", alt: "Business card mockup on concrete" },
          { type: "image", src: "/images/firststrike/firststrike_pres-10.png", alt: "Typography system — Helvetica Heavy and Medium" },
        ]}
      />
    </CaseStudyLayout>
  );
}
