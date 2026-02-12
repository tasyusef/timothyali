import { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import { TextSection } from "@/components/CaseStudySection";
import CaseStudyGallery from "@/components/CaseStudyGallery";

export const metadata: Metadata = {
  title: "Do Androids Dream — Motion Design",
  description:
    'A bold, two-color title sequence for Philip K. Dick\'s "Do Androids Dream of Electric Sheep?"',
};

export default function DoAndroidsDreamPage() {
  return (
    <CaseStudyLayout
      header={{
        title: "Do Androids Dream?",
        category: "Motion Design",
        year: "2023",
        role: "Director, Designer, Animator",
        timeline: "~45 seconds",
        tools: "After Effects, Illustrator",
        overview:
          'A title sequence for Philip K. Dick\'s "Do Androids Dream of Electric Sheep?" — the book that inspired Blade Runner. Rather than recreating the dark, rain-soaked aesthetic everyone expects, I went in the opposite direction: a stark, high-contrast yellow-and-black graphic style that feels closer to Saul Bass than Ridley Scott.',
      }}
      nextProject={{ title: "FirstStrike Research", slug: "firststrike" }}
    >
      {/* Copy */}
      <TextSection title="The Concept">
        <p>
          Every adaptation of Philip K. Dick&apos;s world defaults to the same
          visual language: neon, fog, rain, darkness. I wanted to ask: what does
          this story look like if you strip away the atmosphere and reduce it to
          its most graphic elements?
        </p>
        <p>
          The answer was a two-color world. Bright yellow and deep black —
          nothing else. The yellow represents the artificial, the synthetic, the
          electric. The black represents the void. Together they create a world
          that feels simultaneously stark and overwhelming. The limited palette
          forces the viewer to focus on shape, movement, and composition.
        </p>
      </TextSection>

      <TextSection title="Visual Language">
        <p>
          The sequence&apos;s central visual element is a dystopian skyline — a
          jagged silhouette of towers and industrial structures rendered as flat
          black vector shapes against the yellow sky. A lone silhouetted figure
          appears against the massive cityscape — the emotional core of the
          sequence: one person dwarfed by the built environment.
        </p>
        <p>
          Throughout the sequence, subtle chromatic aberration effects at the
          edges of vector shapes add a sense of instability and electronic
          interference. The world looks slightly misaligned, like it&apos;s being
          viewed through a synthetic lens.
        </p>
      </TextSection>

      <TextSection title="Motion & Pacing">
        <p>
          The sequence moves through three acts in under a minute. Act 1: the
          title builds word by word on a flat yellow field. Act 2: the cityscape
          enters and credits play against it. Act 3: the perspective shifts
          dramatically — pulled into the city along a converging road as the sun
          rises and beams radiate outward.
        </p>
        <p>
          The deliberately anti-Blade Runner aesthetic was a statement about
          adaptation itself: that a source material this rich deserves more than
          one visual interpretation.
        </p>
      </TextSection>

      {/* Gallery */}
      <CaseStudyGallery
        items={[
          { type: "video", src: "/videos/DO_ANDROIDS_DREAM_-_Title_Sequence.mp4", alt: "Do Androids Dream title sequence" },
        ]}
      />
    </CaseStudyLayout>
  );
}
