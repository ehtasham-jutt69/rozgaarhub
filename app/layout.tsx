import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Outfit } from "next/font/google";
import "./globals.css";
import { site, absoluteUrl } from "@/site.config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AdSenseScript, ConsentBanner } from "@/components/ads";
import { JsonLd } from "@/components/ui";
import { organizationSchema, websiteSchema } from "@/lib/seo";

/**
 * Display face: Bricolage Grotesque — a distinct editorial grotesque with
 * real character in the headline sizes. Body face: Outfit, plain and
 * readable, carrying the reference site's feel. Inter is used nowhere.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: absoluteUrl("/") }],
  creator: site.name,
  publisher: site.legalName,
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: absoluteUrl("/"),
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f7f2",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${outfit.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:border focus:border-brand-900 focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-50"
        >
          Skip to content
        </a>

        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />

        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />

        {/* Mounted only once AdSense is actually configured. Before that
            there is nothing to consent to, so showing a cookie banner would
            be theatre — and it would ship the ads chunk to every page. */}
        {site.adsense.enabled && (
          <>
            <ConsentBanner />
            <AdSenseScript />
          </>
        )}
      </body>
    </html>
  );
}
