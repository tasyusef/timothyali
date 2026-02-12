import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Thoughts on design, process, and building products — by Timothy Ali.",
  openGraph: {
    title: "Writing — Timothy Ali",
    description: "Thoughts on design, process, and building products.",
    url: "https://www.timothyali.com/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
