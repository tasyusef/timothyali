import { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import { TextSection } from "@/components/CaseStudySection";
import CaseStudyGallery from "@/components/CaseStudyGallery";

export const metadata: Metadata = {
  title: 'Studio Gridform — "Less Noise."',
  description:
    "A complete brand system, poster series, and design philosophy book built around one idea: less noise.",
  openGraph: {
    title: 'Studio Gridform — "Less Noise." — Timothy Ali',
    description:
      "A complete brand system, poster series, and design philosophy book built around one idea: less noise.",
    url: "https://www.timothyali.com/work/gridform",
    images: [{ url: "/images/gridform/Poster_Frame_Mockup_2.png", width: 1200, height: 900 }],
  },
};

export default function GridformPage() {
  return (
    <CaseStudyLayout
      header={{
        title: 'Studio Gridform — "Less Noise."',
        category: "Personal Brand & Design Philosophy",
        year: "2023",
        role: "Creator & Designer",
        tools: "Illustrator",
        overview:
          'Studio Gridform is my design practice — and "less noise." is its manifesto. I built the entire brand system from scratch: identity, guidelines, website, stationery, a poster series, and a 28-page book that explains the thinking behind it all. Every piece demonstrates the principles it stands for.',
        heroImage: "/images/gridform/Poster_Frame_Mockup_2.png",
        heroAlt: "Less Noise poster series displayed on outdoor wall",
      }}
      nextProject={{ title: "xrp.cafe", slug: "xrpcafe" }}
    >
      {/* Copy */}
      <TextSection title="Logo & Icon Mark">
        <p>
          I began with only the most essential forms, searching for a
          relationship between proportion and negative space. The &ldquo;G&rdquo;
          developed a geometric precision, with the grid element in the top
          right corner completing the lettermark — merging the &ldquo;G&rdquo;
          with a structural motif that reinforces the studio&apos;s identity.
        </p>
        <p>
          It felt Swiss — clarity, order, and purpose. Gibson SemiBold proved the
          perfect typographic fit: a clean, geometric sans-serif whose
          construction matched the mark&apos;s precision.
        </p>
      </TextSection>

      <TextSection title="The Poster Series">
        <p>
          Each poster explores a single geometric primitive — rectangles, circles,
          and triangles — using a four-color modernist palette: teal, vermillion,
          yellow, and forest green on white. They&apos;re exercises in
          composition and restraint: how much visual energy can you create with
          just a few shapes and flat color?
        </p>
        <p>
          Each poster carries the same quiet footer: &ldquo;less noise.&rdquo; on
          the left, the Gridform wordmark on the right. The work speaks; the
          branding stays out of the way.
        </p>
      </TextSection>

      <TextSection title="The Book">
        <p>
          &ldquo;Less Noise.&rdquo; is a 28-page design philosophy book — part
          manifesto, part process documentation. It&apos;s organized around four
          principles: Design is Problem Solving, Finding a Brand&apos;s Voice,
          Timeless Over Trendy, and Inside Out Design.
        </p>
        <p>
          Every spread practices what it preaches: clear typographic hierarchy,
          purposeful grid usage, and content that earns its space on the page.
        </p>
      </TextSection>

      <TextSection title="Stationery & Print">
        <p>
          The identity extends to a full stationery system. The dark business
          cards pair the wordmark with clean contact information and a QR code.
          The exterior signboard reduces the brand to its most minimal expression:
          just the G icon mark on a dark square — confident enough to stand alone.
        </p>
      </TextSection>

      {/* Gallery */}
      <CaseStudyGallery
        items={[
          { type: "image", src: "/images/gridform/Poster_Frame_Mockup_2.png", alt: "Less Noise poster series displayed on outdoor wall" },
          { type: "image", src: "/images/gridform/GRIDFORM_BOOK_3.png", alt: "Book stack" },
          { type: "image", src: "/images/gridform/GRIDFORM_BOOK_1.png", alt: "Design is Problem Solving spread" },
          { type: "image", src: "/images/gridform/GRIDFORM_BOOK_4.png", alt: "Timeless Over Trendy — First Ledger spread" },
          { type: "image", src: "/images/gridform/GRIDFORM_SIGNBOARD.png", alt: "Signboard mockup" },
        ]}
      />
    </CaseStudyLayout>
  );
}
