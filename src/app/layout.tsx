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
    default: "Vedr - Presentation Builder",
    template: "%s - Vedr",
  },
  description:
    "A no-nonsense tool for crafting minimalist, professional platform-independent presentations directly from Markdown using familiar Vim motions.",
  icons: {
    icon: "/vedr/logo.svg",
    apple: "/vedr/logo.svg",
  },
  openGraph: {
    title: "Vedr - Swift Presentations",
    description:
      "A no-nonsense tool for crafting minimalist, professional platform-independent presentations directly from Markdown using familiar Vim motions.",
    url: "https://chraltro.github.io/vedr",
    siteName: "Vedr",
    images: [
      {
        url: "https://chraltro.github.io/vedr/image.png",
        width: 1200,
        height: 630,
        alt: "Vedr - Markdown Presentation Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vedr - Swift Presentations",
    description:
      "A no-nonsense tool for crafting minimalist, professional platform-independent presentations directly from Markdown using familiar Vim motions.",
    images: ["https://chraltro.github.io/vedr/editor.png"],
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
  keywords: [
    "markdown presentation",
    "html slides",
    "vim motions",
    "markdown editor",
    "minimalist slides",
    "offline first",
    "vedr"
  ],
  alternates: {
    canonical: "https://chraltro.github.io/vedr",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const enableAnalytics = process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === "true";
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Vedr",
    description:
      "A no-nonsense tool for creating professional, platform-independent HTML presentations from Markdown using familiar Vim motions.",
    url: "https://chraltro.github.io/vedr",
    applicationCategory: "Productivity",
  };
  return (
    <html lang="en">
      <Head>
        <script type="application/ld+json" id="schema-markup">
          {JSON.stringify(schema)}
        </script>
      </Head>
      <body className={`${inter.className} bg-nordic`}>
        {/* Wayfinder Logo Link */}
        <a
          href="../wayfinder/index.html"
          className="fixed bottom-5 right-5 z-[1000] opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-200"
          title="Back to Wayfinder"
        >
          <img src="/vedr/wayfinder_logo.svg" alt="Wayfinder" className="w-12 h-12 block" />
        </a>

        {children}
        {enableAnalytics ? <Analytics /> : null}
      </body>
    </html>
  );
}
