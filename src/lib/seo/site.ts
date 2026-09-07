export const SITE = {
  name: "Zunara",
  tagline: "Written in the stars.",
  description:
    "Zunara is a precision astronomical engine and personalized birthday guide: exact birth-chart calculations, mathematically derived daily, weekly, monthly and yearly horoscopes for all twelve zodiac signs, live sky data and the famous people who share your birthday.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zunara.vercel.app",
  twitter: "@zunara",
  locale: "en_US",
  image: "/og.svg",
  orgName: "Zunara Publishing",
} as const;

export function absoluteUrl(path = ""): string {
  return SITE.url.replace(/\/$/, "") + path;
}
