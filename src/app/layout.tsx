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
  metadataBase: new URL("https://www.timothyali.com"),
  title: {
    default: "Timothy Ali — Product Design, Brand Identity & Motion",
    template: "%s — Timothy Ali",
  },
  description:
    "Portfolio of Timothy Ali — designer specializing in product/web design, brand identity, and motion design for startups and tech companies.",
  keywords: [
    "product design",
    "brand identity",
    "motion design",
    "web design",
    "UI/UX",
    "designer",
    "Denver",
    "Timothy Ali",
    "portfolio",
  ],
  authors: [{ name: "Timothy Ali", url: "https://www.timothyali.com" }],
  creator: "Timothy Ali",
  openGraph: {
    title: "Timothy Ali — Product Design, Brand Identity & Motion",
    description:
      "Portfolio of Timothy Ali — designer specializing in product/web design, brand identity, and motion design for startups and tech companies.",
    url: "https://www.timothyali.com",
    siteName: "Timothy Ali",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Timothy Ali — Product Design, Brand Identity & Motion",
    description:
      "Portfolio of Timothy Ali — designer specializing in product/web design, brand identity, and motion design for startups and tech companies.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.timothyali.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t})()`,
          }}
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Timothy Ali",
              url: "https://www.timothyali.com",
              jobTitle: "Product Designer",
              knowsAbout: [
                "Product Design",
                "Brand Identity",
                "Motion Design",
                "Web Design",
                "UI/UX Design",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Denver",
                addressRegion: "CO",
                addressCountry: "US",
              },
              sameAs: [
                "https://github.com/tasyusef",
                "https://linkedin.com/in/timothyali",
              ],
            }),
          }}
        />
        <Navigation />
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
