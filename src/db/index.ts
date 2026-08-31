import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb() {
  return drizzle(neon(process.env.DATABASE_URL!), { schema });
}

type Database = ReturnType<typeof createDb>;

let db: Database | null = null;

export function getDb(): Database | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  if (!db) {
    db = createDb();
  }
  return db;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
