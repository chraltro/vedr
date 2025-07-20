import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });
export const viewport = {
  themeColor: "#2E3440",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "md Presentation", // Changed
    template: "%s - md Presentation", // Changed
  },
  description:
    "A no-nonsense tool for crafting minimalist, professional platform-independant presentations directly from Markdown using familiar Vim motions.", // Description remains same, focuses on functionality
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "md Presentation", // Changed
    description:
      "A no-nonsense tool for crafting minimalist, professional platform-independant presentations directly from Markdown using familiar Vim motions.", // Description remains same
    url: "https://chraltro.github.io/mdpresentation", // Changed URL to your GitHub Pages
    siteName: "md Presentation", // Changed
    images: [
      {
        url: "https://chraltro.github.io/mdpresentation/image.png", // Changed URL to your GitHub Pages
        width: 1200,
        height: 630,
        alt: "md Presentation - Markdown Presentation Tool", // Changed
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "md Presentation", // Changed
    description:
      "A no-nonsense tool for crafting minimalist, professional platform-independant presentations directly from Markdown using familiar Vim motions.", // Description remains same
    images: ["https://chraltro.github.io/mdpresentation/editor.png"], // Changed URL to your GitHub Pages
    creator: "@dijith_",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": "standard",
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [{ name: "dijith" }],
  keywords: [
    "markdown presentation",
    "html slides",
    "vim motions",
    "markdown editor",
    "minimalist slides",
    "offline first",
    "nord theme",
    "md presentation" // Added new keyword
  ],
  alternates: {
    canonical: "https://chraltro.github.io/mdpresentation", // Changed URL to your GitHub Pages
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "md Presentation", // Changed
    description:
      "A no-nonsense tool for creating professional, platform-independent HTML presentations from Markdown using familiar Vim motions.", // Description remains same
    url: "https://chraltro.github.io/mdpresentation", // Changed URL to your GitHub Pages
    applicationCategory: "Productivity",
    creator: {
      "@type": "Person",
      name: "dijith",
    },
  };
  return (
    <html lang="en">
      <Head>
        <script type="application/ld+json" id="schema-markup">
          {JSON.stringify(schema)}
        </script>
      </Head>
      <body className={`${inter.className}  bg-nordic  `}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}