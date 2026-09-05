CREATE TABLE "celebrity_cache" (
	"date_key" text PRIMARY KEY NOT NULL,
	"payload" jsonb NOT NULL,
	"source" text DEFAULT 'wikidata' NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
