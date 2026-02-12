import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Timothy Ali — Product Design, Brand Identity & Motion",
    template: "%s — Timothy Ali",
  },
  description:
    "Portfolio of Timothy Ali Yusef — designer specializing in product/web design, brand identity, and motion design for startups and tech companies.",
  openGraph: {
    title: "Timothy Ali — Product Design, Brand Identity & Motion",
    description:
      "Portfolio of Timothy Ali Yusef — designer specializing in product/web design, brand identity, and motion design for startups and tech companies.",
    url: "https://timothyali.com",
    siteName: "Timothy Ali",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <Navigation />
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
