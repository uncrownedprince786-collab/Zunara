import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { MeteorShower } from "@/components/ui/meteor-shower";
import { SITE, absoluteUrl } from "@/lib/seo/site";
import { LocaleProvider } from "@/lib/i18n/client";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Written in the stars`,
    template: `%s | ${SITE.name}`,
  },
  description:
    SITE.description,
  keywords: [
    "daily horoscope",
    "weekly horoscope",
    "monthly horoscope",
    "yearly horoscope",
    "zodiac signs",
    "astrology",
    "astronomy",
  ],
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
    images: [{ url: absoluteUrl(SITE.image), width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    site: SITE.twitter,
    creator: SITE.twitter,
    images: [absoluteUrl(SITE.image)],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      "application/rss+xml": [
        { title: "Zunara Horoscopes", url: "/rss.xml" },
      ],
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#090B10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-starlight">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: SITE.orgName,
                url: SITE.url,
                logo: absoluteUrl(SITE.image),
                sameAs: [],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: SITE.name,
                url: SITE.url,
                description: SITE.description,
                inLanguage: "en",
                publisher: { "@type": "Organization", name: SITE.orgName, url: SITE.url },
              },
            ]),
          }}
        />
        <LocaleProvider>
          <MeteorShower />
          <a href="#main-content" className="skip-link">Skip to content</a>
          <SiteHeader />
          <main id="main-content" className="flex-1">{children}</main>
          <SiteFooter />
          <BackToTop />
        </LocaleProvider>
      </body>
    </html>
  );
}
