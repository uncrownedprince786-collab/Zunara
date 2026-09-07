import type { MetadataRoute } from "next";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { ASTROLOGY_TOPICS } from "@/lib/astrology/topics";
import { SITE } from "@/lib/seo/site";
import { dailyKey } from "@/lib/calendar/periods";
import { birthdayDates } from "@/lib/calendar/birthday-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE.url.replace(/\/$/, "");
  const today = dailyKey(now);

  const entries: MetadataRoute.Sitemap = [];

  entries.push({ url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 });
  entries.push({ url: `${base}/horoscope`, lastModified: now, changeFrequency: "daily", priority: 0.9 });
  entries.push({ url: `${base}/astrology`, lastModified: now, changeFrequency: "weekly", priority: 0.8 });
  for (const topic of ASTROLOGY_TOPICS) {
    entries.push({ url: `${base}/astrology/${topic.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
  }

  for (const sign of ZODIAC_SIGNS) {
    entries.push({
      url: `${base}/horoscope/${sign.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    entries.push({
      url: `${base}/horoscope/${sign.slug}/today`,
      lastModified: new Date(`${today}T00:00:00Z`),
      changeFrequency: "daily",
      priority: 0.9,
    });
    entries.push({
      url: `${base}/horoscope/${sign.slug}/weekly`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
    entries.push({
      url: `${base}/horoscope/${sign.slug}/monthly`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
    entries.push({
      url: `${base}/horoscope/${sign.slug}/yearly`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    });
  }

  entries.push({ url: `${base}/cosmic-facts`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
  entries.push({ url: `${base}/birthchart`, lastModified: now, changeFrequency: "weekly", priority: 0.8 });

  const tools: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
    { path: "/synastry", changeFrequency: "weekly", priority: 0.8 },
    { path: "/daily-transit", changeFrequency: "weekly", priority: 0.7 },
    { path: "/sky-map", changeFrequency: "weekly", priority: 0.6 },
    { path: "/retrograde", changeFrequency: "weekly", priority: 0.6 },
    { path: "/ephemeris", changeFrequency: "weekly", priority: 0.6 },
    { path: "/sky-events", changeFrequency: "weekly", priority: 0.7 },
    { path: "/library", changeFrequency: "monthly", priority: 0.5 },
    { path: "/library/signs", changeFrequency: "monthly", priority: 0.5 },
    { path: "/library/planets", changeFrequency: "monthly", priority: 0.5 },
    { path: "/library/nodes", changeFrequency: "monthly", priority: 0.5 },
  ];
  for (const tool of tools) {
    entries.push({ url: `${base}${tool.path}`, lastModified: now, changeFrequency: tool.changeFrequency, priority: tool.priority });
  }

  for (const { date } of birthdayDates()) {
    entries.push({
      url: `${base}/birthday/${date}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  for (const page of ["/about", "/privacy", "/terms", "/disclaimer"]) {
    entries.push({ url: `${base}${page}`, lastModified: now, changeFrequency: "yearly", priority: 0.4 });
  }
  entries.push({ url: `${base}/rss.xml`, lastModified: now, changeFrequency: "weekly", priority: 0.3 });
  return entries;
}