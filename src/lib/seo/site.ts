export const SITE = {
  name: "Zunara",
  tagline: "Written in the stars.",
  description:
    "Zunara publishes mathematically calculated daily, weekly, monthly and yearly horoscopes for all twelve zodiac signs \u2014 grounded in real astronomical data.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zunara.example.com",
  twitter: "@zunara",
  locale: "en_US",
} as const;

export function absoluteUrl(path = ""): string {
  return SITE.url.replace(/\/$/, "") + path;
}
