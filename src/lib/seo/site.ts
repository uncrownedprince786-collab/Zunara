export const SITE = {
  name: "Zunara",
  tagline: "Written in the stars.",
  description:
    "Exact birth charts and daily, weekly, monthly and yearly horoscopes for all 12 zodiac signs, computed from real planetary positions plus live sky data.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zunara.vercel.app",
  twitter: "@zunara",
  locale: "en_US",
  image: "/og.png",
  orgName: "Zunara Publishing",
  // Real, verifiable public profiles for the Organization entity (E-E-A-T):
  sameAs: ["https://github.com/uncrownedprince786-collab/Zunara"],
} as const;

export function absoluteUrl(path = ""): string {
  return SITE.url.replace(/\/$/, "") + path;
}
