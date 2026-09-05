import {
  pgTable,
  text,
  timestamp,
  jsonb,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

export const zodiacSigns = pgTable("zodiac_signs", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  glyph: text("glyph").notNull(),
  symbol_path: text("symbol_path").notNull(),
  element: text("element").notNull(),
  modality: text("modality").notNull(),
  ruler: text("ruler").notNull(),
  date_range: jsonb("date_range").notNull(),
  description: text("description").notNull(),
});

export const planetarySnapshots = pgTable("planetary_snapshots", {
  id: text("id").primaryKey(),
  time: timestamp("time", { withTimezone: true }).notNull(),
  julian_date: text("julian_date").notNull(),
  engine_version: text("engine_version").notNull(),
  positions: jsonb("positions").notNull(),
  aspects: jsonb("aspects").notNull(),
});

export const horoscopes = pgTable(
  "horoscopes",
  {
    sign_slug: text("sign_slug").notNull(),
    period_type: text("period_type").notNull(),
    period_key: text("period_key").notNull(),
    seed: text("seed").notNull(),
    overview: text("overview").notNull(),
    sections: jsonb("sections").notNull(),
    advice: text("advice").notNull(),
    disclaimer: text("disclaimer").notNull(),
    snapshot_id: text("snapshot_id"),
    generated_at: timestamp("generated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.sign_slug, table.period_type, table.period_key] })],
);

export const generationJobs = pgTable("generation_jobs", {
  id: text("id").primaryKey(),
  period_type: text("period_type").notNull(),
  period_key: text("period_key").notNull(),
  status: text("status").notNull(),
  started_at: timestamp("started_at", { withTimezone: true }).notNull(),
  finished_at: timestamp("finished_at", { withTimezone: true }),
  duration_ms: integer("duration_ms"),
  generated_count: integer("generated_count"),
  valid_count: integer("valid_count"),
  duplicate_pairs: integer("duplicate_pairs"),
  error: text("error"),
});

export const systemHealth = pgTable("system_health", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  value: jsonb("value").notNull(),
  recorded_at: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Pre-calculated "Famous Birthdays Today" cache. A daily cron fetches the
 * upcoming day's top Wikipedians from Wikidata and writes a structured payload
 * per `MM-DD` key so the home page can serve profiles with zero latency and
 * never hit the live API on the request path.
 */
export const celebrityCache = pgTable("celebrity_cache", {
  dateKey: text("date_key").primaryKey(),
  payload: jsonb("payload").notNull(),
  source: text("source").notNull().default("wikidata"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export type ZodiacSignRow = typeof zodiacSigns.$inferSelect;
export type HoroscopeRow = typeof horoscopes.$inferSelect;
export type GenerationJobRow = typeof generationJobs.$inferSelect;
export type PlanetarySnapshotRow = typeof planetarySnapshots.$inferSelect;
export type CelebrityCacheRow = typeof celebrityCache.$inferSelect;
