import { NextResponse } from "next/server";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";

const SITE_URL = "https://zunara.vercel.app";
const PERIODS = [
  { slug: "daily", label: "Daily" },
  { slug: "weekly", label: "Weekly" },
  { slug: "monthly", label: "Monthly" },
  { slug: "yearly", label: "Yearly" },
];

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export const dynamic = "force-static";

export function GET() {
  const now = new Date().toISOString();
  const items: string[] = [];

  for (const sign of ZODIAC_SIGNS) {
    for (const period of PERIODS) {
      const url = `${SITE_URL}/horoscope/${sign.slug}/${period.slug}`;
      const title = `${sign.name} ${period.label} Horoscope`;
      const desc = `Your ${period.label.toLowerCase()} horoscope for ${sign.name}. Read what the stars have in store.`;
      items.push(`
    <item>
      <title>${escapeXml(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(desc)}</description>
      <pubDate>${new Date(now).toUTCString()}</pubDate>
      <category>Horoscope</category>
      <category>${escapeXml(sign.name)}</category>
    </item>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Zunara — Astrology &amp; Horoscopes</title>
    <link>${SITE_URL}</link>
    <description>Your daily guide to the cosmos. Horoscopes, planetary movements, and astronomical insights.</description>
    <language>en</language>
    <lastBuildDate>${new Date(now).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items.join("")}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
  });
}
