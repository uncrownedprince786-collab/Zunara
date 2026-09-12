export const SITE = {
  name: "Zunara",
  tagline: "Written in the stars.",
  description:
    "Exact birth charts and daily, weekly, monthly and yearly horoscopes for all 12 zodiac signs, computed from real planetary positions. Plus live sky data and celebrity birthdays.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zunara.vercel.app",
  twitter: "@zunara",
  locale: "en_US",
  image: "/og.svg",
  orgName: "Zunara Publishing",
} as const;

export function absoluteUrl(path = ""): string {
  return SITE.url.replace(/\/$/, "") + path;
}
