import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Timothy Ali for product design, brand identity, and motion design projects.",
  openGraph: {
    title: "Contact — Timothy Ali",
    description:
      "Open to full-time product and brand design roles, as well as freelance projects.",
    url: "https://www.timothyali.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
