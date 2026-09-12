import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { MeteorShower } from "@/components/ui/meteor-shower";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SITE, absoluteUrl } from "@/lib/seo/site";
import { LocaleProvider } from "@/lib/i18n/client";
import { LocaleText } from "@/components/ui/locale-text";

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
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-starlight">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)zunara-locale=([^;]*)/);var v="";if(m){try{v=decodeURIComponent(m[1]);}catch(_){}}var l=(v||"").trim().toLowerCase();var lang="en",rtl=false;if(l==="ur"){lang="ur";rtl=true;}else if(l==="ar"){lang="ar";rtl=true;}else if(l==="es"){lang="es";}else if(l==="hi"){lang="hi";}else if(l==="zh"){lang="zh";}var de=document.documentElement;de.setAttribute("dir",rtl?"rtl":"ltr");de.setAttribute("lang",lang);if(document.body)document.body.setAttribute("dir",rtl?"rtl":"ltr");}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": absoluteUrl("/#organization"),
              name: SITE.orgName,
              url: SITE.url,
              logo: absoluteUrl(SITE.image),
              sameAs: [],
            }),
          }}
        />
        <LocaleProvider>
          <ErrorBoundary fallback={null}>
            <MeteorShower />
          </ErrorBoundary>
          {/* Relative z-10 layer keeps all interactive content above the fixed
              sky canvas (z-0) while the meteors stay visually behind it on the
              dark canvas background. */}
          <div className="relative z-10 flex w-full flex-1 flex-col">
            <a href="#main-content" className="skip-link">
              <LocaleText path="common.skipToContent" fallback="Skip to content" />
            </a>
            <ErrorBoundary>
              <SiteHeader />
            </ErrorBoundary>
            <main
              id="main-content"
              className="flex-1 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-transparent"
            >
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
            <ErrorBoundary>
              <SiteFooter />
            </ErrorBoundary>
            <ErrorBoundary fallback={null}>
              <BackToTop />
            </ErrorBoundary>
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
