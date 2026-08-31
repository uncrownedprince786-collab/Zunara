CREATE TABLE "generation_jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"period_type" text NOT NULL,
	"period_key" text NOT NULL,
	"status" text NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"finished_at" timestamp with time zone,
	"duration_ms" integer,
	"generated_count" integer,
	"valid_count" integer,
	"duplicate_pairs" integer,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "horoscopes" (
	"sign_slug" text NOT NULL,
	"period_type" text NOT NULL,
	"period_key" text NOT NULL,
	"seed" text NOT NULL,
	"overview" text NOT NULL,
	"sections" jsonb NOT NULL,
	"advice" text NOT NULL,
	"disclaimer" text NOT NULL,
	"snapshot_id" text,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "horoscopes_sign_slug_period_type_period_key_pk" PRIMARY KEY("sign_slug","period_type","period_key")
);
--> statement-breakpoint
CREATE TABLE "planetary_snapshots" (
	"id" text PRIMARY KEY NOT NULL,
	"time" timestamp with time zone NOT NULL,
	"julian_date" text NOT NULL,
	"engine_version" text NOT NULL,
	"positions" jsonb NOT NULL,
	"aspects" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_health" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"value" jsonb NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zodiac_signs" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"glyph" text NOT NULL,
	"symbol_path" text NOT NULL,
	"element" text NOT NULL,
	"modality" text NOT NULL,
	"ruler" text NOT NULL,
	"date_range" jsonb NOT NULL,
	"description" text NOT NULL
);
