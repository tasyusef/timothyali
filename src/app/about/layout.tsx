import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Timothy Ali is a designer working across product, brand, and motion for startups and tech companies. Based in Denver, Colorado.",
  openGraph: {
    title: "About — Timothy Ali",
    description:
      "Designer working across product, brand, and motion for startups and tech companies.",
    url: "https://www.timothyali.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
